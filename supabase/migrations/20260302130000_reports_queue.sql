-- Reports queue for moderation (task/user/chat reports).
-- Canonical schema may live in sline_app; this migration enables dashboard dev/local.
-- Apply to shared DB; for production, prefer adding equivalent in sline_app/supabase/migrations.

-- Extend audit entity type for report-related audit rows (if enum exists).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'related_entity_type_enum') THEN
    ALTER TYPE related_entity_type_enum ADD VALUE IF NOT EXISTS 'report';
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL; -- enum may not exist in all environments
END $$;

-- Reports table: one row per user-submitted report.
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('task', 'user', 'chat')),
  entity_id uuid NOT NULL,
  reason text,
  category text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'triaged', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  meta jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_entity_type ON public.reports(entity_type);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- Report actions: triage/close history (admin_user_id, action, reason).
CREATE TABLE IF NOT EXISTS public.report_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  admin_user_id uuid NOT NULL,
  action text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_actions_report_id ON public.report_actions(report_id);

-- RLS: service role only for admin dashboard; no anon access.
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access reports" ON public.reports
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access report_actions" ON public.report_actions
  FOR ALL USING (auth.role() = 'service_role');

-- updated_at trigger for reports
CREATE OR REPLACE FUNCTION public.update_reports_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trigger_reports_updated_at ON public.reports;
CREATE TRIGGER trigger_reports_updated_at
  BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE PROCEDURE public.update_reports_updated_at();

-- admin_triage_report: update status, insert report_actions, insert audit_logs (atomic).
CREATE OR REPLACE FUNCTION public.admin_triage_report(
  p_report_id uuid,
  p_action text,
  p_admin_id uuid,
  p_reason text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_report record;
  v_new_status text;
BEGIN
  IF p_action NOT IN ('dismiss', 'warn_user', 'escalate', 'close') THEN
    RAISE EXCEPTION 'Invalid action. Must be dismiss, warn_user, escalate, or close';
  END IF;
  v_new_status := CASE WHEN p_action = 'close' THEN 'closed' ELSE 'triaged' END;

  SELECT * INTO v_report FROM public.reports WHERE id = p_report_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Report not found';
  END IF;
  IF v_report.status = 'closed' THEN
    RAISE EXCEPTION 'Report already closed';
  END IF;

  UPDATE public.reports SET status = v_new_status, updated_at = now() WHERE id = p_report_id;
  INSERT INTO public.report_actions (report_id, admin_user_id, action, reason)
  VALUES (p_report_id, p_admin_id, p_action, p_reason);

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    CASE WHEN p_action = 'close' THEN 'admin.report.resolve' ELSE 'admin.report.triage' END,
    p_admin_id,
    'report',
    p_report_id,
    jsonb_build_object('action', p_action, 'reason', p_reason)
  );
END;
$$;

-- admin_close_report: set status closed, insert report_actions, insert audit (atomic).
CREATE OR REPLACE FUNCTION public.admin_close_report(
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

  UPDATE public.reports SET status = 'closed', updated_at = now() WHERE id = p_report_id;
  INSERT INTO public.report_actions (report_id, admin_user_id, action, reason)
  VALUES (p_report_id, p_admin_id, 'close', p_reason);

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES ('admin.report.resolve', p_admin_id, 'report', p_report_id, jsonb_build_object('reason', p_reason));
END;
$$;
