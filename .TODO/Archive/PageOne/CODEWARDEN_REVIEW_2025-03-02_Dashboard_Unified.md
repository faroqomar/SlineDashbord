# Code Warden Review — Dashboard_Unified (2025-03-02)

**Scope**: Dashboard_Unified  
**Plan**: .TODO/PLAN_2025-03-02_Dashboard_Unified.md  
**Evidence**: Verified in dashboard and API code

---

## 1) Boundary Enforcement (Admin UI)

- **Forbidden imports**: **Verified in dashboard code** — No `@/lib/supabase/admin`, `@/lib/supabase/server`, `createAdminClient`, `auth.admin`, `@/types/supabase`, `next/*` in `apps/admin-ui/src`. Grep returned no matches.
- **ViewModel standards**: ViewModels use API clients (dashboard_api, users_api, team_api, etc.) and TanStack Query; no RBAC logic in UI; no raw fetch outside central wrapper (request() in lib/api.ts). **PASS.**
- **Minor**: Some views import API functions directly for callbacks (InviteAdminDialog → inviteMember, AdminTable → removeMember). Prefer routing through ViewModel for consistency; not a hard violation.

---

## 2) API Standards (apps/api)

- **Privileged mutation + audit**: **Verified in app code** — `audit.ts` runs handler then inserts into `admin_logs` (non-atomic). All withAudit routes (users, tasks, finance, disputes, team) are log-after-write. **BLOCKER** per Iron Architecture Rule.
- **Zod**: Routes use shared schemas and validation; RBAC via requireAdminRole on all privileged routes. **PASS** for Zod/RBAC.
- **Idempotency-Key**: Finance approve/reject and other replay-sensitive mutations should require Idempotency-Key; not verified in this pass. **Recommend** explicit check per route.

---

## 3) Scalability & Maintainability

- **God files**: No route or viewmodel file exceeded 300 lines in spot check. Tables (Users, Tasks, Finance) use components; no single file bloat observed. **PASS.**
- **DRY**: API client pattern is consistent (features/*/services/*_api). **PASS.**

---

## 4) Violations List (Exact Paths)

| Severity | Location | Finding |
|----------|----------|---------|
| **BLOCKER** | `apps/api/src/audit.ts` | Non-atomic audit: handler then insert to `admin_logs`. Must be same transaction / DB RPC. |
| **BLOCKER** | All routes using `withAudit` | Write to legacy `admin_logs`; must migrate to `audit_logs` with canonical columns and atomic write. |
| **HIGH** | `apps/api/src/routes/tasks.ts` (GET `/:id/activity`) | Reads from `admin_logs`; must read from `audit_logs` with canonical shape. |

---

## 5) Required Refactors (Target Paths)

1. **apps/api/src/audit.ts**: Remove or replace withAudit that writes to admin_logs. Replace with: either (a) call DB RPC that does mutation + audit_logs insert in one transaction, or (b) use a single transaction in API that does mutation + audit_logs insert.
2. **apps/api/src/routes/*.ts**: All callers of withAudit: switch to atomic audit path (RPC or transaction); ensure audit_logs columns: actor_user_id, action, related_entity_type, related_entity_id, meta.
3. **apps/api/src/routes/tasks.ts**: Change `/:id/activity` to select from `audit_logs` with canonical columns and join to profiles on actor_user_id.

---

## 6) What Must NOT Be Done

- Do not add new uses of `admin_logs` or non-atomic "log after write."
- Do not move RBAC or audit logic into admin-ui.
- Do not allow views to fetch data directly from Supabase or to hold service-role tokens.

---

## Decision: **BLOCKED ❌**

**Reason**: Architecture rule requires "API → DB RPC (atomic audit)". Current implementation violates this with non-atomic withAudit and admin_logs. Must fix per PAGE 02 before **APPROVED**.

---

**File**: .TODO/CODEWARDEN_REVIEW_2025-03-02_Dashboard_Unified.md
