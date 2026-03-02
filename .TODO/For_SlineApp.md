# SLine App — What the App Must Have So All Dashboard Features Work

**Purpose**: Rescan of the dashboard codebase to list every feature, what the **actual (Flutter) marketplace app** must implement, and how the app and dashboard link.  
**Last updated**: 2025-03-03

---

## How the app and dashboard link

- **Same Supabase project**: Dashboard API (Fastify) uses **Service Role** to read/write; the Flutter app uses **Supabase client** with **RLS** (authenticated users).
- **Same schema**: Migrations that the dashboard depends on must exist in the **app repo** (or in a shared DB that both use). Copy the SQL from `MIGRATIONS/for_sline_app/` and `supabase/migrations/` into `sline_app/supabase/migrations/` in the right order so the app owns the canonical schema.
- **No dashboard API from the app**: End users do **not** call the dashboard API. They use the app only. The app talks to Supabase (and optionally your own app API). The dashboard is for admins only.
- **Link summary**:
  - **Data**: One database. App creates/updates users, profiles, tasks, bookings, conversations, messages, reports. Dashboard reads the same tables and calls RPCs that mutate them (ban, force logout, cancel booking, refund, triage report, etc.).
  - **Enforcement**: Some dashboard actions only take effect when the app **enforces** them (e.g. force logout: dashboard sets `profiles.force_logout_after`, app must sign the user out when that is after session start).

---

## 1. Feature list and app requirements

### 1.1 Force Logout (PAGE 06)

| Dashboard side | App side (what you must have) | How they link |
|----------------|--------------------------------|----------------|
| Admin clicks “Force logout” on user detail → API calls RPC `admin_force_logout_user` → sets `profiles.force_logout_after = now()` and writes to `audit_logs`. | **Schema**: Column `profiles.force_logout_after` (timestamptz, nullable). **Migration**: Copy `MIGRATIONS/for_sline_app/20260302140000_force_logout.sql` into app and apply. **Behavior**: On session use (startup / resume / before sensitive ops), read current user’s `profiles.force_logout_after` (e.g. from profile fetch or “me” response). If it is set and **after** the token `iat` or session start → treat session as revoked: call `Supabase.auth.signOut()`, clear caches, redirect to login. | Same `profiles` row. Dashboard writes the column; app reads it and enforces re-auth. |

**App checklist**

- [ ] Migration applied: `profiles.force_logout_after` exists; RPC `admin_force_logout_user` exists (dashboard calls it).
- [ ] Profile / “me” response includes `force_logout_after` (or app reads it from Supabase `profiles` with RLS).
- [ ] Session validator: compare `force_logout_after` with token `iat` or session start; if after → sign out and go to login.
- [ ] Optional: on app resume or periodic check, re-fetch profile and re-run the check.

**Ref**: `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md`, `Docs/features/force-logout.md`

---

### 1.2 User moderation (Ban / Suspend / Unban) (PAGE 05)

| Dashboard side | App side | How they link |
|----------------|----------|----------------|
| Admin bans/suspends/unbans user → API calls RPC `admin_set_user_moderation` → updates `profiles` (account_status, moderation_reason, etc.) and writes to `audit_logs`. | **Schema**: `profiles.account_status`, `moderation_reason`, `moderated_at`, `moderated_by_admin_id`, `restriction_scope`. **Behavior**: Before allowing sensitive actions (e.g. create task, send message), check `profiles.account_status`. If `banned` or `suspended`, show a message and block the action (and optionally redirect to login or a “restricted” screen). | Same `profiles` row. Dashboard sets status; app reads it and enforces. |

**App checklist**

- [ ] Migration applied: `profiles` has moderation columns; RPC `admin_set_user_moderation` exists.
- [ ] App reads `account_status` (e.g. from profile or “me”).
- [ ] App blocks or restricts UX when `account_status` is `banned` or `suspended`.

**Ref**: `supabase/migrations/20260302120000_profiles_moderation_and_rpc.sql`, `Docs/features/users.md`

