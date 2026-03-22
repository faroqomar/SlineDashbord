# Orchestrator Report — System Health (PAGE 14)

**Workflow:** `.agent/workflows/orchestrator.md`  
**Scope:** System Health Figma implementation (observability API, shared schemas, ViewModel, View, E2E, docs)  
**Date:** 2026-03-15

---

## 1. Scope Collection

### Feature / page scope and impacted files

| Area | Files |
|------|--------|
| **Shared contracts** | `packages/shared/src/schemas/observability.ts`, `observability.test.ts`, `packages/shared/src/index.ts` (re-exports) |
| **API** | `apps/api/src/routes/observability.ts`, `observability.test.ts`; `apps/api/src/app.ts` (route registration) |
| **Admin UI** | `apps/admin-ui/src/features/system-health/viewmodels/useSystemHealth.ts`, `services/observability_api.ts`, `views/SystemHealthView.tsx`; `apps/admin-ui/src/routes/SystemHealth.tsx`, `App.tsx`, `Sidebar.tsx` |
| **Tests** | `packages/shared/src/schemas/observability.test.ts`, `apps/api/src/routes/observability.test.ts`, `apps/admin-ui/e2e/system-health.spec.ts` |
| **Docs** | `Docs/features/system_health.md`, `Docs/features/SYSTEM_HEALTH_IMPLEMENTATION_STATUS.md`, `Docs/features/PLAN_*.md` |

### Verification commands and outcomes

| Command | Outcome |
|---------|---------|
| `npm run build` | ✅ Pass (shared, api, admin-ui) |
| `npm run lint` (turbo typecheck) | ✅ Pass (shared, api, admin-ui) |
| `packages/shared`: `npm run test -- observability` | ✅ 13 tests passed |
| `apps/api`: `npm run test -- observability` | ✅ 4 tests passed |
| E2E `system-health.spec.ts` | ✅ Pass (2 tests); run via `playwright test e2e/system-health.spec.ts` |

---

## 2. Integrity Audit

### Real vs mock wiring

- **API:** Documented in route file and in `Docs/features/system_health.md`. Database, Auth, Storage are real checks; other 9 services are maintenance/derived with mock latency and uptime. Summary is derived from 12 services; KPIs and 90-day uptime are mock/derived until a metrics pipeline exists.
- **Frontend:** Consumes `ObservabilityResponse['data']`; no direct backend or DB access. All data from `GET /api/v1/observability` via `observabilityApi.getObservability()`.

### API contracts and frontend consistency

- **Shared:** `ObservabilityResponseSchema` defines `data.services`, `data.summary`, `data.kpis`, `data.uptime90Day` (all optional except `services`). Backward compatible (minimal payload with only `services` still valid).
- **API:** Builds full payload and validates with `ObservabilityResponseSchema.safeParse()` before sending; returns 500 with generic message on validation failure.
- **Admin UI:** View uses `data?.services`, `data?.summary`, `data?.kpis`, `data?.uptime90Day` with fallbacks (e.g. `?? []`, `?? 0`). Types align with `ObservabilityData` from shared.

### Build / typecheck / lint / test

- Build: ✅  
- Typecheck: ✅  
- Shared observability tests: ✅  
- API observability tests: ✅  
- E2E: Suite present; not executed in this audit (no blocker).

### Regressions and design parity gaps

- **No regressions** in touched areas. Previously failing `packages/shared` tests in `logs.test.ts` have been fixed (limit default 10, full LogListResponse shape).
- **Design parity:** Hero, status strip, four KPIs with sparklines, 90-day chart, 12 service cards with descriptions and status pills are implemented per Plan Critic. No open Figma parity gaps flagged.

---

## 3. Risk Audit

### Security (auth / RBAC, privilege scope, exposed internals)

- **Auth:** Observability route is behind Fastify; admin-ui uses `request()` with `withCredentials: true`, so cookies are sent. 401 handled by auth middleware.
- **RBAC:** `requireAdminRole(['support', 'moderator', 'admin', 'super_admin'])` on `GET /observability`. Read-only; no mutations.
- **Exposed internals:** On 500, API returns `failure('INTERNAL_ERROR', 'An error occurred')`; no raw errors or table names in response. Route comment states "No raw error messages or internal table/RPC names in response" — satisfied.
- **Service role:** Used only in API route (server-side) for Supabase checks; not exposed to client.

### Data correctness (aggregation, fallbacks, edge cases)

- **Summary:** `operationalCount` / `degradedCount` / `maintenanceCount` derived from `services` array; `overallUptimePct` from per-service `uptimePct` average. Consistent.
- **Error rates:** From `audit_logs` count with `action ILIKE '%fail%'`; fallback to `{ last1h: 0, last24h: 0 }` on error.
- **Edge cases:** Empty services list would yield `overallUptimePct` 99.93 (fallback in code). Schema allows optional summary/kpis/uptime90Day; View handles missing data with fallbacks and optional rendering.

### Build stability (failing checks, deps, generated files)

- No failing checks in System Health code paths.
- No new dependency issues.
- Turbo cache warnings for typecheck outputs are pre-existing (outputs key), not introduced by this feature.

---

## 4. Output

### Master report summary

| Item | Status |
|------|--------|
| **Changes** | Shared observability schemas (incl. summary, kpis, uptime90Day); API route with 12 services, real DB/Auth/Storage checks, schema validation, Fastify logging; ViewModel with liveInterval and appLogger; View with hero, KPIs, chart, 12 cards and appLogger; observability_api appLogger; E2E with mock auth + observability; docs updated. |
| **Risks** | None critical. KPIs and 90-day data are mock until metrics pipeline — documented. |
| **Missing / optional** | All addressed: E2E mock summary set to 10/1/1; E2E run and passing; shared `logs.test.ts` fixed (limit 10, full response shape). |

### Blockers

- **None.** No actionable blockers for release of System Health (PAGE 14).

### Final readiness status

**Ready**

- Critical and major issues: none.
- Verification: build and typecheck pass; shared and API observability tests pass.
- Security: RBAC enforced, no internals exposed, service role server-only.
- Integrity: real vs mock documented; API and frontend contracts aligned; View uses VM only, no direct DB/API.

**Post-audit fixes (completed):** (1) E2E mock summary counts aligned to 10 operational, 1 degraded, 1 maintenance; (2) shared `logs.test.ts` updated — default limit expectation 10 (per `LogListQuerySchema`), valid response test updated to include `page`, `sourceOptions`, `summary`, `hourlyBuckets` and log item fields `level`, `source`, `message`, `eventCode`, `requestId`, `href` per `LogListItemSchema`/`LogListResponseSchema`; (3) E2E system-health run and passing (2 tests). Shared test suite: 198 tests passing.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
