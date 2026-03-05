# Feature Plan: Logs Destination Parity

## Feature Goal

Replace the current `/logs` placeholder with a functional logs experience so Dashboard “View all” leads to real audit/system log data.

## UX behavior from design

- “View all” from Dashboard Activity opens a complete logs page.
- Logs page supports:
  - list view of recent events
  - key metadata (action, actor, target/entity, timestamp, status)
  - pagination
  - empty state and loading skeleton
- Filtering behavior (minimum):
  - date range
  - action type
  - actor/user

## Data contracts needed (API endpoints / schemas)

### New logs listing endpoint
- `GET /api/v1/logs`
- Query params:
  - `page: number`
  - `limit: number`
  - `action?: string`
  - `actorUserId?: string`
  - `from?: string` (ISO)
  - `to?: string` (ISO)
- Response:
  - `logs: Array<{`
    - `id: string`
    - `action: string`
    - `actorUserId: string | null`
    - `actorName: string | null`
    - `entityType: string | null`
    - `entityId: string | null`
    - `status: 'success' | 'warning' | 'error' | 'info'`
    - `createdAt: string`
    - `meta?: Record<string, unknown>`
  - `}>`
  - `count: number`
  - `totalPages: number`

### Optional detail endpoint
- `GET /api/v1/logs/:id`

### Shared schema updates
- Add `LogListQuerySchema` and `LogListResponseSchema`.

## Steps (backend then frontend)

### Backend
1. Add `/logs` route under admin RBAC.
2. Implement paginated query from `audit_logs` (and optional system log source).
3. Join actor profile names safely.
4. Normalize output shape via shared schemas.
5. Add guardrails: max `limit`, date-range validation, safe error responses.

### Frontend
1. Add logs API client methods in admin UI.
2. Replace placeholder `LogsPage` with table/list UI.
3. Add filter controls and server-side pagination.
4. Keep navigation from Dashboard Activity “View all” unchanged.
5. Add empty/error/skeleton states aligned with dashboard styling.

## Tests (unit/integration/smoke)

### Unit
- Query param mapper and filter serialization.
- Status-to-badge mapping.

### Integration
- API route tests:
  - success path
  - RBAC blocked path
  - invalid query validation
  - pagination correctness

### Smoke
- Dashboard -> “View all” opens populated logs page.
- Filters and pagination update list correctly.
- Empty result set renders proper empty state.

## Rollback / safety notes (avoid breaking prod)

- Keep existing placeholder route fallback behind feature flag.
- Use additive API route introduction; do not change existing dashboard endpoint behavior.
- Enforce conservative query limits to avoid heavy scans in production.
- Monitor route latency/errors after rollout; degrade to minimal list if needed.
