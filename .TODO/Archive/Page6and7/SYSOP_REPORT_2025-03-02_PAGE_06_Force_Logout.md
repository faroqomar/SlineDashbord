# SysOp Report — PAGE 06 Force Logout / Session Revocation

**Scope:** PAGE 06 (force-logout API + RPC + migration).  
**Date:** 2025-03-02  
**Agent:** @SysOp

---

## Endpoint inventory (Fastify)

| Method | Path | Handler | Evidence |
|--------|------|---------|----------|
| POST | /api/v1/users/:userId/force-logout | RPC admin_force_logout_user | **Verified in app code:** users.ts |

## Contract map (packages/shared)

- **Verified in app code:** users.ts — ForceLogoutInputSchema (userId, reason?, idempotency_key?); audit.ts — 'admin.users.force_logout' in AuditActionEnum. API validates with ForceLogoutInputSchema.safeParse({ ...body, userId }).

## DB / RPC

- **Verified in SQL:** supabase/migrations/20260302140000_force_logout.sql — profiles.force_logout_after (timestamptz); RPC admin_force_logout_user(p_user_id, p_admin_id, p_reason) updates profiles SET force_logout_after = now() and INSERT into audit_logs in same block.
- **Verified in app code:** API passes p_user_id, p_admin_id, p_reason; no idempotency_key used in RPC (deferred per plan).

## audit_logs atomicity

- **Verified in SQL:** admin_force_logout_user does UPDATE profiles then INSERT audit_logs in same function (same transaction). No "write then audit" in API; no withAudit used.
- **Status:** Compliant — RPC is sole writer; one audit row per call inside RPC.

---

## Findings

| Severity | Finding | Evidence | Fix |
|----------|---------|----------|-----|
| — | No admin_users writes in force-logout flow | **Verified in app code:** users.ts uses RPC only. | None. |
| — | RPC args match API (p_user_id, p_admin_id, p_reason) | **Verified in app code:** users.ts lines 180–184. | None. |
| — | Idempotency deferred (Option C); replay returns 200 | **Verified in plan:** EXECUTION_REPORT_PAGE_06. | Documented; no change required. |
