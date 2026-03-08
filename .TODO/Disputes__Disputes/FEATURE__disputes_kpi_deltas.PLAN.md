# Feature Plan: Disputes KPI Delta Metrics

## Feature Goal
Replace mock KPI delta chips with real values and trend direction for Disputes summary cards.

## UX Behavior From Design
- KPI cards show real totals and deltas.
- Up/down direction controls chip icon and color.
- Delta period matches design intent (`last 7 days` vs previous period).
- If summary fetch fails, totals still render and deltas degrade gracefully.

## Data Contracts Needed (API Endpoints / Schemas)
- Endpoint: `GET /disputes/summary?window=7d&compare=previous`
- Response schema:
1. `totalDisputes: { value: number; delta: number; direction: "up" | "down" | "flat" }`
2. `openActive: { value: number; delta: number; direction: "up" | "down" | "flat" }`
3. `resolved: { value: number; delta: number; direction: "up" | "down" | "flat" }`
4. `totalAmount: { value: number; delta: number; direction: "up" | "down" | "flat" }`
- Shared schema in `packages/shared/src/schemas/disputes.ts`

## Steps (Backend Then Frontend)
1. Backend: define summary response contract in shared schemas.
2. Backend: add `GET /disputes/summary` route with read-role protection.
3. Backend: compute current vs previous window metrics from disputes/task budget data.
4. Backend: return normalized direction and delta values.
5. Frontend: add `getSummary(window, compare)` API client method.
6. Frontend: add summary query in disputes ViewModel.
7. Frontend: replace mock KPI delta badges in Disputes screen with summary data.
8. Frontend: keep fallback rendering to current totals when summary unavailable.

## Tests (Unit / Integration / Smoke)
- Unit:
1. Delta calculation utility for up/down/flat cases.
2. Amount aggregation uses consistent numeric conversion.
- Integration:
1. Summary endpoint returns valid shape for authorized admin roles.
2. Unauthorized requests are rejected.
3. Window comparison logic is deterministic.
- Smoke:
1. KPI deltas display correctly for positive and negative scenarios.
2. Failure path shows safe fallback without layout break.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Release summary endpoint first; frontend can remain on mock until ready.
- Keep UI fallback path if summary query fails.
- Do not alter existing list/detail endpoint contracts.
- If wrong numbers are detected, disable delta rendering via feature flag and keep totals.
