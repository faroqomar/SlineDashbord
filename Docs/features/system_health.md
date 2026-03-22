# System Health (Observability) — PAGE 14

## Purpose

Live monitoring of backend service status (12 services), aggregate KPIs, 90-day uptime history, and per-service metrics for support and ops. For admins with **support**, **moderator**, **admin**, or **super_admin** roles. Read-only; no mutations or audit writes.

---

## Routes / screens

- **Route:** `/system-health` (TanStack Router under auth layout).
- **Route file:** `apps/admin-ui/src/routes/SystemHealth.tsx` (thin shell).
- **View:** `apps/admin-ui/src/features/system-health/views/SystemHealthView.tsx` — hero card (title, Live 15s, Refresh, partial degradation alert, overall uptime %), four KPI cards (Uptime 30D, Avg Latency, Error Rate, Req/min) with sparklines, 90-day uptime bar chart, 12 service cards (icon, name, description, status pill, Latency, Uptime, Checked, sparkline). Loading skeleton, error + retry, empty state.
- **Sidebar:** "System Health" links to `/system-health`.

---

## API

- **Endpoint:** `GET /api/v1/observability`
- **Auth:** Cookie/session; 401 if unauthenticated.
- **RBAC:** Allowed roles: `support`, `moderator`, `admin`, `super_admin`. 403 for other roles.
- **Response:** `ObservabilityResponseSchema` from `packages/shared`. `data` includes:
  - **services** (array of 12): `name`, `status` (operational | degraded | down | maintenance), `latencyMs`, `lastChecked`, optional `description`, `uptimePct`, `sparkline`.
  - **summary** (optional): `overallUptimePct`, `operationalCount`, `degradedCount`, `maintenanceCount`.
  - **kpis** (optional): `uptime30d`, `uptime30dDelta`, `avgLatencyMs`, `avgLatencyDeltaMs`, `errorRatePct`, `errorRateDeltaPct`, `requestsPerMin`, `requestsPerMinDelta`, optional sparkline arrays.
  - **uptime90Day** (optional): array of 90 `{ date, status: operational | degraded | outage }`.
  - **rpcStatus**, **queueStatus** (e.g. `not_implemented`), **errorRates** (last1h / last24h).
- **No mutation:** Idempotency and audit are N/A; read-only.

---

## Data sources (mock vs real)

| Field | Source | Notes |
|-------|--------|------|
| **services** | Real for Database (Postgres), Auth Service, File Storage (S3); others maintenance/derived | DB check via `admin_users`; Auth via Supabase Auth API; Storage via `listBuckets`. Remaining 9 services have mock/derived status and metrics. |
| **summary** | Derived | Computed from 12-service list (counts); overallUptimePct from per-service uptime or average. |
| **kpis** | **Mock** until metrics pipeline | uptime30d, avgLatencyMs, errorRatePct, requestsPerMin and deltas/sparklines are mock or derived from current response. |
| **uptime90Day** | **Mock/derived** | 90 days; mostly operational, some degraded/outage for demo. Replace with real history store when available. |
| **per-service uptimePct / sparkline** | Derived or mock | Real checks get derived uptime; others get stable mock values. |

---

## ViewModels

- **Hook:** `useSystemHealth()` in `apps/admin-ui/src/features/system-health/viewmodels/useSystemHealth.ts`.
- **Exposes:** `loading`, `error`, `data` (observability payload with summary, kpis, uptime90Day, per-service fields), `refetch`, `liveInterval`, `setLiveInterval`, `liveIntervalMs` (15000). Default `liveInterval` is `false` (no auto-refresh); user can enable "Live (15s)" for polling every 15s.
- **API client:** `apps/admin-ui/src/features/system-health/services/observability_api.ts` — single `GET /observability` via central `request()`. Uses appLogger for request/success/error.

---

## Logging

- **API:** Fastify `log.child({ route: 'observability' })` — request start, validation failure (warn), success (info with counts), error (error).
- **Admin UI:** `createScopedLogger('SystemHealth:API')` in API client; `SystemHealth:VM` in ViewModel; `SystemHealth:View` in View. Debug/info for fetch, live toggle, render state; error on fetch failure.

---

## Special rules

- **RBAC:** Enforced in API only; UI may show/hide the nav item by role for UX, but the API must enforce.
- **No audit:** This feature does not write to `audit_logs`; it only reads `audit_logs` for optional error counts.
- **Security:** API must not return raw error messages or internal details on 500; generic "An error occurred" with full error logged server-side only.

---

## E2E selectors

- `data-testid="system-health-hero"` — hero card container.
- `data-testid="system-health-status"` — status alert (Partial Degradation / All Operational).
- `data-testid="system-health-kpis"` — container for four KPI cards.
- `data-testid="system-health-kpi-uptime"`, `-latency`, `-error`, `-reqmin` — individual KPI cards.
- `data-testid="system-health-services"` — service list container.
- `data-testid="system-health-service-card"` — each of the 12 service cards.

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
