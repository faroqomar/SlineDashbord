# Payment Gateway & Booking Linkage Implementation Plan (V2 - Execution Ready)

Based on the `ADMIN_FINANCE_INTELLIGENCE.md`, `ADMIN_ARCHITECTURE.md`, and `ADMIN_DATABASE_REF.md` documents, this plan outlines the exact execution steps required to implement the payment gateway transaction tracking, link it directly to bookings, and build out the admin monitoring capabilities.

## Phase 0: Contracts & Decisions (Blocking)

> **Goal**: Establish the foundational rules for RBAC, auditing, cursor pagination, and ledger event patterns before any code is written.
> **Primary Agent**: @Architect

### Sub-Phase 0.1: Core Definitions

- [ ] **Step 1 (@Architect)**: Define RBAC permissions for finance. - Masked reads: `support`, `moderator`, `admin`, `super_admin`. - Unmasked reads: `admin`, `super_admin` only (+ audit event required). - Write actions: `admin` (freeze wallet) / `super_admin` (withdrawal approve).
- [ ] **Step 2 (@Architect)**: Standardize audit table naming. Use `audit_logs` universally for both system and admin actions, including an `event_type` column for distinction.
- [ ] **Step 3 (@Architect)**: Define deterministic ledger event patterns. Specify expected debit/credit accounts and payer/payee extraction rules for `escrow_hold`, `release_with_fee`, `refund`, and `withdrawal_request`.
- [ ] **Step 4 (@Architect)**: Define cursor pagination contract for transactions: - Cursor format: `{ created_at, journal_id }` - Query logic: `WHERE (created_at, id) < (cursorCreatedAt, cursorId) ORDER BY created_at DESC, id DESC LIMIT N`
- **Verification (@Sentinel / @QA)**: Review and approve the definitions. Ensure all subsequent phases adhere strictly to these rules.

## Phase 1: Database & RPC Expansions (Ledger Read Models)

> **Goal**: Add necessary tools, views, and indexes to Supabase to support admin observability and trace payment gateway transactions to bookings deterministically.
> **Primary Agent**: @Supabase_Ops

### Sub-Phase 1.1: Views and Indexes

- [ ] **Step 1 (@Supabase_Ops)**: Create/Update `vw_admin_journal_ledger` to compute deterministic values. It MUST include: - `journal_id`, `created_at`, `event_type`, `status` - `entity_type`, `entity_id` - `payer_user_id`, `payee_user_id` (computed from `ledger_lines` + `accounts.owner_id`) - `gross_amount`, `fee_amount`, `net_amount` - `initiator_user_id` (from `audit_logs`) - `meta_masked` (always safe) - `meta_full` (optional, exposed only via secure server action)
- [ ] **Step 2 (@Supabase_Ops)**: Add required indexes for performance and pagination: - `CREATE INDEX idx_journal_entries_pagination ON journal_entries (created_at DESC, id DESC);` - `CREATE INDEX idx_journal_entries_entity ON journal_entries (related_entity_type, related_entity_id);` - `CREATE INDEX idx_journal_entries_event ON journal_entries (event_type, created_at DESC);` - `CREATE UNIQUE INDEX idx_journal_entries_idempotency ON journal_entries (idempotency_key);`
- **Verification (@Sentinel / @QA)**: Run `EXPLAIN ANALYZE` for cursor queries to prove index usage. Query `vw_admin_journal_ledger` to verify correct `payer_user_id` and `payee_user_id` logic.

### Sub-Phase 1.2: RPC Implementation

- [ ] **Step 1 (@Supabase_Ops)**: Create `admin_process_wallet_freeze(user_id, freeze, reason)` RPC. Writes to `profiles.is_wallet_frozen` and inserts into `audit_logs`.
- [ ] **Step 2 (@Supabase_Ops)**: Create `admin_process_withdrawal(request_id, decision, reason)` RPC. - Validates request status and idempotency. - Creates explicit journal entry lines (e.g., debit `user_pending_withdrawal`, credit `platform_cash` or `platform_payout_clearing`). - Marks request as `completed` or `failed`. - Inserts record into `audit_logs`.
- **Verification (@Sentinel / @QA)**: Test the RPCs in the Supabase SQL editor to confirm ledger journal lines are strictly balanced and created correctly for different withdrawal paths.

## Phase 2: Next.js Server Layer (Strict Security)

> **Goal**: Create the secure server clients, shared guards, and Server Actions in Next.js.
> **Primary Agent**: @SysOp

### Sub-Phase 2.1: Secure Clients and Guards

