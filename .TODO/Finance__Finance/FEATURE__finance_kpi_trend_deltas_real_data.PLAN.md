# Feature Plan: Finance KPI Trend Deltas (Real Data)

## Feature Goal

Replace mocked KPI trend chips (`+18%`, `+12`, `+3`) with real trend data for Finance dashboard cards while keeping current card layout unchanged.

## UX behavior from design

1. KPI cards keep existing labels and visual hierarchy:
- `Lifetime Revenue`
- `Escrow Held`
- `Transactions`
- `Withdrawals`
2. Each card displays:
- current value/count
- delta vs comparison window
- trend direction color semantics
3. If trend endpoint fails, KPI values still render and trend chips fall back to neutral/hidden state.

## Data contracts needed (API endpoints / schemas)

New/additive contracts:

1. `GET /api/v1/finance/kpis?window=30d&compare=previous`
- Returns KPI cards with value + delta metadata

2. Shared schema additions in `packages/shared/src/schemas/finance.ts`:
- `FinanceKpiCardSchema`
- `FinanceKpiSummarySchema`
- fields:
  - `key: "lifetime_revenue" | "escrow_held" | "transactions" | "withdrawals"`
  - `value: number`
  - `delta_absolute: number`
  - `delta_percent: number | null`
  - `direction: "up" | "down" | "flat"`
  - `window`, `comparison_window`, `generated_at`

Existing contracts kept:

3. `GET /api/v1/finance/metrics` remains backward-compatible for baseline totals.

## Steps (backend then frontend)

### Backend

1. Add shared KPI trend schemas and export them.
2. Implement `GET /finance/kpis` route in finance domain (new route module recommended).
3. Compute current-window and previous-window aggregates from canonical finance sources.
4. Return Zod-validated payload; keep route additive (do not break `/finance/metrics`).
5. Add RBAC parity with finance read/write policy used by existing dashboard metrics.

### Frontend

1. Add `financeApi.getKpiSummary(...)` in `apps/admin-ui/src/features/finance/services/finance_api.ts`.
2. Add KPI trend query to `apps/admin-ui/src/routes/Finance.tsx`.
3. Replace mock trend badges with real values/direction.
4. Keep fallback rendering path when KPI trend query fails/unavailable.
5. Remove `(Mock)` labels only when endpoint is live and stable.

## Tests (unit/integration/smoke)

### Unit

1. Delta formatter tests for sign, zero, and percentage edge cases.
2. Direction mapping tests (`up/down/flat`) from numeric deltas.

### Integration

1. `GET /finance/kpis` schema validation and response shape tests.
2. Auth/RBAC tests for unauthorized and forbidden roles.
3. Deterministic comparison-window calculation tests.

### Smoke

1. `/finance` shows real KPI trend chips with expected colors/directions.
2. Endpoint failure path renders safe neutral KPI chip state without layout shift.

## Rollback / safety notes (avoid breaking prod)

1. Roll out KPI endpoint first; keep frontend fallback to existing metrics + neutral chips.
2. Keep `/finance/metrics` unchanged to avoid downstream regressions.
3. If trend math is disputed, hide trend chips via feature flag without removing KPI totals.
4. Monitor query cost; add caching/materialized view if aggregation becomes expensive.
