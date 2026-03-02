-- PAGE 06: Force logout / session revocation.
-- Requires related_entity_type_enum to include 'profile' (20260302100000).
-- App (Flutter) must read profiles.force_logout_after and force re-auth when set.

-- 1. Revocation column: app checks this and signs out user if force_logout_after > token issued_at
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS force_logout_after timestamptz DEFAULT NULL;
COMMENT ON COLUMN public.profiles.force_logout_after IS 'When set, app must clear session and require re-auth (admin force-logout).';

-- 2. RPC: set force_logout_after and write one audit row atomically (no idempotency in v1)
CREATE OR REPLACE FUNCTION public.admin_force_logout_user(
  p_user_id uuid,
  p_admin_id uuid,
  p_reason text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated int;
BEGIN
  UPDATE public.profiles
  SET force_logout_after = now()
  WHERE id = p_user_id;
  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 0 THEN
    RAISE EXCEPTION 'Profile not found: user id does not exist or is not in profiles';
  END IF;

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    'admin.users.force_logout',
    p_admin_id,
    'profile',
    p_user_id,
    jsonb_build_object('reason', p_reason)
  );
END;
$$;
