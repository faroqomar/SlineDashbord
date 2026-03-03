# Master Report: PAGE 11 — Global Search

**Scope:** PAGE_11_Global_Search  
**Plan:** .TODO/PLAN_PAGE_11_Global_Search.md  
**Orchestrator:** Multi-Agent Coordinator (per .agent/workflows/orechestrator.md)  
**Date:** 2025-03-03

---

## A) Executive Summary

- **Scope reviewed:** PAGE 11 — Global Search (GET /api/v1/search, /search UI, shared schemas, discovery doc, runbook).
- **Overall risk level:** **LOW.** No BLOCKER from SecGuard or CodeWarden; QA PASS with recommendations.
- **Final decision:** **Ready** — No pipeline halt. Fix plan below is ordered optional and MED items.
- **Gate statuses:**
  - @AdminArchitect: APPROVED ✅  
  - @SysOp: No BLOCKER (MED: filter string safety)  
  - @SecGuard: APPROVED ✅  
  - @CodeWarden: APPROVED ✅  
  - @PerfOpt: No BLOCKER (optional: parallelize queries)  
  - @Modernizer: No new issues  
  - @QA: PASS ✅  
  - @DocKeeper: Optional feature doc  

---

## B) Consolidated Findings (Deduplicated)

### Security

| ID | Severity | Owner | Evidence | Finding | Fix |
|----|----------|--------|----------|---------|-----|
| S1 | MED | @SysOp / @SecGuard | Verified in dashboard code | Query `q` interpolated into PostgREST `.or()` filter; only % and _ escaped. Single quotes in `q` could break or abuse filter. | Sanitize `q` (strip or escape single quotes) or use parameterized filter. Path: apps/api/src/routes/search.ts. |

### Data Integrity / Schema Drift

- No schema drift. Contracts in packages/shared; API and UI use same schemas. **Verified in dashboard code.**

### Contracts / DTO Drift

- No contract drift. Request/response validated with shared Zod schemas. **Verified in dashboard code.**

### Architecture / MVVM

| ID | Severity | Owner | Evidence | Finding | Fix |
|----|----------|--------|----------|---------|-----|
| A1 | LOW | @CodeWarden | Verified in dashboard code | SearchScreen uses `to={item.link as any}` for TanStack Link. | Optional: use typed route path or router.navigate(link) to avoid `any`. Path: apps/admin-ui/src/features/search/view/SearchScreen.tsx. |

### Performance

| ID | Severity | Owner | Evidence | Finding | Fix |
|----|----------|--------|----------|---------|-----|
| P1 | LOW | @PerfOpt | Verified in dashboard code | Entity queries run sequentially (profiles → tasks → bookings → disputes → transactions). | Optional: run five Supabase calls in parallel (Promise.all) within same 8s timeout. Path: apps/api/src/routes/search.ts runSearch(). |

### Testing / QA

| ID | Severity | Owner | Evidence | Finding | Fix |
|----|----------|--------|----------|---------|-----|
| T1 | MED | @QA | Verified in dashboard code | 503 path (timeout/Supabase error) not tested. | Add test that mocks Supabase to throw or forces timeout; assert 503 and x-request-id. |
| T2 | MED | @QA | Verified in dashboard code | “All five entity types” not asserted with seed. | Optional: add fixture/seed so one query can return at least one of each type; assert each entityType appears. |

### Docs / Reference Integrity

| ID | Severity | Owner | Evidence | Finding | Fix |
|----|----------|--------|----------|---------|-----|
| D1 | LOW | @DocKeeper | — | No feature doc for Global Search. | Optional: add Docs/features/global-search.md; update ADMIN_FEATURES if applicable. |

---

## C) Fix Plan (Ordered, Step-by-Step)

| Step | Owner | What to change | Where | Verification |
|------|--------|----------------|-------|--------------|
| 1 | @SysOp | Sanitize search query `q`: remove or escape single quotes before interpolating into `.or()` filter. | apps/api/src/routes/search.ts | Unit or integration test: q containing `'` does not break or alter filter. |
| 2 | @QA | Add integration test: 503 on Supabase error or timeout (mock or force timeout). | apps/api/src/routes/search.test.ts | Test expects status 503 and error code SERVICE_UNAVAILABLE or INTERNAL_ERROR. |
| 3 | @SysOp | (Optional) Parallelize entity queries in runSearch() with Promise.all/Promise.allSettled; keep 8s total timeout. | apps/api/src/routes/search.ts | p95 runbook or manual: latency improves or unchanged. |
| 4 | @UIExpert | (Optional) Replace `to={item.link as any}` with typed path or programmatic navigate. | apps/admin-ui/src/features/search/view/SearchScreen.tsx | Typecheck passes without `any`. |
| 5 | @DocKeeper | (Optional) Create Docs/features/global-search.md; link from ADMIN_FEATURES. | Docs/ | Doc exists and is linked. |

---

## D) Regression Checklist

- **Auth:** Login, GET /auth/me, 401 on protected routes without cookie.  
- **Search:** GET /api/v1/search 401 without auth; 400 for q&lt;2 or limit&gt;50; 200 with admin; response shape.  
- **Other critical flows:** User list, task list, finance, disputes, bookings (existing tests).  

**Quick test steps:**  
1) Run `npm run -w packages/shared test` and `npm run -w apps/api test`.  
2) Open /search in UI; type 3+ chars; confirm loading then results or empty.  
3) Confirm no Supabase/server imports in apps/admin-ui/src/features/search.

---

## E) Rollback Notes

- **Contracts:** Revert packages/shared search schema and export; no breaking change to other features (search is isolated).  
- **API:** Remove or comment search route registration in app.ts; GET /api/v1/search returns 404.  
- **UI:** Remove /search route and nav link; optional 404 for /search.  
- **DB:** No migration in dashboard or app repo for PAGE 11; no DB rollback.  
- **Docs:** Revert Docs/PAGE_11_search_discovery.md and Docs/runbooks/search-p95.md if desired; no runtime impact.

---

## F) Next Actions (Immediate)

| # | Action | Owner |
|---|--------|--------|
| 1 | Harden search query: sanitize `q` (single quotes) in apps/api/src/routes/search.ts. | @SysOp |
| 2 | Add 503 integration test for search route. | @QA |
| 3 | (Optional) Parallelize entity queries in search handler. | @SysOp |
| 4 | (Optional) Add Docs/features/global-search.md. | @DocKeeper |
| 5 | Fix pre-existing admin-ui build (FinanceUsers route type) so full monorepo build passes. | @UIExpert / @AdminArchitect |

---

**Pipeline status:** Not blocked. All agents APPROVED or PASS with optional/MED follow-ups.  
**Single final truth:** This Master Report consolidates all agent reports; fix plan is ordered and owner-assigned.

*One agent at a time. One truth at the end.*
