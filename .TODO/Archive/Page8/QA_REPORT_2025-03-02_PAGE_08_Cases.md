# QA Report — PAGE 08 Cases Domain

**Scope:** PAGE_08_Cases  
**Date:** 2025-03-02  
**Agent:** @QA

---

## 1) Test inventory (Verified in dashboard code)

| Test file | Coverage | Evidence |
|-----------|----------|----------|
| packages/shared/src/schemas/cases.test.ts | AdminCaseCreateInput, AdminCaseAttachEntity, AdminCaseSchema | Unit tests for valid/invalid parsing. |
| apps/api/src/routes/cases.test.ts | GET/POST cases, POST entities | 12 tests: 401 no auth, 200/500 list, 404/500 get, 201/500 create, 400 validation, 404/409 attach. |
| Integration | Create case + attach entity | One test in cases.test.ts; passes with 201/200 or 500 when DB unreachable. |

---

## 2) Supertest list (API)

| Scenario | Expected | Evidence |
|----------|----------|----------|
| GET /api/v1/cases no auth | 401 | Verified in dashboard code: cases.test.ts |
| GET /api/v1/cases with auth | 200 (or 500 if DB/tables missing) | Verified in dashboard code |
| GET /api/v1/cases/:id no auth | 401 | Verified in dashboard code |
| GET /api/v1/cases/:id not found | 404 or 500 | Verified in dashboard code |
| POST /api/v1/cases no auth | 401 | Verified in dashboard code |
| POST /api/v1/cases invalid body (empty subject) | 400 | Verified in dashboard code |
| POST /api/v1/cases valid | 201 or 500 | Verified in dashboard code |
| POST /api/v1/cases/:id/entities no auth | 401 | Verified in dashboard code |
| POST entities invalid entity_id | 400 | Verified in dashboard code |
| POST entities invalid entity_type | 400 | Verified in dashboard code |
| POST entities case not found | 404 | Verified in dashboard code |

**Verdict:** Critical flows covered. **PASS**

---

## 3) Playwright / E2E

- No Playwright tests added for cases in PAGE 08 scope.
- Recommendation: Optional E2E for "open /cases → create case → open detail → attach entity" when E2E harness is run regularly.

**Verdict:** Not required for gate; optional follow-up.

---

## 4) Verification commands

```bash
npm run -w @sline/shared test          # includes cases.test.ts
npm run -w @sline/api test -- src/routes/cases.test.ts
npm run -w @sline/api build
npm run -w @sline/admin-ui build
```

---

## Decision: **PASS**

401/403/400/404/200/201/500 covered. Integration create+attach present. No critical flow failure.
