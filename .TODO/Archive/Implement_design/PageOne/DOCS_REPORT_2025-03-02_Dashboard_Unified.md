# Doc Keeper Report — Dashboard_Unified (2025-03-02)

**Scope**: Dashboard_Unified  
**Plan**: .TODO/PLAN_2025-03-02_Dashboard_Unified.md  
**Evidence**: Repo layout and plan

---

## 1) Docs That Need Updates Now

- **ADMIN_SECURITY_MANUAL / ADMIN_DATABASE_REF** (if present): State that **audit_logs** is canonical and **admin_logs** is legacy/deprecated; all new code must use audit_logs with atomic writes. Remove or update any reference that implies "log after write" is acceptable.
- **ADMIN_DEVELOPER_GUIDE**: Ensure API contract describes ServiceResult, Zod-first validation, and RBAC per route; add note that audit must be atomic (DB RPC or transaction). **Evidence**: Project context and orchestrator rules.

---

## 2) New Feature Doc to Create

- **docs/features/audit-migration.md** (when PAGE 02 is implemented): Describe canonical audit_logs schema (actor_user_id, action, related_entity_type, related_entity_id, meta), migration from admin_logs, and atomic-write pattern (RPC or transaction). **Evidence**: Plan PAGE 02.

---

## 3) Broken Refs / Outdated Assumptions

- Any doc that references **admin_logs** as the audit table should be updated to **audit_logs** and canonical columns after PAGE 02.
- **Evidence**: SysOp and SecGuard reports.

---

## 4) Summary

- Update security and DB docs to reflect audit_logs as canonical and atomic requirement; add feature doc for audit migration when implemented. No BLOCKER from Doc Keeper; documentation delta is tied to PAGE 02 completion.

---

**File**: .TODO/DOCS_REPORT_2025-03-02_Dashboard_Unified.md
