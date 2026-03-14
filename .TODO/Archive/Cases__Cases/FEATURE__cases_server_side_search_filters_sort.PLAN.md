# Feature Plan: Cases Server-Side Search, Filters, and Sort

## Feature Goal

Move Cases toolbar behavior from client-side filtering to server-side query execution for search, status, priority, source, and sorting while preserving current page structure and pagination UX.

## UX Behavior From Design

1. Search field filters results by case code, subject, assignee, and source.
2. Filter chips (Status, Priority, Source) update results immediately and reset to page 1.
3. Result count reflects server-filtered results, not just the current in-memory page.
4. Table sort (created date default) remains deterministic across pages.
5. Loading state uses skeletons while filter/sort query is in-flight.

## Data Contracts Needed (API Endpoints / Schemas)

1. Extend existing endpoint:
- `GET /api/v1/cases`

2. Query params (additive):
- `page`, `limit`
- `q`
- `status`
- `priority`
- `source`
- `sort` (for example `created_desc`, `created_asc`)

3. Shared schema updates (`packages/shared/src/schemas/cases.ts`):
- `AdminCasesListQuerySchema` (new)
- Extend `AdminCaseListResponseSchema` to clarify filtered totals semantics

## Steps (Backend then Frontend)

### Backend

1. Add strict query validation in cases route for new params.
2. Implement server-side filter building with safe allowlists for enum-like fields.
3. Implement server-side search (`q`) across approved columns.
4. Implement deterministic sort strategy with safe defaults.
5. Return filtered total and page metadata consistent with current pagination contract.

### Frontend

1. Extend `casesApi.listCases()` to pass query/filter/sort params.
2. Update `use_cases_viewmodel.ts` to treat search/filter/sort as request params, not local filtering.
3. Debounce search input updates to reduce request spam.
4. Keep existing skeleton, empty, and error states.
5. Remove client-side filtered result derivation once backend filtering is live.

## Tests (Unit / Integration / Smoke)

### Unit

1. Shared schema tests for query parsing and invalid filter rejection.
2. ViewModel tests for filter state transitions and request param mapping.

### Integration

1. API tests:
- `401/403` auth enforcement
- `200` with each filter independently
- combined filters + sort + pagination
- invalid params return `400`

### Smoke

1. Manual smoke on `/cases`:
- apply each chip filter
- apply search
- paginate results
- verify counts remain consistent
- verify sort order stability across page changes

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep current `page/limit` behavior as fallback if advanced params are omitted.
2. Roll out server filtering behind additive query params only (backward compatible).
3. If server filtering causes regressions, temporarily disable advanced params in frontend while retaining endpoint compatibility.
4. Add query performance monitoring before full rollout to prevent production latency spikes.
