# SysOp Report — PAGE 05 User Moderation (+ user routes)

**Scope:** PAGE 05 + user API (ban/unban/suspend/force-logout).  
**Date:** 2025-03-02  
**Agent:** @SysOp

---

## Endpoint inventory (Fastify)

| Method | Path | Handler | Evidence |
|--------|------|---------|----------|
| GET | /api/v1/users | List profiles | **Verified in app code:** users.ts |
| GET | /api/v1/users/:userId | User detail (auth + profile) | **Verified in app code:** users.ts |
| POST | /api/v1/users/:userId/ban | RPC admin_set_user_moderation | **Verified in app code:** users.ts |
| POST | /api/v1/users/:userId/unban | RPC admin_set_user_moderation | **Verified in app code:** users.ts |
| POST | /api/v1/users/:userId/suspend | RPC admin_set_user_moderation | **Verified in app code:** users.ts |
| POST | /api/v1/users/:userId/force-logout | RPC admin_force_logout_user | **Verified in app code:** users.ts |

## Contract map (packages/shared)

- **Verified in app code:** users.ts — BanUserSchema, UnbanUserSchema, SuspendUserSchema, ForceLogoutInputSchema; audit.ts — user_ban, user_unban, user_suspend. All used by API.

## DB / RPC

- **Verified in SQL:** supabase/migrations/20260302120000_profiles_moderation_and_rpc.sql — profiles columns (account_status, moderation_reason, moderated_at, moderated_by_admin_id, restriction_scope); RPC admin_set_user_moderation(p_user_id, p_status, p_reason, p_admin_id, p_restriction_scope) updates profiles + INSERT audit_logs in same transaction.
- **Verified in SQL:** supabase/migrations/20260302140000_force_logout.sql — profiles.force_logout_after; RPC admin_force_logout_user.

## audit_logs atomicity

- **Verified in app code:** Ban/unban/suspend do not use withAudit; RPC is sole writer. One audit row per call inside RPC.
- **Verified in SQL:** admin_set_user_moderation INSERT into audit_logs in same block as UPDATE profiles.

---

## Findings

| Severity | Finding | Evidence | Fix |
|----------|---------|----------|-----|
| — | No admin_users writes in users.ts for moderation | **Verified in app code:** grep admin_users users.ts → 0 | None. |
| — | RPC args match API (p_user_id, p_status, p_reason, p_admin_id, p_restriction_scope) | **Verified in app code:** users.ts lines 90–96, 117–123, 146–152 | None. |
