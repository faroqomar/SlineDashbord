-- PAGE 08 (Cases) + PAGE 09 (Chat): admin_cases, admin_case_entities, admin_chat_access_logs.
-- Service-role only; used by dashboard API for case-gated chat access.
-- For production with shared DB, this SQL can be copied to sline_app/supabase/migrations.

-- admin_cases: one row per investigation/moderation case
CREATE TABLE IF NOT EXISTS public.admin_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assignee_admin_id uuid REFERENCES public.admin_users(id),
  subject text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_cases ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.admin_cases IS 'Admin investigation cases; required for case-gated chat access. Service-role only.';

-- admin_case_entities: links cases to entities (e.g. conversation/thread, task, user)
CREATE TABLE IF NOT EXISTS public.admin_case_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.admin_cases(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (case_id, entity_type, entity_id)
);

ALTER TABLE public.admin_case_entities ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.admin_case_entities IS 'Entities attached to a case; entity_type e.g. conversation, task, profile.';

-- admin_chat_access_logs: every thread view or access grant is logged (PAGE 09)
CREATE TABLE IF NOT EXISTS public.admin_chat_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL,
  case_id uuid NOT NULL REFERENCES public.admin_cases(id) ON DELETE CASCADE,
  viewer_admin_id uuid NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  reason text,
  view_scope text NOT NULL CHECK (view_scope IN ('grant', 'view')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_chat_access_logs ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.admin_chat_access_logs IS 'Case-gated chat access: every view and grant is logged. Service-role only.';

CREATE INDEX IF NOT EXISTS idx_admin_chat_access_logs_thread_case
  ON public.admin_chat_access_logs (thread_id, case_id);
CREATE INDEX IF NOT EXISTS idx_admin_chat_access_logs_created_at
  ON public.admin_chat_access_logs (created_at);
