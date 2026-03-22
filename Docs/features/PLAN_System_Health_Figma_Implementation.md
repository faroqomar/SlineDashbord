# Feature Plan: System Health — Figma Design Implementation (PAGE 14)

**Planner:** Strategic Planner per `.agent/workflows/planner.md`  
**Design refs:**  
- Figma node `2:38077` — System Health (overview + KPIs + 90-day uptime + service list start)  
- Figma node `2:39244` — System Health 2 (Service Status 12 services, two-column grid)  
- Figma node `2:40414` — System Health 3 (same Service Status layout)

---

## 0) Objective

**Done** means the `/system-health` page matches the Figma design with:

1. **Hero/overview card:** Title "System Health", subtitle "Real-time infrastructure monitoring & service status", **Live (15s)** toggle/label and **Refresh** button; **Partial Degradation** (or equivalent) alert with counts (e.g. "8 operational, 2 degraded, 1 maintenance"); **Overall uptime %** (e.g. 99.93%) on the right.
2. **Four KPI cards** in a row: **Uptime (30D)** (e.g. 99.93%, +0.02%, green sparkline), **Avg Latency** (e.g. 83ms, +3ms, cyan sparkline), **Error Rate** (e.g. 0.62%, +0.17%, red sparkline), **Req/min** (e.g. 9,100, +14%, purple sparkline). Each card: icon, label, value, delta, mini sparkline.
3. **90-Day Uptime** section: bar chart (one bar per day), legend: Operational (green), Degraded (yellow), Outage (red); axis "90 days ago" → "Today".
4. **Service Status (12 services):** Two-column grid of cards. Each card: **icon**, **name**, **short description**, **status pill** (Operational / Degraded / Maintenance) with colored dot, **Latency** (e.g. 10ms, color by health), **Uptime** (e.g. 99.08%), **Checked** (time e.g. 21:36:00), **mini sparkline**. Services from design: API Gateway, Auth Service, Booking Service, File Storage (S3), Cron Scheduler, CDN Edge Network, Database (Postgres), Payment Engine, Notification Service, Search Index (ES), Rate Limiter (Redis), Admin Panel.

All states: **loading** (skeleton), **error** (message + retry), **empty** (no services), and **success** with live/refresh behavior. E2E selectors preserved: `data-testid="system-health-status"`, `data-testid="system-health-services"`.

---

## 1) Current State (Evidence-labeled)

| Item | Evidence |
|------|----------|
| **Route** | [Verified in dashboard code] `/system-health` in TanStack Router; `SystemHealth.tsx` → `SystemHealthView`. Refs: `apps/admin-ui/src/App.tsx`, `apps/admin-ui/src/routes/SystemHealth.tsx`. |
| **View** | [Verified in dashboard code] `SystemHealthView.tsx`: single overall status card + simple services list (name, status dot, latency, lastChecked). No hero with Live/Refresh/partial degradation/overall uptime; no KPI row; no 90-day chart; no per-service description, uptime %, or sparklines. Refs: `apps/admin-ui/src/features/system-health/views/SystemHealthView.tsx`. |
| **ViewModel** | [Verified in dashboard code] `useSystemHealth.ts`: TanStack Query, `observabilityApi.getObservability()`, refetchInterval 30000. No live-interval option (e.g. 15s). Refs: `apps/admin-ui/src/features/system-health/viewmodels/useSystemHealth.ts`. |
| **API client** | [Verified in dashboard code] `observability_api.ts`: GET `/observability` → `ObservabilityData`. Refs: `apps/admin-ui/src/features/system-health/services/observability_api.ts`. |
| **API** | [Verified in dashboard code] `GET /api/v1/observability` in Fastify; returns `data: { services, rpcStatus, queueStatus, errorRates }`. Services: `name`, `status`, `latencyMs`, `lastChecked` only. No aggregate KPIs, no 90-day history, no per-service uptime % or sparkline data. Refs: `apps/api/src/routes/observability.ts`, `apps/api/src/app.ts`. |
| **Shared schema** | [Verified in dashboard code] `ServiceStatusSchema`: name, status (`operational` \| `degraded` \| `down`), latencyMs, lastChecked. No `maintenance`; no uptimePct; no sparkline/trend. No schema for aggregate KPIs or 90-day uptime. Refs: `packages/shared/src/schemas/observability.ts`. |
| **Sidebar** | [Verified in dashboard code] "System Health" → `/system-health` in Sidebar. Refs: `apps/admin-ui/src/components/layout/Sidebar.tsx`. |

**Gaps:**

