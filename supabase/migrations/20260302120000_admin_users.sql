-- Canonical admin_users table: source of truth for admin identity and RBAC.
-- id references auth.users; role from admin_role_enum.
-- For production with shared DB, apply sline_app migrations first; this SQL can be
-- copied to sline_app/supabase/migrations so the app repo owns the schema.

-- Enum for admin roles (must match packages/shared AdminRoleEnum).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role_enum') THEN
    CREATE TYPE public.admin_role_enum AS ENUM (
      'support',
      'moderator',
      'admin',
      'super_admin'
    );
  END IF;
END$$;

-- Table: one row per admin user; id = auth.users.id.
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.admin_role_enum NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  email text,
  last_active_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: only service_role (API) can read/write; anon has no access.
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Optional: explicit policy for service_role if your project uses roles.
-- By default Supabase service_role bypasses RLS; this table is then only
-- accessible via the API (service_role). No policy for anon/authenticated
-- so they cannot select/insert/update/delete.

COMMENT ON TABLE public.admin_users IS 'Canonical admin identity; RBAC reads role from here. Service-role only.';
