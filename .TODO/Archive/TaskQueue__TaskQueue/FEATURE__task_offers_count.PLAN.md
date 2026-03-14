# Feature Plan: Real Offers Count per Task

## Feature Goal
- Replace mocked `Offers` column in Task Queue table with real per-task counts.
- Maintain current pagination/filter behavior.

## UX Behavior From Design
- Each row shows a numeric offers badge in the `Offers` column.
- Value should match backend truth for the visible page.
- If count is unavailable for a row, show `0` (or a neutral fallback) without breaking row layout.

## Data Contracts Needed (API Endpoints / Schemas)
- **Endpoint update:** existing `GET /api/v1/tasks` response extension.
- **Response field (per row):**
  - `offers_count?: number` (eventually required after rollout)
- **Schema updates:**
  - `packages/shared/src/schemas/tasks.ts` list item schema
  - `apps/admin-ui/src/features/tasks/models/task.schema.ts` DTO type

## Steps (Backend then Frontend)
### Backend
1. Confirm authoritative offers source table(s) and definition (`offer` vs `task_request` semantics).
2. Add aggregate count join/subquery by `task_id` in tasks list query.
3. Ensure counts are scoped to visible tasks only (avoid N+1 behavior).
4. Return `offers_count` in task list payload.
5. Keep existing list query filters and pagination unchanged.

### Frontend
1. Extend task DTO to include `offers_count`.
2. Replace mock offers fallback in `TaskTable` with `task.offers_count` when present.
3. Keep mock fallback path only while backend rollout is incomplete.
4. Remove `(mock)` label after backend rollout reaches stable stage.

## Tests (Unit / Integration / Smoke)
### Unit
- Mapper behavior: prefer real `offers_count`, fallback only when undefined.

### Integration
- API test validates `offers_count` field per task.
- API test covers tasks with zero offers.
- API test confirms filters/pagination still work with count aggregation.

### Smoke
- Task Queue table shows real offers counts.
- Pagination and filtering do not corrupt counts.
- No performance degradation for standard page sizes.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Keep `offers_count` optional during rollout to preserve backward compatibility.
- If query performance regresses, rollback to mocked frontend values and remove backend aggregation.
- Avoid changing mutation flows; this is read-only enhancement.
