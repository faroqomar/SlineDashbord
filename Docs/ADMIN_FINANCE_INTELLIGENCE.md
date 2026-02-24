# 🧭 Admin Dashboard Intelligence Report: Payments & Wallet Monitoring

## A) Feature Overview

- **Feature Name**: Payments & Wallet Monitoring Module
- **Primary Goal**: Provide SLine Admins and Finance/Support roles with complete, transparent, and auditable visibility into all financial movements across the platform (platform wallets, user wallets, task/booking payments), while keeping the app's double-entry ledger secure and append-only.
- **Actors**:
  - `super_admin`: Full read access, privileged actions (adjustments, withdrawal approvals).
  - `admin` / `finance_support`: Read access to ledgers, user wallets, ability to trace transactions.
  - `client` / `freelancer`: (App-side only) Perform booking payments and work deliveries.
- **In-Scope**: Company/Platform wallet metrics, per-user wallet balances, global ledger timeline, transaction traceability, escrow statuses, and withdrawal requests.
- **Out-of-Scope**: Disputes functionality (handled in a separate planning phase).
- **Assumptions**:
  - The double-entry payment ledger is fully active and serves as the single source of truth for all balances.
  - The legacy `wallet_transactions` table is frozen.
  - Access to the Admin Dashboard requires standard SLine RBAC (`role` column in `profiles`).

---

## B) App Behavior (How it works in the app)

The financial system for SLine operates on a strict double-entry ledger. All money movements are balanced (`SUM(DEBIT) == SUM(CREDIT)`).

**User Journeys & Key Events**:

1. **Deposit** (`deposit`): User funds their wallet via a payment gateway webhook (QiCard). Funds move into `user_available:{user_id}` and `platform_cash`.
2. **Escrow Hold** (`escrow_hold`): A client initiates a Booking or awards a Task Request. Funds are debited from the client's `user_available` and credited to `platform_escrow`. The booking status becomes `pending` and payment status is `unpaid`.
3. **Release with Fee** (`release_with_fee`): The task/booking is completed and delivered. Funds move from `platform_escrow` to the provider's `user_available` (net amount), with a percentage credited to `platform_revenue` (the fee).
4. **Refund** (`refund`): A booking or task request is declined, canceled, or expired. Funds are debited from `platform_escrow` back to the client's `user_available`.
5. **Withdrawal Request** (`withdrawal_request`): A user decides to cash out. Funds are debited from `user_available` and credited to `user_pending_withdrawal` until an admin/system completes it.

**Invariants (Must Always Hold)**:

- **Append-only**: No `UPDATE` or `DELETE` allowed on ledger tables.
- **Balanced Journal**: Every journal entry must have perfectly balancing ledger lines.
- **Idempotency**: All events use a deterministic `idempotency_key` to prevent double-processing.
- **No Negative Available Balance**: `user_available:{user_id}` must never drop below 0.

---

## C) Data & Variables Dictionary (Canonical)

| Variable              | Type      | Source            | Meaning                                         | Allowed values                                                                                                   | Validation                          | Notes                                                  |
| --------------------- | --------- | ----------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `account_code`        | `text`    | `accounts`        | Unique identifier for the account node.         | `platform_cash`, `platform_escrow`, `platform_revenue`, `user_available:{id}`, `user_pending_withdrawal:{id}`    | Unique Constraint                   | `user_*` accounts belong to clients/freelancers.       |
| `event_type`          | `text`    | `journal_entries` | The financial event triggered.                  | `escrow_hold`, `release_with_fee`, `refund`, `deposit`, `withdrawal_request`, `admin_credit`, `admin_adjustment` | Pre-defined Enum List               | Determines the strict debit/credit flow.               |
| `related_entity_type` | `text`    | `journal_entries` | What real-world object this payment applies to. | `booking`, `task_request`, `withdrawal_request`, `admin_adjustment`                                              | Linked Enum List                    | Admins use this to trace the origin of funds.          |
| `related_entity_id`   | `uuid`    | `journal_entries` | The UUID of the specific booking/task.          | Any valid UUID                                                                                                   | Must match entity type              | **CRITICAL for traceability.**                         |
| `idempotency_key`     | `text`    | `journal_entries` | Guaranteed uniquely processed key.              | `UUIDv5` or Gateway ID                                                                                           | Unique Constraint                   | High importance for debugging double-charges.          |
| `status`              | `text`    | `journal_entries` | State of the ledger record.                     | `posted`, `voided`                                                                                               | Only `posted` factors into balances |                                                        |
| `amount`              | `numeric` | `ledger_lines`    | Absolute value of the line.                     | `> 0`                                                                                                            | Must be strictly positive           |                                                        |
| `meta`                | `jsonb`   | `journal_entries` | Extra data (gateway ID, fee breakdown).         | Valid JSON                                                                                                       | Schema varies by event              | **Admin-only sensitive data** like gateway references. |

