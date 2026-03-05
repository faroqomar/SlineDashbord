# SLine Admin Dashboard - Data Integration Plan

> **Goal**: Map every UI feature to real Supabase data and define the connection strategy.
> **Status**: Planning Phase
> **Compliance**: Must follow [ADMIN_INTEGRATION_PLAN.md](./ADMIN_INTEGRATION_PLAN.md)

---

## 🏗️ Phase 1: Core Infrastructure (Schema & Ops)

> **Goal**: Prepare the database to support Admin features.
> **Primary Agent**: @Supabase_Ops

### ✅ Prerequisites (What we need)

- [ ] **Supabase Project connected**: Access to the project dashboard.
- [ ] **Service Role Key**: Added to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] **`supabase-admin.ts` client**: A configured client helper that uses the Service Role key (for server actions ONLY).

- [ ] **1.1 Create `admin_logs` Table**
  - **Schema**: `id (uuid)`, `actor_id (uuid, fk)`, `action (text)`, `target_resource (text)`, `target_id (uuid)`, `metadata (jsonb)`, `created_at`.
  - **RLS**: Read-only for admins, No access for users.

- [ ] **1.2 Create/Verify `disputes` Table**
  - **Schema**: `id`, `task_id`, `complainant_id`, `defendant_id`, `status` (`open`, `resolved`, `refunded`), `reason`, `created_at`.
  - **RLS**: Admin full access, Participants read-only.

- [ ] **1.3 Create `support_tickets` Table**
  - **Schema**: `id`, `user_id`, `category` (`bug`, `account`, `feature`), `priority`, `status`, `assignee_id`, `subject`, `created_at`.
  - **RLS**: Admin full access, User read-only (own tickets).

- [ ] **1.4 Create `admin_users` Table**
  - **Schema**: `id (fk auth.users)`, `role` (`super_admin`, `admin`, `moderator`), `name`, `email`.
  - **RLS**: Admin read-only (self-manage via super-admin).

---

## 👥 Phase 2: User Management (`/users`)

> **Goal**: Replace mock user lists with real `profiles` data.
> **Primary Agent**: @SysOp

### ✅ Prerequisites (What we need)

- [ ] **Phase 1 Complete**: `admin_logs` table must exist for audit logging.
- [ ] **Existing User Data**: The `auth.users` and `public.profiles` tables must have at least one user to test.
- [ ] **UI Components**: The `UserList` table and `UserProfile` components must be present in the code.

- [ ] **2.1 User List (Read)**
  - **UI**: `src/app/dashboard/users/page.tsx`
  - **Source**: `auth.users` (joined with `public.profiles`)
  - **Action**: `getUsers(page, query, role)`
  - **Security**: Service Role (to see all users) -> Filter -> Return DTO.

- [ ] **2.2 User Details (Read)**
  - **UI**: `src/app/dashboard/users/[id]/page.tsx`
  - **Source**: `profiles`, `tasks` (as client/freelancer), `wallet_transactions`.
  - **Action**: `getUserDetails(id)`

- [ ] **2.3 User Actions (Write)**
  - **UI**: Ban/Suspend Button
  - **Target**: `auth.users.banned_until` OR `profiles.status`.
  - **Action**: `suspendUser(id, reason, duration)`
  - **Audit**: Log `BAN_USER` action.

---

## ⚖️ Phase 3: Dispute Resolution (`/disputes`)

> **Goal**: Connect the dispute center to real ticket data.
> **Primary Agent**: @SysOp

### ✅ Prerequisites (What we need)

- [ ] **Phase 1 Complete**: `disputes` table must exist.
- [ ] **`tasks` Table**: Must exist in the schema to link disputes to tasks.
- [ ] **`messages` Table**: Must exist to fetch chat history context.
- [ ] **UI Components**: `DisputeList` and `DisputeDetail` pages must be built.

- [ ] **3.1 Dispute List (Read)**
  - **UI**: `src/app/dashboard/disputes/page.tsx`
  - **Source**: `disputes` table join `tasks`, `profiles`.
  - **Action**: `getDisputes(status, page)`

- [ ] **3.2 Dispute Detail (Read)**
  - **UI**: `src/app/dashboard/disputes/[id]/page.tsx`
  - **Source**: `disputes` row + `chat_messages` (context).
  - **Action**: `getDisputeDetails(id)`

- [ ] **3.3 Resolution Actions (Write)**
  - **UI**: Refund / Release Buttons.
  - **Target**: `tasks.status`, `wallet_transactions` (insert refund).
  - **Action**: `resolveDispute(id, outcome, reason)`
  - **Audit**: Log `RESOLVE_DISPUTE` action.

---

## 💼 Phase 4: Task Management (`/tasks`)

> **Goal**: Monitor and moderate marketplace tasks.
> **Primary Agent**: @SysOp

### ✅ Prerequisites (What we need)

- [ ] **`tasks` Table**: Must exist and contain real/seed data.
- [ ] **UI Components**: `TaskList` page must be built (currently partially missing or needs update).

- [ ] **4.1 Task List (Read)**
  - **UI**: `src/app/dashboard/tasks/page.tsx` (Needs creation/update).
  - **Source**: `tasks` table.
  - **Action**: `getAllTasks(filter, page)`

