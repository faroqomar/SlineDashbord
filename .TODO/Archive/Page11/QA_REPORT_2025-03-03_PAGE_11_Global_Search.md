# QA Report: PAGE 11 — Global Search

**Scope:** PAGE_11_Global_Search  
**Plan:** .TODO/PLAN_PAGE_11_Global_Search.md  
**Role:** @QA

---

## 1. Supertest list (existing)

**Verified in dashboard code:** apps/api/src/routes/search.test.ts

| Case | Status | Note |
|------|--------|------|
| 401 when no auth | ✅ | Implemented and passing. |
| 400 when q &lt; 2 chars | ✅ | Implemented and passing. |
| 400 when limit &gt; 50 | ✅ | Implemented and passing. |
| 200 with admin + shape valid | ✅ | AdminGlobalSearchResultSchema.safeParse(body.data). |
| 200 with types filter | ✅ | types=user,task. |
| Response items have entityType, id, title, link | ✅ | Loop over items and assert. |

---

## 2. Gaps (plan vs implemented)

| Case | Plan requirement | Current | Severity |
|------|------------------|---------|----------|
| 403 if non-admin | “403 if applicable” | Not tested. All admin roles allowed; 403 would require a role not in list (e.g. unauthenticated or future “guest”). | LOW |
| 503 on forced error path | “503 on forced error path” | Not tested. Would require mocking Supabase to throw or timeout. | MED |
| “Query returns expected entity types” | Assert each of five entity types can appear | Test only checks that returned items have valid entityType; does not assert presence of all five types (would need seed data). | MED |
| Fixture/seed | “Minimal seed for search” | Tests use buildApp(testUser); no dedicated seed. Empty items array is valid. | LOW |

---

## 3. Playwright / E2E

- Plan did not require Playwright for search. Optional: smoke test “open /search, type 3 chars, see loading then results or empty”.
- **Recommendation (task):** Add optional Playwright smoke for /search if critical-flow matrix includes it.

---

## 4. Bounded waits and artifact capture

- Supertest uses default Vitest/inject timeouts; no explicit bounded wait policy in test file. Search handler has 8s timeout; tests complete well under that.
- No artifact capture (screenshots/logs) in current tests; acceptable for unit/integration.

---

## 5. Verification commands

```bash
npm run -w packages/shared test -- --run src/schemas/search.test.ts
npm run -w apps/api test -- --run src/routes/search.test.ts
```

**Verified:** Both pass (shared 14 tests, search route 6 tests).

---

## Decision

**PASS ✅** — Critical flows covered: 401, 400, 200, shape, entity types shape. Gaps: 503 path not tested; “all five entity types” not asserted with seed; 403 N/A for current role matrix. No BLOCKER for release; recommend adding 503 test and optional seed for entity-type coverage.

**File:** .TODO/QA_REPORT_2025-03-03_PAGE_11_Global_Search.md
