-- Canonical admin dispute workflow: accept (open→active), cancel (open|active→canceled), resolve (active→resolved).
-- All mutations write audit_logs in the same transaction. No direct UPDATE from API.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action_enum') THEN
    ALTER TYPE public.audit_action_enum ADD VALUE IF NOT EXISTS 'admin.disputes.accept';
    ALTER TYPE public.audit_action_enum ADD VALUE IF NOT EXISTS 'admin.disputes.cancel';
    ALTER TYPE public.audit_action_enum ADD VALUE IF NOT EXISTS 'admin.disputes.resolve';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- admin_accept_dispute: open → active (atomic with audit)
CREATE OR REPLACE FUNCTION public.admin_accept_dispute(
  p_admin_id uuid,
  p_dispute_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current text;
BEGIN
  IF p_admin_id IS NULL OR p_dispute_id IS NULL THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;

  SELECT status::text INTO v_current FROM public.disputes WHERE id = p_dispute_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dispute not found';
  END IF;
  IF v_current <> 'open' THEN
    RAISE EXCEPTION 'Only open disputes can be accepted (current: %)', v_current;
  END IF;

  UPDATE public.disputes SET status = 'active'::dispute_status_enum WHERE id = p_dispute_id;

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.disputes.accept',
    p_admin_id,
    'dispute',
    p_dispute_id,
    jsonb_build_object('from_status', 'open', 'to_status', 'active')
  );
END;
$$;

-- admin_cancel_dispute: open or active → canceled (atomic with audit). Reason required.
CREATE OR REPLACE FUNCTION public.admin_cancel_dispute(
  p_admin_id uuid,
  p_dispute_id uuid,
  p_reason text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current text;
BEGIN
  IF p_admin_id IS NULL OR p_dispute_id IS NULL THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;
  IF COALESCE(length(trim(p_reason)), 0) < 1 THEN
    RAISE EXCEPTION 'Reason is required for cancel';
  END IF;

  SELECT status::text INTO v_current FROM public.disputes WHERE id = p_dispute_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dispute not found';
  END IF;
  IF v_current NOT IN ('open', 'active') THEN
    RAISE EXCEPTION 'Only open or active disputes can be canceled (current: %)', v_current;
  END IF;

  UPDATE public.disputes SET status = 'canceled'::dispute_status_enum WHERE id = p_dispute_id;

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.disputes.cancel',
    p_admin_id,
    'dispute',
    p_dispute_id,
    jsonb_build_object('from_status', v_current, 'to_status', 'canceled', 'reason', trim(p_reason))
  );
END;
$$;

-- admin_resolve_dispute: active → resolved (atomic with audit). Sets resolved_at. Optional outcome/booking_id for money flows.
CREATE OR REPLACE FUNCTION public.admin_resolve_dispute(
  p_admin_id uuid,
  p_dispute_id uuid,
  p_reason text,
  p_outcome text DEFAULT NULL,
  p_booking_id uuid DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current text;
BEGIN
  IF p_admin_id IS NULL OR p_dispute_id IS NULL THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;
  IF COALESCE(length(trim(p_reason)), 0) < 1 THEN
    RAISE EXCEPTION 'Reason is required for resolve';
  END IF;

  SELECT status::text INTO v_current FROM public.disputes WHERE id = p_dispute_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dispute not found';
  END IF;
  IF v_current <> 'active' THEN
    RAISE EXCEPTION 'Only active disputes can be resolved (current: %)', v_current;
  END IF;

  UPDATE public.disputes
  SET status = 'resolved'::dispute_status_enum, resolved_at = now(), resolution = trim(p_reason)
  WHERE id = p_dispute_id;

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.disputes.resolve',
    p_admin_id,
    'dispute',
    p_dispute_id,
    jsonb_build_object(
      'from_status', 'active',
      'to_status', 'resolved',
      'reason', trim(p_reason),
      'outcome', p_outcome,
      'booking_id', p_booking_id
    )
  );
END;
$$;
