# PerfOpt Report — PAGE 08 Cases Domain

**Scope:** PAGE_08_Cases  
**Date:** 2025-03-02  
**Agent:** @PerfOpt

---

## 1) Pagination strategy

| Area | Evidence | Finding |
|------|----------|---------|
| GET /cases | Verified in dashboard code | Uses `.range(from, to)` (offset). Limit capped at 100; default 10. |
| Recommendation | — | For large case lists, cursor-based pagination preferred (project rule). Current offset acceptable for PAGE 08; add task to consider cursor in future if list grows. |

**Verdict:** Offset pagination; acceptable for initial scope. No blocker.

---

## 2) N+1 risk

| Flow | Evidence | Finding |
|------|----------|---------|
| GET /cases | Verified in dashboard code | Single query admin_cases; no per-row follow-up. |
| GET /cases/:id | Verified in dashboard code | Two queries: one admin_cases, one admin_case_entities. No N+1. |

**Verdict:** No N+1. **PASS**

---

## 3) Bundle / bloat

| Check | Evidence |
|-------|----------|
| cases_api dynamic import | Verified in dashboard code | CasesScreen uses `await import('../services/cases_api')` for create submit only; cases_api also statically imported by viewmodels. Build note: "dynamic import will not move module into another chunk." |
| Recommendation | — | Optional: use static import for casesApi in CasesScreen to avoid dual reference; low priority. |

**Verdict:** No bundle blocker.

---

## 4) Indexes / queries

| Object | Evidence | Recommendation |
|--------|----------|----------------|
| admin_cases | Verified in SQL | Migration has idx_admin_cases_status, assignee, created_at DESC. Sufficient for list/detail. |
| admin_case_entities | Verified in SQL | idx on case_id, (entity_type, entity_id). Sufficient for detail entities. |

**Verdict:** Indexes in place. No additional tasks required for PAGE 08.
