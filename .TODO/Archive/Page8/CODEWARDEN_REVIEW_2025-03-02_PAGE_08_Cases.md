# CodeWarden Review — PAGE 08 Cases Domain

**Scope:** PAGE_08_Cases  
**Date:** 2025-03-02  
**Agent:** @CodeWarden (Hard Architecture Gate)

---

## 1) MVVM purity

| Rule | Evidence | Result |
|------|----------|--------|
| Views do not call DB/Supabase | Verified in dashboard code | CasesScreen, CaseDetailScreen — no Supabase, no fetch to DB; only VM and router. |
| Views do not contain business logic | Verified in dashboard code | Create/attach logic in VM or inline handler that calls cases_api; validation (e.g. subject trim) is minimal UI concern. |
| Service calls only from VM or explicit handler | Verified in dashboard code | CasesScreen: `casesApi.createCase` called in handleCreateSubmit (dialog submit). CaseDetailScreen: `vm.attachEntity` (VM calls API). |

**Verdict:** No MVVM violations. **PASS**

---

## 2) Structure / God files

| Check | Evidence |
|-------|----------|
| cases routes single responsibility | Verified in dashboard code: `cases.ts` — list, get, create, attach only. |
| View files size | Verified in dashboard code: CasesScreen ~230 lines, CaseDetailScreen ~220 — acceptable. |
| No business logic in UI components | Verified in dashboard code: No pricing, permissions, or DB rules in views. |

**Verdict:** No God files; structure acceptable.

---

## 3) What must not be done (reminders)

- Do not add Supabase or server-only imports to `apps/admin-ui/src/features/cases/`.
- Do not move audit writes to client; keep in API only.
- Do not bypass requireAdminRole for cases routes.

---

## Decision: **APPROVED**

No blockers. Cases feature respects MVVM; Views are presentational; ViewModels and API layer own data and mutations.
