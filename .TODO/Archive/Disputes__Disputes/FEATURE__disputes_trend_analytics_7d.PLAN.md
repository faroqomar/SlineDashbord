# Feature Plan: Disputes Trend Analytics (7 Days)

## Feature Goal
Replace mock hero trend lines with real `opened` and `resolved` 7-day dispute analytics.

## UX Behavior From Design
- Hero chart displays real opened vs resolved curves.
- Legend labels stay the same (`Opened`, `Resolved`, `Last 7 days`).
- If no data exists, chart area shows stable empty-state line behavior.
- If fetch fails, page remains usable and chart falls back safely.

## Data Contracts Needed (API Endpoints / Schemas)
- Endpoint: `GET /disputes/trends?window=7d`
- Response schema:
1. `window: "7d"`
2. `points: Array<{ date: string; opened: number; resolved: number }>`
3. Optional `timezone` field
- Shared schema in `packages/shared/src/schemas/disputes.ts`

## Steps (Backend Then Frontend)
1. Backend: define trend response schema in shared package.
2. Backend: add trends route in `apps/api/src/routes/disputes.ts` under read-role guard.
3. Backend: aggregate `disputes.created_at` for opened counts per day.
4. Backend: aggregate `disputes.resolved_at` for resolved counts per day.
5. Backend: normalize missing days to zero for a fixed 7-point response.
6. Frontend: add `getTrends(window)` API client method.
7. Frontend: add trends query in disputes ViewModel.
8. Frontend: replace mock trend data usage in hero chart with real query data.
9. Frontend: keep temporary fallback to mock when endpoint is unavailable.

## Tests (Unit / Integration / Smoke)
- Unit:
1. Aggregation helper returns fixed 7-day shape with gap fill.
2. Response parser handles zero-data correctly.
- Integration:
1. Trends endpoint returns 7 points for authorized roles.
2. Unauthorized access is rejected.
3. Date-window behavior is stable across timezone boundaries.
- Smoke:
1. Hero chart renders real lines from API in staging.
2. Error path keeps page interactive with fallback behavior.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Add endpoint without modifying existing disputes list/detail routes.
- Keep frontend fallback to mock trend until backend rollout is confirmed.
- Guard route with existing read roles only.
- If perf issues appear, cache aggregated response for short TTL.
