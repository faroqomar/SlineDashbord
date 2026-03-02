-- PAGE 05: Canonical moderation state for marketplace users (profiles).
-- Apply after related_entity_type_enum has 'profile' (20260302100000).
-- When dashboard and sline_app share a DB, app repo can add equivalent migration for source-of-truth.

-- 1. Extend profiles with moderation columns (Option A)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_status text DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS moderation_reason text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS moderated_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS moderated_by_admin_id uuid;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS restriction_scope text;

COMMENT ON COLUMN public.profiles.account_status IS 'Canonical moderation: active | suspended | banned (marketplace users only)';
COMMENT ON COLUMN public.profiles.moderated_by_admin_id IS 'Admin who last set moderation (auth.users id or admin_users id)';

-- 2. RPC: set user moderation and write one audit row atomically
CREATE OR REPLACE FUNCTION public.admin_set_user_moderation(
  p_user_id uuid,
  p_status text,
  p_reason text,
  p_admin_id uuid,
  p_restriction_scope text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_action text;
BEGIN
  -- Derive audit action from status
  v_action := CASE p_status
    WHEN 'banned' THEN 'user_ban'
    WHEN 'active' THEN 'user_unban'
    WHEN 'suspended' THEN 'user_suspend'
    ELSE 'user_suspend'
  END;

  UPDATE public.profiles
  SET
    account_status = p_status,
    moderation_reason = p_reason,
    moderated_at = now(),
    moderated_by_admin_id = p_admin_id,
    restriction_scope = p_restriction_scope
  WHERE id = p_user_id;

  INSERT INTO public.audit_logs (action, actor_user_id, related_entity_type, related_entity_id, meta)
  VALUES (
    v_action,
    p_admin_id,
    'profile',
    p_user_id,
    jsonb_build_object('reason', p_reason, 'restriction_scope', p_restriction_scope)
  );
END;
$$;