- **Contracts:** Aggregate KPIs (uptime 30d, avg latency, error rate, req/min) with optional deltas and sparkline arrays; 90-day uptime (array of daily status); per-service optional `description`, `uptimePct`, `sparkline` (or trend array); status enum extended with `maintenance`.
- **API:** Observability response must expose (or be extended with) summary KPIs, 90-day daily status array, and per-service metadata (description, uptime %, trend) — or UI uses fixed service list + mock/derived data for sparklines and 90-day until backend provides them.
- **UI:** Full page layout per Figma: hero card, 4 KPI cards with sparklines, 90-day bar chart, 12 service cards with icons, descriptions, status pills, Latency/Uptime/Checked, sparklines; Live (15s) and Refresh.

---

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Preconditions / Build stabilization

- [ ] **Step 0.1** (@DevOps): Ensure `npm run build` and `npm run typecheck -w @sline/admin-ui` and `-w @sline/api` and `-w @sline/shared` pass. Fix any pre-existing type/build failures in the system-health or observability code paths.  
  **Verification (@QA):** `npm run build` from repo root succeeds.

### Phase 1: Contracts (Shared)

- [ ] **Step 1.1** (@SysOp): Extend `packages/shared/src/schemas/observability.ts`:  
  - Add `'maintenance'` to service status enum (e.g. `ServiceStatusEnum`).  
  - Add optional fields to service item: `description?: z.string()`, `uptimePct?: z.number().min(0).max(100)`, `sparkline?: z.array(z.number())` (or trend data array).  
  - Define **aggregate KPIs schema**: e.g. `SystemHealthKpisSchema` with `uptime30d`, `uptime30dDelta`, `avgLatencyMs`, `avgLatencyDeltaMs`, `errorRatePct`, `errorRateDeltaPct`, `requestsPerMin`, `requestsPerMinDelta`, and optional `sparklines` per KPI (arrays of numbers).  
  - Define **90-day uptime schema**: e.g. `UptimeDaySchema = z.object({ date: z.string(), status: z.enum(['operational','degraded','outage']) })`, `Uptime90DaySchema = z.array(UptimeDaySchema)`.  
  - Extend observability response `data` with optional `summary?: { overallUptimePct, operationalCount, degradedCount, maintenanceCount }`, `kpis?: KpisType`, `uptime90Day?: z.array(...)`.  
  Keep backward compatibility: existing clients still work when new fields are absent.  
  **Verification (@QA):** Existing `ObservabilityResponseSchema` and `observability.test.ts` still pass; new fields parse when present.

- [ ] **Step 1.2** (@SysOp): Export new types/schemas from `packages/shared/src/index.ts`.  
  **Verification (@QA):** `import { ... } from '@sline/shared'` resolves new symbols.

### Phase 2: Backend / API

- [ ] **Step 2.1** (@SysOp): In `apps/api/src/routes/observability.ts`, extend the GET handler to:  
  - Add a **fixed list of 12 services** (API Gateway, Auth Service, Booking Service, File Storage (S3), Cron Scheduler, CDN Edge Network, Database (Postgres), Payment Engine, Notification Service, Search Index (ES), Rate Limiter (Redis), Admin Panel) with short **descriptions** from Figma; map current DB/Auth/Storage checks to the corresponding entries; for services without real checks, return `maintenance` or derived status and optional mock latency/uptime so the UI can render 12 cards.  
  **Verification (@QA):** Response includes 12 services with names and descriptions; existing 3 checks still map correctly.

- [ ] **Step 2.2** (@SysOp): Add **summary** to response: compute `overallUptimePct` (e.g. average of per-service uptime or single DB uptime), `operationalCount`, `degradedCount`, `maintenanceCount` from the 12-service list.  
  **Verification (@QA):** `data.summary` present; counts sum to 12.

- [ ] **Step 2.3** (@SysOp): Add **kpis** to response: either compute from real data (e.g. avg latency from services, error rate from existing errorRates) or return stable mock values for `uptime30d`, `avgLatencyMs`, `errorRatePct`, `requestsPerMin` with deltas and sparkline arrays (e.g. 7 points per KPI). Document that KPIs are mock/derived until real metrics exist.  
  **Verification (@QA):** `data.kpis` present; schema validation passes.

- [ ] **Step 2.4** (@SysOp): Add **uptime90Day** to response: array of 90 days with `date` and `status` (operational | degraded | outage). Initially can be derived from a single status or mock (e.g. mostly operational, few degraded/outage for demo).  
  **Verification (@QA):** `data.uptime90Day` length 90; schema validation passes.

