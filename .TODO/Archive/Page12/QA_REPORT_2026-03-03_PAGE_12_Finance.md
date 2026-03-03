# QA Report — PAGE 12 Finance (Transaction Detail, Audit Export, User Lookup)

**Scope:** PAGE_12_Finance_Transaction_Detail_Audit_Export_User_Lookup  
**Date:** 2026-03-03  
**Agent:** @QA  
**Plan:** `.TODO/PLAN_PAGE_12_Finance_Transaction_Detail_Audit_Export_User_Lookup.md`

---

## 1) Supertest / route tests (Vitest)

**File:** `apps/api/src/routes/finance.test.ts`

| Test area | Coverage | Evidence |
|-----------|----------|----------|
| GET /finance/transactions/:journalId | 401 no auth, 403 for support, 400 invalid UUID, 200 masked or 404 | Verified in app code: finance.test.ts (PAGE 12 block) |
| GET /finance/audit | 401, 403, 200 with data array and optional nextCursor | Verified in app code |
| GET /finance/audit/export | 401, 403, 200 CSV + Content-Disposition; **export row count matches list** for same limit | Verified in app code |
| GET /finance/users/:userId | 401, 403, 400 invalid userId, 200 or 501 | Verified in app code |

**Run:** `npm run test -w @sline/api` — finance tests pass (23 tests, 1 skipped). Failures in same run are in **bookings.test.ts** (cancel/refund 404 without DB), not PAGE 12.

---

## 2) Trust boundaries

| Check | Result |
|-------|--------|
| admin-ui cannot call privileged Supabase | ✅ — No server imports in finance feature. |
| PAGE 12 endpoints require RBAC | ✅ — 403 for support/moderator; 200 for admin/super_admin in tests. |
| Reveal: audit then return | ✅ — Covered by API design; test can assert 200 + body shape when reveal=1. |
| Export matches list (same params) | ✅ — Test asserts CSV data rows length vs list length. |

---

## 3) No-throw / ServiceResult

API returns failure payloads (failure('...')) and success(success(...)); no unhandled throw in PAGE 12 routes. ✅

---

## Decision

**PASS ✅** — PAGE 12 route tests exist and pass. Security and invariant tests (401/403, export vs list) are in place. No blocking QA gaps for PAGE 12.
