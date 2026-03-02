# Task activity (canonical audit feed)

> **Status**: v1 — Shipped (PAGE 02 canonical audit)  
> **Last Updated**: 2025-03-02

## Purpose

Shows an activity timeline for a single task: who did what and when. Used for accountability and support. Data comes from the canonical `audit_logs` table (no `admin_logs`). Only actions with `related_entity_type = 'task'` and `related_entity_id = <taskId>` are shown.

**Who it's for**: Admins and Super Admins (RBAC on the API).

---

## Routes / screens

- **Task detail** — Activity section or tab that lists audit entries for that task (e.g. force-cancel, status changes). Implemented in the task detail view; the feed is loaded via the activity API.

---

## API

| Method | Endpoint | Auth | Returns |
|--------|----------|------|---------|
| GET | `/api/v1/tasks/:id/activity` | Admin or Super Admin | `{ ok: true, data: TaskActivityItem[] }` |

**Response shape** (`packages/shared`): `TaskActivityResponseSchema` = array of `TaskActivityItemSchema`. Each item has: `id`, `actor_user_id`, `actor` (optional: `id`, `full_name`, `avatar_url`), `action`, `related_entity_type`, `related_entity_id`, `created_at`, `meta`.

---

## ViewModels / UI

- Task detail view (or dedicated Activity component) calls the API and displays the list. ViewModel holds loading state and the activity list; no direct DB access from the UI.

---

## Special rules

- **Audit source**: Only `audit_logs` with canonical columns. No `admin_logs`.
- **RBAC**: `requireAdminRole(['admin', 'super_admin'])` on the activity endpoint.
- **Mutations that create activity**: e.g. task force-cancel uses `withAudit` in the API so one new row is written to `audit_logs` with `related_entity_type = 'task'`. Finance approve/reject does **not** use `withAudit` (RPC writes the row).

---

## Related docs

- `ADMIN_SECURITY_MANUAL.md` — Canonical audit, atomic write.
- `ADMIN_DATABASE_REF.md` — `audit_logs`, `related_entity_type_enum` (includes `task`).
- `MIGRATIONS/for_sline_app/README.md` — Copyable migrations for app repo.
