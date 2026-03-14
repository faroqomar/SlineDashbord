# Feature Plan: Booking KPI Live Trends

## Feature Goal

Replace mocked Booking KPI cards with real totals, deltas, and sparkline trends so KPI blocks reflect current platform data.

## UX Behavior From Design

1. KPI cards show `Total Bookings`, `Completed`, `Revenue`, `Canceled` values.
2. Each card shows trend delta and mini sparkline.
3. Card color tones and typography remain unchanged from current design implementation.
4. If KPI payload is partially unavailable, each card gracefully falls back to `--` without blocking page rendering.

## Data Contracts Needed (API Endpoints / Schemas)

1. Add endpoint:
- `GET /api/v1/bookings/analytics/kpis?window=7d`

2. Response contract:
- `window: '7d'`
- `cards: Array<{ id: 'total_bookings' | 'completed' | 'revenue' | 'canceled'; value: number; delta: number; sparkline: number[]; tone: 'violet' | 'green' | 'amber' | 'red' }>`
- `currency: 'IQD'`
- `updatedAt: string`

3. Shared schema updates:
- Add `BookingKpiCardSchema`
- Add `BookingKpiResponseSchema`
- Export from shared index

## Steps (Backend then Frontend)

### Backend

1. [@SysOp] Confirm metric formulas (especially revenue and delta calculation baseline).
2. [@SysOp] Add KPI schemas in `packages/shared/src/schemas/bookings.ts`.
3. [@SysOp] Add KPI route in `apps/api/src/routes/bookings.ts` with booking read RBAC.
4. [@SysOp] Build aggregation query for totals + delta + sparkline series.
5. [@SysOp] Return schema-validated payload with clear defaults for empty datasets.

### Frontend

1. [@AdminArchitect] Add `getAnalyticsKpis()` to `bookings_api.ts`.
2. [@AdminArchitect] Extend `use_bookings_viewmodel.ts` with KPI state and loading/error handling.
3. [@UIExpert] Replace `BOOKING_KPI_MOCK_CARDS` usage in `Bookings.tsx` with live KPI state.
4. [@UIExpert] Keep per-card fallback placeholders and preserve design tones.
5. [@DataSmith] Keep mock constants as explicit fallback fixture until backend is stable.

## Tests (Unit / Integration / Smoke)

### Unit

1. KPI delta formatting test (positive, zero, negative).
2. Sparkline normalization test for flat/empty sequences.

### Integration

1. API tests for `GET /api/v1/bookings/analytics/kpis`:
- `401/403` RBAC
- `200` valid KPI shape
- no-data scenario still returns valid schema

### Smoke

1. Verify Bookings KPI cards render with live values.
2. Validate visual deltas and sparkline rendering for all four cards.
3. Verify no crash when one KPI entry is missing and fallback appears.

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep mock-to-live fallback toggle until KPI endpoint is proven stable.
2. Treat KPI contract as additive; do not change existing list/detail contracts.
3. Clamp unexpected values server-side (negative totals, NaN) before response.
4. If KPI route regresses, disable live KPI fetch and fall back to existing mock UI safely.
