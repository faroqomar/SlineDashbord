# Finance Page / Finance Tab TODO Summary

## 1. Page Overview

- Route: `/finance`
- Scope: UI-first Finance dashboard redesign aligned with Figma for the Finance page/tab.
- Current implementation includes:
- Hero section with actions (`Refresh`, `Audit Ledger`, `User Wallets`)
- Platform cash panel with Top-up/Payout controls
- KPI cards row (`Lifetime Revenue`, `Escrow Held`, `Transactions`, `Withdrawals`)
- Two chart panels (`Revenue vs Expenses`, `Daily Volume`)
- Recent transactions list
- Withdrawal queue list
- Loading skeletons, empty states, and partial-error banner

Primary implementation file:
- `apps/admin-ui/src/routes/Finance.tsx`

Supporting linked pages/routes:
- `apps/admin-ui/src/routes/FinanceAudit.tsx`
- `apps/admin-ui/src/routes/FinanceUsers.tsx`
- `apps/admin-ui/src/routes/FinanceTransactions.tsx`
- `apps/admin-ui/src/routes/FinanceWithdrawals.tsx`

---

## 2. Existing Features Already Linked

The following are wired to existing features/APIs:

1. Platform metrics (real)
- API: `financeApi.getMetrics()`
- Backend contract: `GET finance/metrics`
- Used for: `platform_cash`, `lifetime_revenue`, `escrow_held`

2. Recent transactions list (real)
- API: `financeApi.getTransactions({ limit: 10 })`
- Backend contract: `GET finance/transactions`
- Used for: list rows, amount/status/event labels, transaction count card

3. Withdrawal queue list (real)
- API: `financeApi.getWithdrawals({ limit: 5 })`
- Backend contract: `GET finance/withdrawals`
- Used for: queue rows, status badges, pending count, withdrawal count card

4. Cross-page navigation links (real route wiring)
- `/finance/audit` (Audit Ledger)
- `/finance/users` (User Wallets)
- `/finance/transactions` (View all transactions)
- `/finance/withdrawals` (Manage all withdrawals)

5. Refresh behavior (real)
- Dashboard refresh button refetches all three existing queries:
- metrics + transactions + withdrawals

6. Top-up approval request from Finance hero (real)
- UI action opens top-up dialog and validates input locally.
- API: `financeApi.createApproval(...)`
- Backend contract: `POST finance/approvals` with `operation_type=wallet_adjust`
- Uses idempotency key and existing approval queue workflow.

---

## 3. Missing Features (Design References but Backend/Feature Not Implemented)

1. Actionable Payout flow
- Design suggests active payout operation from dashboard.
- No verified backend payout initiation action is currently wired from this page.

2. Real trend/delta analytics for KPI cards
- Design trend deltas (`+18%`, `+12`, etc.) imply computed comparison windows.
- Existing metrics endpoint does not currently provide trend/delta payloads.

3. Real chart analytics datasets
- Design chart sections imply real financial timeseries.
- No dedicated dashboard analytics endpoint is currently wired for:
- revenue vs expense series
- daily transaction volume series

4. Rich withdrawal card identity metadata
- Design shows business/user identity and bank details in queue cards.
- Current withdrawal payload has `user_id`, `amount`, `status`, `created_at` only (no bank display fields).

---

## 4. What We Mocked and Why

Mocks are intentionally local in:
- `apps/admin-ui/src/routes/Finance.tsx`

Mocked parts:

1. Chart datasets
- `MOCK_REVENUE_EXPENSE_DATA`
- `MOCK_DAILY_VOLUME_DATA`
- Reason: no current dashboard analytics API payload wired.

2. KPI trend chips
- Display values such as `+18% (Mock)`, `+12 (Mock)`, `+3 (Mock)`.
- Reason: no backend trend/delta fields in current metrics/list contracts.

3. Payout button behavior
- Payout button is currently rendered disabled and marked as mock.
- Reason: payout initiation flow is not implemented/approved for this page scope.

4. Withdrawal identity/bank presentation fallback
- Queue shows truncated `user_id` plus `Bank details unavailable`.
- Reason: withdrawal list contract does not expose bank/account display metadata.

---

## 5. Implementation Plan for Missing Features (High-Level Only)

1. Add finance dashboard analytics contract
- Introduce a read endpoint for chart-ready series:
- monthly revenue/expense totals
- daily transaction volume

2. Add KPI trend contract
- Extend metrics payload (or companion endpoint) with comparison-window deltas for dashboard KPI chips.

3. Introduce explicit payout service action (if product-approved)
- Define payout initiation command with RBAC and audit logging requirements.
- Keep dashboard as launcher UI only after payout contracts are stable.

4. Enrich withdrawal queue API payload
- Add optional display fields (beneficiary/business label, masked bank/account metadata) suitable for admin queue cards.

5. Replace mocks incrementally
- Switch chart data from mock arrays to real API responses.
- Switch KPI delta chips from mock text to real values.
- Enable Payout control only when payout mutation is implemented and authorized.

---

## 6. Risks / Dependencies / Required APIs

### Risks

1. Data consistency risk
- If metrics and trend series use different aggregation windows/timezones, dashboard values can appear contradictory.

2. Security/compliance risk
- Wallet adjustments and payout operations are sensitive financial mutations and require strict RBAC + audit logging.

3. UX trust risk
- Leaving mock trend/chart data active for long periods can be misread as real operational telemetry.

### Dependencies

1. API ownership for finance analytics and mutation endpoints.
2. Shared contract updates for typed response models (admin-ui + shared package alignment).
3. Audit logging conventions for any new financial mutation actions.

### Required APIs (for full de-mock)

1. `GET /finance/dashboard/analytics` (or equivalent)
- Revenue vs expense timeseries
- Daily transaction volume series

2. `GET /finance/metrics` extension (or `GET /finance/dashboard/kpis`)
- KPI trend/delta values with defined comparison window

3. `POST /finance/payout` (or approved equivalent)
- Admin-authorized payout initiation flow

4. `GET /finance/withdrawals` payload enrichment
- Optional beneficiary/business and masked bank display metadata for queue rows
