# Feature Plan: Reports Trend Analytics (7 Days)

## Feature Goal

Replace mocked hero trend lines (`Incoming` vs `Resolved`) with real 7-day analytics data.

## UX Behavior From Design

1. Hero chart shows two real lines: incoming and resolved.
2. Legend remains `Incoming`, `Resolved`, `Last 7 days`.
3. Chart always renders fixed 7 points (gap-filled days included).
4. On API failure, page remains fully usable and trend area gracefully falls back.

## Data Contracts Needed (API Endpoints / Schemas)

1. New endpoint:
- `GET /api/v1/reports/trends?window=7d`

2. Shared response schema:
- `ReportsTrendResponseSchema` in `packages/shared/src/schemas/reports.ts`
- shape:
  - `window: "7d"`
  - `points: Array<{ date: string; incoming: number; resolved: number }>`
  - optional `timezone`
  - optional `generated_at`

3. Access:
- same read roles as current reports read endpoints.

## Steps (Backend then Frontend)

### Backend

1. Add trend schema definitions in shared reports schema module.
2. Add `GET /reports/trends` route in `apps/api/src/routes/reports.ts`.
3. Aggregate incoming counts from reports created-at by day.
4. Aggregate resolved counts from reports reaching resolved/closed state by day (define exact source column/event rule).
5. Normalize missing days to zeros to ensure fixed 7-point response.
6. Return validated payload with deterministic day ordering.

### Frontend

1. Add `reportsApi.getTrends(window)` method.
2. Fetch trends in reports viewmodel with isolated loading/error state.
3. Replace `REPORTS_HERO_TREND_MOCK` usage in hero chart with API response.
4. Keep temporary fallback to mock until backend rollout is stable in production.

## Tests (unit/integration/smoke)

### Unit

1. Trend data mapper ensures fixed 7 points and ordered dates.
2. Fallback behavior test when API payload is missing/invalid.

### Integration

1. `GET /reports/trends` returns `200` + valid schema for authorized roles.
2. Unauthorized/forbidden roles rejected.
3. Window validation rejects unsupported values.

### Smoke

1. `/reports` hero chart renders live trend data in staging.
2. Network/API error path retains stable UI and fallback behavior.

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Add trend endpoint without altering existing reports list/detail endpoints.
2. Keep frontend fallback to mock until endpoint is validated under load.
3. Apply short TTL caching if aggregation query causes latency spikes.
4. Keep timezone handling explicit and documented to prevent misread trends.
