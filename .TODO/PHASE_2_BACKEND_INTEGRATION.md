# Phase 2: Backend Integration (Execution Plan)

> **Objective:** Connect the "Visual Twin" frontend to the real SLine Supabase backend.
> **Philosophy:** "Read from Client (carefully), Write from Server (always)."
> **Security Rule:** All Admin Mutations MUST use `SUPABASE_SERVICE_ROLE_KEY` via Server Actions.

## 1. 🔐 Authentication & Security Layer

> **Goal**: Establish the "Secure Operations Center" where only authorized admins can enter.
> **Primary Agent**: @SecGuard

### Sub-Phase 1.1: The Gatekeeper

- [ ] **Step 1 (@SecGuard)**: Create `admin_users` table in Supabase.
  - Columns: `id` (uuid), `email` (text), `role` (super_admin, support, moderator), `permissions` (jsonb), `last_active_at` (timestamptz).
- [ ] **Step 2 (@SysOp)**: Implement `src/middleware.ts` logic to block all `/dashboard/*` routes unless the user has a valid session AND exists in `admin_users` (or has `service_role`).
- [ ] **Step 3 (@SysOp)**: Configure `src/lib/supabase/admin.ts` to strictly use `SUPABASE_SERVICE_ROLE_KEY` and prevent client-side usage (`import 'server-only'`).
- **Verification (@QA)**: Try to access `/dashboard` as a normal user -> Should redirect to `/login`.

## 2. 🏠 Dashboard Overview (Read-Only)

> **Goal**: Replace mock stats with real database aggregations.
> **Primary Agent**: @SysOp

### Sub-Phase 2.1: Data Aggregation

- [ ] **Step 1 (@SysOp)**: Create `getOverviewStats` Server Action in `src/actions/dashboard.ts`.
  - Query 1: Count `profiles` where `status = 'active'`.
  - Query 2: Sum `transactions` where `type = 'platform_fee'`.
  - Query 3: Count `disputes` where `status = 'open'`.
- [ ] **Step 2 (@UIExpert)**: Connect `DashboardPage` to `getOverviewStats` and remove `MOCK_KPI_STATS`.
- [ ] **Step 3 (@MotionMaster)**: Add loading skeletons while the Server Action fetches.
- **Verification (@QA)**: Create a new user in DB -> Refresh Admin Dashboard -> Active Users count increases by 1.

## 3. 👥 User Management (Read + Write)

> **Goal**: Full CRUD on the user base, with audit trails.
> **Primary Agent**: @SysOp

### Sub-Phase 3.1: Directory & Profile

- [ ] **Step 1 (@SysOp)**: Implement `getUsers(page, query)` Action.
  - Must use `ILKE` for search and `OFFSET/LIMIT` for pagination.
- [ ] **Step 2 (@SysOp)**: Implement `getUserDeepProfile(id)` Action.
  - Parallel fetch: Profile + Job History + Wallet Balance.
- [ ] **Step 3 (@UIExpert)**: Wire up the `UsersPage` search bar to the Server Action (using `useSearchParams`).
- **Verification (@QA)**: Search for "John" -> result list filters correctly.

### Sub-Phase 3.2: Administrative Actions

- [ ] **Step 4 (@SecGuard)**: Implement `banUser(userId, reason)` Mutation.
  - Action: Update `profiles.status` to 'banned'.
  - Action: Revoke Auth Session (Supabase Admin API).
  - Audit: Log to `activity_log`.
- [ ] **Step 5 (@UIExpert)**: Connect "Ban User" button in UI to this mutation with a confirmation dialog.
- **Verification (@QA)**: Ban a test user -> User should be logged out immediately from the main app.

## 4. ⚖️ Disputes Center (Complex Write)

> **Goal**: The "Money Movement" engine. High Risk.
> **Primary Agent**: @SysOp

### Sub-Phase 4.1: Data Schema

- [ ] **Step 1 (@SysOp)**: Create `disputes`, `dispute_evidence`, and `dispute_messages` tables in Supabase (if not existing).
  - RLS: Admins have FULL access. Users have access ONLY to their own disputes.
- [ ] **Step 2 (@DataSmith)**: Create SQL Seed script to populate these tables for dev testing.

### Sub-Phase 4.2: Resolution Engine

- [ ] **Step 3 (@SysOp)**: Implement `resolveDispute(disputeId, decision)` Action.
  - **Atomic Transaction**: Update Dispute Status + Move Funds (Refund/Release).
  - **Logic**: If `Refund`, call `rpc('refund_payment', { job_id })`.
- [ ] **Step 4 (@UIExpert)**: Connect `DisputeCaseFile` UI to this action.
- **Verification (@QA)**: Resolve a dispute as "Refund" -> Check `wallets` table -> Client balance increased, Freelancer balance unchanged.

## 5. 💰 Finance Treasury (Read-Only)

> **Goal**: Transparency for financial flows.
> **Primary Agent**: @SysOp

### Sub-Phase 5.1: Transaction Ledger

- [ ] **Step 1 (@SysOp)**: Implement `getTransactions(filters)` Action.
- [ ] **Step 2 (@UIExpert)**: Connect `FinancePage` table. Add "CSV Export" using client-side generation from the fetched data.
- **Verification (@QA)**: Verify "Platform Fees" match the sum required for the Dashboard Overview.

## 6. 🛡️ System Logs (The Auditor)

> **Goal**: Immutable record of all admin actions.
> **Primary Agent**: @SecGuard

### Sub-Phase 6.1: The Audit Loop

- [ ] **Step 1 (@SecGuard)**: Create `activity_log` table.
  - Policies: Insert-only for Service Role. Read-only for Admins.
- [ ] **Step 2 (@SysOp)**: Ensure `logAdminAction` helper is called in _every_ mutation from Section 3 & 4.
- [ ] **Step 3 (@UIExpert)**: Connect `LogsPage` to `getLogs()` Action.
- **Verification (@QA)**: Perform a Ban -> Check Logs -> Verify `actor_id` matches the admin and `metadata` contains the reason.
