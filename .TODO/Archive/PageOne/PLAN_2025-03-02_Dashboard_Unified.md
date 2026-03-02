# Plan: Dashboard Unified (2025-03-02)

**Scope**: Dashboard_Unified  
**Source**: MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md  
**Repo**: SlineDashbord (admin-ui Vite SPA + Fastify API + packages/shared)

---

## Summary

Execution-grade checklist for the SLine Admin Dashboard migration. Pages are sequential; each page has explicit gates before proceeding.

---

## PAGE 01 — Baseline Build & Security Hard Gates ✅ (Done)

- **Goal**: Admin-ui builds; no server-only code in SPA; forbidden-import CI gate.
- **Evidence**: Verified in dashboard code — no `admin_logs`, `createAdminClient`, `@/lib/supabase`, `@/types/supabase`, `next/*` in apps/admin-ui.
- **Gates**: Build, typecheck, forbidden-import scan.

---

## PAGE 02 — Canonical Audit: Kill admin_logs Drift

- **Goal**: No API reads/writes `admin_logs`; all audit via `audit_logs` with canonical columns; atomic writes.
- **Findings**:
  - `apps/api/src/audit.ts`: `withAudit()` writes to `admin_logs` (legacy), non-atomic (handler then insert).
  - `apps/api/src/routes/tasks.ts`: `GET /:id/activity` reads from `admin_logs`; status mutations use `withAudit`.
  - `apps/api/src/routes/dashboard.ts`: reads `audit_logs` (canonical shape: actor_user_id, action, meta).
- **Contracts**: Add `packages/shared/src/schemas/audit.ts` (AuditActionEnum, MutationAckSchema, AuditLogRowSchema).
- **Gates**: No `admin_logs` in api/admin-ui/shared; audit_logs inserts use canonical columns; atomic per mutation.

---

## PAGE 03 — Finance RPC Drift (admin_process_withdrawal)

- **Goal**: Approve/reject withdrawal works; RPC signature and columns match app schema.
- **Gates**: RPC succeeds; one audit_logs row per decision; idempotency.

---

## PAGE 04 — Admin Identity: admin_users (Source of Truth)

- **Goal**: admin_users in app repo; RBAC reads canonical table.
- **Gates**: GET /api/v1/auth/me returns role; RBAC tests.

---

## PAGE 05 — User Moderation (Ban/Suspend)

- **Goal**: Ban/unban/suspend target marketplace users (profiles), not admin_users; atomic audit.
- **Gates**: Banned user blocked in app; audit row per action.

---

## PAGE 06–08+ (Logout, Bookings, Cases, …)

- Per audit doc: Force logout, Bookings admin, Cases domain, etc. Each with gates.

---

## Agent Assignment (Orchestrator)

- **@SysOp**: API/DB/contracts/audit atomics (PAGE 02, 03, …).
- **@AdminArchitect**: VMs, routes, contract wiring.
- **@SecGuard**: RBAC, forbidden imports, audit compliance.
- **@CodeWarden**: MVVM boundaries, no God files.
- **@QA**: Supertest/Playwright, regression checklist.
- **@DocKeeper**: Docs delta.

---

## Gate Summary

| Gate        | PAGE 01 | PAGE 02+ |
|------------|---------|----------|
| Build      | ✅      | Required |
| Security   | ✅      | Required |
| Audit      | N/A     | Atomic   |
| API        | Stable  | Per page |
| QA         | Scan    | Tests    |
