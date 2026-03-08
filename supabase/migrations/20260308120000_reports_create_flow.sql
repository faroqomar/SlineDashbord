-- Reports create flow for admin dashboard.
-- Dashboard/local migration; copy equivalent DDL/RPCs to sline_app for canonical production schema.

CREATE OR REPLACE FUNCTION public.admin_create_report(
  p_admin_id uuid,
  p_entity_type text,
  p_entity_id uuid,
  p_reason text,
  p_category text DEFAULT NULL,
  p_severity text DEFAULT NULL,
  p_meta jsonb DEFAULT '{}'::jsonb,
  p_reporter_user_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_entity_exists boolean := false;
  v_reporter_exists boolean := false;
  v_report_id uuid;
BEGIN
  IF COALESCE(trim(p_reason), '') = '' THEN
    RAISE EXCEPTION 'Invalid reason';
  END IF;

  IF p_entity_type NOT IN ('task', 'user', 'chat', 'booking') THEN
    RAISE EXCEPTION 'Invalid entity type';
  END IF;

  IF p_severity IS NOT NULL AND p_severity NOT IN ('low', 'medium', 'high', 'critical') THEN
    RAISE EXCEPTION 'Invalid severity';
  END IF;

  CASE p_entity_type
    WHEN 'task' THEN
      SELECT EXISTS(SELECT 1 FROM public.tasks t WHERE t.id = p_entity_id) INTO v_entity_exists;
    WHEN 'user' THEN
      SELECT EXISTS(SELECT 1 FROM auth.users u WHERE u.id = p_entity_id) INTO v_entity_exists;
    WHEN 'chat' THEN
      SELECT EXISTS(SELECT 1 FROM public.conversations c WHERE c.id = p_entity_id) INTO v_entity_exists;
    WHEN 'booking' THEN
      SELECT EXISTS(SELECT 1 FROM public.bookings b WHERE b.id = p_entity_id) INTO v_entity_exists;
    ELSE
      v_entity_exists := false;
  END CASE;

  IF NOT v_entity_exists THEN
    RAISE EXCEPTION 'Entity not found';
  END IF;

  IF p_reporter_user_id IS NOT NULL THEN
    SELECT EXISTS(SELECT 1 FROM auth.users u WHERE u.id = p_reporter_user_id) INTO v_reporter_exists;
    IF NOT v_reporter_exists THEN
      RAISE EXCEPTION 'Reporter not found';
    END IF;
  END IF;

  INSERT INTO public.reports (
    reporter_user_id,
    entity_type,
    entity_id,
    reason,
    category,
    status,
    severity,
    resolution,
    assigned_admin_id,
    meta
  )
  VALUES (
    p_reporter_user_id,
    p_entity_type,
    p_entity_id,
    p_reason,
    p_category,
    'open',
    p_severity,
    NULL,
    p_admin_id,
    COALESCE(p_meta, '{}'::jsonb)
  )
  RETURNING id INTO v_report_id;

  INSERT INTO public.report_actions (report_id, admin_user_id, action, reason, status_after)
  VALUES (v_report_id, p_admin_id, 'create', p_reason, 'open');

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.report.create',
    p_admin_id,
    'report',
    v_report_id,
    jsonb_build_object(
      'entity_type', p_entity_type,
      'entity_id', p_entity_id,
      'severity', p_severity,
      'category', p_category,
      'reporter_user_id', p_reporter_user_id
    )
  );

  RETURN v_report_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_create_report(uuid, text, uuid, text, text, text, jsonb, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_create_report(uuid, text, uuid, text, text, text, jsonb, uuid) TO service_role;