- [ ] **Step 1 (@SysOp)**: Create server-only Supabase clients: - `supabaseAdmin()`: Uses service role (backend operations only). - `supabaseServer()`: Uses user session (for auth and role verification).
- [ ] **Step 2 (@SysOp)**: Create shared security guards: - `requireAdminRole(allowedRoles)`: Validates active session role against permitted array. - `maskMetaForRole(role, meta_full)`: Ensures `support`/`moderator` only get masked meta. - `logAuditEvent(event_type, payload_redacted)`: Centralized helper to write to `audit_logs`.

### Sub-Phase 2.2: Server Actions

- [ ] **Step 1 (@SysOp)**: Implement required data fetching actions: - `getPlatformMetrics()` - `getTransactionsPaginated(filters, cursor)` (Always returns masked data). - `getUserWalletSummary(userId)` - `getUserFinanceTimeline(userId, filters, cursor)` - `getEntityTrace(type, id)` - `getWithdrawals(filters, cursor)`
- [ ] **Step 2 (@SysOp)**: Implement sensitive / write actions: - `getTransactionDetails(journalId)`: Returns masked by default. Only unmasks for `admin`/`super_admin` and actively logs `admin.finance.tx_view_sensitive_meta` to `audit_logs`. - `approveWithdrawal(requestId)` / `rejectWithdrawal(requestId)` (`super_admin` only). - `freezeWallet(userId, reason)` (`admin+`). - `softDeleteUser(userId, reason)` (`admin+`). - `exportTransactionsCSV(filters)` (`admin+`): Must include rate-limiting and audit logging.
- **Verification (@Sentinel / @QA)**: Verify that `support` role cannot access unmasked data via `getTransactionDetails` and cannot freeze wallets. Assert audit logs are generated for sensitive views.

## Phase 3: Dashboard UI Build

> **Goal**: Build the secure `shadcn/ui` interfaces for monitoring the payment gateway events and tracing funds to exact bookings.
> **Primary Agent**: @UIExpert

### Sub-Phase 3.1: Overview and Transactions View

- [ ] **Step 1 (@UIExpert)**: Build `app/(dashboard)/admin/finance/overview/page.tsx` for metrics.
- [ ] **Step 2 (@UIExpert)**: Build `app/(dashboard)/admin/finance/transactions/page.tsx`. Implement real cursor pagination UI based on the predefined contract.
- [ ] **Step 3 (@UIExpert)**: Implement the "Transaction Trace" Detail Drawer (Sheet). Defaults to masked meta. Include a "Reveal sensitive meta" button (visible only to `admin`/`super_admin`) that triggers `getTransactionDetails(journalId)` server action and logs the event.
- **Verification (@Sentinel / @QA)**: Ensure cursor "Next/Prev" fetching works seamlessly without query offset issues.

### Sub-Phase 3.2: Additional Views

- [ ] **Step 1 (@UIExpert)**: Build `app/(dashboard)/admin/finance/users/page.tsx` and `app/(dashboard)/admin/finance/entities/[type]/[id]/page.tsx` (Booking/Task trace view).
- [ ] **Step 2 (@UIExpert)**: Build `app/(dashboard)/admin/finance/withdrawals/page.tsx` with action buttons.
- [ ] **Step 3 (@UIExpert)**: Build `app/(dashboard)/admin/finance/audit/page.tsx` to read from the unified `audit_logs` table.
- **Verification (@Sentinel / @QA)**: Review visual behavior of sensitive meta-reveals and role-based action button visibility.

## Phase 4: Actions, Rate Limits & QA

> **Goal**: Enforce rate limits and conduct comprehensive end-to-end security QA.
> **Primary Agent**: @QA

### Sub-Phase 4.1: Rate Limiting & E2E Validation

- [ ] **Step 1 (@Architect)**: Enforce rate limits (e.g., Upstash or Next.js cache) on withdrawal approvals/rejects, CSV exports, and "reveal sensitive meta" endpoints.
- [ ] **Step 2 (@QA)**: Role tests: Prove `support` sees ONLY masked traces.
- [ ] **Step 3 (@QA)**: Negative tests: Guarantee `support` API calls to unmask fail with 403 Forbidden.
- [ ] **Step 4 (@QA)**: E2E Transaction path: Simulate `hold` → `release_with_fee`. Verify UI correctly attributes `payer_user_id`, `payee_user_id`, `net_amount`, and `fee_amount` cleanly based on `vw_admin_journal_ledger`.
- **Verification (@QA)**: Document test execution matrix in PR review containing screen recordings of rejection states and trace unmasking flows.
