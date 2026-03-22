# System Health — App Checklist & What We Did

Use this to verify the feature in the **running app** and to see what was added, removed, and changed.

---

## Checklist: What to Check in the Actual App

1. **Navigation**
   - [ ] Log in as admin (support / moderator / admin / super_admin).
   - [ ] Sidebar shows **“System Health”** and links to `/system-health`.
   - [ ] Click it; URL is `/system-health` and the page loads.

2. **Hero card (top)**
   - [ ] Title: **“System Health”** and subtitle about monitoring.
   - [ ] Buttons: **“Live (15s)”** and **“Refresh”**.
   - [ ] **“Live (15s)”** turns on 15s auto-refresh when toggled; **“Refresh”** reloads once.
   - [ ] Status strip: either **“All Systems Operational”** (green) or **“Partial Degradation — X operational, Y degraded, Z maintenance.”**
   - [ ] **Overall uptime %** shown (e.g. 99.93%).

3. **KPI cards (4 cards in a row)**
   - [ ] **Uptime (30D)** with % and small sparkline.
   - [ ] **Avg Latency** with ms and sparkline.
   - [ ] **Error Rate** with % and sparkline.
   - [ ] **Req/min** with number and sparkline.

4. **90-day uptime**
   - [ ] Section **“90-Day Uptime”** with a **bar chart** (green / amber / red by day).
   - [ ] Legend: Operational, Degraded, Outage.

5. **Service cards (12 cards)**
   - [ ] Section **“Service Status (12 services)”**.
   - [ ] **12 cards**, each with: icon, name, short description, status pill (operational / degraded / down / maintenance), Latency, Uptime %, “Checked” time, small sparkline.
   - [ ] Services listed: API Gateway, Auth Service, Booking Service, File Storage (S3), Cron Scheduler, CDN Edge Network, Database (Postgres), Payment Engine, Notification Service, Search Index (ES), Rate Limiter (Redis), Admin Panel.

6. **Loading & errors**
   - [ ] On first load you see a **skeleton** (no flash of wrong content).
   - [ ] If the API fails: **“Failed to load system health”** and a **Retry** button.

7. **Permissions**
   - [ ] With a non-allowed role (or logged out), calling `/api/v1/observability` returns **401** or **403** (no data).

---

## What We Did (Short Summary)

### Added

| What | Where | Why |
|------|--------|-----|
| **System Health page** | New route `/system-health`, sidebar link, `SystemHealthView` | Implement PAGE 14 (Figma): single screen for infrastructure status. |
| **Shared schemas** | `packages/shared`: `observability.ts` — status enum, service item, summary, KPIs, 90-day uptime, full response schema | One contract for API and frontend; validate API response. |
| **Observability API** | `apps/api`: `GET /api/v1/observability` — 12 services, summary, KPIs, 90-day | Backend provides data; RBAC (support/moderator/admin/super_admin); real checks for DB, Auth, Storage; rest mock/derived. |
| **ViewModel** | `useSystemHealth()` — fetch, loading/error/data, **Live (15s)** toggle, refetch | Keep UI dumb: all data and refresh logic in one hook. |
| **API client** | `observability_api.getObservability()` + appLogger | Single place for GET observability and logging. |
| **Logging** | API: Fastify route logger; UI: `SystemHealth:API`, `SystemHealth:VM`, `SystemHealth:View` | Debug and trace requests and errors. |
| **E2E tests** | `e2e/system-health.spec.ts` — mock auth + observability, assert hero, status, 12 cards | Regression safety for the page. |
| **Docs** | `system_health.md`, implementation status, orchestrator report, this checklist | Onboard and verify. |

### Removed

| What | Where | Why |
|------|--------|-----|
| **Nothing** | — | Feature is additive; no existing observability UI or route was replaced. |

### Modified

| What | Where | Why |
|------|--------|-----|
| **App routes** | `App.tsx` (or router config) | Register `/system-health` route. |
| **Sidebar** | `Sidebar.tsx` | Add “System Health” nav item. |
| **API app** | `apps/api/src/app.ts` | Register observability route. |
| **Shared index** | `packages/shared/src/index.ts` | Re-export observability schemas. |
| **E2E mock** | `system-health.spec.ts` — summary counts | Align mock summary (10 operational, 1 degraded, 1 maintenance) with mock service statuses so tests and UI match. |
| **Logs schema tests** | `packages/shared/src/schemas/logs.test.ts` | Fix two tests: (1) default `limit` is 10, not 20; (2) valid response must include `page`, `sourceOptions`, `summary`, `hourlyBuckets` and full log item fields so `LogListResponseSchema` / `LogListItemSchema` pass. |
| **Orchestrator report** | `ORCHESTRATOR_REPORT_System_Health.md` | Mark E2E as run and passing; note logs.test fixes and “missing items” as addressed. |

---

## One-Line Summary

**We added a read-only System Health page at `/system-health` (hero, 4 KPIs, 90-day chart, 12 service cards) with API, schemas, ViewModel, logging, E2E, and docs; fixed E2E mock and shared logs tests so all checks pass.**

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
