# Feature Plan: Booking Hero Analytics Series (Real Data)

## Feature Goal

Replace static hero chart lines with real 7-day booking analytics so the Bookings header reflects live operational movement.

## UX Behavior From Design

1. Hero shows two trend lines: `Booked` and `Completed` over the last 7 days.
2. Legend labels remain visible and color mapping stays stable.
3. Refresh updates the hero values with latest server data.
4. If analytics is unavailable, hero keeps non-blocking fallback state (chart hidden or neutral placeholder).

## Data Contracts Needed (API Endpoints / Schemas)

1. Add endpoint:
- `GET /api/v1/bookings/analytics/series?window=7d`

2. Response contract:
- `window: '7d'`
- `timezone: string`
- `points: Array<{ date: string; booked: number; completed: number }>`
- `updatedAt: string`

3. Shared schema updates:
- Add `BookingAnalyticsSeriesPointSchema`
- Add `BookingAnalyticsSeriesResponseSchema`
- Export from `packages/shared/src/index.ts`

## Steps (Backend then Frontend)

### Backend

1. [@SysOp] Confirm counting definitions for `booked` and `completed` statuses and timezone boundary.
2. [@SysOp] Add analytics schemas in `packages/shared/src/schemas/bookings.ts`.
3. [@SysOp] Add route in `apps/api/src/routes/bookings.ts` under existing booking read RBAC.
4. [@SysOp] Implement aggregation query grouped by day for last 7 days.
5. [@SysOp] Validate and return typed payload with safe error handling.

### Frontend

1. [@AdminArchitect] Extend `apps/admin-ui/src/features/bookings/services/bookings_api.ts` with `getAnalyticsSeries()`.
2. [@AdminArchitect] Extend `use_bookings_viewmodel.ts` state to load/cache series data.
3. [@UIExpert] Replace `HeroTrend` static arrays in `apps/admin-ui/src/routes/Bookings.tsx` with API-driven series.
4. [@UIExpert] Keep skeleton/fallback rendering for loading/error states.
5. [@CodeWarden] Verify no DB/API direct calls leak into route view logic.

## Tests (Unit / Integration / Smoke)

### Unit

1. Series mapper test for date ordering and empty points handling.
2. Chart transform test for stable coordinate mapping with sparse data.

### Integration

1. API tests for `GET /api/v1/bookings/analytics/series`:
- `401/403` RBAC enforcement
- `200` valid shape
- `400` invalid window

### Smoke

1. Open Bookings page and verify hero chart renders with live series.
2. Trigger refresh and confirm updated `updatedAt` / chart redraw.
3. Simulate analytics failure and confirm graceful fallback.

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep hero rendering backward-compatible: if series API fails, continue showing fallback state.
2. Ship route as additive API; do not alter existing `/bookings` list response.
3. Guard frontend with safe defaults to avoid runtime crashes on partial payloads.
4. Feature-flag live hero series if staging data quality is uncertain.