---

### 1.3 Bookings Admin (PAGE 07)

| Dashboard side | App side | How they link |
|----------------|----------|----------------|
| Dashboard lists bookings, opens detail, cancels (reason), refunds (reason + optional idempotency_key). API calls RPCs `admin_cancel_booking` and `admin_refund_booking`; they update `bookings.status` and write to `audit_logs`. | **Schema**: Table `bookings` with at least: id, task_id, client_id, provider_id, status, payment_status, price, created_at, completed_at, delivered_at. **Migrations**: RPCs `admin_cancel_booking` and `admin_refund_booking` must exist (copy `MIGRATIONS/for_sline_app/20260302120000_admin_booking_rpcs.sql`). **Behavior**: App is where bookings are **created** (user books a task). App shows booking state; when admin cancels or refunds, `status` (and optionally `payment_status`) change in DB — app should reflect that (e.g. “Canceled” or “Refunded”) and, if you have wallet/ledger, trigger any refund flow (e.g. call `rpc_finalize_booking_refund` if you add it). | Same `bookings` table. App creates and displays; dashboard mutates via RPCs; app shows updated status. |

**App checklist**

- [ ] Table `bookings` exists with expected columns; app creates bookings in normal flow.
- [ ] Migration applied: `admin_cancel_booking`, `admin_refund_booking` exist (and optionally wire refund to your ledger in app SQL).
- [ ] App UI shows booking status; when status is `canceled` or `refunded`, show that and apply any in-app refund logic.

**Ref**: `Docs/features/bookings-admin.md`, `MIGRATIONS/for_sline_app/20260302120000_admin_booking_rpcs.sql`

---

### 1.4 Cases (PAGE 08) & Chat Moderation (PAGE 09)

| Dashboard side | App side | How they link |
|----------------|----------|----------------|
| Dashboard creates cases, attaches entities (task, user, conversation, booking, dispute). Dashboard views chat thread **only** when a case is linked to that thread (case_id in query); every view/grant is logged in `admin_chat_access_logs`. API reads `conversations` / messages for that thread. | **Schema**: Tables `admin_cases`, `admin_case_entities`, `admin_chat_access_logs`; table `admin_users` (referenced by assignee_id / viewer_admin_id). **Conversations**: App has `conversations` (or equivalent) and `messages`; dashboard uses **thread_id** = conversation id. **Behavior**: App does **not** create cases or write to admin_chat_access_logs; those are dashboard-only. App only needs the same DB so that when an admin opens a thread from a case, the API can read the same `conversations`/`messages` the app uses. | Same DB. App owns conversation/message data; dashboard reads it via API when case is linked; RLS on admin tables is service_role only (app never reads them). |

**App checklist**

- [ ] Migrations applied: `admin_users`, `admin_cases`, `admin_case_entities`, `admin_chat_access_logs` (from `supabase/migrations/20260302120000_admin_users.sql`, `20260302130000_admin_cases_and_chat_access.sql`, and `20260308100000_admin_cases.sql` if you use the latter’s enum/constraints). Ensure `admin_cases.assignee_id` / `admin_chat_access_logs.viewer_admin_id` match your schema (some migrations reference `admin_users(id)`).
- [ ] App has `conversations` and `messages` (or equivalent) so dashboard chat API can read by thread_id.
- [ ] No app-side logic required for “cases” or “chat moderation” — just schema so dashboard can operate.

**Ref**: `Docs/features/cases.md`, `Docs/features/chat-moderation.md`, `supabase/migrations/20260302130000_admin_cases_and_chat_access.sql`, `20260308100000_admin_cases.sql`

---

### 1.5 Reports Queue (PAGE 10)

