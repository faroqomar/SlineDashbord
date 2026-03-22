# SLine Admin Dashboard - Feature Matrix (Current)

This file tracks current implemented/admin-facing capabilities for the Vite + TanStack + Fastify stack.

## 1) Auth and Role Guard

- Implemented:
  - Login route and session-based auth checks.
  - Route-level auth guard via TanStack route auth context.
  - Server-side RBAC enforcement in Fastify middleware (`requireAdminRole`).

## 2) Dashboard (`/`)

- Implemented:
  - KPI cards (users, revenue, active jobs, open disputes).
  - Platform pulse strip (reports, cases, tasks, disputes, bookings today, system status).
  - Revenue and user growth chart sections.
  - Recent activity feed.
- API:
  - `GET /api/v1/dashboard/overview`
- Reference:
  - `Docs/features/dashboard-overview.md`

## 3) Users (`/users`)

- Implemented:
  - Searchable and paginated users table.
  - Server-backed status tabs (`all`, `active`, `inactive`) with tab counts.
  - KPI counts and invite user flow.
  - Row actions menu with profile/investigation/moderation actions.
- API:
  - `GET /api/v1/users`
  - `POST /api/v1/team/invite`
- Reference:
  - `Docs/features/users.md`

## 4) User Profile (`/users/$userId`)

- Implemented:
  - Profile facts and identity sections.
  - Moderation actions (suspend/ban/unban/force logout).
  - Tenders/assignments block.
  - Bookings overview block.
  - Wallet situation block.
- API:
  - `GET /api/v1/users/:userId`
  - `GET /api/v1/users/:userId/investigation`
  - `GET /api/v1/finance/users/:userId`
  - `POST /api/v1/users/:userId/suspend|ban|unban|force-logout`
- Reference:
  - `Docs/features/users.md`
  - `Docs/features/user-investigation.md`

## 5) Global Search (`/search`)

- Implemented:
  - Cross-entity search results.
  - KPI insights panel and modular search UI components.
  - Entity-aware row rendering and navigation.
- API:
  - `GET /api/v1/search`
  - `GET /api/v1/search/insights`
- Reference:
  - `Docs/features/global-search.md`

## 6) Logs (`/logs`)

- Implemented:
  - Filterable and paginated logs table over canonical `audit_logs`.
  - Filters by action, actor, from/to date.
- API:
  - `GET /api/v1/logs`
- Reference:
  - `Docs/features/logs.md`

## 7) System Health (`/system-health`)

- Implemented:
  - Hero card (title, Live 15s toggle, Refresh, status strip, overall uptime %).
  - Four KPI cards (Uptime 30D, Avg Latency, Error Rate, Req/min) with sparklines.
  - 90-day uptime bar chart (operational/degraded/outage).
  - 12 service cards (icon, name, description, status pill, latency, uptime %, checked time, sparkline).
  - Loading skeleton and error state with Retry.
- API:
  - `GET /api/v1/observability` (RBAC: support, moderator, admin, super_admin; read-only).
- Reference:
  - `Docs/features/system_health.md`

## 8) Other Admin Domains

For disputes, cases, chat moderation, reports, finance, settings, bookings, and system health, see the feature docs index:
- `Docs/features/README.md`

## Notes

- This matrix tracks current behavior only. Planned/future capability should be tracked in `.TODO/` plans and not presented as shipped here.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
