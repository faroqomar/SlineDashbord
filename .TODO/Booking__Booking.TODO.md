# Booking Page / Booking Tab TODO Summary

## 1. Page Overview

This document tracks the implementation status of the **Booking** page/tab in `apps/admin-ui` against the current Figma redesign.

Figma references:
- `https://www.figma.com/design/Wvr0SEWZrmtWTFczRJbAew/Untitled?node-id=2-34421&m=dev`
- `https://www.figma.com/design/Wvr0SEWZrmtWTFczRJbAew/Untitled?node-id=2-35250&m=dev`
- `https://www.figma.com/design/Wvr0SEWZrmtWTFczRJbAew/Untitled?node-id=2-36079&m=dev`

Current scope is **UI-first** for booking list experiences (hero, KPI cards, filters, table, app preview, empty/loading/error states), while preserving existing backend integrations only.

Primary implementation files:
- `apps/admin-ui/src/routes/Bookings.tsx`
- `apps/admin-ui/src/features/bookings/viewmodels/use_bookings_viewmodel.ts`
- `apps/admin-ui/src/features/bookings/services/bookings_api.ts`
- `apps/admin-ui/src/features/bookings/models/bookings-ui.mock.ts`

---

## 2. Existing Features Already Linked

The following are wired to existing backend/API behavior (real, not mocked):

1. **Bookings list fetch**
- `useBookingsViewModel().fetchList()` calls `bookingsApi.getList()`
- API: `GET /bookings` with `page`, `pageSize`, `status`

2. **Status filter (server-side)**
- Status chips map to API status values via `STATUS_TAB_TO_API`
- Updates ViewModel filters and re-fetches list from API

3. **Refresh action**
- Refresh button reuses `vm.fetchList(vm.filters)`
- Calls real list endpoint again

4. **Pagination**
- Previous/Next updates `filters.page`
- Re-fetches list using backend pagination metadata (`count`, `totalPages`)

5. **Booking detail navigation**
- Row click and per-row "View" navigate to `/bookings/$bookingId`
- Detail page loads via real API: `GET /bookings/:bookingId`

6. **Cancel/Refund flows on booking detail**
- Detail view uses existing endpoints:
  - `POST /bookings/:bookingId/cancel`
  - `POST /bookings/:bookingId/refund`
- Wired through `useBookingsViewModel` + `bookingsApi`

---

## 3. Missing Features (Design References but Backend/Feature Not Implemented)

These are present in design intent but not backed by current API contracts:

1. **Hero analytics trend data (Booked vs Completed, last 7 days)**
- Current hero trend is static visual data, not API-driven analytics.

2. **KPI cards with real totals/deltas/sparklines**
- Current KPI cards are UI mock cards and not linked to a backend analytics source.

3. **Rich server-side search/filter from toolbar**
- Current search is client-side over currently loaded rows only.
- Backend does not currently provide query contract for full dataset search in this page implementation.

4. **Human-readable row enrichment fields from backend**
- Service title, category, booking code, client/provider names/avatars are currently synthetic UI data.
- Existing list response does not provide full design-level display payload used in table/app preview.

5. **App Preview as real booking projection**
- Mobile preview panel is currently a design mock representation, not a real app-rendered or backend-provided preview payload.

---

## 4. What We Mocked and Why

Mocking is intentionally isolated in:
- `apps/admin-ui/src/features/bookings/models/bookings-ui.mock.ts`

Mocked items:

1. **KPI cards metadata**
- `BOOKING_KPI_MOCK_CARDS`
- Includes value/delta/sparkline/tone
- Reason: no existing analytics endpoint for booking KPIs

2. **Status chip presentation set**
- `BOOKING_STATUS_CHIPS`
- UI option model for tabs/chips
- Reason: design-driven UI model; API currently only consumes raw `status`

3. **Display enrichment for rows**
- `getBookingDisplayMock(booking)`
- Produces booking code, service title, category, client/provider names and initials
- Reason: list API does not return this enriched display payload

4. **App preview payload**
- `getBookingAppPreviewMock(booking, display)`
- Produces mock location, description, timeline, participants, notes, pricing breakdown labels
- Reason: no backend contract currently provides this preview-specific structured payload

5. **Hero trend line points**
- `HeroTrend` component in `apps/admin-ui/src/routes/Bookings.tsx`
- Reason: no analytics trend API currently wired for this page

All mocked parts are UI-only placeholders used to match Figma layout and interaction states without adding non-existing backend features.

---

## 5. Implementation Plan for Missing Features (High-Level Only)

1. **Add booking analytics API contract**
- Introduce endpoint(s) for hero trend and KPI totals/deltas/sparkline series.
- Define shared schemas in `packages/shared` and consume in admin-ui API client.

2. **Extend booking list query/filter contract**
- Add server-side query params for text search and any required design filters.
- Keep server-side pagination as the source of truth.

3. **Extend booking row DTO for display parity**
- Include backend-provided booking code, service label, category, client/provider display fields (or resolvable IDs with dedicated lookup contracts).

4. **Define app preview contract (if product requires real data parity)**
- Create an API response shape for mobile preview sections or map existing detail fields into preview sections.

5. **Progressive mock replacement**
- Replace each mocked section one-by-one behind type-safe contracts.
- Keep UI fallback states for partial payload rollout.

6. **Verification and regression checks**
- Validate loading/empty/error/disabled states after replacing mocks.
- Add/adjust tests for list filtering, pagination integrity, and detail action stability.

---

## 6. Risks / Dependencies / Required APIs

### Risks

1. **Contract drift risk**
- UI may diverge from API if analytics and enrichment contracts are not formalized in `packages/shared` first.

2. **Search behavior risk**
- Current client-side search over a paginated subset can create misleading expectations versus full-dataset search.

3. **Preview realism risk**
- App preview can be misinterpreted as real operational data while still mock-driven.

4. **General build hygiene risk**
- Unrelated typecheck issues in other modules can block full confidence checks for this area unless resolved separately.

### Dependencies

1. `apps/api` booking route enhancements (analytics + richer list filters/fields)
2. `packages/shared` schema/type updates for new response/query contracts
3. DB/query support for any new aggregate metrics and searchable columns
4. Product alignment on exact semantics for KPI formulas and trend windows

### Required APIs (Target)

1. **Booking list with richer querying**
- `GET /bookings?page=&pageSize=&status=&q=&...`
- Returns server-filtered rows + pagination metadata

2. **Booking analytics endpoint**
- Example: `GET /bookings/analytics?window=7d`
- Returns hero series + KPI totals + deltas + sparkline data

3. **(Optional) Booking preview payload endpoint**
- Example: `GET /bookings/:bookingId/preview`
- Returns structured sections needed for app-preview parity
