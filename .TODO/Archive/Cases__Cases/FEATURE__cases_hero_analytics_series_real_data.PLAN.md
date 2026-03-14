# Feature Plan: Cases Hero Analytics Series (Real Data)

## Feature Goal

Replace the hero chart mock series (`opened` vs `closed`, last 7 days) with real backend-provided analytics while preserving the current visual design and fallback behavior.

## UX Behavior From Design

1. Hero section shows two trend lines:
- Opened cases (blue)
- Closed cases (green)
2. Legend remains visible: `Opened`, `Closed`, `Last 7 days`.
3. Refresh action updates the chart with latest real values.
4. If analytics API is unavailable, chart falls back to existing mock series and displays a non-blocking "mock/fallback" hint.

## Data Contracts Needed (API Endpoints / Schemas)

1. API endpoint (new):
- `GET /api/v1/cases/analytics?window=7d`

2. Shared schema additions (`packages/shared/src/schemas/cases.ts`):
- `AdminCasesAnalyticsPointSchema`
- `AdminCasesHeroSeriesSchema`
- `AdminCasesAnalyticsQuerySchema`

3. Response shape (minimum):
- `window`: `"7d"`
- `opened`: array of `{ bucket_start: string; value: number }`
- `closed`: array of `{ bucket_start: string; value: number }`
- Optional: `is_stale`, `generated_at`

## Steps (Backend then Frontend)

### Backend

1. Add query parsing and validation for analytics window (`7d` default).
2. Implement analytics handler under cases routes with existing admin RBAC guard.
3. Aggregate opened and closed case counts by day over the selected window.
4. Return fixed-length ordered arrays (always 7 points) to keep chart rendering deterministic.
5. Add structured error handling without exposing raw SQL/internal details.

### Frontend

1. Add `getCasesAnalytics()` in `apps/admin-ui/src/features/cases/services/cases_api.ts`.
2. Extend `use_cases_viewmodel.ts` to fetch hero analytics separately from list data.
3. Keep existing hero chart rendering; swap data source to real endpoint output.
4. Preserve mock fallback (`HERO_OPENED_SERIES_MOCK`, `HERO_CLOSED_SERIES_MOCK`) when analytics fetch fails.
5. Add lightweight UI hint when fallback is active.

## Tests (Unit / Integration / Smoke)

### Unit

1. Shared schema tests for analytics query and response parsing.
2. ViewModel tests for:
- successful analytics fetch
- fallback activation on API error

### Integration

1. API route tests:
- `401` unauthenticated
- `403` unauthorized role
- `200` valid analytics payload and ordered buckets

### Smoke

1. Manual check:
- open `/cases`
- verify hero chart renders with real data
- trigger refresh and verify chart updates
- simulate endpoint failure and verify fallback behavior

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep mock series in place during rollout; never block page rendering on analytics failure.
2. Make endpoint additive only; do not modify existing `/cases` list response contract.
3. Feature-flag analytics fetch if needed for staged rollout.
4. If production issues occur, disable analytics fetch and keep hero chart on mock series temporarily.
