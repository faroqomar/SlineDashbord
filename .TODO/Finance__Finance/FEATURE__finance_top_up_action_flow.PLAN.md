# Feature Plan: Finance Top-up Action Flow

## Feature Goal

Make the dashboard `Top-up` CTA operational so admins can initiate a safe wallet-credit flow from `/finance` instead of a disabled mock button.

## UX behavior from design

1. `Top-up` button in the Finance hero is enabled for authorized roles.
2. Clicking `Top-up` opens a modal with:
- target user (UUID, with optional lookup preview)
- amount
- reason
3. Submit creates a top-up request using the existing approvals-first finance policy.
4. Success feedback shows request created and links to approval queue.
5. Errors are shown inline without breaking dashboard layout.

## Data contracts needed (API endpoints / schemas)

Existing contracts to reuse:

1. `POST /api/v1/finance/approvals`
- Schema: `ApprovalRequestSchema` (`packages/shared/src/schemas/approvals.ts`)
- Header: `Idempotency-Key` required

2. `POST /api/v1/finance/wallets/:userId/adjust`
- Schema: `AdjustWalletInputSchema` (`packages/shared/src/schemas/finance.ts`)
- Uses `approval_id` after approval state transitions

3. `GET /api/v1/finance/users/:userId` (optional lookup/validation in modal)
- Schemas: `UserLookupSchema`, `WalletSummarySchema`

Additive contract (optional, only if one-call orchestration is approved):

4. `POST /api/v1/finance/topups`
- Wrapper contract that creates approval + returns actionable state
- Keep optional to avoid expanding backend surface unnecessarily

## Steps (backend then frontend)

### Backend

1. Confirm and document policy for top-up from dashboard:
- approval request is mandatory
- execution requires approved approval and current authorization
2. Add API test coverage for top-up happy path using existing endpoints:
- create approval -> approve -> execute wallet adjust
3. Keep `audit_logs` coverage verified for wallet adjust execution.
4. Only add `POST /finance/topups` wrapper if product explicitly requires one-click orchestration.

### Frontend

1. Add a page-local Top-up modal component under finance feature UI.
2. Wire modal submit to `financeApi.createApproval(...)` (wallet_adjust operation).
3. Show created approval id/status and deep-link to `/finance/approvals`.
4. Replace disabled hero `Top-up` mock button in `apps/admin-ui/src/routes/Finance.tsx` with real action gating by role.
5. Keep optimistic UI minimal; always refetch metrics/queue after successful request creation.

## Tests (unit/integration/smoke)

### Unit

1. Modal validation rules (user id, amount bounds, reason required).
2. Idempotency-key generation helper test.

### Integration

1. API test: top-up approval request validates payload and auth.
2. API test: wallet adjust requires valid approved approval id.
3. API test: unauthorized roles receive 401/403.

### Smoke

1. `/finance` top-up modal opens and submits request successfully.
2. Request appears in `/finance/approvals`.
3. Error state remains contained (no dashboard crash).

## Rollback / safety notes (avoid breaking prod)

1. Ship frontend modal behind role/data guards; keep old disabled state as fallback flag.
2. Do not change existing approvals schema semantics (additive only).
3. Preserve idempotency behavior to prevent duplicate financial operations.
4. If incidents occur, disable top-up CTA and keep existing approvals pages operational.
