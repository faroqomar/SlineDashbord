# Global Search

## Purpose

Provide cross-entity admin search from one screen, including live search insights KPIs and typed result navigation.

## Route / Screen

- Route: `/search`
- Screen: `apps/admin-ui/src/features/search/view/SearchScreen.tsx`

## UI Composition

Search UI is modularized into feature components:
- `SearchHeroPanel`
- `SearchKpiGrid`
- `SearchTypeChips`
- `SearchResultsPanel`
- `SearchResultRow`
- `SearchRightRail`
- `SearchEmptyState`
- `SearchSkeleton`

Theme tokens/vibe are defined in `apps/admin-ui/src/features/search/view/search.theme.ts`.

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/search` | Global entity search (`q`, `types`, `limit`) |
| GET | `/api/v1/search/insights` | KPI metrics window (`window`, `tz`) for Search KPIs |

## Entities Returned

- `user`
- `task`
- `booking`
- `dispute`
- `transaction`

## ViewModel / Models

- ViewModel: `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts`
- UI models:
  - `apps/admin-ui/src/features/search/models/search-ui.model.ts`
  - `apps/admin-ui/src/features/search/models/search-ui.mock.ts`

## Shared Contracts

- `packages/shared/src/schemas/search.ts`
  - `AdminGlobalSearchQuerySchema`
  - `AdminGlobalSearchResultSchema`
  - `AdminSearchInsightsQuerySchema`
  - `AdminSearchInsightsResultSchema`

## Security / Behavior

- Search endpoints are read-only admin endpoints.
- No privileged mutation is executed from this feature.
- API-side validation is Zod-first.

## Verification

- `npm --prefix apps/api run test -- src/routes/search.test.ts`
- `npm --prefix apps/admin-ui run test -- src/features/search/models/search-ui.mock.test.ts`

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
