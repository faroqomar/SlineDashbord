-- Platform fee settings: single source of truth for admin-controlled fee rate.
-- Fee is locked per entity at: booking escrow/hold, direct_offer accept, task_request award.
-- Requires audit_logs. Copy into sline_app for canonical ownership if app owns schema.

-- Extend audit entity type for platform_settings audit rows (if enum exists).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'related_entity_type_enum') THEN
    ALTER TYPE related_entity_type_enum ADD VALUE IF NOT EXISTS 'platform_settings';
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Single-row (singleton) table for global platform fee. Only service role / admin RPC writes.
-- Supports both shapes:
-- 1) new singleton row shape with explicit fee columns
-- 2) legacy key/value shape where `value jsonb NOT NULL` already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'platform_settings'
  ) THEN
    CREATE TABLE public.platform_settings (
      key text PRIMARY KEY DEFAULT 'default' CHECK (key = 'default'),
      fee_rate_default_bps int NOT NULL DEFAULT 1000 CHECK (fee_rate_default_bps >= 0 AND fee_rate_default_bps <= 10000),
      max_fee_rate_bps int NOT NULL DEFAULT 2000 CHECK (max_fee_rate_bps >= 0 AND max_fee_rate_bps <= 10000),
      updated_at timestamptz NOT NULL DEFAULT now(),
      updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
    );
  ELSE
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'platform_settings' AND column_name = 'fee_rate_default_bps'
    ) THEN
      ALTER TABLE public.platform_settings
        ADD COLUMN fee_rate_default_bps int NOT NULL DEFAULT 1000 CHECK (fee_rate_default_bps >= 0 AND fee_rate_default_bps <= 10000);
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'platform_settings' AND column_name = 'max_fee_rate_bps'
    ) THEN
      ALTER TABLE public.platform_settings
        ADD COLUMN max_fee_rate_bps int NOT NULL DEFAULT 2000 CHECK (max_fee_rate_bps >= 0 AND max_fee_rate_bps <= 10000);
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'platform_settings' AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE public.platform_settings
        ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'platform_settings' AND column_name = 'updated_by'
    ) THEN
      ALTER TABLE public.platform_settings
        ADD COLUMN updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

COMMENT ON TABLE public.platform_settings IS 'Single source of truth for platform fee rate (basis points). Lock points: booking=escrow, direct_offer=accept, task_request=award.';

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- No policy for anon/authenticated: only service role (dashboard API) can read/write.

-- Seed single row. Legacy shape may require `value`.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.platform_settings WHERE key = 'default') THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'platform_settings' AND column_name = 'value'
    ) THEN
      INSERT INTO public.platform_settings (key, value, fee_rate_default_bps, max_fee_rate_bps, updated_at, updated_by)
      VALUES ('default', '{}'::jsonb, 1000, 2000, now(), NULL);
    ELSE
      INSERT INTO public.platform_settings (key, fee_rate_default_bps, max_fee_rate_bps)
      VALUES ('default', 1000, 2000);
    END IF;
  END IF;
END $$;

-- Helper: return current default fee rate in bps (capped by max). Used at lock points only.
CREATE OR REPLACE FUNCTION public.fn_get_default_fee_rate_bps()
RETURNS int
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT LEAST(
      p.fee_rate_default_bps,
      p.max_fee_rate_bps
    ) FROM public.platform_settings p WHERE p.key = 'default' LIMIT 1),
    1000
  );
$$;

COMMENT ON FUNCTION public.fn_get_default_fee_rate_bps() IS 'Canonical fee rate in bps for new lock points. Reads only from platform_settings.';

-- Admin RPC: update fee rate with mandatory reason; writes audit_logs atomically (no admin_logs).
CREATE OR REPLACE FUNCTION public.admin_update_platform_fee_rate(
  p_fee_rate_default_bps int,
  p_reason text,
  p_actor_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_bps int;
  v_max_bps int;
  v_has_value_column boolean;
BEGIN
  IF p_reason IS NULL OR trim(p_reason) = '' THEN
    RAISE EXCEPTION 'Reason is required for platform fee rate change';
  END IF;
  IF p_fee_rate_default_bps < 0 OR p_fee_rate_default_bps > 10000 THEN
    RAISE EXCEPTION 'fee_rate_default_bps must be between 0 and 10000';
  END IF;

  SELECT fee_rate_default_bps, max_fee_rate_bps
  INTO v_old_bps, v_max_bps
  FROM public.platform_settings
  WHERE key = 'default'
  FOR UPDATE;

  IF NOT FOUND THEN
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'platform_settings' AND column_name = 'value'
    ) INTO v_has_value_column;

    IF v_has_value_column THEN
      INSERT INTO public.platform_settings (key, value, fee_rate_default_bps, max_fee_rate_bps, updated_at, updated_by)
      VALUES ('default', '{}'::jsonb, LEAST(p_fee_rate_default_bps, 2000), 2000, now(), p_actor_user_id);
    ELSE
      INSERT INTO public.platform_settings (key, fee_rate_default_bps, max_fee_rate_bps, updated_at, updated_by)
      VALUES ('default', LEAST(p_fee_rate_default_bps, 2000), 2000, now(), p_actor_user_id);
    END IF;

    INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
    VALUES (
      'admin.finance.update_platform_fee_rate',
      p_actor_user_id,
      'platform_settings',
      NULL,
      jsonb_build_object(
        'key', 'default',
        'old_fee_rate_default_bps', NULL,
        'new_fee_rate_default_bps', LEAST(p_fee_rate_default_bps, 2000),
        'reason', trim(p_reason)
      )
    );
    RETURN;
  END IF;

  UPDATE public.platform_settings
  SET
    fee_rate_default_bps = LEAST(p_fee_rate_default_bps, v_max_bps),
    updated_at = now(),
    updated_by = p_actor_user_id
  WHERE key = 'default';

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.finance.update_platform_fee_rate',
    p_actor_user_id,
    'platform_settings',
    NULL,
    jsonb_build_object(
      'key', 'default',
      'old_fee_rate_default_bps', v_old_bps,
      'new_fee_rate_default_bps', LEAST(p_fee_rate_default_bps, v_max_bps),
      'reason', trim(p_reason)
    )
  );
END;
$$;

COMMENT ON FUNCTION public.admin_update_platform_fee_rate IS 'Updates platform fee rate with mandatory reason; writes exactly one audit_logs row. super_admin only at API.';
