# Security Review — PAGE 06 & PAGE 07

**Scope:** PAGE 06 (Force Logout) + PAGE 07 (Bookings Admin)  
**Date:** 2025-03-02  
**Agent:** @SecGuard per `.agent/skills/security-review/SKILL.md`

---

## 1. Forbidden Imports (Admin UI)

| Check | Result | Evidence |
|-------|--------|----------|
| Server-only Supabase in admin-ui | **PASS** | **Verified in dashboard code:** No `@/lib/supabase/admin`, `@/lib/supabase/server`, `createAdminClient`, `auth.admin`, `@/types/supabase` in `apps/admin-ui/src/features/bookings` or booking routes. |
| Service role in client bundle | **PASS** | **Verified in dashboard code:** Bookings and user detail use `request()` from `lib/api` (cookie/Bearer to Fastify); no SUPABASE_SERVICE_ROLE_KEY in admin-ui. |

---

## 2. RBAC Enforcement

| Route | Required role | Evidence |
|-------|----------------|----------|
| GET/POST /api/v1/bookings/* | List/detail/cancel: moderator, admin, super_admin; refund: admin, super_admin | **Verified in dashboard code:** `requireAdminRole(BOOKING_LIST_ROLES)` and `BOOKING_REFUND_ROLES` in `bookings.ts`. |
| POST /api/v1/users/:userId/force-logout | admin, super_admin | **Verified in dashboard code:** Explicit check `USERS_WRITE_ROLES.includes(role)` in `users.ts`; 403 otherwise. |

---

## 3. Input Validation (Zod)

| Endpoint | Schema | Evidence |
|----------|--------|----------|
| GET /bookings | BookingListQuerySchema | **Verified in dashboard code:** safeParse(request.query) in bookings.ts. |
| POST /bookings/:id/cancel | AdminBookingCancelInputSchema (path + body) | **Verified in dashboard code:** Path bookingId validated UUID regex; body safeParse. |
| POST /bookings/:id/refund | AdminBookingRefundInputSchema | **Verified in dashboard code:** Same. |
| POST /users/:userId/force-logout | ForceLogoutInputSchema | **Verified in dashboard code:** safeParse({ ...body, userId }). |

---

## 4. Audit Compliance

| Rule | Status | Evidence |
|------|--------|----------|
| No "write then audit" (non-atomic) | **PASS** | **Verified in dashboard code:** Cancel/refund/force-logout call RPC only; RPC performs mutation + single audit insert in one transaction. No `withAudit` in bookings or force-logout handlers. |
| Canonical audit columns | **PASS** | **Verified in dashboard code:** RPCs insert actor_user_id, action, related_entity_type, related_entity_id, meta. |

---

## 5. PII / Sensitive Data

- Bookings list/detail expose booking and user IDs (client_id, provider_id); no payment instruments or full PII in scope. Plan does not require masking for this page.
- Force-logout targets user id; reason stored in audit meta. Acceptable for admin action.

---

## Decision: **APPROVED ✅**

No blockers. RBAC, Zod, and atomic audit requirements met. No service-role or forbidden imports in admin-ui.

---

*Report produced per Orchestrator pipeline.*
