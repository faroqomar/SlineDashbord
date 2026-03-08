# Feature Plan: KPI Deltas and Sparklines

## Feature Goal
- Replace mocked KPI delta/sparkline values with real computed metrics for:
  - Total Tasks
  - Open
  - In Progress
  - Total Budget
- Preserve current card layout and avoid breaking existing list behavior.

## UX Behavior From Design
- Each KPI card displays:
  - Main value
  - Delta badge (`+/-`)
  - Small sparkline trend
- KPI updates when the page refreshes.
- If KPI endpoint fails, cards still render with fallback values (existing live count + mocked trend).

## Data Contracts Needed (API Endpoints / Schemas)
- **Endpoint (new):** `GET /api/v1/tasks/queue-kpis?range=7d&compare=previous_7d`
- **Response shape (shared schema):**
  - `range: "7d"`
  - `compare_range: "previous_7d"`
  - `cards: {`
    - `total_tasks: { value: number; delta_percent: number; sparkline: number[] }`
    - `open_tasks: { value: number; delta_percent: number; sparkline: number[] }`
    - `in_progress_tasks: { value: number; delta_percent: number; sparkline: number[] }`
    - `total_budget: { value: number; delta_percent: number; sparkline: number[]; currency: "IQD" }`
  - `}`
- **Shared files to extend:**
  - `packages/shared/src/schemas/tasks.ts`
  - Admin UI task KPI model mapping files.

## Steps (Backend then Frontend)
### Backend
1. Implement KPI aggregation query logic for current and previous 7-day windows.
2. Define `in_progress` canonical set (e.g., `assigned`, `in_progress`) and keep consistent with current UI.
3. Build sparkline arrays with fixed length and consistent ordering.
4. Return zero-safe deltas when comparison baseline is zero.
5. Add admin RBAC and response schema validation.

### Frontend
1. Add `tasksApi.getTaskQueueKpis()` in tasks service.
2. Extend task ViewModel with `kpiMetrics` state and fallback merge strategy.
3. Render real `value`, `delta`, and `sparkline` in KPI cards.
4. Keep current fallback behavior if API is unavailable.
5. Include KPI refresh in existing page refresh action.

## Tests (Unit / Integration / Smoke)
### Unit
- Delta calculation behavior with zero baselines.
- Sparkline normalization and fixed length validation.

### Integration
- API returns all four KPI cards with valid schema.
- API rejects unauthorized roles.
- Edge case: no tasks in either period returns zero-safe KPI structure.

### Smoke
- KPI cards render real values without visual regressions.
- Refresh updates KPI values.
- API outage shows fallback values without page crash.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Keep fallback mock trends and current live count logic until KPI endpoint is stable.
- Avoid changing existing task list route contract.
- Rollback option: disable KPI API call in ViewModel and retain current behavior.
