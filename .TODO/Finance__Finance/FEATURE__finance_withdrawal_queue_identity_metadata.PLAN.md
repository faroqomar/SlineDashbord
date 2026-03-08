# Feature Plan: Finance Withdrawal Queue Identity Metadata

## Feature Goal

Upgrade withdrawal queue rows from raw `user_id` placeholders to design-aligned identity metadata (user/business display + masked bank details) without exposing sensitive data.

## UX behavior from design

1. Each queue row shows recognizable identity instead of UUID-only:
- display name or business label
- bank descriptor (masked)
- status and amount remain prominent
2. Missing metadata degrades gracefully to current fallback text.
3. Sensitive account fields are never shown in full.
4. Existing approve/reject actions remain unchanged.

## Data contracts needed (API endpoints / schemas)

Additive extension to existing endpoint:

1. `GET /api/v1/finance/withdrawals`
- keep current payload fields
- add optional metadata fields:
  - `user_display_name?: string | null`
  - `business_name?: string | null`
  - `bank_label_masked?: string | null`
  - `bank_account_masked?: string | null`

Shared schema updates (`packages/shared/src/schemas/finance.ts`):

2. Extend `WithdrawalRequestSchema` with optional identity/display fields (non-breaking).

Data source dependencies:

3. User identity likely from `profiles` (verified in repo).
4. Bank metadata source is currently missing clear repo evidence; discovery required before implementation:
- preferred source: masked values from `withdrawal_requests.meta`
- fallback source: dedicated payout/bank table if available in canonical migrations

## Steps (backend then frontend)

### Backend

1. Discovery step: confirm canonical source for bank display metadata in migrations.
2. Update withdrawals query to include identity fields (join/select/JSON extraction) without changing existing status logic.
3. Extend shared schema with optional metadata fields.
4. Ensure masking policy is enforced server-side (never send full account number/IBAN).
5. Add RBAC parity with existing withdrawals list endpoint.

### Frontend

1. Update finance model typing to include new optional fields.
2. Render display name/business/bank metadata in:
- dashboard withdrawal queue (`apps/admin-ui/src/routes/Finance.tsx`)
- withdrawals table (`apps/admin-ui/src/features/finance/components/WithdrawalsTable.tsx`) as applicable
3. Keep fallback text when metadata is null/missing.
4. Do not alter approve/reject action flow.

## Tests (unit/integration/smoke)

### Unit

1. Masking formatter tests (only masked output allowed).
2. Display-priority tests (business > user display > fallback).

### Integration

1. `GET /finance/withdrawals` response includes optional metadata fields with valid schema.
2. PII safety test: full account identifiers must not appear in payload.
3. Existing pagination/filter behavior remains unchanged.

### Smoke

1. `/finance` withdrawal queue shows human-readable identities when available.
2. Missing metadata falls back to current placeholder copy.
3. Approve/reject actions still function after payload extension.

## Rollback / safety notes (avoid breaking prod)

1. Use additive optional fields only; never remove existing withdrawal fields.
2. Keep frontend fallback path active to handle partial rollout.
3. If masking validation fails, disable metadata rendering and revert to UUID-only display.
4. Avoid DB writes in this feature; read-only enrichment reduces production risk.