---

## D) Supabase Mapping (What exists vs what's needed)

### 1) Existing Tables Involved

- **`accounts`**: Stores account definitions (`account_code`, `account_type`, `owner_id`).
- **`journal_entries`**: Core ledger headers (Event type, idempotency, status, entity mapping).
- **`ledger_lines`**: Debits and credits (Must sum to 0 for a given journal entry).
- **`audit_logs`**: Logs who triggered the journal entry (`actor_user_id`, `action`).
- **`withdrawal_requests`**: Holds user requests intended for admin review and external payout.

### 2) Views Needed (Dashboard-Friendly Read Models)

- **`vw_wallet_balances_user`** (Existing): Gives real-time user balances.
- **`vw_wallet_activity_user`** (Existing): Gives real-time user-specific transaction histories.
- **`vw_financial_metrics_realtime`** (Existing): Gives platform escrow, cash, and lifetime revenue.
- **`vw_financial_metrics_period`** (Existing): Gives period-based metrics like GMV, Revenue, Refunds.
- **`vw_admin_journal_ledger`** (**NEW**): A denormalized view joining `journal_entries` + `ledger_lines` + `accounts` + `profiles`. Needed for the Admin Dashboard to easily show: "User X paid User Y an amount of Z for Booking UUID on Date."

### 3) RPCs Needed

- **`process_payment_event_ledger`** (Existing): Used by app to commit safe transactions.
- **`admin_process_wallet_freeze`** (**NEW**): Flips a flag preventing specific users from making transactions.
- **`admin_process_withdrawal`** (**NEW**): Handles `withdrawal_complete` or `withdrawal_failed` on `withdrawal_requests`.

### 4) Triggers / Constraints (Existing)

- `trg_journal_entries_append_only`, `trg_ledger_lines_append_only`: Ensure immutability.
- Strict checks on idempotency and balancing.

### 5) Indexes Needed

Ensure the following exist for dashboard reporting speed:

- `idx_journal_entries_entity` ON `(related_entity_type, related_entity_id)`
- `idx_journal_entries_created_at` ON `(created_at)`

### 6) Risk Level

- **HIGH RISK**: This data maps 1:1 to real-world financial liability. Dashboard reads must be strictly isolated to privileged accounts.

---

## E) Dashboard Module Design (UI/UX Spec)

**Routes & Layouts**:

1. **`/admin/finance/overview`** (Company / Platform Wallet)
   - **KPIs**: Platform Cash Balance, Total Escrow Held, Lifetime Revenue, Pending Withdrawal Volume.
   - **Charts**: Revenue growth over the last 30 days (bar chart).
   - **Recent Activity**: A mini-table of the latest 10 global journal entries.

2. **`/admin/finance/transactions`** (Transaction Traceability)
   - **Main Table**: Date, Event Type, Entity Type, Entity ID, Gross Amount, Status, Actions.
   - **Filters**: Date Range, Event Type, Entity Type, Min/Max Amount.
   - **Detail Drawer**: Clicking a row opens a "Transaction Trace" drawer showing:
     - The raw `journal_entry` meta payload.
     - The corresponding `ledger_lines` (T-Account format showing Debit vs Credit across accounts).
     - The `audit_logs` record showing who initiated the action.

3. **`/admin/finance/users`** (Per-User Wallet)
   - **Main Table**: User Name, Email, Role, Available Balance, Held Balance, Pending Withdrawal.
   - **Actions**: "View Ledger History" (redirects to Transactions filtered by user), "Freeze Wallet".
   - _Safe Deletion Rule_: Financial accounts can **never** be deleted. Users with ledger histories must be **Soft-Deleted / Deactivated** via an `is_active` boolean in `profiles`.

4. **`/admin/finance/withdrawals`** (Withdrawal Management)
   - **Main Table**: Request ID, User, Amount, Date Requested, Status (`requested`, `processing`, `completed`, `failed`).
   - **Actions**: Approve (Calls `withdrawal_complete`), Reject (Calls `withdrawal_failed`).

**Recommended UI Libraries**:
Utilize `shadcn/ui` components: `DataTable` (for rich filtering/pagination), `Sheet` (for detail drawers), and `Card` (for top-level metrics).

---

## F) Admin Actions & Permissions (RBAC)

| Action (Dashboard CTA)               | Allowed Roles                     | Data Touched                          | Server-only? | Audit Log Required                      |
| ------------------------------------ | --------------------------------- | ------------------------------------- | ------------ | --------------------------------------- |
| View Dashboards                      | `super_admin`, `admin`, `support` | Views (`vw_...`)                      | Yes          | No                                      |
| Trace Transactions                   | `super_admin`, `admin`, `support` | `journal_entries`, `ledger_lines`     | Yes          | No                                      |
| Freeze/Disable Wallet                | `super_admin`, `admin`            | `profiles` or `accounts` (new column) | Yes          | Yes (Event: `admin.wallet_freeze`)      |
| Approve Withdrawal                   | `super_admin`                     | `withdrawal_requests`, triggers RPC   | Yes          | Yes (Event: `admin.withdrawal_approve`) |
| Test Float Adjustment (Admin Credit) | `super_admin`                     | `journal_entries` via RPC             | Yes          | Yes (Event: `admin.adjustment`)         |

