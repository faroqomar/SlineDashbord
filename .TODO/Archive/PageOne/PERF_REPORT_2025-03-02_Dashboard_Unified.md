# Perf Opt Report — Dashboard_Unified (2025-03-02)

**Scope**: Dashboard_Unified  
**Plan**: .TODO/PLAN_2025-03-02_Dashboard_Unified.md  
**Evidence**: Verified in dashboard code (structure and patterns; no runtime profiling in this run)

---

## 1) Pagination Strategy

- **Dashboard overview**: Single GET `/dashboard/overview`; aggregates (counts, recent activity, revenue, user growth). No cursor/offset in scope. **Evidence**: dashboard route and dashboard_api.getOverview().
- **Lists (users, tasks, disputes, finance)**: API and UI use page/limit or similar; exact strategy (cursor vs offset) not verified per endpoint. **Recommendation**: Prefer cursor for large feeds (tasks, transactions) to avoid p95 degradation; document in API contracts.

---

## 2) N+1 Risk Flags

- **Tasks activity**: GET `tasks/:id/activity` fetches logs then fetches actor profiles by IDs (manual join). Two round-trips; acceptable for small activity list. **Evidence**: tasks.ts.
- **Dashboard**: Promise.all for multiple aggregates; single round-trip per metric. **No N+1 in dashboard route.**

---

## 3) Bundle Bloat Risks

- **Charts**: Dashboard uses Recharts (BarChart, AreaChart). **Evidence**: DashboardIndex.tsx. Recommend lazy-load chart components if dashboard is not always visible (route-level code split).
- **Heavy deps**: No audit of node_modules in this run. Recommendation: run bundle analyzer; keep route-based splitting (TanStack Router typically supports this).

---

## 4) Recommended Indexes / Queries (Tasks, Not Code)

- **audit_logs**: Ensure index on (related_entity_type, related_entity_id) and (created_at DESC) for activity and dashboard recent-activity queries (app repo).
- **admin_logs** (legacy): Will be removed; no new indexes.

---

## 5) Summary

- No critical performance blockers identified from structure. Pagination and indexing should be validated when moving to audit_logs and high-traffic lists. Bundle: consider lazy-loading charts.

---

**File**: .TODO/PERF_REPORT_2025-03-02_Dashboard_Unified.md
