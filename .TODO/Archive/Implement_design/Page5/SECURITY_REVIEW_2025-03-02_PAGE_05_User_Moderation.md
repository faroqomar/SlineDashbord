# Security Review — PAGE 05 User Moderation

**Scope:** PAGE 05 + user routes (force-logout).  
**Date:** 2025-03-02  
**Agent:** @SecGuard

---

## Forbidden imports (admin-ui)

- **Verified in dashboard code:** apps/admin-ui/src/lib/supabase.ts uses `createClient(supabaseUrl, supabaseAnonKey)` only (VITE_ env). No createAdminClient, no auth.admin, no server-only Supabase in API client path.
- **Verified in dashboard code:** users_api.ts uses `request()` to API; no Supabase import.

**Decision:** APPROVED — no service-role or server-only Supabase in admin-ui for user moderation flow.

## RBAC

- **Verified in app code:** users.ts preHandler: requireAdminRole(['support', 'moderator', 'admin', 'super_admin']) for all routes. Force-logout additionally checks USERS_WRITE_ROLES (admin/super_admin) and returns 403 for support.
- Ban/unban/suspend: any of the four roles can call (plan allowed moderator+). Force-logout: admin/super_admin only.

**Decision:** APPROVED — RBAC enforced; force-logout correctly restricted.

## Audit compliance

- **Verified in app code:** Ban/unban/suspend use RPC only; no “write then audit” in API layer. RPC does UPDATE + INSERT in one transaction.

**Decision:** APPROVED — atomic audit.

## PII / case-gated access

- User list/detail return profile data (email, name). No chat scope in PAGE 05. No change required.

---

## Decision: **APPROVED**

No blockers. Service role server-only; RBAC and atomic audit satisfied.
