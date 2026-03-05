# Security Review — Page 13 (Settings / System Config + Feature Flags)

**Scope**: Page_13_Settings  
**Date**: 2025-03-03  
**Agent**: @SecGuard  
**Plan reference**: `.cursor/plans/PLAN_PAGE_13_Settings_System_Config_Feature_Flags.md`

---

## 1. Forbidden imports (admin-ui)

- **Verified in dashboard code**: No `@/lib/supabase/admin`, `createAdminClient`, `'use server'`, `@/lib/supabase/server`, `auth.admin`, `@/types/supabase`, `next/*` in `apps/admin-ui/src/features/settings/`. **PASS**.

---

## 2. RBAC enforcement

- **Verified in app code**: GET `/config`: `preHandler: [requireAdminRole(SETTINGS_READ_ROLES)]` with `['support','moderator','admin','super_admin']`. **Verified in app code**.
- **Verified in app code**: PATCH `/config`: `preHandler: [requireAdminRole(SETTINGS_WRITE_ROLES)]` with `['super_admin']`. **Verified in app code**.
- **Verified in app code**: PATCH handler also checks `request.user?.id` and returns 401 if missing. **Verified in app code**.

**PASS**.

---

## 3. Input validation (Zod)

- **Verified in app code**: PATCH body validated with `UpdateSystemConfigBodySchema.safeParse(request.body)`; on failure returns 400 with `VALIDATION_ERROR`. **Verified in app code**.
- **Verified in app code**: GET response validated with `GetSystemConfigResponseSchema.safeParse(rows)` before send; on failure returns 500. **Verified in app code**.

**PASS**.

---

## 4. Audit compliance

- **Verified in SQL**: Mutation performed only via RPC `admin_update_system_config`, which writes exactly one `audit_logs` row in the same transaction as the UPDATE/INSERT. **Verified in SQL**.
- **Verified in app code**: API does not perform "write then audit"; single RPC call. **Verified in app code**.

**PASS** — no write-then-audit; audit is atomic.

---

## 5. Secrets

- **Verified in app code**: Supabase client in `settings.ts` uses `process.env.SUPABASE_URL` and `process.env.SUPABASE_SERVICE_ROLE_KEY`; no hardcoded keys. **Verified in app code**.

**PASS**.

---

## 6. PII / case-gated chat

- Page 13 does not touch user PII or chat. N/A.

---

## 7. Additional checks

- **Rate limit**: PATCH limited to 5/60s per user; 429 on exceed. **Verified in app code**. **PASS**.
- **Type assertion**: PATCH uses `(request as any).user?.id` for userId. **LOW**: Prefer typed request (e.g. extended Fastify type with user). Not a security blocker.

---

## Decision

**APPROVED ✅** — No blockers. RBAC, Zod, audit atomicity, and secrets handling comply. One LOW recommendation: type the request user instead of `any`.