_Rules: Any privileged write MUST use the Supabase Service Role Key inside a Next.js App Router Server Action. Never expose the logic or keys to the browser._

---

## G) Security Model (Non-Negotiable)

1. **Dashboard Reads**:
   - Ledger tables (`journal_entries`, `ledger_lines`) do not allow public or user-level `SELECT` access to all rows via RLS.
   - The Admin Dashboard (Next.js) **must** query these tables and views using the Supabase Service Role Key inside Server Components or Route Handlers.
   - Before executing the query, the server **must** deeply verify the admin's session and assert that `profiles.role IN ('admin', 'super_admin')`.
2. **PII Handling**:
   - In the global transactions table, sensitive gateway identifiers (like full bank references embedded in `meta`) should be masked in the UI for standard `support` roles and only revealed explicitly for `admin` / `super_admin`.
3. **Rate Limiting / Abuse Prevention**:
   - Implement strict API rate limiting on withdrawal approvals (e.g., max 5 per minute) using Upstash/Redis or memory caching in Next.js to prevent automation abuse and ensure manual deliberate reviews.

---

## H) Monitoring & Alerts

**Metrics to Track (Dashboard KPIs)**:

- Escrow Liability Ratio (Escrow Held vs Platform Cash).
- Release vs Refund Volume.
- Daily Platform Revenue captured.

**Health Metrics & Alert Thresholds**:

- **FATAL ERROR**: If `user_available:{id}` is ever calculated as `< 0` in any view query.
- **ANOMALY (HIGH)**: Spike in `refund` event types (> 10% of transaction volume in 1 hour) implying a systemic cancellation or fraud issue.
- **ANOMALY (HIGH)**: Spike in `journal_entries` with status `voided`.
- **SYSTEM HEALTH**: Mismatch detected between `platform_escrow` account balance and `tasks/bookings` in `pending`/`held` status globally.

---

## I) Implementation Blueprint (Step-by-Step)

### Phase 1: Database & RPC Expansions

- **Goal**: Add necessary tools to Supabase to support admin observability and ops.
- **Output**:
  - Denormalized view `vw_admin_journal_ledger` created via migration.
  - Add `is_wallet_frozen` boolean to `profiles` (default `false`).
  - RPC `admin_process_withdrawal` created.
- **Verification**: Run raw SQL `SELECT * FROM vw_admin_journal_ledger LIMIT 5` as `postgres` role and ensure data mapping joins correctly.

### Phase 2: Data Contracts & Next.js Server Integration

- **Goal**: Create the DTOs and Supabase Service Role server queries in the Next.js app.
- **Output**: `src/lib/api/finance.ts` containing functions like `getPlatformMetrics()`, `getTransactionsPaginated(filters)`, `getUserWallet(id)`.
- **Verification**: Write unit tests making mock calls to server actions asserting that unprivileged users are explicitly rejected.

### Phase 3: Dashboard UI Build

- **Goal**: Build the UI interfaces with `shadcn/ui`.
- **Output**:
  - Server components under `app/admin/finance/overview/page.tsx`
  - `app/admin/finance/transactions/page.tsx`
  - `app/admin/finance/users/page.tsx`
- **Verification**: Load the pages locally and ensure loading skeletons (`Suspense`) and empty states render gracefully.

### Phase 4: Admin Actions & Audit Wiring

- **Goal**: Connect privileged buttons (Freeze Wallet, Approve Withdrawal).
- **Output**:
  - Server Actions wired to `shadcn/ui` dialogs requesting confirmation.
  - Ensuring the `audit_logs` table correctly logs the `super_admin` ID completing the action.
- **Verification**: Complete a mock withdrawal in the local simulator and verify the resulting `journal_entry` and `audit_log` row.

---

## J) Final Deliverables Checklist

- [ ] Complete UI for **Overview, Transactions, Users, and Withdrawals**.
- [ ] Export to CSV functionality works for the globally filtered Transactions ledger.
- [ ] Database view `vw_admin_journal_ledger` securely deployed.
- [ ] Next.js Middleware explicitly blocks unauthorized access to `/admin/finance/*`.
- [ ] Every admin write action (Freeze, Approve, Adjustment) generates a matching row in `audit_logs`.
- [ ] Server Action rate-limiting applied.
- [ ] **Evidence Required**: Screenshots provided to team demonstrating the "Transaction Trace" drawer fully expanding a complex Escrow Hold + Release flow.
