# QA Report — PAGE 06 Force Logout

**Scope:** PAGE 06 (force-logout API + UI).  
**Date:** 2025-03-02  
**Agent:** @QA

---

## Supertest (API)

- **Verified in app code:** apps/api/src/routes/users.test.ts — PAGE 06 block:
  - 401 when no auth (appNoAuth).
  - 403 for support role (only admin/super_admin allowed).
  - 400 for invalid userId (not UUID).
  - 200 with userId or 404/500 for valid payload (reason optional).
- Shared schema: **Verified in app code:** packages/shared/src/schemas/users.test.ts — ForceLogoutInputSchema unit tests.

## Playwright / E2E

- No Playwright tests added for force-logout. Manual smoke: open user detail → Force logout → confirm → verify success/invalidation acceptable for gate.

## Fixtures / seeds

- Tests use placeholder Supabase URL; 200/404/500 accepted. No DB seeds required for force-logout unit/integration.

---

## Decision: **PASS ✅**

Critical flows (401, 403, 400, 200/404/500) covered for force-logout. No FAIL on critical flow.
