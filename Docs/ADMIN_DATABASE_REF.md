# Admin Database Reference (The Brain)

This document covers how the Sline Admin Dashboard interacts with the database: which objects it touches, canonical audit, and type generation. The **canonical schema** lives in the **app repo** (`sline_app/supabase/migrations`); the dashboard repo does not own production schema.

---

## DB Objects the Admin Touches

| Object / Table     | Description | Admin usage | Evidence |
|--------------------|-------------|------------|----------|
| `profiles`         | User accounts, roles, platform status | View, ban/unban, suspend (moderation), force logout | API + Service Role; moderation: `20260302120000_profiles_moderation_and_rpc.sql`; force logout: `20260302140000_force_logout.sql` |
| `tasks`            | Marketplace jobs | View, force-cancel, status update | apps/api routes |
| `bookings`         | Booking records (payments, status) | View list/detail; cancel and refund via RPC (PAGE 07) | apps/api routes/bookings.ts |
| `admin_cases`     | Investigation/moderation cases (PAGE 08) | Create, list, detail, assign; case-gated chat | apps/api routes/cases.ts; migration `20260302130000_admin_cases_and_chat_access.sql` (canonical; see MIGRATIONS/README) |
| `admin_case_entities` | Links cases to tasks, users, conversations, etc. | Attach/detach entities to a case | Same migration; RLS service_role only |
| `disputes`         | Conflict resolution | View, resolve, refund/release | apps/api routes |
| `audit_logs`       | Immutable ledger of admin actions | **Read** (activity feeds); **Write** only via atomic RPC/transaction with mutation | Canonical; no `admin_logs` for new code |
| `admin_users`     | Admin identity and roles (source of truth for RBAC) | Read for RBAC; manage via super_admin | Implemented in dashboard: `supabase/migrations/20260302120000_admin_users.sql`; copy to sline_app for production (see MIGRATIONS/README.md) |
| `support_tickets`  | User support requests | View, reply, assign, status | If feature exists |
| `system_config`    | Global flags (maintenance, banners) | Read/update | If feature exists |
| Finance/ledger     | Withdrawals, transactions | View, approve/reject (via RPC) | apps/api finance routes |
| `reports`          | User-submitted reports (task/user/chat) | List, detail, triage, close (via RPC) | apps/api routes/reports.ts; migration `20260302130000_reports_queue.sql` |
| `report_actions`   | Triage/close history per report | Insert via RPC; read for detail | Same migration |
| `admin_chat_access_logs` | Case-gated chat (PAGE 09) | Every thread view/grant logged | Same migration as admin_cases |

**Schema ownership**: For production with a shared DB, apply **sline_app** migrations first. Dashboard migrations in `supabase/migrations/` can be applied via Supabase MCP or CLI; equivalent SQL can be copied to **sline_app** so the app repo remains source of truth. **admin_cases conflict**: `20260308100000_admin_cases.sql` defines the same tables with a different schema; per plan Option A we use only `20260302130000_admin_cases_and_chat_access` for those tables. See `MIGRATIONS/README.md`. Optional: `notes`, `approvals`, `system_config` as needed per product.

**Admin RPCs (atomic mutation + one audit row)** — SQL in `supabase/migrations/` and `MIGRATIONS/for_sline_app/`:

| RPC | Purpose | Audit action |
|-----|---------|--------------|
| `admin_process_withdrawal(p_request_id, p_decision, p_admin_id, p_reason)` | Approve/reject withdrawal | One row in `audit_logs` |
| `admin_cancel_booking(p_booking_id, p_admin_id, p_reason)` | Set booking status to canceled (PAGE 07) | `admin.bookings.cancel` |
| `admin_refund_booking(p_booking_id, p_admin_id, p_reason, p_idempotency_key?)` | Set booking status to refunded; idempotent by key (PAGE 07) | `admin.bookings.refund` |
| `admin_set_user_moderation(p_user_id, p_status, p_reason, p_admin_id, p_restriction_scope?)` | Set profile account_status (PAGE 05) | `user_ban`, `user_unban`, `user_suspend` |
| `admin_force_logout_user(p_user_id, p_admin_id, p_reason?)` | Set `profiles.force_logout_after = now()` (PAGE 06) | `admin.users.force_logout`; app: `FORCE_LOGOUT_APP_ENFORCEMENT.md` |
| `admin_triage_report(p_report_id, p_action, p_admin_id, p_reason)` | Triage report (PAGE 10) | `admin.report.triage` or `admin.report.resolve` |
| `admin_close_report(p_report_id, p_admin_id, p_reason)` | Close report (PAGE 10) | `admin.report.resolve` |

**Enum extension**: `related_entity_type_enum` is extended with `task`, `admin_user`, `profile`, `report` (and optionally `admin_case`). Migrations: `supabase/migrations/20260302100000_extend_audit_related_entity_type_enum.sql`; `reports_queue` adds `report` in its DO block.

---

## Canonical Audit Table: `audit_logs` (Not admin_logs)

- **Table**: `public.audit_logs`.
- **Purpose**: Every privileged mutation must insert exactly one row here **in the same transaction** as the mutation.
- **Canonical columns** (align with app repo): e.g. `id`, `actor_user_id`, `action`, `related_entity_type`, `related_entity_id`, `meta` (JSONB), `created_at`. Avoid legacy names (`actor_id`, `target_resource`, `target_id`, `metadata`) for new code.
- **admin_logs**: Treated as legacy/drift. New code must not read or write `admin_logs`; migrate to `audit_logs` and atomic writes.

---

## Views Needed by Admin

- **Analytics**: e.g. `vw_analytics_monthly_revenue`, `vw_analytics_monthly_user_growth` (or equivalent) for dashboard KPIs.
- **Ledger/reporting**: e.g. `vw_admin_journal_ledger` if required for finance or audit views.

These views should live in the app repo migrations when they are canonical; the API reads them via Service Role.

---

## Type Generation and Shared Contracts

- **DB types**: Generated from the **app repo** schema (canonical). Example: `npx supabase gen types typescript --project-id <id> > src/types/supabase.ts` in the app repo. The **dashboard API** may use these types or shared DTOs; the **admin-ui** must NOT import `@/types/supabase` or any server-side DB types—it uses only DTOs from `packages/shared` or local TS interfaces.
- **Shared contracts**: `packages/shared` holds Zod schemas for API request/response shapes. These are the contract between admin-ui and api. DB row types stay in the API or app repo; shared exposes only safe, stable DTOs (no raw DB columns that could leak schema details).

---

## RLS and Service Role

- **App users**: Access data through RLS. The mobile/app client uses anon or user JWT and is restricted by RLS.
- **Admin**: The API uses the Supabase client with `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS. Access control is enforced in application code (RBAC middleware and route handlers), not in Postgres, for admin operations.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
