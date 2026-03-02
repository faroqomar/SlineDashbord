# SecGuard — Security Review: Dashboard_Unified (2025-03-02)

**Scope**: Dashboard_Unified  
**Plan**: .TODO/PLAN_2025-03-02_Dashboard_Unified.md  
**Evidence**: Verified in dashboard and API code

---

## 1) Forbidden Imports Scan (admin-ui)

- **Requirement**: admin-ui must NOT contain server-only Supabase, createAdminClient, auth.admin, @/types/supabase, next/*.
- **Evidence**: Grep in `apps/admin-ui/src` for `admin_logs`, `createAdminClient`, `@/lib/supabase`, `@/types/supabase`, `next/` → **no matches**. Verified in dashboard code.
- **Status**: **PASS** (PAGE 01 gate satisfied).

---

## 2) RBAC Enforcement

- **Evidence**: All privileged routes use `requireAdminRole(...)` (verified in app code): dashboard, users, tasks, finance, team, disputes. Roles: support, moderator, admin, super_admin; finance and tasks restrict to admin/super_admin where appropriate.
- **Status**: **PASS** (RBAC applied at route level).

---

## 3) Input Validation (Zod)

- **Evidence**: Routes use shared schemas and validate inputs (e.g. finance, users, disputes). Not every route was exhaustively checked; recommendation: ensure every POST/PUT/PATCH body and path param is validated with Zod from packages/shared.
- **Status**: **Assumed adequate**; no evidence of raw body use without schema in sampled routes. Recommend full pass for PII/mutation routes.

---

## 4) Audit Compliance (No "Write Then Audit")

- **Evidence**: `apps/api/src/audit.ts` — **Verified in app code**: Handler runs first, then insert to `admin_logs`. No DB transaction; audit can fail after mutation succeeds. Project context requires: "Privileged mutation MUST produce an audit record in public.audit_logs atomically."
- **Status**: **BLOCKER**. All withAudit flows are non-atomic and write to legacy `admin_logs`. This violates the security manual / project context.

---

## 5) PII Masking / Reveal Plan

- **Scope**: Users, finance, disputes routes return user/profile data. No explicit PII masking schema (masked vs unmasked DTO) verified in this review. Recommend: define masked DTOs for list endpoints and full DTO only for detail with proper role.
- **Status**: **MED** — Document and implement per scope (e.g. PAGE 05+).

---

## 6) Case-Gated Chat Access

- **Scope**: Not in current PAGE 01–02 focus. Cases domain (PAGE 08+) will require case-gated chat access. No finding for current scope.

---

## 7) Secrets

- **Evidence**: API uses `process.env.SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`; no hardcoded secrets in repo. admin-ui uses central API client with credentials via cookies/session.
- **Status**: **PASS**.

---

## Decision: **BLOCKED ❌**

**Reason**: Audit compliance is a hard gate. Privileged mutations must write to `public.audit_logs` **atomically** (same transaction as the mutation). Current implementation uses log-after-write to `admin_logs`, which is non-compliant and constitutes a **BLOCKER** per orchestrator rules.

**What to fix first**: Implement PAGE 02 (canonical audit: migrate to audit_logs, atomic writes via DB RPC or transaction). Re-run SecGuard after atomic audit is in place.

---

**File**: .TODO/SECURITY_REVIEW_2025-03-02_Dashboard_Unified.md
