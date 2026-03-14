# Feature Plan: Admin Create Dispute Flow

## Feature Goal
Enable admins to create a dispute from the `Disputes` page using the existing `New Dispute` CTA, with RBAC, validation, and audit logging.

## UX Behavior From Design
- `New Dispute` button in the hero becomes active.
- Clicking opens a create-dispute form dialog.
- Admin can submit required dispute data.
- Success closes dialog, shows toast, and refreshes lanes.
- Validation and API errors are shown inline without page breakage.

## Data Contracts Needed (API Endpoints / Schemas)
- Endpoint: `POST /disputes`
- Auth: admin-only roles aligned with disputes write roles.
- Request schema (shared zod): `CreateDisputeSchema`
- Response schema: `ActionResult<{ id: string }>`
- Audit event: `admin.disputes.create`

## Steps (Backend Then Frontend)
1. Backend: add shared request/response schema in `packages/shared`.
2. Backend: add `POST /disputes` route in `apps/api/src/routes/disputes.ts` with Zod validation and RBAC guard.
3. Backend: write dispute row using existing table fields only; no destructive schema change.
4. Backend: add audit log entry in same action scope.
5. Frontend: add `createDispute` method in `apps/admin-ui/src/features/disputes/services/disputes_api.ts`.
6. Frontend: implement modal form in disputes view using existing form stack (`react-hook-form` + `zod` + shadcn).
7. Frontend: wire CTA to open modal, submit mutation, and invalidate disputes queries.
8. Frontend: keep fallback disabled state behind feature flag until backend is deployed.

## Tests (Unit / Integration / Smoke)
- Unit:
1. Zod request schema validation cases.
2. Frontend form validation behavior.
- Integration:
1. `POST /disputes` happy path.
2. Unauthorized role returns forbidden.
3. Invalid payload returns validation error.
4. Audit record is written for successful create.
- Smoke:
1. Admin can create from UI and new dispute appears in lane after refresh.
2. Failed create keeps modal open and shows actionable error.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Ship endpoint as additive change; no existing endpoint behavior changes.
- Keep CTA behind feature flag until backend is verified in staging.
- If incidents occur, disable flag and revert UI to mock/disabled CTA.
- Keep create route idempotency guard for duplicate submissions.