- [ ] **Step 2.5** (@SysOp): For each service in the 12-list, add optional `uptimePct` and `sparkline` (e.g. 6–7 points) from real data or mock, so UI can render per-service sparklines and uptime.  
  **Verification (@QA):** Each service has uptimePct and sparkline when schema expects them; response still validates.

- [ ] **Step 2.6** (@SysOp): Ensure RBAC unchanged: `requireAdminRole(['support','moderator','admin','super_admin'])`; no audit writes (read-only).  
  **Verification (@SecGuard):** No new mutation; no sensitive data in response.

### Phase 3: ViewModels

- [ ] **Step 3.1** (@AdminArchitect): In `useSystemHealth.ts`, expose:  
  - `liveInterval: number | false` (e.g. 15000 for "Live (15s)" or false for off).  
  - `setLiveInterval(value: number | false)`.  
  - Use `refetchInterval: liveInterval || false` in TanStack Query (when live is on, poll every 15s).  
  **Verification (@CodeWarden):** VM remains client-only; no DB/API calls from VM, only via `observabilityApi`.

- [ ] **Step 3.2** (@AdminArchitect): Expose in VM: `data.summary`, `data.kpis`, `data.uptime90Day`, and per-service `description`, `uptimePct`, `sparkline` for the view. Handle missing optional fields (backward compat).  
  **Verification (@CodeWarden):** MVVM purity; view only reads from VM state/actions.

### Phase 4: UI

- [ ] **Step 4.1** (@UIExpert): **Hero/overview card** in `SystemHealthView.tsx`:  
  - Title "System Health", subtitle "Real-time infrastructure monitoring & service status".  
  - Right side: "Live (15s)" control (toggle or badge that reflects polling every 15s when enabled) and "Refresh" button (calls refetch).  
  - Alert strip: e.g. "Partial Degradation" with "X operational, Y degraded, Z maintenance" from `data.summary`; if all operational, show "All Systems Operational" or similar.  
  - Far right: "Overall uptime" percentage from `data.summary.overallUptimePct`.  
  Use existing `Card`/layout; match Figma spacing and typography.  
  **Verification (@QA):** Manual check: hero matches Figma; Live and Refresh work.

- [ ] **Step 4.2** (@UIExpert): **Four KPI cards** in a responsive grid (one row on desktop):  
  - Uptime (30D): value, delta (e.g. +0.02%), green-tinted sparkline; icon (e.g. RefreshCw or Activity).  
  - Avg Latency: value (e.g. 83ms), delta (e.g. +3ms), cyan sparkline; icon (e.g. Gauge).  
  - Error Rate: value (e.g. 0.62%), delta (e.g. +0.17%), red sparkline; icon (e.g. Flame).  
  - Req/min: value (e.g. 9,100), delta (e.g. +14%), purple sparkline; icon (e.g. Zap).  
  Reuse existing sparkline pattern (e.g. `MiniSparkline` / polyline or small Recharts area) from Bookings/Dashboard. Data from `data.kpis`.  
  **Verification (@QA):** Four cards render with correct labels and sparklines; loading skeleton for KPIs when loading.

- [ ] **Step 4.3** (@UIExpert): **90-Day Uptime** section:  
  - Title "90-Day Uptime".  
  - Bar chart: 90 bars (one per day); color by status (operational = green, degraded = yellow, outage = red). Use Recharts `BarChart` (or similar) with `data.uptime90Day`; axis labels "90 days ago" and "Today".  
  - Legend: Operational (green), Degraded (yellow), Outage (red).  
  **Verification (@QA):** Chart renders 90 bars; legend and axis match Figma.

- [ ] **Step 4.4** (@UIExpert): **Service Status (12 services)** section:  
  - Title "Service Status (12 services)".  
  - Two-column grid of cards. Each card:  
    - Icon (per-service: Globe, Database, Lock, Calendar, Cloud, Server, CreditCard, HardDrive, Clock, Globe, Search, Bell, Cpu, Settings — map from design).  
    - Name (e.g. "API Gateway", "Database (Postgres)").  
    - Description (from API or local map).  
    - Status pill: Operational (green), Degraded (yellow/amber), Maintenance (purple) with small status dot.  
    - Metrics row: Latency (e.g. 10ms; color green/orange/red by threshold), Uptime (e.g. 99.08%), Checked (time from lastChecked).  
    - Mini sparkline (per-service sparkline from API or derived).  
  Preserve `data-testid="system-health-services"` on the container and `data-testid="system-health-status"` on the overview/hero status area.  
  **Verification (@QA):** 12 cards render; status and colors match design; loading/error/empty states still work.

