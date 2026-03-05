# Code Warden Review — PAGE 06 & PAGE 07

**Scope:** PAGE 06 (Force Logout) + PAGE 07 (Bookings Admin)  
**Date:** 2025-03-02  
**Agent:** @CodeWarden per `.agent/workflows/code_review/code_warden.md`

---

## 1. Boundary Enforcement

### Allowed flow: Route/View → ViewModel → API client → Fastify → DB RPC

| Component | Compliance | Evidence |
|-----------|------------|----------|
| **Bookings.tsx** | ✅ | **Verified in dashboard code:** Uses only `useBookingsViewModel()` and UI components; no API or DB calls. |
| **BookingDetail.tsx** | ✅ | **Verified in dashboard code:** Uses `useBookingsViewModel()`; actions call `vm.cancel`, `vm.refund`, `vm.loadDetail`; no direct fetch or Supabase. |
| **use_bookings_viewmodel.ts** | ✅ | **Verified in dashboard code:** Calls only `bookingsApi.*`; no RBAC logic, no Supabase, no raw fetch. |
| **bookings_api.ts** | ✅ | **Verified in dashboard code:** Uses `request()` from `lib/api`; types from `@sline/shared`. |

### Forbidden flows

| Check | Result | Evidence |
|-------|--------|----------|
| UI calling Supabase for privileged ops | **None** | **Verified in dashboard code:** Grep in bookings + UserDetail paths — no supabase import. |
| API "audit after write" | **None** | **Verified in dashboard code:** Bookings route does not use `withAudit`; cancel/refund use RPC only. |

---

## 2. API Standards (apps/api)

| Rule | Status | Evidence |
|------|--------|----------|
| Zod validation for inputs | ✅ | **Verified in dashboard code:** All booking and force-logout handlers use safeParse with shared schemas. |
| RBAC per route | ✅ | **Verified in dashboard code:** preHandler requireAdminRole or explicit role check (force-logout). |
| No privileged mutation without atomic audit | ✅ | **Verified in dashboard code:** Cancel, refund, force-logout invoke RPC that does mutation + audit in one transaction. |

---

## 3. File Size / God File

| File | Lines (approx) | Status |
|------|----------------|--------|
| Bookings.tsx | ~165 | ✅ Under 300 |
| BookingDetail.tsx | ~255 | ✅ Under 300 |
| use_bookings_viewmodel.ts | ~115 | ✅ Under 300 |
| bookings.ts (API) | ~168 | ✅ Under 300 |

---

## 4. Violations List

**None.** No UI logic in wrong layer, no service calls from Views except via ViewModel, no forbidden imports.

---

## Decision: **APPROVED ✅**

MVVM and API boundaries respected. No blocking violations.

---

*Report produced per Orchestrator pipeline.*
