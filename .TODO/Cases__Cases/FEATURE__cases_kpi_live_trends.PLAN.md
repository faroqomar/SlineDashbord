# Feature Plan: Cases KPI Live Trends

## Feature Goal

Replace UI KPI mocks (`CASES_KPI_MOCK`) with real KPI values and trend metadata for:
- Total cases
- Open
- In Progress
- Escalated

## UX Behavior From Design

1. Four KPI cards remain in the same layout and styling.
2. Each card shows:
- live value
- delta (`+/-`) vs previous period
- mini sparkline
3. Card visuals stay unchanged regardless of real/mock source.
4. If KPI API is unavailable, card values degrade gracefully to mock trend metadata plus live-safe counts where available.

## Data Contracts Needed (API Endpoints / Schemas)

1. API endpoint:
- Prefer same analytics endpoint as hero: `GET /api/v1/cases/analytics?window=7d`

2. Shared schema additions (`packages/shared/src/schemas/cases.ts`):
- `AdminCasesKpiItemSchema`
- `AdminCasesKpiResponseSchema` (or included under analytics response)

3. KPI response fields:
- `id`: `total | open | in_progress | escalated`
- `value`: number
- `delta`: string or numeric change payload
- `trend`: `up | down | neutral`
- `sparkline`: numeric array

## Steps (Backend then Frontend)

### Backend

1. Extend cases analytics service to return KPI payload alongside hero series.
2. Define exact status mapping for KPI counters (including escalated logic).
3. Calculate deltas against a prior comparable period with deterministic formula.
4. Keep payload stable and additive; no breaking changes to existing list/detail endpoints.

### Frontend

1. Update viewmodel KPI mapping to use real analytics KPI payload by default.
2. Keep `CASES_KPI_MOCK` only as fallback metadata when analytics fails.
3. Ensure existing `CasesScreen` card rendering remains unchanged.
4. Expose and render a subtle fallback indicator when KPI data is mock-driven.

## Tests (Unit / Integration / Smoke)

### Unit

1. Shared schema tests for KPI item validation.
2. ViewModel tests for:
- KPI mapping from API response
- fallback behavior when analytics endpoint fails

### Integration

1. API tests for KPI payload shape and value consistency.
2. Regression test for stable status mapping rules (`open`, `in_progress`, `escalated`, `closed`).

### Smoke

1. Manual check on `/cases`:
- verify all four KPI cards render non-zero/expected values when data exists
- verify deltas and sparkline render without layout shift
- verify fallback behavior during simulated API failure

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep KPI fallback in place to avoid blank cards during endpoint incidents.
2. Use additive contract changes only; do not couple KPI availability to list endpoint success.
3. Log analytics failures separately from list failures to avoid false incident grouping.
4. If KPI logic is incorrect in production, disable real KPI fetch and revert to fallback while fixing backend calculations.
