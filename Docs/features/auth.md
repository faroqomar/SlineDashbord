# Admin Authentication

## Purpose

Secure, isolated access control for Dashboard Admins. Admin identity and RBAC are enforced server-side; the admin-ui never has Service Role or direct DB access. Role comes from the canonical **`admin_users`** table (source of truth).

## Architecture

- **admin-ui**: Login via Supabase Auth (anon key); session cookie sent to API. Calls `GET /api/v1/auth/me` to get current user and role. No `admin_users` or service-role access.
- **api**: Verifies JWT (cookie or header), looks up `admin_users` by user id to resolve **role**; validates role with `AdminRoleEnum` from `packages/shared`; returns `AuthMeResponseSchema`-shaped payload. RBAC middleware (`requireAdminRole(allowedRoles)`) on every privileged route.

## API

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/auth/me` | GET | Cookie/session | Returns `{ user: { id, email?, role }, ok: true }`. Role is from `admin_users` (e.g. `super_admin`, `admin`, `support`) or `'authenticated'` if not in `admin_users`. Response validated with `AuthMeResponseSchema` before send. |

## Contracts (packages/shared)

- **AdminRoleEnum** — Zod enum of canonical admin roles.
- **AuthMeUserSchema** / **AuthMeResponseSchema** — GET /me response shape; `role` is `AdminRole | 'authenticated'`.
- **AuthRole** (in api): `AdminRole | 'authenticated'` for typed `AuthUser.role` in `apps/api/src/auth.ts`.

## Routes / screens

- **Login**: Supabase Auth (email/password); may use a dedicated login route that redirects to dashboard after success.
- **Protected routes**: Use `beforeLoad` or equivalent to call GET /me; redirect to login if 401.

## ViewModels / services

- Session check and GET /me are typically invoked from a root layout or auth context; the response drives role-based UI (e.g. hide Finance approve for `support`).

## Special rules

- **RBAC**: Server-only. API enforces `requireAdminRole([...])` per route; e.g. finance approve/reject requires `super_admin`/`admin`.
- **No client-side role trust**: UI may show/hide actions for UX, but the API must reject unauthorized requests (401/403).
- **admin_users**: Defined in `supabase/migrations/20260302120000_admin_users.sql`; for production with shared DB, copy to sline_app. See **MIGRATIONS/README.md**.

## References

- **ADMIN_SECURITY_MANUAL.md** — Trust boundaries, RBAC, Service Role server-only.
- **ADMIN_DATABASE_REF.md** — `admin_users` table and RLS.
- **.TODO/APP_VERIFICATION_CHECKLIST_PAGE_04.md** — Verification steps for auth and GET /me.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