| Dashboard side | App side | How they link |
|----------------|----------|----------------|
| Dashboard lists reports, opens detail, triages (dismiss, warn_user, escalate, close), closes. API reads `reports` and `report_actions`; mutations call RPCs `admin_triage_report` and `admin_close_report`. | **Schema**: Tables `reports` and `report_actions` (see `supabase/migrations/20260302130000_reports_queue.sql`). **Behavior**: **Users in the app** must be able to **create** reports (e.g. “Report this task”, “Report this user”, “Report this chat”). So either: (1) RLS policy allowing `INSERT` into `reports` where `reporter_user_id = auth.uid()`, or (2) an RPC like `user_create_report(entity_type, entity_id, reason?, category?)` that inserts one row and returns id. Dashboard only reads/triages/closes; it does not create reports. | Same `reports` table. App inserts new reports; dashboard reads and updates status via RPCs. |

**App checklist**

- [ ] Migration applied: `reports`, `report_actions`, `admin_triage_report`, `admin_close_report` (and enum/constraint for `entity_type`: task, user, chat).
- [ ] App UI: “Report task”, “Report user”, “Report conversation” that create a row in `reports` (via RLS insert or RPC). Store at least: reporter_user_id, entity_type, entity_id, reason, category (optional), status default `open`.
- [ ] No app-side triage/close — dashboard only.

**Ref**: `Docs/features/reports-queue.md`, `supabase/migrations/20260302130000_reports_queue.sql`

---

### 1.6 Users list & detail (dashboard)

| Dashboard side | App side | How they link |
|----------------|----------|----------------|
| Dashboard lists and shows `profiles` (and auth user); ban, unban, suspend, force logout. | **Schema**: Table `profiles` with columns expected by dashboard (id, email, full_name, avatar_url, role/active_role, account_status, force_logout_after, moderation columns, etc.). App creates/updates profiles on sign-up/profile edit. | Same `profiles` (and auth.users). Dashboard reads via API (service role); app writes via Supabase client (RLS). |

**App checklist**

- [ ] `profiles` exists and is kept in sync with auth (e.g. trigger or app code on sign-up).
- [ ] Optional: if dashboard expects `admin_users` for RBAC, ensure `admin_users` exists and is populated for admin accounts.

---

### 1.7 Tasks (dashboard)

| Dashboard side | App side | How they link |
|----------------|----------|----------------|
| Dashboard lists tasks, may force-cancel. | **Schema**: Tables `tasks` (and related) that dashboard API queries. App creates/updates tasks in normal flow. | Same `tasks` table; dashboard reads and may call an RPC to cancel/update status. |

**App checklist**

- [ ] `tasks` (and any task_requests / status fields) exist; app uses them.
- [ ] If dashboard implements force-cancel via RPC (e.g. `admin_update_task_status`), add that RPC in app migrations so dashboard can call it.

---

### 1.8 Finance (dashboard)

| Dashboard side | App side | How they link |
|----------------|----------|----------------|
| Dashboard shows transaction/withdrawal views; may approve/reject withdrawals via RPC. | **Schema**: Ledger/accounts/withdrawal tables and views (e.g. `vw_admin_journal_ledger`, `withdrawal_requests`); RPCs like `admin_process_withdrawal`. App creates ledger entries and withdrawal requests in normal flow. | Same DB; dashboard reads and mutates via RPCs; app creates the underlying financial data. |

**App checklist**

- [ ] Ledger and withdrawal schema + RPCs used by dashboard exist in app migrations.
- [ ] App creates withdrawals/ledger events when users request payouts or complete payments.

---

### 1.9 Disputes (dashboard)

| Dashboard side | App side | How they link |
|----------------|----------|----------------|
| Dashboard lists disputes, views evidence, may release funds / refund / split. | **Schema**: Disputes/tickets table; link to tasks/bookings and chat. RPCs for resolution if any. App may create disputes when a user escalates. | Same DB; app may insert disputes; dashboard reads and resolves. |

**App checklist**

- [ ] Dispute/ticket schema exists; app can create a dispute (e.g. from a booking or task).
- [ ] Any RPCs the dashboard calls for dispute resolution exist in app migrations.

---

## 2. Migrations to copy into the app (order)

