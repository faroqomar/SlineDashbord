# Feature Plan: Reports Create Report Flow

## Feature Goal

Enable the `New Report` CTA on `/reports` with a safe admin-only create flow that logs a valid report record without breaking the existing moderation pipeline.

## UX Behavior From Design

1. `New Report` button is enabled (no mock badge).
2. Clicking opens a create dialog/form with required fields.
3. Admin can submit and immediately see the new row in the queue.
4. Form validates required fields inline and shows actionable error text.
5. On success, show toast confirmation and close the dialog.

## Data Contracts Needed (API Endpoints / Schemas)

1. New endpoint:
- `POST /api/v1/reports`

2. Request schema (shared):
- `CreateReportInputSchema` in `packages/shared/src/schemas/reports.ts`
- Proposed fields:
  - `entity_type` (`task | user | chat | booking`)
  - `entity_id` (uuid)
  - `reason` (string, min length)
  - `category` (optional string/enum)
  - `severity` (`low | medium | high | critical`, optional with server default)
  - `meta` (optional object)

3. Response schema (shared):
- `CreateReportResponseSchema` returning created report id + status metadata.

4. RBAC:
- write roles aligned with current reports write policy (`moderator | admin | super_admin`).

## Steps (Backend then Frontend)

### Backend

1. Add create input/output schemas to shared reports schema file.
2. Add `POST /reports` route in `apps/api/src/routes/reports.ts`:
- Zod validate input.
- Enforce write-role prehandler.
- Verify referenced entity exists (or fail with typed error).
- Insert into `reports` table with safe defaults.
3. Return standardized success payload.
4. Add audit logging behavior if product policy requires create actions in audit stream.

### Frontend

1. Add `reportsApi.create()` in `apps/admin-ui/src/features/reports/services/reports_api.ts`.
2. Add create dialog state and submit action in `use_reports_viewmodel.ts`.
3. Add create dialog UI in reports view (existing screen scope, no broad refactor).
4. Replace disabled mock `New Report` button with real open-dialog behavior.
5. On success: refresh list + KPI totals and show success notification.

## Tests (unit/integration/smoke)

### Unit

1. Shared schema tests for `CreateReportInputSchema` required fields.
2. ViewModel tests for create submit success/error state transitions.

### Integration

1. API tests:
- `401/403` unauthorized and forbidden paths.
- `400` invalid payload.
- `200` valid create path.
- entity-not-found behavior returns deterministic error code.

### Smoke

1. Admin opens `/reports`, creates report, sees new row.
2. Refresh preserves created item visibility under default filters.
3. KPI totals update after create.

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep endpoint additive only; do not change existing list/detail/action contracts.
2. Keep current moderation endpoints untouched.
3. If create flow causes production issues, feature-flag hide button in frontend while keeping backend route available for controlled testing.
4. Ensure strict input validation to avoid bad rows entering moderation queue.
