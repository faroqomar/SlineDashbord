# SysOp Report — PAGE 06 & PAGE 07

**Scope:** PAGE 06 (Force Logout) + PAGE 07 (Bookings Admin)  
**Date:** 2025-03-02  
**Agent:** @SysOp per `.agent/workflows/architecture/sys_op.md`

---

## 1. Endpoint Inventory (Fastify)

| Method | Path | RBAC | Zod | Audit |
|--------|------|------|-----|-------|
| GET | `/api/v1/bookings` | moderator, admin, super_admin | BookingListQuerySchema | N/A (read) |
| GET | `/api/v1/bookings/:bookingId` | moderator, admin, super_admin | path UUID | N/A (read) |
| POST | `/api/v1/bookings/:bookingId/cancel` | moderator, admin, super_admin | AdminBookingCancelInputSchema | RPC only (atomic) |
| POST | `/api/v1/bookings/:bookingId/refund` | admin, super_admin | AdminBookingRefundInputSchema | RPC only (atomic) |
| POST | `/api/v1/users/:userId/force-logout` | admin, super_admin (USERS_WRITE_ROLES) | ForceLogoutInputSchema | RPC only (atomic) |

**Evidence:** **Verified in dashboard code:** `apps/api/src/routes/bookings.ts`, `users.ts`; `app.ts` registers `bookingsRoutes` at `/api/v1/bookings`.

---

## 2. DB/RPC Requirements

| Object | Evidence | Location |
|--------|----------|----------|
| **admin_cancel_booking** | **Verified in dashboard code:** `supabase/migrations/20260302120000_admin_booking_rpcs.sql` — UPDATE bookings + INSERT audit_logs in one transaction. | Dashboard repo |
| **admin_refund_booking** | **Verified in dashboard code:** Same migration; idempotency via audit_logs meta idempotency_key; UPDATE bookings + INSERT audit_logs. | Dashboard repo |
| **admin_force_logout_user** | **Verified in dashboard code:** `supabase/migrations/20260302140000_force_logout.sql` — UPDATE profiles.force_logout_after + INSERT audit_logs. | Dashboard repo |
| **profiles.force_logout_after** | **Verified in dashboard code:** Added in same force_logout migration. | Dashboard repo |

**Canonical ownership:** Plan states app repo owns production DB; dashboard migrations support local/shared DB. Copyable SQL in `MIGRATIONS/for_sline_app/` for force-logout.

---

## 3. audit_logs Atomicity

| Mutation | Atomic? | Evidence |
|----------|---------|----------|
| Cancel booking | ✅ | **Verified in dashboard code:** RPC performs UPDATE + INSERT in same function; API does not call `withAudit`. |
| Refund booking | ✅ | **Verified in dashboard code:** Same; single transaction in RPC. |
| Force logout | ✅ | **Verified in dashboard code:** `admin_force_logout_user` updates profiles and inserts audit in one transaction; no withAudit in route. |

**Grep:** **Verified in dashboard code:** `withAudit` in `apps/api/src/routes/bookings.ts` → 0 matches.

---

## 4. Contract Map (packages/shared)

| Schema | File | Exported |
|--------|------|----------|
| BookingListQuerySchema, BookingRowSchema, BookingDetailSchema, BookingListResponseSchema | packages/shared/src/schemas/bookings.ts | Yes (index.ts) |
| AdminBookingCancelInputSchema, AdminBookingRefundInputSchema | Same | Yes |
| ForceLogoutInputSchema | packages/shared/src/schemas/users.ts | Yes |
| AuditActionEnum includes 'admin.users.force_logout' | packages/shared/src/schemas/audit.ts | Yes |

---

## 5. Gaps / Drift

| Item | Severity | Evidence | Recommendation |
|------|----------|----------|----------------|
| **Bookings RPC in app repo** | LOW | **Missing repo evidence** for sline_app migrations containing admin_cancel_booking / admin_refund_booking. | Copy dashboard migration SQL to app repo when promoting to production. |
| **entity_type 'booking'** | — | **Verified in audit doc:** related_entity_type_enum already includes 'booking'. | None. |

---

*Report produced per Orchestrator pipeline.*
