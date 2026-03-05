# Architect Report — PAGE 06 & PAGE 07

**Scope:** PAGE 06 (Force Logout) + PAGE 07 (Bookings Admin)  
**Date:** 2025-03-02  
**Agent:** @AdminArchitect per `.agent/workflows/architecture/admin_architect.md`

---

## 1. MVVM Boundary Check

| Area | Evidence | Status |
|------|----------|--------|
| **Bookings View → VM** | **Verified in dashboard code:** `Bookings.tsx` and `BookingDetail.tsx` use `useBookingsViewModel()` only; no direct API or DB. | ✅ PASS |
| **Bookings VM → API** | **Verified in dashboard code:** `use_bookings_viewmodel.ts` calls `bookingsApi.getList`, `getById`, `cancel`, `refund`; no Supabase import. | ✅ PASS |
| **Bookings API client** | **Verified in dashboard code:** `features/bookings/services/bookings_api.ts` uses `request()` from `../../../lib/api` and types from `@sline/shared`. | ✅ PASS |
| **Force Logout** | **Verified in dashboard code:** `UserDetail.tsx` uses `request('POST', .../force-logout)` and mutation; no server imports. | ✅ PASS |

---

## 2. Route Parity (TanStack Router)

| Route | Evidence | Status |
|-------|----------|--------|
| `/bookings` | **Verified in dashboard code:** `App.tsx` registers `bookingsRoute` with path `/bookings`, component `BookingsPage`. | ✅ PASS |
| `/bookings/$bookingId` | **Verified in dashboard code:** `bookingDetailRoute` path `/bookings/$bookingId`, component `BookingDetailPage`; `useParams({ from: '/bookings/$bookingId' })` in detail. | ✅ PASS |
| **Sidebar** | **Verified in dashboard code:** `Sidebar.tsx` includes "Bookings" with `href: "/bookings"`, icon `CalendarCheck`. | ✅ PASS |

---

## 3. Contract Wiring

| Contract | Location | Evidence |
|----------|----------|----------|
| **Bookings** | **Verified in dashboard code:** `packages/shared/src/schemas/bookings.ts` — `BookingListQuerySchema`, `BookingRowSchema`, `BookingDetailSchema`, `BookingListResponseSchema`, `AdminBookingCancelInputSchema`, `AdminBookingRefundInputSchema`; exported from `packages/shared/src/index.ts`. | ✅ |
| **Force Logout** | **Verified in dashboard code:** `ForceLogoutInputSchema` in `packages/shared/src/schemas/users.ts`; `AuditActionEnum` includes `'admin.users.force_logout'` in `audit.ts`. | ✅ |
| **UI consumption** | **Verified in dashboard code:** `bookings_api.ts` imports `BookingRow`, `BookingDetail`, `BookingListResponse`, `AdminBookingCancelInput`, `AdminBookingRefundInput` from `@sline/shared`. | ✅ |

---

## 4. Forbidden Imports (Admin UI)

| Check | Evidence |
|-------|----------|
| **Bookings feature** | **Verified in dashboard code:** `rg "supabase|createAdminClient|auth.admin|@/lib/supabase|@/types/supabase" apps/admin-ui/src/features/bookings` → 0 matches. |
| **Routes** | **Verified in dashboard code:** `Bookings.tsx`, `BookingDetail.tsx` import only from `@/components`, `@/lib/utils`, `@tanstack/react-router`, `../features/bookings`. |

**Decision:** No blocking defects. Architecture compliant.

---

## 5. Structure Notes

- **Bookings feature** uses `features/bookings/services/bookings_api.ts` (not `api/` subfolder); plan used "services" — acceptable per existing patterns (e.g. `tasks_api.ts`).
- **ViewModels** live in `viewmodels/use_bookings_viewmodel.ts`; single hook for list + detail + mutations — within maintainability limits.

---

*Report produced per Orchestrator pipeline. Evidence labels: Verified in dashboard code.*
