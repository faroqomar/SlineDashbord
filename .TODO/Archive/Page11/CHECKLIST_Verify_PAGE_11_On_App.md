# Checklist: Verify PAGE 11 (Global Search) & Report Fixes on the Actual App

Use this list to confirm everything works in your environment (local or staging).

---

## 1. Build & tests (terminal)

| # | Check | Command | Pass when |
|---|--------|--------|-----------|
| 1.1 | Shared package builds and search schema tests pass | `npm run -w packages/shared test -- --run src/schemas/search.test.ts` | All 14 tests pass |
| 1.2 | API typechecks | `npm run -w apps/api typecheck` | No errors |
| 1.3 | Search API integration tests pass | `npm run -w apps/api test -- --run src/routes/search.test.ts` | All tests pass (401, 400, 200, shape, types filter, items shape, **503 timeout**, **q with single quote**) |
| 1.4 | Admin UI builds (optional; may fail on other routes) | `npm run -w apps/admin-ui build` | Build completes or only known non-search errors |

---

## 2. API (search endpoint)

| # | Check | How | Pass when |
|---|--------|-----|-----------|
| 2.1 | 401 without auth | `curl -s -o /dev/null -w "%{http_code}" "http://localhost:YOUR_API_PORT/api/v1/search?q=ab"` (no cookie) | `401` |
| 2.2 | 400 when q too short | With valid admin cookie: `GET /api/v1/search?q=a` | Response 400, body has `VALIDATION_ERROR` |
| 2.3 | 400 when limit > 50 | With valid admin cookie: `GET /api/v1/search?q=ab&limit=51` | Response 400 |
| 2.4 | 200 with valid query | With valid admin cookie: `GET /api/v1/search?q=test&limit=10` | Response 200, body `ok: true`, `data.items` is array |
| 2.5 | Response shape | Same as 2.4; inspect `data.items` | Each item has `entityType`, `id`, `title`, `link`; `entityType` is one of user, task, booking, dispute, transaction |
| 2.6 | Types filter | `GET /api/v1/search?q=ab&types=user,task` | 200, items only user or task (if any) |
| 2.7 | x-request-id on response | Any successful or 503 response | Header `x-request-id` present (if Fastify sets request.id) |
| 2.8 | q with single quote | `GET /api/v1/search?q=a%27b&limit=5` (with auth) | 200 or 503 (no 500; filter not broken) |

---

## 3. UI (admin app in browser)

| # | Check | How | Pass when |
|---|--------|-----|-----------|
| 3.1 | Search in nav | Log in to admin UI, look at sidebar | “Search” link with search icon is visible |
| 3.2 | Open /search | Click “Search” or go to `/search` | Search page loads; heading “Global Search” and one search input visible |
| 3.3 | Min 2 chars hint | Type 1 character only | Message like “Enter at least 2 characters to search” appears |
| 3.4 | Search runs | Type 3+ characters (e.g. a name or “test”) | After short delay: either “Searching…” then a results list, or “No results found for …” |
| 3.5 | Results are clickable | If results appear, click one row | Navigates to the correct detail page (e.g. /users/…, /tasks/…, /disputes/…) |
| 3.6 | No console errors | Keep DevTools console open on /search | No red errors (except known unrelated ones) |
| 3.7 | Error state | (Optional) Stop API or use bad network) Trigger search | “Something went wrong” (or similar) and Retry button appear |
| 3.8 | Timeout state | (Hard to test without forcing slow API) | If implemented: after ~10s without response, “Search timed out” and Retry appear |

---

## 4. Security & architecture (quick audit)

| # | Check | How | Pass when |
|---|--------|-----|-----------|
| 4.1 | No server/Supabase in search UI | `grep -r "supabase\|createAdminClient\|@/lib/supabase" apps/admin-ui/src/features/search apps/admin-ui/src/routes/Search.tsx` (or search in IDE) | No matches |
| 4.2 | Search route protected | Call `GET /api/v1/search?q=ab` without cookie/header | 401 |

---

## 5. Master Report fixes (what was changed)

| # | Fix | How to verify |
|---|-----|----------------|
| 5.1 | Query sanitized (single quote) | API test “accepts q containing single quote” passes (1.3); or call API with `q=a'b` (with auth) and get 200 or 503, not 500 |
| 5.2 | 503 + x-request-id test | Search test suite includes “returns 503 and x-request-id when search times out” (1.3) |
| 5.3 | Parallel entity queries | Code: `apps/api/src/routes/search.ts` uses `Promise.all([runUser(), runTask(), ...])` |
| 5.4 | No `any` on search result link | SearchScreen uses button + `navigate({ to: item.link })` (no `Link` with `as any`) |
| 5.5 | Feature doc | File `Docs/features/global-search.md` exists and is listed in `Docs/features/README.md` |

---

## 6. Docs & runbook

| # | Check | Pass when |
|---|--------|-----------|
| 6.1 | Discovery doc exists | `Docs/PAGE_11_search_discovery.md` present |
| 6.2 | p95 runbook exists | `Docs/runbooks/search-p95.md` present |
| 6.3 | Global search feature doc | `Docs/features/global-search.md` exists and is in README list |

---

## 7. Optional / follow-up

| # | Check | Notes |
|---|--------|------|
| 7.1 | admin-ui full build | If build fails, confirm it’s not due to search (e.g. FinanceUsers route type); search route and SearchScreen are not the cause |
| 7.2 | p95 &lt; 500ms | Run `Docs/runbooks/search-p95.md` against staging (or staging-sized DB) and record result |

---

## Quick “smoke” sequence (minimum to confirm on app)

1. **Terminal:** `npm run -w apps/api test -- --run src/routes/search.test.ts` → all pass.  
2. **Browser:** Log in → open **Search** from sidebar → type at least 2 chars → see loading then results or “No results”.  
3. **Browser:** Click a result row → navigates to correct detail page.  
4. **Files:** `Docs/features/global-search.md` exists; `apps/api/src/routes/search.ts` uses `Promise.all` and `getSearchTimeoutMs()`; SearchScreen uses `navigate({ to: item.link })` (no `as any` on Link).

---

*Reference: .TODO/MASTER_REPORT_2025-03-03_PAGE_11_Global_Search.md, .TODO/EXECUTION_REPORT_PAGE_11_Global_Search.md*
