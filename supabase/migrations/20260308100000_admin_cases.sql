-- PAGE 08 — Admin Cases Domain (Case Management Core)
-- Canonical schema owner: sline_app. This migration is for dashboard/local dev;
-- for production, apply equivalent DDL in sline_app/supabase/migrations.

-- Extend audit enum for case-related audit rows (required for audit_logs inserts).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'related_entity_type_enum' AND e.enumlabel = 'admin_case'
  ) THEN
    ALTER TYPE related_entity_type_enum ADD VALUE 'admin_case';
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    -- Enum may not exist in some environments; create as text in that case or skip
    NULL;
END $$;

-- Case status and priority enums for admin_cases
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_case_status_enum') THEN
    CREATE TYPE admin_case_status_enum AS ENUM ('open', 'in_progress', 'pending', 'closed');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_case_priority_enum') THEN
    CREATE TYPE admin_case_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_case_entity_type_enum') THEN
    CREATE TYPE admin_case_entity_type_enum AS ENUM ('task', 'user', 'conversation', 'dispute', 'booking');
  END IF;
END $$;

-- admin_cases: one row per investigation/moderation case
CREATE TABLE IF NOT EXISTS public.admin_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  source text NOT NULL DEFAULT 'dashboard',
  status admin_case_status_enum NOT NULL DEFAULT 'open',
  priority admin_case_priority_enum NOT NULL DEFAULT 'medium',
  assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_cases_status ON public.admin_cases(status);
CREATE INDEX IF NOT EXISTS idx_admin_cases_assignee ON public.admin_cases(assignee_id);
CREATE INDEX IF NOT EXISTS idx_admin_cases_created_at ON public.admin_cases(created_at DESC);

ALTER TABLE public.admin_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_cases_service_role_all ON public.admin_cases
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- admin_case_entities: many-to-many link case <-> entity (task, user, conversation, etc.)
CREATE TABLE IF NOT EXISTS public.admin_case_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.admin_cases(id) ON DELETE CASCADE,
  entity_type admin_case_entity_type_enum NOT NULL,
  entity_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (case_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_admin_case_entities_case_id ON public.admin_case_entities(case_id);
CREATE INDEX IF NOT EXISTS idx_admin_case_entities_entity ON public.admin_case_entities(entity_type, entity_id);

ALTER TABLE public.admin_case_entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_case_entities_service_role_all ON public.admin_case_entities
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: updated_at trigger for admin_cases
CREATE OR REPLACE FUNCTION public.set_admin_cases_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS admin_cases_updated_at ON public.admin_cases;
CREATE TRIGGER admin_cases_updated_at
  BEFORE UPDATE ON public.admin_cases
  FOR EACH ROW EXECUTE PROCEDURE public.set_admin_cases_updated_at();
