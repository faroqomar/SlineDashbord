# Code Warden Review: PAGE 11 — Global Search

**Scope:** PAGE_11_Global_Search  
**Plan:** .TODO/PLAN_PAGE_11_Global_Search.md  
**Role:** @CodeWarden (Hard Architecture Gate)

---

## 1. Boundary enforcement

### Admin UI (apps/admin-ui)

- **Verified in dashboard code:** No `@/lib/supabase/admin`, `@/lib/supabase/server`, `createAdminClient`, `auth.admin`, `@/types/supabase`, `next/*` in search feature or Search route.
- **Verified in dashboard code:** View (SearchScreen) does not call API directly; uses ViewModel only. ViewModel uses `request()` from `@/lib/api` and types from `@sline/shared`.

**Result:** No forbidden flows.

### ViewModel standards

- **Verified in dashboard code:** useGlobalSearch.vm.ts does not perform RBAC; uses central API wrapper (`request()`); returns consistent shape (query, results, loading, error, timedOut, retry). No raw fetch.
- **Note:** No TanStack Query (no query keys); plan did not require it for this feature. Acceptable for single search endpoint.

**Result:** PASS.

### API standards (apps/api)

- **Verified in dashboard code:** Search is read-only; no privileged mutation; no audit write. Zod validation (AdminGlobalSearchQuerySchema) on input. RBAC via requireAdminRole. No Idempotency-Key (not applicable for read-only).

**Result:** PASS.

---

## 2. Scalability & maintainability

### Line count

- **Verified in dashboard code:** search.ts ~164 lines; useGlobalSearch.vm.ts ~95 lines; SearchScreen.tsx ~124 lines. All under 300-line limit.

### Type safety

- **Finding (LOW):** SearchScreen.tsx line 104: `to={item.link as any}`. Link component receives `item.link` (string) cast to `any` for TanStack Router `to` prop. Discriminated union types from shared ensure `link` is string; the cast is used to satisfy router’s strict path type.
- **Recommendation:** Prefer a typed route helper or declare that `item.link` is a valid route path type instead of `as any`. Not blocking.

**Result:** PASS with one LOW (justified escape).

---

## 3. Violations list

| Violation | Severity | File | Fix |
|-----------|----------|------|-----|
| None | — | — | — |

---

## 4. Required refactors

- None mandatory. Optional: replace `item.link as any` with a typed path or router.navigate(item.link) if type-safe.

---

## 5. What must not be done

- Do not add Supabase or server-only imports to admin-ui search code.
- Do not perform search or RBAC in the View; keep in VM and API only.
- Do not skip Zod validation on GET /api/v1/search query params.

---

## Decision

**APPROVED ✅** — MVVM purity and boundaries satisfied. One LOW: type escape for `to={item.link}`; acceptable with justification.

**File:** .TODO/CODEWARDEN_REVIEW_2025-03-03_PAGE_11_Global_Search.md
