-- Disputes create flow hardening:
-- 1) Enforce one active dispute per task/initiator/defendant at DB level.
-- 2) Create dispute and audit log atomically in one RPC.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'related_entity_type_enum') THEN
    ALTER TYPE public.related_entity_type_enum ADD VALUE IF NOT EXISTS 'dispute';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action_enum') THEN
    ALTER TYPE public.audit_action_enum ADD VALUE IF NOT EXISTS 'admin.disputes.create';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_disputes_active_pair_unique
ON public.disputes (task_id, initiator_id, defendant_id)
WHERE status IN ('open', 'in_progress', 'escalated');

CREATE OR REPLACE FUNCTION public.admin_create_dispute(
  p_admin_id uuid,
  p_task_id uuid,
  p_complainant_id uuid,
  p_defendant_id uuid,
  p_reason text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dispute_id uuid;
  v_users_count integer;
BEGIN
  IF p_admin_id IS NULL THEN
    RAISE EXCEPTION 'Invalid admin id';
  END IF;

  IF p_task_id IS NULL OR p_complainant_id IS NULL OR p_defendant_id IS NULL THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;

  IF p_complainant_id = p_defendant_id THEN
    RAISE EXCEPTION 'Invalid input: complainant and defendant must differ';
  END IF;

  IF COALESCE(length(trim(p_reason)), 0) < 5 OR COALESCE(length(trim(p_reason)), 0) > 500 THEN
    RAISE EXCEPTION 'Invalid reason';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = p_task_id) THEN
    RAISE EXCEPTION 'Task not found';
  END IF;

  SELECT COUNT(*)
  INTO v_users_count
  FROM public.profiles p
  WHERE p.id IN (p_complainant_id, p_defendant_id);

  IF v_users_count <> 2 THEN
    RAISE EXCEPTION 'Complainant or defendant not found';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtext(p_task_id::text || ':' || p_complainant_id::text || ':' || p_defendant_id::text)
  );

  BEGIN
    INSERT INTO public.disputes (task_id, initiator_id, defendant_id, reason, status)
    VALUES (p_task_id, p_complainant_id, p_defendant_id, trim(p_reason), 'open')
    RETURNING id INTO v_dispute_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Active dispute already exists';
  END;

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.disputes.create',
    p_admin_id,
    'dispute',
    v_dispute_id,
    jsonb_build_object(
      'task_id', p_task_id,
      'complainant_id', p_complainant_id,
      'defendant_id', p_defendant_id
    )
  );

  RETURN v_dispute_id;
END;
$$;
