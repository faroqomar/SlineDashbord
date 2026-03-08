# Feature Plan: Finance Payout Action Flow

## Feature Goal

Make the dashboard `Payout` CTA actionable by linking it to the real withdrawal-processing flow, replacing the current disabled mock state.

## UX behavior from design

1. `Payout` button in the Finance hero is enabled for authorized roles.
2. Clicking `Payout` opens the existing payout workflow entry:
- preferred: navigate to `/finance/withdrawals?status=requested`
- alternative: open a compact sheet with pending payouts and `Manage all` action
3. Pending payout count shown in dashboard remains consistent with withdrawals queue.
4. Approve/Reject actions continue on the withdrawals page without new behavior drift.

## Data contracts needed (API endpoints / schemas)

Existing contracts to reuse (no new backend feature required for v1):

1. `GET /api/v1/finance/withdrawals?status=requested&limit=...`
- Current source of pending payout queue
- Schema currently mapped by `WithdrawalRequestSchema`

2. `POST /api/v1/finance/withdrawals/:requestId/approve`
- Schema: `ApproveWithdrawalSchema`

3. `POST /api/v1/finance/withdrawals/:requestId/reject`
- Schema: `RejectWithdrawalSchema`

Additive schema recommendation:

4. Add `WithdrawalListQuerySchema` in `packages/shared/src/schemas/finance.ts` to formally validate `status`, `limit`, and cursor fields (currently route parses query manually).

## Steps (backend then frontend)

### Backend

1. Keep withdrawal decision endpoints unchanged (already production-critical).
2. Add query-schema validation for `GET /finance/withdrawals` in shared contracts + route usage.
3. Add/extend API tests for `status=requested` filtering and cursor pagination stability.

### Frontend

1. Replace disabled `Payout` hero button with real action in `apps/admin-ui/src/routes/Finance.tsx`.
2. Wire click to `/finance/withdrawals?status=requested` (quick-path behavior).
3. Keep queue panel and pending count sourced from existing withdrawals query.
4. Ensure empty and loading states remain identical to current dashboard visuals.

## Tests (unit/integration/smoke)

### Unit

1. Route helper test for payout quick-link generation.
2. Filter-state parser test for `status=requested`.

### Integration

1. `GET /finance/withdrawals` validates query params and returns filtered rows.
2. Approve/Reject endpoints preserve existing RBAC behavior and status transitions.

### Smoke

1. Clicking `Payout` from `/finance` lands on pending withdrawals view.
2. Approve/Reject from withdrawals screen still works.
3. Returning to `/finance` reflects updated pending count after refresh.

## Rollback / safety notes (avoid breaking prod)

1. Frontend-only fallback is trivial: revert CTA to disabled state if issues appear.
2. Do not change withdrawal mutation RPC behavior in this feature.
3. Keep payout CTA as navigation-only in v1; avoid introducing new payout mutation surface area.
4. Preserve audit trail semantics in existing approve/reject routes.
