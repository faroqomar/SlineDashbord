# Feature Plan: Finance Dashboard Analytics Timeseries

## Feature Goal

Replace mocked chart datasets on `/finance` with real backend timeseries for:
- `Revenue vs Expenses`
- `Daily Volume`

## UX behavior from design

1. Chart panels keep current visual structure and dimensions.
2. `Revenue vs Expenses` uses real month-series values.
3. `Daily Volume` uses real day-series transaction volume.
4. Chart tooltips, axes, and legends remain stable with live data.
5. If analytics API fails, charts degrade gracefully (empty state or neutral fallback) without breaking rest of dashboard.

## Data contracts needed (API endpoints / schemas)

New/additive endpoint:

1. `GET /api/v1/finance/dashboard/analytics?window=7m&granularity=month`
- includes revenue/expenses series and daily volume series

Shared schema additions (`packages/shared/src/schemas/finance.ts`):

2. `FinanceRevenueExpensePointSchema`
3. `FinanceDailyVolumePointSchema`
4. `FinanceDashboardAnalyticsSchema`
- example fields:
  - `revenue_expenses: Array<{ period: string; revenue: number; expenses: number }>`
  - `daily_volume: Array<{ period: string; volume: number }>`
  - `window`, `timezone`, `generated_at`

Data-source note:

5. If canonical SQL views for analytics are missing, create additive read views in migration repo and consume them from API (no client-side aggregate math).

## Steps (backend then frontend)

### Backend

1. Add shared analytics schemas and tests.
2. Implement `GET /finance/dashboard/analytics` route (new route module under finance).
3. Query canonical finance sources and aggregate by required periods.
4. Ensure deterministic period ordering and zero-fill for missing periods.
5. Add RBAC guard consistent with finance dashboard read requirements.

### Frontend

1. Add `financeApi.getDashboardAnalytics(...)` method.
2. Replace `MOCK_REVENUE_EXPENSE_DATA` and `MOCK_DAILY_VOLUME_DATA` usage in `apps/admin-ui/src/routes/Finance.tsx`.
3. Keep chart components unchanged; only swap data source.
4. Add analytics error/empty fallback rendering and remove chart `Mock` badge when live.

## Tests (unit/integration/smoke)

### Unit

1. Timeseries normalizer tests (ordering, zero-fill, number coercion).
2. Frontend mapper tests from API payload -> Recharts dataset.

### Integration

1. Endpoint response schema validation with authorized role.
2. Window/granularity query validation and rejection for invalid values.
3. Aggregation correctness tests for deterministic sample fixtures.

### Smoke

1. `/finance` charts render live values in staging.
2. Analytics API failure path displays fallback state without page crash.
3. Existing metrics/transactions/withdrawals sections remain unaffected.

## Rollback / safety notes (avoid breaking prod)

1. Ship endpoint first and keep frontend fallback to mock-safe empty chart state.
2. Keep chart query isolated; do not block page render when analytics fails.
3. Use additive contracts only; no breaking changes to current metrics or list endpoints.
4. If performance degrades, temporarily disable analytics query and keep remaining dashboard data live.
