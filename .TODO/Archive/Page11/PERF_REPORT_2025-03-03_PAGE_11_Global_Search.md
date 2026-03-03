# PerfOpt Report: PAGE 11 — Global Search

**Scope:** PAGE_11_Global_Search  
**Plan:** .TODO/PLAN_PAGE_11_Global_Search.md  

---

## 1. Pagination strategy

- **Verified in dashboard code:** Search returns a single batch (no cursor/offset). Request schema enforces `limit` max 50, default 20. No pagination on result set; acceptable for “top N per entity type” search.
- **Recommendation:** If result set grows, consider cursor or “load more” per entity type; not required for current gate (p95 < 500ms with limit 20).

---

## 2. N+1 risk

- **Verified in dashboard code:** API runs one query per entity type (profiles, tasks, bookings, disputes, vw_admin_journal_ledger). No per-item follow-up queries. No N+1.

---

## 3. Query shape and parallelism

- **Finding (LOW):** runSearch() executes five entity branches sequentially (await profiles, then tasks, then bookings, then disputes, then transactions). Total latency is sum of branch latencies.
- **Recommendation (task):** Run the five Supabase calls in parallel with Promise.all (or Promise.allSettled) and merge results; keep 8s overall timeout. Reduces p95 when multiple entity types are requested.

---

## 4. Indexes

- **Verified in dashboard code / Discovery:** Docs/PAGE_11_search_discovery.md documents “use existing indexes”; if p95 ≥ 500ms, add indexes in app repo. No new migration in dashboard.
- **Recommendation:** Ensure profiles(full_name, email), tasks(title), and journal view access have suitable indexes when scaling; per Discovery and runbook.

---

## 5. Bundle bloat

- **Verified in dashboard code:** Search feature imports only React, TanStack Router Link, shared types, and existing UI components (Card, Input, Button, Badge, Alert). No heavy new deps. API route uses existing Supabase client and shared schemas.

**Result:** No bundle bloat risk.

---

## 6. Timeout and limit

- **Verified in dashboard code:** API timeout 8s; UI timeout 10s; limit max 50. Bounded and consistent with plan.

---

## Summary

- No BLOCKER. Optional: parallelize entity queries in search route; add indexes if p95 fails (per runbook).

**File:** .TODO/PERF_REPORT_2025-03-03_PAGE_11_Global_Search.md
