# System Health (Observability) — PAGE 14

## Purpose

Live monitoring of backend service status (Database, Auth, Storage) and optional error-rate summary for support and ops. For admins with **support**, **moderator**, **admin**, or **super_admin** roles. Read-only; no mutations or audit writes.

---

## Routes / screens

- **Route:** `/system-health` (TanStack Router under auth layout).
- **Route file:** `apps/admin-ui/src/routes/SystemHealth.tsx` (thin shell).
- **View:** `apps/admin-ui/src/features/system-health/views/SystemHealthView.tsx` — status card, services list, optional queue/error cards, loading skeleton, error + retry.
- **Sidebar:** "System Health" links to `/system-health`.

---

## API

- **Endpoint:** `GET /api/v1/observability`
- **Auth:** Cookie/session; 401 if unauthenticated.
- **RBAC:** Allowed roles: `support`, `moderator`, `admin`, `super_admin`. 403 for other roles.
- **Response:** `ObservabilityResponseSchema` from `packages/shared` — `data.services` (array of `{ name, status, latencyMs, lastChecked }`), optional `rpcStatus`, `queueStatus` (currently `not_implemented`), optional `errorRates` (last1h / last24h from audit_logs fail-like actions).
- **No mutation:** Idempotency and audit are N/A; this is read-only.

---

## ViewModels

- **Hook:** `useSystemHealth()` in `apps/admin-ui/src/features/system-health/viewmodels/useSystemHealth.ts`.
- **Exposes:** `loading`, `error`, `data` (observability payload), `refetch()`.
- **API client:** `apps/admin-ui/src/features/system-health/services/observability_api.ts` — single `GET /observability` via central `request()`.

---

## Special rules

- **RBAC:** Enforced in API only; UI may show/hide the nav item by role for UX, but the API must enforce.
- **No audit:** This feature does not write to `audit_logs`; it only reads `audit_logs` for optional error counts.
- **Security:** API must not return raw error messages or internal details on 500; generic "An error occurred" with full error logged server-side only.

---

## DB / migrations

- **No migration** for PAGE 14. Dashboard API and UI only.
- **Read-only usage:**
  - **admin_users:** Used for RBAC (role resolution) and for a neutral DB connectivity check (single row read from `admin_users`).
  - **Auth / Storage:** API performs health checks via Supabase client (no dedicated table).
  - **audit_logs:** Optional read for `errorRates` — count of rows where `action ILIKE '%fail%'` in last 1h and 24h; zeros if not implemented.

See **MIGRATIONS/README.md** (PAGE 14 — Observability / System Health) and **Docs/ADMIN_DATABASE_REF.md** for DB object list.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
