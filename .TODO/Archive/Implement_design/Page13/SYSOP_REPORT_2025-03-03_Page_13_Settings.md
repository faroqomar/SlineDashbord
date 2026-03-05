# SysOp Report — Page 13 (Settings / System Config + Feature Flags)

**Scope**: Page_13_Settings  
**Date**: 2025-03-03  
**Agent**: @SysOp  
**Plan reference**: `.cursor/plans/PLAN_PAGE_13_Settings_System_Config_Feature_Flags.md`

---

## 1. Endpoint inventory (Fastify)

| Method | Path | Handler | RBAC | Evidence |
|--------|------|---------|------|----------|
| GET | `/api/v1/settings/config` | List system_config rows | `requireAdminRole(['support','moderator','admin','super_admin'])` | **Verified in app code** — `apps/api/src/routes/settings.ts` |
| PATCH | `/api/v1/settings/config` | Update one key via RPC | `requireAdminRole(['super_admin'])` | **Verified in app code** — same file |

Routes registered in `apps/api/src/app.ts`: `server.register(settingsRoutes, { prefix: '/api/v1/settings' })`. **Verified in app code**.

---

## 2. Contract map (packages/shared)

- **Verified in app code**: `packages/shared/src/schemas/settings.ts` exports:
  - `GetSystemConfigResponseSchema` (z.array(SystemConfigSchema))
  - `UpdateSystemConfigBodySchema` (z.object({ key, value }))
- API imports `GetSystemConfigResponseSchema`, `UpdateSystemConfigBodySchema`, `failure`, `success` from `@sline/shared`. **Verified in app code**.

No missing contracts for Page 13.

---

## 3. DB / RPC requirements and migration location

- **Verified in SQL**: Migration `MIGRATIONS/for_sline_app/20260303100000_system_config.sql`:
  - Table `public.system_config` (key PK, value jsonb, description, updated_by, updated_at); RLS enabled; no policies for anon/authenticated.
  - RPC `public.admin_update_system_config(p_key, p_value, p_actor_user_id)`: UPDATE or INSERT then INSERT into `audit_logs` in same function (atomic). **Verified in SQL**.
- Plan states: copy to sline_app for production. **Verified in app code** — README and ADMIN_DATABASE_REF reference this.

---

## 4. audit_logs atomicity compliance

- **Verified in SQL**: RPC `admin_update_system_config` performs UPDATE/INSERT on `system_config` and INSERT into `audit_logs` in one PL/pgSQL block (same transaction). No "log-after-write" from API. **Verified in SQL**.
- **Verified in app code**: PATCH handler calls `supabase.rpc('admin_update_system_config', ...)` only; no separate audit call in API. **Verified in app code**.

**Status**: **Compliant** — audit is atomic with mutation in DB.

---

## 5. Exact SQL object names and route paths

| Object | Name / Path |
|--------|-------------|
| Table | `public.system_config` |
| RPC | `public.admin_update_system_config(p_key text, p_value jsonb, p_actor_user_id uuid)` |
| Audit action | `admin.system.update_config` |
| related_entity_type | `system_config` |
| GET route | `/api/v1/settings/config` |
| PATCH route | `/api/v1/settings/config` |

---

## 6. Rate limit

- **Verified in app code**: In-memory per-user rate limit for PATCH: 5 requests per 60s; 429 with `RATE_LIMIT` when exceeded. Implemented in `apps/api/src/routes/settings.ts`. **Verified in app code**.

---

## 7. Findings

- No schema drift for Page 13.
- One **LOW** note: Supabase client is created at module level in `settings.ts` (shared across requests). Acceptable for server; ensure env vars set at startup.

**Decision**: **APPROVED** — endpoints, contracts, RPC, and audit atomicity comply.