- [ ] **4.2 Task Moderation (Write)**
  - **UI**: Cancel Task Button.
  - **Target**: `tasks.status` -> `cancelled`.
  - **Action**: `forceCancelTask(id, reason)`
  - **Audit**: Log `CANCEL_TASK` action.

---

## 📊 Phase 5: Dashboard Overview & Analytics

> **Goal**: Real-time stats on the home page.
> **Primary Agent**: @SysOp

### ✅ Prerequisites (What we need)

- [ ] **Phases 2-4 Data**: `users`, `tasks`, and `disputes` tables must be populated to show meaningful counts.
- [ ] **UI Components**: `StatsCards` and `RecentActivity` components must be ready.

- [ ] **5.1 KPI Cards (Read)**
  - **UI**: `src/app/dashboard/page.tsx`
  - **Source**: `count(*)` on `users`, `tasks`, `disputes`.
  - **Action**: `getDashboardStats()` (Cached).

- [ ] **5.2 Activity Feed (Read)**
  - **UI**: `RecentActivity` component.
  - **Source**: `audit_logs` union `tasks` (created) union `profiles` (joined).
  - **Action**: `getRecentActivity()`

---

## 🛠 Phase 6: System Logs & Config

> **Goal**: Admin traceability and system config.
> **Primary Agent**: @SysOp

### ✅ Prerequisites (What we need)

- [ ] **Phase 1 Complete**: `admin_logs` table must exist.
- [ ] **Audit Data**: Other actions (ban, refund) must be firing to populate this list.

- [ ] **6.1 Audit Logs (Read)**
  - **UI**: `src/app/dashboard/logs/page.tsx`
  - **Source**: `admin_logs` table.
  - **Action**: `getAuditLogs(filter, page)`

- [ ] **6.2 Broadcasts (Write)**
  - **UI**: Notification Center.
  - **Target**: `notifications` table (insert for all users) or Edge Function.
  - **Action**: `sendSystemBroadcast(message, type)`
  - **Audit**: Log `BROADCAST_SENT`.

---

## 🛡️ Phase 7: Team Management (`/team`)

> **Goal**: Manage Admin Users and Permissions.
> **Primary Agent**: @SysOp

### ✅ Prerequisites (What we need)

- [ ] **Phase 1 Complete**: `admin_users` table must exist.
- [ ] **Initial Super Admin**: At least one super admin must be seeded manually to invite others.
- [ ] **UI Components**: `AdminList` and `InviteDialog` must be built.

- [ ] **7.1 Admin List (Read)**
  - **UI**: `src/app/dashboard/team/page.tsx`
  - **Source**: `admin_users` table.
  - **Action**: `getAdminUsers()`

- [ ] **7.2 Invite Admin (Write)**
  - **UI**: `InviteAdminDialog`
  - **Target**: `auth.inviteUserByEmail` + `admin_users` (insert).
  - **Action**: `inviteAdmin(email, role)`
  - **Audit**: Log `INVITE_ADMIN`.

---

## 🩺 Phase 8: System Health (`/system-health`)

> **Goal**: Operational metrics.
> **Primary Agent**: @SysOp

### ✅ Prerequisites (What we need)

- [ ] **DB Access**: Ability to run `pg_stat_activity` or existence of a `health_check` function/endpoint.
- [ ] **Job Queue System**: If tracking queues, the queue table/view must exist.

- [ ] **8.1 Health Metrics (Read)**
  - **UI**: `src/app/dashboard/system-health/page.tsx`
  - **Source**: Database/Edge Function health check endpoint.
  - **Action**: `getSystemHealth()` (Returns latency, error rates from monitoring tool or simple DB ping).

- [ ] **8.2 Job Queue Status (Read)**
  - **UI**: Job Queue Card.
  - **Source**: `pg_stat_activity` or dedicated Queue table (if using Edge Functions).
  - **Action**: `getJobQueueStatus()`

---

## 🎫 Phase 9: Support Tickets (`/complaints`)

> **Goal**: General support request handling.
> **Primary Agent**: @SysOp

### ✅ Prerequisites (What we need)

- [ ] **Phase 1 Complete**: `support_tickets` table must exist.
- [ ] **`ticket_messages` table**: Must exist for chat history.
- [ ] **UI Components**: `TicketList` and chat interface must be built.

- [ ] **9.1 Ticket List (Read)**
  - **UI**: `src/app/dashboard/complaints/page.tsx`
  - **Source**: `support_tickets` table `left join admin_users (assignee)`.
  - **Action**: `getTickets(filter, page)`

- [ ] **9.2 Ticket Chat (Read/Write)**
  - **UI**: `TicketChat` component.
  - **Source**: `ticket_messages` table.
  - **Action**: `sendMessage(ticketId, content, isInternal)`

- [ ] **9.3 Update Status (Write)**
  - **UI**: `TicketHeader` dropdown.
  - **Target**: `support_tickets.status`.
  - **Action**: `updateTicketStatus(id, status)`
  - **Audit**: Log `UPDATE_TICKET`.
