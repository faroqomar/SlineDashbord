# User Management

## Overview

View, filter, and manage all registered users (Clients & Freelancers). Includes ban, suspend, unban, and **force logout** (session revocation). All privileged actions are enforced server-side via the Fastify API; audit is written atomically in DB RPCs to `audit_logs` (not `admin_logs`).

## Routes / Screens

- **List**: `apps/admin-ui/src/routes/Users.tsx` (or equivalent) → `UsersScreen` with table, search, pagination.
- **Detail**: `apps/admin-ui/src/routes/UserDetail.tsx` → single user profile with **Administrative Actions** (Ban, Force logout, Reset password placeholder).

## API Endpoints

| Method | Path | Description | RBAC |
|--------|------|-------------|------|
| GET | `/api/v1/users` | List profiles (paginated, filterable) | admin_users read roles |
| GET | `/api/v1/users/:userId` | User detail (auth + profile) | admin_users read roles |
| POST | `/api/v1/users/:userId/ban` | Ban user (reason required) | admin, super_admin |
| POST | `/api/v1/users/:userId/unban` | Unban user | admin, super_admin |
| POST | `/api/v1/users/:userId/suspend` | Suspend user (reason + duration) | admin, super_admin |
| POST | `/api/v1/users/:userId/force-logout` | Revoke session; user must re-auth | admin, super_admin |

## ViewModels / API Client

- **API client**: `apps/admin-ui/src/features/users/services/users_api.ts` — `getUsers`, `getUserDetails`, `banUser`, `unbanUser`, `suspendUser`, `forceLogoutUser(userId, reason?)`.
- **ViewModels**: e.g. `useUsersViewModel` (list), `use_user_actions.vm` (ban); UserDetail uses `useMutation` with `forceLogoutUser()` for force-logout.

## How It Works

1. **Listing**: API fetches `profiles` via Service Role (bypassing RLS). Pagination and filters applied server-side.
2. **Search**: Server-side filtering by name/email/role.
3. **Ban / Unban / Suspend**: Admin chooses action, enters reason where required; API validates with Zod, calls RPC (e.g. `admin_set_user_moderation`). RPC updates `profiles` and inserts **one** row into `audit_logs` in the same transaction.
4. **Force logout**: Admin clicks "Force logout" on user detail → confirmation dialog → optional reason → `forceLogoutUser(userId, reason)` → API calls `admin_force_logout_user`. RPC sets `profiles.force_logout_after = now()` and inserts one row into `audit_logs`. The marketplace app (Flutter) must read `force_logout_after` and force re-auth—see `Docs/features/force-logout.md` and `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md`.

## DB / Migrations

- **Moderation (PAGE 05)**: `supabase/migrations/20260302120000_profiles_moderation_and_rpc.sql` — adds `profiles.account_status`, `moderation_reason`, `moderated_at`, `moderated_by_admin_id`, `restriction_scope` and RPC `admin_set_user_moderation`.
- **Force logout (PAGE 06)**: `supabase/migrations/20260302140000_force_logout.sql` — adds `profiles.force_logout_after` and RPC `admin_force_logout_user`. App enforcement: `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md`.
- See `Docs/ADMIN_DATABASE_REF.md` and `MIGRATIONS/README.md`.

## Special Rules

- **RBAC**: Write actions (ban, unban, suspend, force-logout) require `admin` or `super_admin` (USERS_WRITE_ROLES). Support can only read.
- **Audit**: All mutations use DB RPCs that write to `audit_logs` atomically. No `withAudit` wrapper for these routes.
- **Destructive actions**: Ban/suspend require a reason; force-logout accepts an optional reason (recommended for audit).
- **Idempotency**: Force-logout does not require Idempotency-Key in v1 (replay updates timestamp again).

## Related Docs

- **Force logout (session revocation)**: `Docs/features/force-logout.md`
- **Security**: `Docs/ADMIN_SECURITY_MANUAL.md`
- **Database**: `Docs/ADMIN_DATABASE_REF.md` (profiles, audit_logs, RPCs)

## Future Work

- [ ] Impersonation Mode (Login as User).
- [ ] Verification Badge manual approval flow.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
