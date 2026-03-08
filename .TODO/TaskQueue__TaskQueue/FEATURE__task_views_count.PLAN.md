# Feature Plan: Real Views Count per Task

## Feature Goal
- Replace mocked `Views` column with real view metrics per task where available.
- Keep table stable even when metrics source is incomplete.

## UX Behavior From Design
- Each row shows a views indicator (`eye` icon + number).
- Values should load with the row data in table mode.
- Missing metrics should degrade gracefully to `0` (or hidden value state) without layout shift.

## Data Contracts Needed (API Endpoints / Schemas)
- **Endpoint update:** `GET /api/v1/tasks` response extension.
- **Response field (per row):**
  - `views_count?: number`
- **Discovery dependency:**
  - Identify source of truth (`task_views`, analytics events, journal table, or materialized aggregate).
- **Schema updates:**
  - `packages/shared/src/schemas/tasks.ts`
  - `apps/admin-ui/src/features/tasks/models/task.schema.ts`

## Steps (Backend then Frontend)
### Backend
1. Discovery step: confirm canonical source for task view events/counts.
2. Add performant per-task aggregation in list query (or join a pre-aggregated table/view).
3. Return `views_count` as optional field.
4. Validate payload with shared schema.
5. Keep existing list latency within acceptable admin SLA.

### Frontend
1. Extend task DTO with `views_count`.
2. Render `views_count` in `TaskTable` when provided.
3. Use mock fallback only while backend source is unavailable.
4. Remove mock label once data source is stable.

## Tests (Unit / Integration / Smoke)
### Unit
- Row render logic prioritizes real `views_count`.

### Integration
- API test validates `views_count` presence/absence behavior.
- API performance test baseline with pagination/filter combinations.

### Smoke
- Views values appear for rows with data.
- Table remains responsive and visually stable during fetches.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Keep `views_count` optional and non-blocking for UI rendering.
- If views source is unstable or expensive, rollback by returning no field and keep temporary UI fallback.
- No write-path changes required; only read-model extension.
