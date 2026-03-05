# Code Warden Review — PAGE 06 Force Logout (2025-03-02)

**Scope:** PAGE_06_Force_Logout  
**Plan:** .TODO/PLAN_PAGE_06_Force_Logout_Session_Revocation.md  
**Evidence:** Verified in dashboard and API code

---

## 1) Boundary Enforcement (Admin UI)

- **Forbidden imports:** **Verified in dashboard code** — No server-only Supabase or admin client in UserDetail.tsx or users_api.ts for force-logout. Request goes through central request().
- **ViewModel/View standards:** UserDetail uses useMutation with request() for force-logout; no DB or RBAC logic in UI. **PASS.**
- **Fixed:** UserDetail now uses users_api.forceLogoutUser() in the force-logout mutation for consistency with ban/suspend.

---

## 2) API Standards (apps/api)

- **Privileged mutation + audit:** **Verified in app code** — Force-logout does not use withAudit; it calls RPC admin_force_logout_user which does UPDATE + INSERT audit_logs in one transaction. **PASS.**
- **Zod:** ForceLogoutInputSchema used; safeParse before RPC. **PASS.**
- **RBAC:** Role and adminId checked; 401/403 returned. **PASS.**

---

## 3) Scalability & Maintainability

- **God files:** users.ts and UserDetail.tsx not oversized; force-logout adds minimal surface. **PASS.**
- **DRY:** users_api.forceLogoutUser exists; View could use it for consistency. Optional refactor.

---

## 4) Violations List (Exact Paths)

| Severity | Location | Finding |
|----------|----------|---------|
| — | None | No BLOCKER or HIGH. |

---

## 5) Required Refactors

- None. UserDetail.tsx was refactored to use users_api.forceLogoutUser() in forceLogoutMutation (done).

---

## 6) What Must NOT Be Done

- Do not add withAudit for force-logout (RPC already does atomic audit).
- Do not allow support role to call force-logout (RBAC must remain).

---

## Decision: **APPROVED ✅**

MVVM and atomic-audit rules satisfied. No blocking violations.

---

**File:** .TODO/CODEWARDEN_REVIEW_2025-03-02_PAGE_06_Force_Logout.md
