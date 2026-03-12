-- Idempotent: add fee columns to existing platform_settings if table exists with different schema.
-- Run this when platform_settings already exists (e.g. key/value style) so fee columns are added.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'platform_settings') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'platform_settings' AND column_name = 'fee_rate_default_bps') THEN
      ALTER TABLE public.platform_settings
        ADD COLUMN fee_rate_default_bps int NOT NULL DEFAULT 1000 CHECK (fee_rate_default_bps >= 0 AND fee_rate_default_bps <= 10000),
        ADD COLUMN max_fee_rate_bps int NOT NULL DEFAULT 2000 CHECK (max_fee_rate_bps >= 0 AND max_fee_rate_bps <= 10000);
    END IF;
  END IF;
END $$;

-- Set default fee on existing default row
UPDATE public.platform_settings
SET fee_rate_default_bps = 1000, max_fee_rate_bps = 2000
WHERE key = 'default';

-- Ensure default row exists when missing (handles both table shapes: with or without value column)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.platform_settings WHERE key = 'default') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'platform_settings' AND column_name = 'value') THEN
      INSERT INTO public.platform_settings (key, value, fee_rate_default_bps, max_fee_rate_bps, updated_at, updated_by)
      VALUES ('default', '{}'::jsonb, 1000, 2000, now(), NULL);
    ELSE
      INSERT INTO public.platform_settings (key, fee_rate_default_bps, max_fee_rate_bps, updated_at, updated_by)
      VALUES ('default', 1000, 2000, now(), NULL);
    END IF;
  END IF;
END $$;
