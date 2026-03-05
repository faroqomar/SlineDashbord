# Feature Plan: KPI Trend Analytics

## Feature Goal

Replace hardcoded KPI trend badges (`+12%`, `+5.4%`, `No change`) with backend-driven trend analytics for dashboard cards.

## UX behavior from design

- Each KPI card shows:
  - current value
  - trend chip (positive/negative/neutral)
- Trend chip style reflects direction:
  - positive -> success tone
  - negative -> warning/destructive tone
  - neutral -> muted tone (“No change”)
- Trend labels are concise and consistent across cards.

## Data contracts needed (API endpoints / schemas)

### Extend existing dashboard overview payload
- `GET /api/v1/dashboard/overview`
- Add:
  - `kpiTrends: {`
    - `activeUsers: { direction: 'up' | 'down' | 'flat', deltaPercent: number, label: string }`
    - `platformRevenue: { direction: 'up' | 'down' | 'flat', deltaPercent: number, label: string }`
    - `activeJobs: { direction: 'up' | 'down' | 'flat', deltaPercent: number, label: string }`
    - `openDisputes: { direction: 'up' | 'down' | 'flat', deltaPercent: number, label: string }`
    - `comparisonWindow: string`
  - `}`

### Shared schema updates
- Add strict trend DTO schema in shared package.
- Enforce `label` max length and enum validation.

## Steps (backend then frontend)

### Backend
1. Define comparison windows per metric (for example: last 30d vs previous 30d).
2. Implement trend computation queries with deterministic rules.
3. Produce normalized trend object (`up/down/flat`, percent, label).
4. Return trends in dashboard payload; keep existing fields unchanged.
5. Add schema validation and robust fallback (`flat` + `0` delta) on partial failures.

### Frontend
1. Extend dashboard API types with `kpiTrends`.
2. Pass trend object through viewmodel to cards.
3. Replace hardcoded trend text constants in dashboard mock usage.
4. Map trend direction to chip styles/icons.
5. Keep graceful fallback to neutral label when trend data missing.

## Tests (unit/integration/smoke)

### Unit
- Trend direction mapper:
  - positive percent -> `up`
  - negative percent -> `down`
  - zero/near-zero -> `flat`
- UI chip renderer for all three directions.

### Integration
- API tests for trend computation and shape.
- Edge cases: no historical rows, sparse data, zero baseline.

### Smoke
- Dashboard cards render real trend chips for all 4 KPIs.
- No runtime errors if one metric trend is missing.

## Rollback / safety notes (avoid breaking prod)

- Ship trends as additive fields only.
- Maintain neutral frontend fallback until backend trend quality is validated.
- If analytics query regresses latency, disable trend block via feature flag and keep core KPI values.