- [ ] **Step 4.5** (@UIExpert): Loading: skeleton for hero, KPI row, 90-day chart, and service grid. Error: existing error card + retry. Empty: message when no services.  
  **Verification (@QA):** Smoke test loading, error, empty, success.

- [ ] **Step 4.6** (@MotionMaster, optional): Subtle entrance or refresh animation for cards/chart if it fits project motion guidelines.  
  **Verification (@QA):** No regression in layout or performance.

### Phase 5: Testing

- [ ] **Step 5.1** (@QA): Supertest: GET `/api/v1/observability` with 401 (no cookie), 403 (wrong role), 200 with body matching extended schema; validate new fields when present.  
  **Verification:** `apps/api/src/routes/observability.test.ts` updated and passing.

- [ ] **Step 5.2** (@QA): Playwright: login as admin, navigate to `/system-health`, assert presence of `data-testid="system-health-status"` and `data-testid="system-health-services"`; optionally assert "System Health" title, "Service Status" and number of service cards (12).  
  **Verification:** E2E spec in `apps/admin-ui/e2e` (or existing system-health spec) passes.

- [ ] **Step 5.3** (@DataSmith, optional): If list/table scale tests are needed, provide mock observability response (12 services, 90-day array, KPIs) in fixtures.  
  **Verification:** Fixture used in tests; no production impact.

---

## 3) Gate Checks (Must-Pass)

| Gate | Criteria |
|------|----------|
| **Build Gate** | `npm run build` (root) and typecheck for admin-ui, api, shared pass. |
| **Contracts Gate** | `ObservabilityResponseSchema` and new observability types/schemas in shared; backward compatible; tests pass. |
| **Security Gate** | Observability route read-only; RBAC unchanged; no audit writes; no sensitive internals in response. |
| **API Gate** | GET `/api/v1/observability` returns 12 services with descriptions, summary, kpis, uptime90Day, per-service uptime/sparkline (or documented mock); response validates. |
| **UI Gate** | `/system-health` shows hero, 4 KPIs with sparklines, 90-day chart, 12 service cards per Figma; Live (15s) and Refresh work; loading/error/empty handled; data-testids present. |
| **QA Gate** | Observability API tests (401/403/200 + schema); Playwright system-health flow passes. |

---

## 4) Risks & Mitigations

| Risk | Mitigation | Detection |
|------|------------|-----------|
| **Backend doesn’t have real 90-day or per-service uptime** | Ship with mock/derived data in API; document in code/docs; add TODO for real metrics later. | Code review; Docs/features/system_health.md updated. |
| **Figma “12 services” doesn’t match actual checks** | Fixed 12-service list in API; map DB/Auth/Storage (and any future checks) to that list; others can be maintenance or derived. | API test asserts 12 services and descriptions. |
| **Live 15s polling too aggressive** | Make Live optional (user turns on); keep default refetch 30s or off; rate limit on API if needed. | QA checks network tab; no excessive 401/403. |
| **Chart/sparkline lib regression** | Reuse existing Recharts and sparkline patterns (Bookings, Dashboard); no new deps. | Build and visual smoke test. |
| **Schema drift (new fields break old clients)** | All new fields optional; existing ObservabilityResponseSchema shape unchanged for existing keys. | Shared schema tests; API returns valid payload for old and new clients. |

---

## 5) Definition of Done (DoD)

- [ ] **Contracts:** Observability schema extends with optional summary, kpis, uptime90Day, and per-service description, uptimePct, sparkline; status includes `maintenance`; shared build and tests pass.
- [ ] **API:** GET `/api/v1/observability` returns 12 named services with descriptions; summary (overall uptime, counts); kpis (uptime30d, avgLatency, errorRate, req/min) with deltas and sparklines; uptime90Day (90 entries); per-service uptime and sparkline; RBAC and security unchanged.
- [ ] **ViewModel:** useSystemHealth exposes summary, kpis, uptime90Day, per-service extras; supports Live (15s) interval toggle and Refresh; MVVM preserved.
- [ ] **UI:** System Health page matches Figma: hero (title, subtitle, Live, Refresh, degradation alert, overall uptime), 4 KPI cards with sparklines, 90-day uptime bar chart with legend, 12 service cards with icon, name, description, status pill, Latency/Uptime/Checked, sparkline; loading/error/empty; data-testid="system-health-status" and data-testid="system-health-services" present.
- [ ] **Tests:** Observability route tests updated and passing; Playwright system-health E2E passes.
- [ ] **Docs:** `Docs/features/system_health.md` updated to describe new response shape and UI sections (hero, KPIs, 90-day, 12 services).

---

*Plan produced per `.agent/workflows/planner.md`. No code produced; execution to be done by assigned agents.*
