-- PAGE 15 (User Investigation): admin_pii_access_logs for PII reveal audit.
-- Every reveal of PII (e.g. user email, phone) must insert a row here.
-- Service-role only. For production with shared DB, copy to sline_app/supabase/migrations.

CREATE TABLE IF NOT EXISTS public.admin_pii_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  field_scope text NOT NULL,
  viewer_admin_id uuid NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  case_id uuid REFERENCES public.admin_cases(id) ON DELETE SET NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_pii_access_logs ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.admin_pii_access_logs IS 'Audit log for admin PII reveal (e.g. user email/phone). Service-role only.';

CREATE INDEX IF NOT EXISTS idx_admin_pii_access_logs_entity
  ON public.admin_pii_access_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_pii_access_logs_viewer_created
  ON public.admin_pii_access_logs (viewer_admin_id, created_at DESC);