Copy these into **sline_app** (`sline_app/supabase/migrations/`) so the app repo owns the schema. Apply in dependency order (after your existing tables like `profiles`, `bookings`, `audit_logs`, etc.):

| Order | Migration (dashboard repo) | Purpose |
|-------|----------------------------|--------|
| 1 | Extend `related_entity_type_enum` (if you use it) | For audit_logs. |
| 2 | `20260302120000_admin_users.sql` | Admin identity for RBAC and cases/chat logs. |
| 3 | `20260302120000_profiles_moderation_and_rpc.sql` | Profiles moderation columns + `admin_set_user_moderation`. |
| 4 | `MIGRATIONS/for_sline_app/20260302140000_force_logout.sql` | Force logout column + `admin_force_logout_user`. |
| 5 | `MIGRATIONS/for_sline_app/20260302120000_admin_booking_rpcs.sql` | `admin_cancel_booking`, `admin_refund_booking` (after `bookings` and `audit_logs` exist). |
| 6 | `20260302130000_admin_cases_and_chat_access.sql` | admin_cases, admin_case_entities, admin_chat_access_logs (references admin_users). |
| 7 | `20260308100000_admin_cases.sql` (if needed) | Enums/constraints for admin_cases if your schema uses them. |
| 8 | `20260302130000_reports_queue.sql` | reports, report_actions, admin_triage_report, admin_close_report. |

**Ref**: `MIGRATIONS/for_sline_app/README.md`

---

## 3. Summary: per-feature app requirements

| Feature | App must have (schema) | App must do (behavior) | Link |
|---------|------------------------|------------------------|------|
| **Force Logout** | `profiles.force_logout_after`; RPC `admin_force_logout_user` | Read `force_logout_after`; if after session start → sign out and go to login | Same profiles row |
| **User moderation** | `profiles` moderation columns; RPC `admin_set_user_moderation` | Check `account_status`; block/restrict when banned/suspended | Same profiles row |
| **Bookings Admin** | `bookings` table; RPCs `admin_cancel_booking`, `admin_refund_booking` | Create bookings; show status; handle canceled/refunded in UI (and ledger if any) | Same bookings table |
| **Cases & Chat** | `admin_cases`, `admin_case_entities`, `admin_chat_access_logs`, `admin_users`; `conversations`/`messages` | None (dashboard-only); same DB so dashboard can read threads | Same DB; app owns chat data |
| **Reports Queue** | `reports`, `report_actions`; RPCs `admin_triage_report`, `admin_close_report` | **Create** reports from app (Report task/user/chat) via RLS or RPC | Same reports table; app inserts, dashboard reads/updates |
| **Users** | `profiles` (and optionally `admin_users`) | Create/update profiles; sync with auth | Same profiles |
| **Tasks** | `tasks` (and related) | Create/update tasks; optional RPC for admin force-cancel | Same tasks table |
| **Finance** | Ledger/withdrawal schema and RPCs | Create ledger/withdrawal rows when users pay/request payout | Same DB |
| **Disputes** | Dispute/ticket schema and RPCs | Create disputes when user escalates; dashboard resolves | Same DB |

---

## 4. Quick checklist for “all features work fully”

- [ ] All migrations above applied in sline_app in order.
- [ ] **Force logout**: App reads `force_logout_after`, compares to session, signs out when revoked.
- [ ] **Moderation**: App checks `account_status` and restricts banned/suspended users.
- [ ] **Bookings**: App creates bookings; shows status; RPCs for cancel/refund exist and are used by dashboard.
- [ ] **Reports**: App lets users submit reports (insert into `reports` with entity_type task/user/chat).
- [ ] **Cases/Chat**: admin_cases/admin_chat_access_logs and conversations/messages in same DB; no app logic for cases.
- [ ] **Admin identity**: `admin_users` populated for dashboard admins so RBAC and case/chat logs work.

This document is the single place to see what the app should have and how it links to the dashboard for each feature.
