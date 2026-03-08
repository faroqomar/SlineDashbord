# Cases Page / Cases Tab TODO Summary

## 1. Page Overview

This document tracks the current implementation status of the **Cases** page (`/cases`) in `apps/admin-ui`, compared to the target Figma layout (hero analytics, KPI cards, search/filter toolbar, and dense case table).

Scope is **UI-first** for the Cases list page:
- Route: `apps/admin-ui/src/routes/Cases.tsx`
- Screen: `apps/admin-ui/src/features/cases/view/CasesScreen.tsx`
- ViewModel: `apps/admin-ui/src/features/cases/viewmodels/use_cases_viewmodel.ts`
- API client: `apps/admin-ui/src/features/cases/services/cases_api.ts`

---

## 2. Existing Features Already Linked

The following features are already wired to real existing backend functionality:

1. **List cases**
- `useCasesViewModel()` calls `casesApi.listCases({ page, limit })`
- Backed by `GET /api/v1/cases`

2. **Refresh list**
- Refresh button triggers `vm.refreshCases()`
- Reuses the same real list API call

3. **Create new case**
- Dialog submits `casesApi.createCase(...)`
- Backed by `POST /api/v1/cases`

4. **Open case detail**
- Table row click navigates to `/cases/$caseId`
- Backed by existing detail route and detail API flow

5. **Pagination**
- Prev/Next pagination updates `filters.page`
- Backed by existing `page`/`limit` API support

---

## 3. Missing Features (Design References but Backend/Feature Not Implemented)

These items are still not fully real because current backend contracts do not provide them:

1. **Hero analytics series (Opened vs Closed, last 7 days)**
- Design expects time-series data.
- Current `/cases` API does not expose chart-series metrics.

2. **KPI delta/sparkline analytics**
- Design expects trend deltas (`+28%`, etc.) and sparkline history per KPI.
- Current API only provides case rows + pagination totals.

3. **Server-side query/filter/sort for design toolbar**
- Design includes rich search/filter interaction.
- Current API only supports `page` and `limit`, so the page currently applies filters client-side on fetched rows.

4. **Row metadata parity fields**
- Design shows structured case code (`CAS-00X`), row tags, and links count.
- Current list API payload does not return these fields.

---

## 4. What We Mocked and Why

Mocked data is intentionally isolated in:
- `apps/admin-ui/src/features/cases/models/cases-ui.mock.ts`

Mocked items:

1. **KPI trend metadata**
- `CASES_KPI_MOCK`
- Includes delta text, trend direction, sparkline arrays
- Reason: no existing backend analytics endpoint

2. **Hero chart lines**
- `HERO_OPENED_SERIES_MOCK`
- `HERO_CLOSED_SERIES_MOCK`
- Reason: no existing backend time-series endpoint

3. **Per-row design metadata**
- `getCaseRowMetaMock(index)` returning:
- `caseCode` (CAS-xxx)
- `tags`
- `links`
- Reason: list endpoint does not return these design fields

All mocks are UI-only placeholders and should be replaced by real API fields once backend support exists.

---

## 5. Implementation Plan for Missing Features (High-Level Only)

1. **Add cases analytics endpoint(s)**
- Add API support for hero and KPI trends (7-day opened/closed + KPI sparkline/delta source)
- Return typed payloads via `packages/shared` schema updates

2. **Extend `/cases` list query contract**
- Add query params for `q`, `status`, `priority`, `source`, optional `sort`
- Keep server-side pagination
- Move current client-side filtering to backend-driven filtering

3. **Extend case list row DTO**
- Include optional `case_code`, `tags`, and `links_count` (or equivalent)
- Return stable values from API so UI can remove row meta mocks

4. **Replace mocks progressively**
- Replace hero series from API
- Replace KPI mock trends from API
- Replace row meta mock from API fields
- Keep fallback UI if any field is absent

5. **Verify and harden**
- Update/extend API tests for new query params and response fields
- Add/extend admin-ui tests for filter behavior, loading state, and empty state

---

## 6. Risks / Dependencies / Required APIs

## Risks

1. **Build stability risk (current repo state)**
- `apps/admin-ui` typecheck is currently blocked by unrelated missing file:
- `apps/admin-ui/src/features/disputes/view/DisputesScreen.tsx`
- There is also an icon compatibility issue to resolve in Cases UI imports (lucide export mismatch).

2. **Contract drift risk**
- If UI expectations are implemented before shared schema/API updates, mocks can leak into long-term behavior.

3. **Performance risk**
- Client-side filtering over paged data can produce incomplete/incorrect expectations for total result behavior.

## Dependencies

1. `apps/api` Cases route enhancements (`GET /api/v1/cases` query/filter support + analytics endpoint)
2. `packages/shared` schema updates for new analytics and row metadata contracts
3. Potential DB-side support (indexes for query/filter fields if full-text/search is added)

## Required APIs (target)

1. `GET /api/v1/cases` with:
- Fields: `page`, `limit`, `q`, `status`, `priority`, `source`, `sort`

2. `GET /api/v1/cases/analytics` (or equivalent):
- Fields: 7-day opened/closed series, KPI totals, KPI delta metadata

3. Case list row payload extension:
- Fields: `case_code`, `tags[]`, `links_count`
