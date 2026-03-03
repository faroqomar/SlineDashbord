-- Reports -> Cases moderation pipeline hardening.
-- Dashboard/local migration; copy equivalent DDL/RPCs to sline_app for canonical production schema.

-- ---------------------------------------------------------------------------
-- Reports table upgrades
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  -- Expand report entity support to include booking.
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'reports'
      AND constraint_name = 'reports_entity_type_check'
  ) THEN
    ALTER TABLE public.reports DROP CONSTRAINT reports_entity_type_check;
  END IF;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

ALTER TABLE IF EXISTS public.reports
  ADD CONSTRAINT reports_entity_type_check
  CHECK (entity_type IN ('task', 'user', 'chat', 'booking'));

-- Allow status 'escalated' (original 20260302130000 only had open, triaged, closed).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'reports' AND constraint_name = 'reports_status_check'
  ) THEN
    ALTER TABLE public.reports DROP CONSTRAINT reports_status_check;
  END IF;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;
ALTER TABLE IF EXISTS public.reports
  ADD CONSTRAINT reports_status_check
  CHECK (status IN ('open', 'triaged', 'escalated', 'closed'));

ALTER TABLE IF EXISTS public.reports
  ADD COLUMN IF NOT EXISTS severity text CHECK (severity IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE IF EXISTS public.reports
  ADD COLUMN IF NOT EXISTS resolution text CHECK (resolution IN ('dismissed', 'resolved', 'case_opened', 'case_attached'));

ALTER TABLE IF EXISTS public.reports
  ADD COLUMN IF NOT EXISTS case_id uuid REFERENCES public.admin_cases(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.reports
  ADD COLUMN IF NOT EXISTS assigned_admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.reports
  ADD COLUMN IF NOT EXISTS sla_due_at timestamptz;

ALTER TABLE IF EXISTS public.reports
  ADD COLUMN IF NOT EXISTS escalated_at timestamptz;

ALTER TABLE IF EXISTS public.reports
  ADD COLUMN IF NOT EXISTS closed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_reports_severity ON public.reports(severity);
CREATE INDEX IF NOT EXISTS idx_reports_resolution ON public.reports(resolution);
CREATE INDEX IF NOT EXISTS idx_reports_case_id ON public.reports(case_id);
CREATE INDEX IF NOT EXISTS idx_reports_sla_due_at ON public.reports(sla_due_at);

ALTER TABLE IF EXISTS public.report_actions
  ADD COLUMN IF NOT EXISTS case_id uuid REFERENCES public.admin_cases(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.report_actions
  ADD COLUMN IF NOT EXISTS resolution text CHECK (resolution IN ('dismissed', 'resolved', 'case_opened', 'case_attached'));

ALTER TABLE IF EXISTS public.report_actions
  ADD COLUMN IF NOT EXISTS status_after text CHECK (status_after IN ('open', 'triaged', 'escalated', 'closed'));

-- ---------------------------------------------------------------------------
-- Cases workspace tables
-- ---------------------------------------------------------------------------

-- Ensure case enums exist (in case 20260308100000 did not run or table came from 20260302130000).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_case_status_enum') THEN
    CREATE TYPE public.admin_case_status_enum AS ENUM ('open', 'in_progress', 'pending', 'closed');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_case_priority_enum') THEN
    CREATE TYPE public.admin_case_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
  END IF;
END $$;

-- Ensure admin_cases has assignee_id (earlier migration 20260302130000 created it with assignee_admin_id only).
ALTER TABLE IF EXISTS public.admin_cases
  ADD COLUMN IF NOT EXISTS assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.admin_case_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.admin_cases(id) ON DELETE CASCADE,
  admin_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  note text NOT NULL,
  visibility text NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal', 'system')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_case_notes_case_id ON public.admin_case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_admin_case_notes_created_at ON public.admin_case_notes(created_at);

CREATE TABLE IF NOT EXISTS public.admin_case_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.admin_cases(id) ON DELETE CASCADE,
  event text NOT NULL,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reason text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_case_timeline_case_id ON public.admin_case_timeline(case_id);
CREATE INDEX IF NOT EXISTS idx_admin_case_timeline_created_at ON public.admin_case_timeline(created_at);

ALTER TABLE IF EXISTS public.admin_case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_case_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_case_notes_service_role_all ON public.admin_case_notes;
CREATE POLICY admin_case_notes_service_role_all ON public.admin_case_notes
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS admin_case_timeline_service_role_all ON public.admin_case_timeline;
CREATE POLICY admin_case_timeline_service_role_all ON public.admin_case_timeline
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Support linking report rows as case evidence.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_case_entity_type_enum') THEN
    BEGIN
      ALTER TYPE admin_case_entity_type_enum ADD VALUE IF NOT EXISTS 'report';
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;
EXCEPTION WHEN undefined_object THEN
  NULL;
END $$;

-- ---------------------------------------------------------------------------
-- RPCs for moderation lifecycle (atomic write + audit)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_dismiss_report(
  p_report_id uuid,
  p_admin_id uuid,
  p_reason text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_report record;
BEGIN
  SELECT * INTO v_report FROM public.reports WHERE id = p_report_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Report not found';
  END IF;
  IF v_report.status = 'closed' THEN
    RAISE EXCEPTION 'Report already closed';
  END IF;

  UPDATE public.reports
  SET status = 'closed',
      resolution = 'dismissed',
      closed_at = now(),
      updated_at = now()
  WHERE id = p_report_id;

  INSERT INTO public.report_actions (report_id, admin_user_id, action, reason, resolution, status_after)
  VALUES (p_report_id, p_admin_id, 'dismiss', p_reason, 'dismissed', 'closed');

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.report.dismiss',
    p_admin_id,
    'report',
    p_report_id,
    jsonb_build_object('reason', p_reason)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_close_report(
  p_report_id uuid,
  p_admin_id uuid,
  p_reason text,
  p_resolution text DEFAULT 'resolved'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_report record;
  v_resolution text;
BEGIN
  v_resolution := COALESCE(p_resolution, 'resolved');
  IF v_resolution NOT IN ('resolved', 'dismissed') THEN
    RAISE EXCEPTION 'Invalid resolution. Must be resolved or dismissed';
  END IF;

  SELECT * INTO v_report FROM public.reports WHERE id = p_report_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Report not found';
  END IF;
  IF v_report.status = 'closed' THEN
    RAISE EXCEPTION 'Report already closed';
  END IF;

  UPDATE public.reports
  SET status = 'closed',
      resolution = v_resolution,
      closed_at = now(),
      updated_at = now()
  WHERE id = p_report_id;

  INSERT INTO public.report_actions (report_id, admin_user_id, action, reason, resolution, status_after)
  VALUES (
    p_report_id,
    p_admin_id,
    CASE WHEN v_resolution = 'dismissed' THEN 'dismiss' ELSE 'close_resolved' END,
    p_reason,
    v_resolution,
    'closed'
  );

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.report.resolve',
    p_admin_id,
    'report',
    p_report_id,
    jsonb_build_object('reason', p_reason, 'resolution', v_resolution)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_escalate_report(
  p_report_id uuid,
  p_admin_id uuid,
  p_reason text,
  p_case_id uuid DEFAULT NULL,
  p_priority text DEFAULT 'medium',
  p_assignee_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_report record;
  v_case_id uuid;
  v_case_was_created boolean := false;
  v_case_status text;
  v_report_entity_type text;
  v_resolution text;
BEGIN
  SELECT * INTO v_report FROM public.reports WHERE id = p_report_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Report not found';
  END IF;
  IF v_report.status = 'closed' THEN
    RAISE EXCEPTION 'Report already closed';
  END IF;

  v_report_entity_type := CASE
    WHEN v_report.entity_type = 'chat' THEN 'conversation'
    ELSE v_report.entity_type
  END;

  IF p_case_id IS NOT NULL THEN
    SELECT id, status INTO v_case_id, v_case_status
    FROM public.admin_cases
    WHERE id = p_case_id
    FOR UPDATE;

    IF v_case_id IS NULL THEN
      RAISE EXCEPTION 'Case not found';
    END IF;

    IF v_case_status = 'closed' THEN
      RAISE EXCEPTION 'Cannot attach escalation to closed case';
    END IF;
  ELSE
    SELECT c.id
      INTO v_case_id
    FROM public.admin_cases c
    JOIN public.admin_case_entities e
      ON e.case_id = c.id
    WHERE e.entity_type::text = v_report_entity_type
      AND e.entity_id = v_report.entity_id
      AND c.status::text IN ('open', 'in_progress', 'pending')
    ORDER BY c.created_at DESC
    LIMIT 1;

    IF v_case_id IS NULL THEN
      INSERT INTO public.admin_cases (subject, source, status, priority, assignee_id)
      VALUES (
        COALESCE(v_report.reason, 'Escalated report') || ' (' || left(p_report_id::text, 8) || ')',
        'reports',
        'open',
        CASE
          WHEN p_priority IN ('low', 'medium', 'high', 'urgent') THEN p_priority::admin_case_priority_enum
          ELSE 'medium'::admin_case_priority_enum
        END,
        p_assignee_id
      )
      RETURNING id INTO v_case_id;

      v_case_was_created := true;
    END IF;
  END IF;

  -- Attach original reported entity as evidence context.
  INSERT INTO public.admin_case_entities (case_id, entity_type, entity_id)
  VALUES (
    v_case_id,
    v_report_entity_type,
    v_report.entity_id
  )
  ON CONFLICT (case_id, entity_type, entity_id) DO NOTHING;

  -- Attach report id as evidence item.
  INSERT INTO public.admin_case_entities (case_id, entity_type, entity_id)
  VALUES (
    v_case_id,
    'report',
    p_report_id
  )
  ON CONFLICT (case_id, entity_type, entity_id) DO NOTHING;

  v_resolution := CASE WHEN v_case_was_created THEN 'case_opened' ELSE 'case_attached' END;

  UPDATE public.reports
  SET status = 'escalated',
      resolution = v_resolution,
      case_id = v_case_id,
      assigned_admin_id = COALESCE(p_assignee_id, assigned_admin_id),
      escalated_at = now(),
      updated_at = now()
  WHERE id = p_report_id;

  INSERT INTO public.report_actions (report_id, admin_user_id, action, reason, case_id, resolution, status_after)
  VALUES (p_report_id, p_admin_id, 'escalate', p_reason, v_case_id, v_resolution, 'escalated');

  IF v_case_was_created THEN
    INSERT INTO public.admin_case_timeline (case_id, event, actor_user_id, reason, meta)
    VALUES (v_case_id, 'case.created', p_admin_id, p_reason, jsonb_build_object('source', 'report_escalation'));
  END IF;

  INSERT INTO public.admin_case_timeline (case_id, event, actor_user_id, reason, meta)
  VALUES (
    v_case_id,
    'report.escalated',
    p_admin_id,
    p_reason,
    jsonb_build_object('report_id', p_report_id, 'resolution', v_resolution)
  );

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.report.escalate',
    p_admin_id,
    'report',
    p_report_id,
    jsonb_build_object('reason', p_reason, 'case_id', v_case_id, 'resolution', v_resolution)
  );

  RETURN v_case_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_triage_report(
  p_report_id uuid,
  p_action text,
  p_admin_id uuid,
  p_reason text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_action = 'dismiss' THEN
    PERFORM public.admin_dismiss_report(p_report_id, p_admin_id, p_reason);
    RETURN;
  END IF;

  IF p_action IN ('close', 'close_resolved') THEN
    PERFORM public.admin_close_report(p_report_id, p_admin_id, p_reason, 'resolved');
    RETURN;
  END IF;

  IF p_action = 'escalate' THEN
    PERFORM public.admin_escalate_report(p_report_id, p_admin_id, p_reason, NULL, 'medium', NULL);
    RETURN;
  END IF;

  IF p_action = 'warn_user' THEN
    UPDATE public.reports
    SET status = 'triaged',
        updated_at = now()
    WHERE id = p_report_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Report not found';
    END IF;

    INSERT INTO public.report_actions (report_id, admin_user_id, action, reason, status_after)
    VALUES (p_report_id, p_admin_id, 'warn_user', p_reason, 'triaged');

    INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
    VALUES (
      'admin.report.triage',
      p_admin_id,
      'report',
      p_report_id,
      jsonb_build_object('action', p_action, 'reason', p_reason)
    );
    RETURN;
  END IF;

  RAISE EXCEPTION 'Invalid action. Must be dismiss, warn_user, escalate, close, or close_resolved';
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_case_assign(
  p_case_id uuid,
  p_admin_id uuid,
  p_assignee_id uuid,
  p_reason text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.admin_cases
  SET assignee_id = p_assignee_id,
      updated_at = now()
  WHERE id = p_case_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Case not found';
  END IF;

  INSERT INTO public.admin_case_timeline (case_id, event, actor_user_id, reason, meta)
  VALUES (
    p_case_id,
    'case.assigned',
    p_admin_id,
    p_reason,
    jsonb_build_object('assignee_id', p_assignee_id)
  );

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES ('admin.case.assign', p_admin_id, 'admin_case', p_case_id, jsonb_build_object('reason', p_reason, 'assignee_id', p_assignee_id));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_case_update_status(
  p_case_id uuid,
  p_admin_id uuid,
  p_status text,
  p_reason text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_status NOT IN ('open', 'in_progress', 'pending', 'closed') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;

  UPDATE public.admin_cases
  SET status = p_status::admin_case_status_enum,
      updated_at = now()
  WHERE id = p_case_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Case not found';
  END IF;

  INSERT INTO public.admin_case_timeline (case_id, event, actor_user_id, reason, meta)
  VALUES (
    p_case_id,
    'case.status_updated',
    p_admin_id,
    p_reason,
    jsonb_build_object('status', p_status)
  );

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES ('admin.case.status_update', p_admin_id, 'admin_case', p_case_id, jsonb_build_object('reason', p_reason, 'status', p_status));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_case_add_note(
  p_case_id uuid,
  p_admin_id uuid,
  p_note text,
  p_visibility text DEFAULT 'internal'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_note_id uuid;
BEGIN
  IF COALESCE(length(trim(p_note)), 0) = 0 THEN
    RAISE EXCEPTION 'Note is required';
  END IF;

  IF p_visibility NOT IN ('internal', 'system') THEN
    RAISE EXCEPTION 'Invalid visibility';
  END IF;

  INSERT INTO public.admin_case_notes (case_id, admin_user_id, note, visibility)
  VALUES (p_case_id, p_admin_id, p_note, p_visibility)
  RETURNING id INTO v_note_id;

  INSERT INTO public.admin_case_timeline (case_id, event, actor_user_id, reason, meta)
  VALUES (
    p_case_id,
    'case.note_added',
    p_admin_id,
    NULL,
    jsonb_build_object('note_id', v_note_id, 'visibility', p_visibility)
  );

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.case.note_add',
    p_admin_id,
    'admin_case',
    p_case_id,
    jsonb_build_object('note_id', v_note_id, 'visibility', p_visibility)
  );

  RETURN v_note_id;
END;
$$;
