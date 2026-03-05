# Feature Plan: Platform Pulse Live Metrics

## Feature Goal

Replace mocked Platform Pulse values with real, RBAC-protected metrics so the Dashboard strip shows live platform state.

## UX behavior from design

- Platform Pulse strip shows 6 cells:
  - Open Reports
  - Open Cases
  - Active Tasks
  - Open Disputes
  - Bookings Today
  - System Status
- Values render in one compact row (responsive wrap on smaller screens).
- Section updates on dashboard refresh cadence.
- If live data is unavailable, UI shows safe fallback state (`--`) and non-blocking warning style.

## Data contracts needed (API endpoints / schemas)

### Option A (preferred): extend existing dashboard contract
- `GET /api/v1/dashboard/overview`
- Add:
  - `pulse: {`
    - `openReports: number`
    - `openCases: number`
    - `activeTasks: number`
    - `openDisputes: number`
    - `bookingsToday: number`
    - `systemStatus: 'ok' | 'degraded' | 'down'`
    - `updatedAt: string` (ISO)
  - `}`

### Option B: dedicated endpoint
- `GET /api/v1/dashboard/pulse`
- Returns same `pulse` object above.

### Shared schema updates
- Add/extend typed schema in shared package for pulse payload.
- Add strict parsing/validation before response.

## Steps (backend then frontend)

### Backend
1. Confirm metric definitions with product/ops:
   - “Open” status sets for reports/cases/disputes.
   - Timezone definition for “Bookings Today”.
   - Source/logic for `systemStatus`.
2. Implement pulse aggregation query logic under admin RBAC.
3. Add pulse payload to `/dashboard/overview` (or create `/dashboard/pulse`).
4. Validate payload with shared schema and safe error handling.
5. Add indexes or query constraints if needed for count queries.

### Frontend
1. Update dashboard API types to include `pulse`.
2. Update dashboard viewmodel to expose pulse object.
3. Replace `dashboard.mock.ts` pulse constants with real data mapping.
4. Keep fallback rendering (`--`) when API returns partial data.
5. Remove “Mock” label for pulse section when all pulse fields are real.

## Tests (unit/integration/smoke)

### Unit
- Pulse mapper handles missing/null data safely.
- `systemStatus` enum mapping to UI tone classes.

### Integration
- API route test for `/dashboard/overview` (or `/dashboard/pulse`) with:
  - valid response shape
  - RBAC denied access
  - partial data fallback behavior

### Smoke
- Dashboard loads and pulse row renders all 6 cells.
- Values change after refresh interval when source data changes.

## Rollback / safety notes (avoid breaking prod)

- Keep backward-compatible API changes (optional `pulse` field during rollout).
- Frontend must tolerate absent `pulse` and fall back gracefully.
- Feature-flag pulse-real-data render if needed.
- Do not remove existing mock fallback until API stability is confirmed in staging.
