# Architect Report: PAGE 11 — Global Search

**Scope:** PAGE_11_Global_Search  
**Plan:** .TODO/PLAN_PAGE_11_Global_Search.md  
**Evidence rule:** Verified in dashboard code unless stated.

---

## 1. MVVM boundary check

| Layer | Path | Status | Notes |
|-------|------|--------|--------|
| Route | `apps/admin-ui/src/routes/Search.tsx` | ✅ | Thin wrapper; delegates to SearchScreen. |
| View | `apps/admin-ui/src/features/search/view/SearchScreen.tsx` | ✅ | Uses VM only; no API/Supabase imports; no `useEffect` for data fetch (VM owns side effect). |
| ViewModel | `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts` | ✅ | Calls `request()` from `@/lib/api` only; types from `@sline/shared`; no Supabase, no RBAC logic. |

**Verdict:** MVVM boundaries respected. View does not call API or DB.

---

## 2. Route parity (TanStack Router)

- **Verified in dashboard code:** `/search` route exists in App.tsx; `searchRoute` created with `createRoute`, path `/search`, component SearchPage; added to authLayoutRoute children.
- **Verified in dashboard code:** Sidebar nav includes "Search" with href `/search` and Search icon.
- No missing or broken route refs for search.

---

## 3. Contract needs / schemas

- **Verified in dashboard code:** `packages/shared` exports search schemas: AdminGlobalSearchRequestSchema, AdminGlobalSearchQuerySchema, AdminGlobalSearchResultSchema, AdminGlobalSearchResultItemSchema, AdminSearchEntityTypeEnum. Used by API (search.ts) and UI (VM imports types).
- No ad hoc response shapes; API validates response with AdminGlobalSearchResultSchema before send.

---

## 4. Structure (feature-first)

- **Verified in dashboard code:** Feature folder exists: `apps/admin-ui/src/features/search/` with `viewmodels/useGlobalSearch.vm.ts` and `view/view/SearchScreen.tsx`.
- No `api/` subfolder: VM uses global `@/lib/api` request(), which is acceptable (central API wrapper).
- No `models/` for search: types come from shared; no local model needed.

---

## 5. Forbidden imports (admin-ui)

- **Verified in dashboard code:** Grep over `apps/admin-ui/src/features/search` and `apps/admin-ui/src/routes/Search.tsx`: no `@/lib/supabase/admin`, no `@/lib/supabase/server`, no `createAdminClient`, no `auth.admin`, no `@/types/supabase`, no `next/*`.

---

## 6. Exact file paths touched (for fix ordering)

- `apps/admin-ui/src/routes/Search.tsx`
- `apps/admin-ui/src/features/search/viewmodels/useGlobalSearch.vm.ts`
- `apps/admin-ui/src/features/search/view/SearchScreen.tsx`
- `apps/admin-ui/src/App.tsx` (route + tree)
- `apps/admin-ui/src/components/layout/Sidebar.tsx` (nav)

---

## Gate checklist

- [x] View uses only ViewModel state/actions.
- [x] ViewModel uses only API client and shared types.
- [x] No server/DB imports in admin-ui search code.
- [x] Route and nav registered.

**Decision: APPROVED ✅**
