# Search / Search TODO Summary

## 1. Page Overview

- **Page:** Search
- **Tab:** Search
- **Design source:** Figma nodes `2:24847` and `2:25707`
- **Scope:** UI-first implementation only (no new backend features)
- **Primary implementation files:**
  - `apps/admin-ui/src/routes/Search.tsx`
  - `apps/admin-ui/src/features/search/view/SearchScreen.tsx`
  - `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts`

This page now includes:
- Hero search panel with shortcut hints and actions
- KPI cards row
- Search type chips
- Results panel with row states and actions
- Right rail (saved searches, recent searches, volume chart, tips)
- Empty and skeleton states
- Timeout and error alerts with retry

## 2. Existing Features Linked (Real)

- **Global search API (real)**
  - Uses existing endpoint through app client: `GET /search?q=...&types=...&limit=20`
  - File: `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts`

- **Type filtering for real entities (real)**
  - Real entity filters (`user`, `booking`, `task`, `dispute`, `transaction`) are converted to API `types` query params.
  - Files:
    - `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts`
    - `apps/admin-ui/src/features/search/models/search-ui.mock.ts` (`toApiTypeFilter`)

- **Result navigation (real rows only)**
  - Clicking a non-mock row navigates to the row link.
  - File: `apps/admin-ui/src/features/search/view/SearchScreen.tsx`

- **Search behavior (real wiring)**
  - Debounce: `300ms`
  - Timeout marker: `10000ms`
  - Retry action and error handling
  - File: `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts`

## 3. Mocked Features (Intentional, UI-Only)

Mock data is centralized in:
- `apps/admin-ui/src/features/search/models/search-ui.mock.ts`

Mocked sections:
- KPI cards and sparkline data (`SEARCH_KPI_MOCK`)
- Saved searches (`SEARCH_SAVED_SEARCHES_MOCK`)
- Recent searches seed (`SEARCH_RECENT_SEARCHES_MOCK`)
- Search volume chart (`SEARCH_VOLUME_MOCK`)
- Search tips (`SEARCH_TIPS_MOCK`)
- Mock results rows (`SEARCH_RESULT_ROWS_MOCK`)
- Mock-only filters: `report`, `case`

Mock behavior rules:
- Mock rows carry `isMock: true`
- Mock rows do not navigate to detail pages
- `report` and `case` filters stay mock-only until backend/search contracts exist

## 4. Component Map (Implemented)

- **Page shell**
  - `apps/admin-ui/src/features/search/view/SearchScreen.tsx`

- **Hero panel**
  - `apps/admin-ui/src/features/search/view/components/SearchHeroPanel.tsx`

- **KPI cards**
  - `apps/admin-ui/src/features/search/view/components/SearchKpiGrid.tsx`

- **Type chips**
  - `apps/admin-ui/src/features/search/view/components/SearchTypeChips.tsx`

- **Results panel + row UI**
  - `apps/admin-ui/src/features/search/view/components/SearchResultsPanel.tsx`
  - `apps/admin-ui/src/features/search/view/components/SearchResultRow.tsx`
  - `apps/admin-ui/src/features/search/view/components/SearchRowPills.tsx`

- **Right rail**
  - `apps/admin-ui/src/features/search/view/components/SearchRightRail.tsx`

- **Loading / empty states**
  - `apps/admin-ui/src/features/search/view/components/SearchSkeleton.tsx`
  - `apps/admin-ui/src/features/search/view/components/SearchEmptyState.tsx`

- **Theme tokens**
  - `apps/admin-ui/src/features/search/view/search.theme.ts`

## 5. Remaining TODOs

1. Replace `SEARCH_KPI_MOCK` with real analytics payload once backend contract exists.
2. Replace `SEARCH_VOLUME_MOCK` with real search-volume data endpoint.
3. Replace `SEARCH_SAVED_SEARCHES_MOCK` and seeded recents with persistent source.
4. Enable real `report` and `case` entity types when they are available in shared schema + API.
5. Replace static status/tone mapping for real rows with backend-provided status metadata.
6. Add visual regression coverage for Search page states (loaded, loading, empty, timed out, error).

## 6. Verification Snapshot

Last implementation verification completed with:
- `npm --prefix apps/admin-ui run typecheck` ✅
- `npm --prefix apps/admin-ui run build` ✅
- `npm --prefix apps/admin-ui run forbidden-imports` ✅

## 7. Planner Expansion Docs

Detailed implementation plans for missing features:

- `.TODO/Search__Search/FEATURE__search_kpi_live_analytics.PLAN.md`
- `.TODO/Search__Search/FEATURE__search_volume_timeseries_real_data.PLAN.md`
- `.TODO/Search__Search/FEATURE__search_saved_recent_persistence.PLAN.md`
- `.TODO/Search__Search/FEATURE__search_reports_cases_entity_parity.PLAN.md`
- `.TODO/Search__Search/FEATURE__search_result_status_metadata.PLAN.md`
- `.TODO/Search__Search/FEATURE__search_visual_regression_coverage.PLAN.md`
