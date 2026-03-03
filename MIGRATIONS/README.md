# Dashboard migrations

Migrations in this folder are applied to the Supabase project used by the dashboard (and optionally the same DB as the app). They live in **supabase/migrations/** in this repo and can be applied via **Supabase MCP** (`apply_migration`) or Supabase CLI.

**Related docs**: Full DB object and RPC list → `Docs/ADMIN_DATABASE_REF.md`. Security and audit rules → `Docs/ADMIN_SECURITY_MANUAL.md`. Feature-level migration refs → `Docs/features/*.md` (per `.agent/workflows/architecture/doc_keeper.md`).

## Migration order (shared DB)

When the dashboard and **sline_app** use the same database:

1. **Apply sline_app migrations first** (canonical schema: ledger, `audit_logs`, `withdrawal_requests`, `related_entity_type_enum`, etc.).
2. Then apply dashboard migrations in this order (see `.cursor/plans/` for full plan):
   - `20260302100000_extend_audit_related_entity_type_enum.sql` (adds `task`, `admin_user`, `profile` to enum)
   - `20260302120000_admin_users.sql`
   - `20260302120000_admin_booking_rpcs.sql`
   - `20260302120000_profiles_moderation_and_rpc.sql`
   - `20260302130000_admin_cases_and_chat_access.sql`
   - `20260302130000_reports_queue.sql` (fix: `reporter_user_id` nullable for `ON DELETE SET NULL`)
   - `20260302140000_force_logout.sql`
   - `20260303100000_system_config.sql` (PAGE 13 — system_config table + RPC `admin_update_system_config`; copy to sline_app for production)
   - `20260302150000_admin_approvals.sql` (PAGE 16 — dual approval queue and RPCs)
   - **Do not** apply `20260308100000_admin_cases.sql` for table creation (schema conflict with above; see "admin_cases conflict" below).

The RPC `admin_process_withdrawal` is defined in this repo with canonical signature (`p_request_id`, `p_decision`, `p_admin_id`, `p_reason`). For production, the same RPC can be added to **sline_app** so the app repo remains the single source of truth for schema and RPCs.

## PAGE 05 — User moderation (profiles)

- **20260302120000_profiles_moderation_and_rpc.sql**: Adds to `profiles`: `account_status`, `moderation_reason`, `moderated_at`, `moderated_by_admin_id`, `restriction_scope`; and RPC `admin_set_user_moderation(p_user_id, p_status, p_reason, p_admin_id, p_restriction_scope)` for atomic profile update + audit. When shared DB is used, the app repo can add an equivalent migration so it remains source of truth for schema.

### Enforcement (main app)

Banned/suspended users must not perform restricted operations (e.g. create tasks, post). In the **main app** (sline_app or client app):

- **RLS:** Add a policy or check that blocks mutations when `profiles.account_status IN ('banned', 'suspended')` for the requesting user (e.g. on `tasks` INSERT: `WHERE (SELECT account_status FROM profiles WHERE id = auth.uid()) NOT IN ('banned', 'suspended')`).
- **App logic:** Alternatively, before creating a task or other restricted action, read the user's profile and reject if `account_status` is `banned` or `suspended`.

Dashboard API list/detail already return full profile (including `account_status`) via `profiles` select.

The table `admin_users` (and enum `admin_role_enum`) is defined in this repo in `supabase/migrations/*_admin_users.sql`. For production with a shared DB, apply sline_app migrations first; the same SQL can be copied to **sline_app** so the app repo owns the canonical admin identity schema.

## PAGE 06 — Force logout / session revocation

- **20260302140000_force_logout.sql**: Adds `profiles.force_logout_after` and RPC `admin_force_logout_user(p_user_id, p_admin_id, p_reason)` for atomic update + audit. App must read `force_logout_after` and force re-auth. See `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md`.

## PAGE 07 — Bookings admin (cancel / refund)

- **20260302120000_admin_booking_rpcs.sql**: Adds RPCs `admin_cancel_booking(p_booking_id, p_admin_id, p_reason)` and `admin_refund_booking(p_booking_id, p_admin_id, p_reason, p_idempotency_key)` for atomic status update + one `audit_logs` row each. For production, equivalent SQL can be added to **sline_app** so the app repo remains source of truth.

## PAGE 08 / PAGE 09 — Cases and chat access logs

- **20260302130000_admin_cases_and_chat_access.sql**: Creates `admin_cases`, `admin_case_entities`, and `admin_chat_access_logs` for case management (PAGE 08) and case-gated chat moderation (PAGE 09). Every thread view and access grant is logged in `admin_chat_access_logs`. For production with a shared DB, this SQL can be copied to **sline_app** so the app repo owns the schema.

## admin_cases conflict (Option A)

Two migrations define `admin_cases` and `admin_case_entities` with different schemas:

- **20260302130000_admin_cases_and_chat_access.sql** (canonical for dashboard): `admin_cases` with text status/priority and `assignee_admin_id`; `admin_case_entities` with text `entity_type`; also creates `admin_chat_access_logs`. Use this one.
- **20260308100000_admin_cases.sql**: Same table names but enums and `assignee_id` (auth.users). **Do not apply** for table creation when using the dashboard; it would be ignored anyway (`CREATE TABLE IF NOT EXISTS`), but applying it can create orphan enums. For production, if the app repo prefers the enum-based schema, add equivalent DDL in sline_app and do not rely on 20260308100000 in the dashboard repo for creating tables.

See `Docs/ADMIN_DATABASE_REF.md` for the RPC table and object list.

## PAGE 10 — Reports queue

- **20260302130000_reports_queue.sql**: Creates `reports` and `report_actions` tables, RLS, and RPCs `admin_triage_report` and `admin_close_report` (atomic status update + report_actions insert + audit_logs insert). Extends `related_entity_type_enum` with `report` when the enum exists. **Note**: `reports.reporter_user_id` must be nullable (no `NOT NULL`) because of `ON DELETE SET NULL`. For production, equivalent SQL can be added to **sline_app** so the app repo remains source of truth.

## PAGE 13 — Settings / System config + feature flags

- **20260303100000_system_config.sql** (in `MIGRATIONS/for_sline_app/`): Creates `system_config` table (key, value jsonb, description, updated_by, updated_at), extends `related_entity_type_enum` with `system_config`, adds RPC `admin_update_system_config(p_key, p_value, p_actor_user_id)` for atomic update + audit, seeds default keys. RLS enabled; only service role can access.

## PAGE 14 — Observability / System Health

- **No DB migration.** Dashboard API and UI only.
- **GET /api/v1/observability**: Returns DB connectivity, Auth, Storage service status; optional `rpcStatus` (N/A), `queueStatus: { status: 'not_implemented' }`, `errorRates` (from `audit_logs` actions containing `fail` in last 1h/24h, or zeros).
- **RBAC:** Allowed roles: `support`, `moderator`, `admin`, `super_admin`. 401 unauthenticated; 403 when role not in list.
- **UI:** `/system-health` route; shared `ObservabilityResponseSchema`; data-testid `system-health-status`, `system-health-services` for E2E.
- **N/A policy:** RPC and queue status not implemented; schema/API allow N/A; gates accept.

## PAGE 17 — Route parity complete / Remove legacy-source (rollback)

- **Archive branch:** Before removing `legacy-source`, an archive branch is created so the Next dashboard can be restored if needed. Branch name pattern: `archive/legacy-next-dashboard-YYYYMMDD` (e.g. `archive/legacy-next-dashboard-20250303`).
- **Rollback (if build or CI breaks after removal):**  
  1. Restore the `legacy-source` tree from the archive branch:  
     `git checkout archive/legacy-next-dashboard-YYYYMMDD -- legacy-source`  
  2. Commit the restored directory.  
  3. Document in this file or a runbook that rollback was performed and the date.
- **Canonical dashboard after Page 17:** Admin UI = `apps/admin-ui` (Vite), API = `apps/api` (Fastify). Legacy Next app is removed; do not rely on `legacy-source` for new work. Copy to sline_app for production.
