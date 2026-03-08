# Feature Plan: Server-Side Table Sorting

## Feature Goal
- Implement real sortable table headers for Task Queue aligned with design expectations.
- Sorting must be deterministic, secure, and compatible with existing pagination/filter/search.

## UX Behavior From Design
- Column headers indicate sortable behavior (e.g., Status, Budget, Offers, Created).
- Clicking a sortable header toggles `asc` / `desc`.
- Active sort column and direction are visually represented.
- Sorting updates task list without breaking current filters.

## Data Contracts Needed (API Endpoints / Schemas)
- **Endpoint update:** `GET /api/v1/tasks`
- **New query params:**
  - `sort_by` (allowlisted enum; e.g., `created_at`, `budget`, `status`, `offers_count`, `views_count`)
  - `sort_dir` (`asc` | `desc`)
- **Defaults:**
  - `sort_by=created_at`
  - `sort_dir=desc`
- **Schema updates:**
  - Request query schema in API layer
  - Shared frontend query typing in tasks ViewModel/service

## Steps (Backend then Frontend)
### Backend
1. Add allowlisted sorting params to tasks route query parsing.
2. Apply safe mapping from `sort_by` to known query columns.
3. Keep deterministic tie-breaker (e.g., `id` secondary sort) for stable pagination.
4. Reject unsupported sort values with validation error.
5. Ensure sort works with active status/search filters.

### Frontend
1. Extend `TaskFilters`/ViewModel with `sortBy` and `sortDir`.
2. Add sortable header UI affordances in `TaskTable`.
3. Update `tasksApi.getTasks` call to send sort params.
4. Keep default sort behavior identical to current production.

## Tests (Unit / Integration / Smoke)
### Unit
- Sort state toggle behavior in ViewModel.
- API query builder maps allowlisted sort keys correctly.

### Integration
- API test: valid sort combinations return 200 and correct ordering.
- API test: invalid `sort_by` returns validation error.
- API test: sort with filter/search/pagination combinations.

### Smoke
- User can sort by supported columns and see order change.
- Paging with sort does not duplicate/skip rows unexpectedly.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Keep default `created_at desc` when sort params are missing or invalid.
- Rollback option: disable sortable headers in UI while retaining default backend ordering.
- Never pass raw client field names directly into DB ordering without allowlist mapping.
