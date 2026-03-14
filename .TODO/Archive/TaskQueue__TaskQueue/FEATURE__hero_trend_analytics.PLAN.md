# Feature Plan: Hero Trend Analytics (Posted vs Completed)

## Feature Goal
- Replace mocked hero chart data with real 7-day trend metrics for:
  - `Posted` tasks
  - `Completed` tasks
- Keep Task Queue page stable even if analytics data is unavailable.

## UX Behavior From Design
- Hero section shows two trend lines and legend labels:
  - Posted
  - Completed
  - Last 7 days
- Refresh action updates the chart with latest values.
- On API failure, hero chart gracefully falls back to existing mock visuals (no blank state).

## Data Contracts Needed (API Endpoints / Schemas)
- **Endpoint (new):** `GET /api/v1/tasks/queue-analytics?range=7d`
- **Response shape (shared schema):**
  - `range: "7d"`
  - `days: Array<{ date: string; posted_count: number; completed_count: number }>` (length = 7)
  - `totals: { posted: number; completed: number }`
  - `is_stale?: boolean`
- **Shared files to extend:**
  - `packages/shared/src/schemas/tasks.ts` (or equivalent task analytics schema file)
  - Admin UI DTO mapping in `apps/admin-ui/src/features/tasks/models/*`

## Steps (Backend then Frontend)
### Backend
1. Add a read-only analytics route in `apps/api/src/routes/tasks.ts` (or a dedicated tasks analytics route module).
2. Aggregate daily posted counts from `tasks.created_at`.
3. Aggregate daily completed counts using canonical completion signal (status transition/source of truth confirmed first).
4. Return exactly 7 ordered daily points (oldest -> newest), filling missing days with zeros.
5. Protect route with existing admin RBAC middleware.
6. Add response validation against shared schema before send.

### Frontend
1. Add `tasksApi.getTaskQueueAnalytics(range)` in `apps/admin-ui/src/features/tasks/services/tasks_api.ts`.
2. Extend `use_tasks_viewmodel.ts` with `heroAnalytics` state and loading/error handling.
3. Replace mock hero line points in `TasksScreen.tsx` with real series when available.
4. Keep fallback to current mock series if analytics fetch fails or is empty.
5. Ensure refresh button reloads hero analytics and list data together.

## Tests (Unit / Integration / Smoke)
### Unit
- Date-bucket formatter returns exactly 7 points and zero-fills gaps.
- Schema validation rejects malformed analytics payloads.

### Integration
- API test: authorized admin gets 200 with valid 7-day payload.
- API test: non-admin gets 403.
- API test: empty dataset still returns 7 zero-filled points.

### Smoke
- Task Queue renders hero chart with live data.
- Refresh updates chart and table without UI regression.
- Simulated analytics failure falls back to mock chart, page remains usable.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Keep hero mock fallback path active until analytics endpoint is proven stable.
- Do not remove existing task list endpoint behavior.
- Guard new route behind strict RBAC; no service-role exposure to client.
- If aggregation query impacts performance, rollback by disabling new endpoint and relying on current mock series.
