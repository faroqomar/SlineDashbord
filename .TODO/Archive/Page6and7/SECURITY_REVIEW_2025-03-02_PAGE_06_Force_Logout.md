# SecGuard — Security Review: PAGE 06 Force Logout (2025-03-02)

**Scope:** PAGE_06_Force_Logout  
**Plan:** .TODO/PLAN_PAGE_06_Force_Logout_Session_Revocation.md  
**Evidence:** Verified in dashboard code, app code, SQL

---

## 1) Forbidden Imports Scan (admin-ui)

- **Requirement:** admin-ui must NOT contain server-only Supabase, createAdminClient, auth.admin, @/types/supabase, next/*.
- **Evidence:** **Verified in dashboard code:** Force-logout flow in UserDetail.tsx and users_api.ts use request() only; no Supabase/admin imports in users feature.
- **Status:** **PASS**

---

## 2) RBAC Enforcement

- **Evidence:** **Verified in app code:** users.ts POST /:userId/force-logout checks (request as any).user?.role and USERS_WRITE_ROLES (admin, super_admin); returns 403 for missing role or non-write role; 401 if no adminId.
- **Status:** **PASS** (RBAC applied; support cannot force-logout).

---

## 3) Input Validation (Zod)

- **Evidence:** **Verified in app code:** ForceLogoutInputSchema.safeParse({ ...body, userId }); path param userId merged into body for validation; 400 on invalid input.
- **Status:** **PASS**

---

## 4) Audit Compliance (No "Write Then Audit")

- **Evidence:** **Verified in app code + SQL:** Force-logout does NOT use withAudit. API calls RPC admin_force_logout_user; RPC performs UPDATE profiles and INSERT audit_logs in same transaction.
- **Status:** **PASS** (atomic audit in RPC).

---

## 5) PII / Case-Gated Chat

- **Scope:** Force-logout does not expose PII beyond existing user detail; no chat access change in this scope.
- **Status:** N/A

---

## 6) Secrets

- **Evidence:** **Verified in app code:** API uses env for Supabase; no hardcoded secrets in force-logout route.
- **Status:** **PASS**

---

## Decision: **APPROVED ✅**

No blockers. RBAC, Zod, and atomic audit (RPC) satisfied for PAGE 06 force-logout.

---

**File:** .TODO/SECURITY_REVIEW_2025-03-02_PAGE_06_Force_Logout.md
