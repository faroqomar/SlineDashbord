-- 1. Add wallet freeze capability to profiles if it doesn't already exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_wallet_frozen boolean DEFAULT false;

-- 2. Create Denormalized Journal Ledger View for Admin Dashboard
DROP VIEW IF EXISTS public.vw_admin_journal_ledger CASCADE;
CREATE OR REPLACE VIEW public.vw_admin_journal_ledger AS
SELECT 
    je.id as journal_id,
    je.created_at,
    je.event_type,
    je.related_entity_type,
    je.related_entity_id,
    je.idempotency_key,
    je.status,
    je.meta,
    -- Compute gross amount (Total Debit)
    (SELECT SUM(amount) FROM public.ledger_lines ll WHERE ll.journal_entry_id = je.id AND ll.direction = 'DEBIT') as gross_amount,
    
    -- Compute fee (credit to platform_revenue)
    COALESCE((
        SELECT SUM(amount) 
        FROM public.ledger_lines ll 
        JOIN public.accounts a ON ll.account_id = a.id
        WHERE ll.journal_entry_id = je.id AND ll.direction = 'CREDIT' AND a.account_code = 'platform_revenue'
    ), 0) as fee_amount,
    
    -- Compute net (Gross - Fee, typically credit to user_available)
    COALESCE((
        SELECT SUM(amount) 
        FROM public.ledger_lines ll 
        JOIN public.accounts a ON ll.account_id = a.id
        WHERE ll.journal_entry_id = je.id AND a.account_code LIKE 'user_available:%' AND ll.direction = 'CREDIT'
    ), 0) as net_amount,
    
    -- Identify Payer User ID
    (
        SELECT a.owner_id
        FROM public.ledger_lines ll
        JOIN public.accounts a ON ll.account_id = a.id
        WHERE ll.journal_entry_id = je.id AND a.account_code LIKE 'user_available:%' AND ll.direction = 'DEBIT'
        LIMIT 1
    ) as payer_user_id,
    
    -- Identify Payee User ID
    (
        SELECT a.owner_id
        FROM public.ledger_lines ll
        JOIN public.accounts a ON ll.account_id = a.id
        WHERE ll.journal_entry_id = je.id AND a.account_code LIKE 'user_available:%' AND ll.direction = 'CREDIT'
        LIMIT 1
    ) as payee_user_id
FROM public.journal_entries je;

-- 3. Admin Process Withdrawal RPC (legacy signature; overwritten by 20260302110000_admin_process_withdrawal_canonical.sql)
-- Production: RPC is defined with canonical signature (p_request_id, p_decision) in later migration or in app repo.
CREATE OR REPLACE FUNCTION public.admin_process_withdrawal(
  p_request_id uuid,
  p_decision text,
  p_admin_id uuid,
  p_reason text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_withdrawal record;
BEGIN
  IF p_decision NOT IN ('approve', 'reject') THEN
    RAISE EXCEPTION 'Invalid decision. Must be approve or reject';
  END IF;
  SELECT * INTO v_withdrawal FROM public.withdrawal_requests WHERE id = p_request_id AND status = 'requested' FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Withdrawal request not found or already processed';
  END IF;
  UPDATE public.withdrawal_requests
  SET status = CASE WHEN p_decision = 'approve' THEN 'completed' ELSE 'failed' END, processed_at = now(),
      meta = COALESCE(meta, '{}'::jsonb) || jsonb_build_object('processed_by', p_admin_id, 'reason', p_reason)
  WHERE id = p_request_id;
  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES ('admin.withdrawal_' || p_decision, p_admin_id, 'withdrawal_request', p_request_id, jsonb_build_object('reason', p_reason, 'amount', v_withdrawal.amount));
END;
$$;

-- 4. Create Admin Wallet Freeze RPC
CREATE OR REPLACE FUNCTION public.admin_process_wallet_freeze(
  p_user_id uuid,
  p_freeze boolean,
  p_admin_id uuid,
  p_reason text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET is_wallet_frozen = p_freeze
  WHERE id = p_user_id;

  INSERT INTO public.audit_logs (
    action, actor_user_id, related_entity_type, related_entity_id, meta
  ) VALUES (
    CASE WHEN p_freeze THEN 'admin.wallet_freeze.apply' ELSE 'admin.wallet_freeze.remove' END, 
    p_admin_id, 'profile', p_user_id, 
    jsonb_build_object('reason', p_reason)
  );
END;
$$;
