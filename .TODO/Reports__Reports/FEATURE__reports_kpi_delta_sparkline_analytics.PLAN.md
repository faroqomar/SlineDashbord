# Feature Plan: Reports KPI Delta + Sparkline Analytics

## Feature Goal

Replace mocked KPI visual signals (`+31%`, `+2`, `-1`, sparkline mini-trends) with real analytics so each KPI card communicates meaningful movement, not just absolute counts.

## UX Behavior From Design

1. KPI cards keep current layout and labels (`Total Reports`, `Open`, `Escalated`, `Closed`).
2. Each card shows:
- current absolute count
- signed delta value vs comparison window
- sparkline trend matching the selected window (default last 7 days).
3. Delta color semantics match design:
- positive resolved/closed trends = success color
- negative risk trends for open/escalated = warning/error color (as defined by product rules).
4. If analytics fails, KPI cards still render absolute counts and hide/neutralize delta visuals gracefully.

## Data Contracts Needed (API Endpoints / Schemas)

1. New endpoint:
- `GET /api/v1/reports/kpis?window=7d`

2. Shared schema updates in `packages/shared/src/schemas/reports.ts`:
- `ReportsKpiAnalyticsResponseSchema`
- shape:
  - `window: "7d"`
  - `comparison_window: "previous_7d"`
  - `cards: Array<{`
    - `key: "total" | "open" | "escalated" | "closed"`
    - `count: number`
    - `delta_absolute: number`
    - `delta_percent: number | null`
    - `trend: number[]` (fixed length 7)
  - `}>`
  - optional `generated_at`, optional `timezone`

3. Access control:
- same read roles as reports list (`moderator | admin | super_admin`).

## Steps (Backend then Frontend)

### Backend

1. Add KPI analytics schemas to shared reports schema module.
2. Add `GET /reports/kpis` route in `apps/api/src/routes/reports.ts`.
3. Compute current-window aggregates for total/open/escalated/closed.
4. Compute previous-window aggregates for deterministic delta math.
5. Build 7-point trend arrays per card with normalized day ordering and zero-fill.
6. Return Zod-validated payload and keep route additive (no contract changes to existing list endpoint).

### Frontend

1. Add `reportsApi.getKpis(window)` in `apps/admin-ui/src/features/reports/services/reports_api.ts`.
2. Extend `use_reports_viewmodel.ts` to fetch/store KPI analytics payload.
3. Replace `REPORTS_KPI_VISUALS_MOCK` usage in `ReportsScreen.tsx` with real values.
4. Keep temporary fallback path to current mock visual data for rollout safety.
5. Preserve existing absolute total fetch until KPI endpoint is stable; then remove duplicate calls in follow-up cleanup.

## Tests (unit/integration/smoke)

### Unit

1. KPI delta formatter tests (signs, rounding, percent/null rules).
2. Sparkline mapper tests (fixed length, ordered points, zero-fill behavior).

### Integration

1. `GET /reports/kpis` returns valid schema for authorized users.
2. Unauthorized/forbidden access rejected with existing auth conventions.
3. Window parameter validation rejects unsupported values.

### Smoke

1. `/reports` shows live KPI deltas and sparkline trends in staging.
2. API failure path keeps page stable and shows absolute counts without broken UI.

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep existing absolute KPI count path as fallback during initial rollout.
2. Gate delta/sparkline rendering behind data-availability checks.
3. Use query-level limits/caching to avoid expensive repeated aggregation under load.
4. Document exact delta baseline (`last 7d vs previous 7d`) to prevent product ambiguity.
