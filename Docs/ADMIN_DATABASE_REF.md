# Admin Database Reference (The Brain)

This document covers how the Sline Admin Dashboard interacts with the database: which objects it touches, canonical audit, and type generation. The **canonical schema** lives in the **app repo** (`sline_app/supabase/migrations`); the dashboard repo does not own production schema.

---

## DB Objects the Admin Touches

| Object / Table     | Description | Admin usage | Evidence |
|--------------------|-------------|------------|----------|
| `profiles`         | User accounts, roles, platform status | View, ban/unban, suspend, moderation | API routes + RLS bypass via Service Role in api |
| `tasks`            | Marketplace jobs | View, force-cancel, status update | apps/api routes |
| `disputes`         | Conflict resolution | View, resolve, refund/release | apps/api routes |
| `audit_logs`       | Immutable ledger of admin actions | **Read** (activity feeds); **Write** only via atomic RPC/transaction with mutation | Canonical; no `admin_logs` for new code |
| `admin_users`     | Admin identity and roles (source of truth for RBAC) | Read for RBAC; manage via super_admin | To be added in app repo if missing |
| `support_tickets`  | User support requests | View, reply, assign, status | If feature exists |
| `system_config`    | Global flags (maintenance, banners) | Read/update | If feature exists |
| Finance/ledger     | Withdrawals, transactions | View, approve/reject (via RPC) | apps/api finance routes |

**Missing / to be added in app migrations**: `admin_users`, `cases`, `notes`, `reports`, `approvals`, `system_config` (as needed per product). Dashboard repo may have temporary or read-only migrations for development; production truth is app-owned.

**RPCs used by admin**:
- `admin_process_withdrawal(p_request_id, p_decision, p_admin_id, p_reason)` — Approve or reject a withdrawal. Updates `withdrawal_requests` and inserts **exactly one** row into `audit_logs` (atomic). Signature and SQL are in dashboard repo at `MIGRATIONS/for_sline_app/` for copying into the app repo.

**Enum extension** (app repo): `related_entity_type_enum` is extended with `task`, `admin_user`, `profile` for canonical audit. Migration: `MIGRATIONS/for_sline_app/20260302100000_extend_related_entity_type_enum.sql`.

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
