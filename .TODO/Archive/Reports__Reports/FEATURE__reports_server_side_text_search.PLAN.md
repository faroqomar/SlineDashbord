# Feature Plan: Reports Server-Side Text Search

## Feature Goal

Implement real server-side free-text search for the reports queue so search results are complete across the dataset, not limited to the currently loaded client page.

## UX Behavior From Design

1. Search input (`Search by ID, reason, reporter, or entity...`) queries server data.
2. Typing a query updates table results with pagination tied to the filtered dataset.
3. Result count reflects backend total for the active query.
4. Search combines with existing filter chips (status/type/severity/ownership).
5. Empty state message clearly indicates no matches for the query.

## Data Contracts Needed (API Endpoints / Schemas)

1. Extend existing endpoint:
- `GET /api/v1/reports`
- add optional query param: `q`

2. Shared schema updates in `packages/shared/src/schemas/reports.ts`:
- extend reports list query schema with:
  - `q?: string` (trimmed, max length, sanitized)

3. Search scope contract:
- searchable fields:
  - report id (prefix/exact support rule)
  - reason text
  - reporter display name / identifier
  - entity id / entity reference text
- define deterministic precedence and collation behavior.

4. Access control:
- unchanged; same read roles as current list endpoint.

## Steps (Backend then Frontend)

### Backend

1. Extend list query schema to accept optional `q`.
2. Update reports list query builder in `apps/api` reports route/service:
- apply safe `ILIKE`/FTS filter set over approved searchable fields.
- combine with existing status/type/severity/assigned filters.
3. Keep pagination meta based on filtered query (`total`, `page`, `limit`).
4. Add guardrails:
- min/max query length
- defensive escaping/sanitization
- indexed strategy (trigram or FTS index) if needed for performance.

### Frontend

1. Extend `ReportsListQuery` and `reportsApi.list()` in `apps/admin-ui/src/features/reports/services/reports_api.ts` to include `q`.
2. In `use_reports_viewmodel.ts`, pass `searchQuery` as `q` to list requests and reset page to 1 on query change.
3. In `ReportsTable.tsx`, remove mock/local-only search indicator once backend search is live.
4. Keep current debouncing behavior (or add lightweight debounce) to limit request flood.

## Tests (unit/integration/smoke)

### Unit

1. Query schema validation tests for `q` trimming and max length.
2. Frontend VM tests for page reset and query propagation.

### Integration

1. `GET /reports?q=...` returns filtered rows + correct `total`.
2. Combined filters + search produce expected intersection behavior.
3. Unauthorized/forbidden behavior unchanged from existing list route.

### Smoke

1. Searching by report id/reason/reporter/entity returns matching rows in staging.
2. Pagination works correctly within search results.
3. No-result query shows empty state without UI errors.

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep `q` optional and additive to preserve existing clients.
2. Feature flag frontend server-side search usage if query performance regresses.
3. Add/verify indexes before broad rollout to avoid slow scans on large tables.
4. Retain current UI functionality with empty query as baseline fallback behavior.
