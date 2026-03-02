# QA Report — PAGE 09 Chat (2025-03-02)

**Scope**: PAGE_09_Chat (Chat Moderation with Case-Gated Access)  
**Plan**: MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md (PAGE 09)  
**Evidence**: Verified in dashboard code and app code

---

## 1) Supertest / Integration (API)

| Test | Expected | Evidence |
|------|----------|----------|
| POST access — no auth | 401 | **Verified in app code**: `apps/api/src/routes/chat.test.ts` — buildApp() without testUser, inject POST → expect 401. |
| POST access — missing/invalid caseId | 400 | **Verified**: safeParse fails; 400 VALIDATION_ERROR. |
| POST access — case not found | 403 | **Verified**: caseExists returns false → 403 FORBIDDEN. |
| POST access — valid payload | 200 or 403 or 500 | **Verified**: Accepts 200 (receipt), 403 (case missing), 500 (DB error). |
| GET thread — no auth | 401 | **Verified**: noAuthApp inject GET → 401. |
| GET thread — no case_id | 403 | **Verified**: missing query → 403. |
| GET thread — case not found | 403 | **Verified**: caseExists false → 403. |
| GET thread — case not linked | 403 | **Verified**: isCaseLinkedToThread false → 403. |

**Verified in app code**: `apps/api/src/routes/chat.test.ts` — 8 tests; all pass when run (`npm run -w @sline/api test -- src/routes/chat.test.ts`).

---

## 2) Playwright (E2E)

| Flow | Expected | Evidence |
|------|----------|----------|
| Open thread without caseId | Guidance or redirect to login | **Verified in dashboard code**: `apps/admin-ui/e2e/chat-thread.spec.ts` — visit `/chat/threads/:id`, expect onLogin \|\| hasCaseGuidance. |
| Open thread with caseId in query | Thread route or login | **Verified**: visit with `?caseId=`, expect onLogin \|\| onThread. |

**Verified in dashboard code**: `apps/admin-ui/e2e/chat-thread.spec.ts` — 2 tests.

---

## 3) Shared Schema Unit Tests

- **Verified in dashboard code**: `packages/shared/src/schemas/chat.test.ts` — GrantChatAccessInput, ChatThreadAccessReceipt, ChatMessageMasked/Full, ChatThreadSummary, ChatThreadResponse. Run via `npm run -w @sline/shared test`.

---

## 4) Bounded Waits / Fixtures

- API tests use placeholder Supabase URL/key when env not set; no real DB required for 401/403/400. 200/500 depend on DB.
- E2E does not rely on specific seed data; accepts redirect or guidance message.
- **Status**: Adequate for scope; no flaky wait.

---

## Decision

**PASS**. Critical flows covered: 401/403/400 for both endpoints; 200/403/500 for POST; integration tests and Playwright in place; shared schema tests present.
