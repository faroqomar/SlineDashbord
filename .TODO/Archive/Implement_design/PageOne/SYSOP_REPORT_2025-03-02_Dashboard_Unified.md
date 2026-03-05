# SysOp Report — Dashboard_Unified (2025-03-02)

**Scope**: Dashboard_Unified  
**Plan**: .TODO/PLAN_2025-03-02_Dashboard_Unified.md  
**Evidence**: Verified in API and shared code (dashboard repo)

---

## 1) Endpoint Inventory (Fastify)

- **Verified in app code**: Routes under `apps/api/src/routes/`: auth, dashboard, disputes, finance, team, tasks, users. Index registers routes at `/api/v1/*`.
- **Dashboard**: GET `/dashboard/overview` (reads audit_logs, tasks, profiles, disputes, vw_analytics_*).
- **Tasks**: GET `/tasks`, GET `/tasks/:id`, GET `/tasks/:id/activity`, POST `/tasks/:id/status` (withAudit).
- **Users**: GET `/users`, GET `/users/:id`, POST `/users/:id/ban`, POST `/users/:id/unban`, etc. (withAudit).
- **Finance**: GET/POST approve/reject withdrawals (withAudit), metrics, transactions, withdrawals.
- **Team**: POST invite (manual audit_logs insert), DELETE `/:userId` (withAudit).
- **Disputes**: list, detail, resolve (withAudit).

---

## 2) Contract Map Changes (packages/shared)

| Need | Status | Evidence |
|------|--------|----------|
| `schemas/audit.ts` | **Missing** | No file in packages/shared/src/schemas/ |
| AuditActionEnum, MutationAckSchema, AuditLogRowSchema (canonical columns) | Required for PAGE 02 | Plan + dashboard route expects audit_logs shape |
| auth.ts AdminRole enum | Check | RBAC uses string roles; canonical enum recommended for PAGE 04 |

---

## 3) DB / RPC Requirements (App Repo)

- **Canonical schema**: Lives in `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` (not verified in this repo).
- **PAGE 02**: Replace all `admin_logs` usage with `audit_logs`; RPC or single-statement writes that do mutation + audit in one transaction (app repo).
- **PAGE 03**: `admin_process_withdrawal` (or equivalent) in app repo; signature and columns aligned with API.
- **PAGE 04**: `admin_users` table in app repo; RBAC reads from it.

---

## 4) Audit_logs Atomicity Compliance Status

| Location | Evidence | Status |
|----------|----------|--------|
| `apps/api/src/audit.ts` | **Verified in app code**: Writes to `admin_logs` after handler runs; non-atomic (handler then insert). | **NON-COMPLIANT** |
| `apps/api/src/routes/tasks.ts` | Uses `withAudit` (→ admin_logs); GET `/:id/activity` reads from `admin_logs`. | **NON-COMPLIANT** (legacy table + non-atomic) |
| `apps/api/src/routes/users.ts` | withAudit (ban/unban). | **NON-COMPLIANT** (admin_logs, non-atomic) |
| `apps/api/src/routes/finance.ts` | withAudit (approve/reject). | **NON-COMPLIANT** |
| `apps/api/src/routes/disputes.ts` | withAudit. | **NON-COMPLIANT** |
| `apps/api/src/routes/team.ts` | Invite: manual `audit_logs.insert` (actor_id, entity_type, entity_id, metadata). Remove: withAudit→admin_logs. | **MIXED** (one path uses audit_logs but column names may drift from canonical) |
| `apps/api/src/routes/dashboard.ts` | **Verified in app code**: Reads `audit_logs` with `actor_user_id`, `action`, `meta`, `profiles!actor_user_id`. | **READ path canonical**; write path still admin_logs elsewhere |

**Conclusion**: No privileged mutation is atomic with audit. All withAudit flows are log-after-write and target `admin_logs`. Team invite writes to `audit_logs` but column names (actor_id, entity_type, entity_id, metadata) may not match canonical (actor_user_id, related_entity_type, related_entity_id, meta). **BLOCKER for PAGE 02.**

---

## 5) Exact SQL Object Names + Route Paths

- **admin_logs** (legacy): Used in `audit.ts` (insert), `tasks.ts` (select for activity). **Remove or replace with audit_logs + canonical columns.**
- **audit_logs**: Used in `dashboard.ts` (select), `team.ts` (insert for invite). Canonical columns: actor_user_id, action, related_entity_type, related_entity_id, meta (per plan).
- **Routes**: `/api/v1/dashboard/overview`, `/api/v1/tasks`, `/api/v1/tasks/:id`, `/api/v1/tasks/:id/activity`, `/api/v1/tasks/:id/status`, `/api/v1/users`, `/api/v1/finance/withdrawals/:requestId/approve|reject`, `/api/v1/team`, `/api/v1/disputes`, etc.

---

## 6) Recommendations (Ordered)

1. **PAGE 02 (Blocker)**: Introduce `packages/shared/src/schemas/audit.ts` with canonical AuditLogRowSchema (actor_user_id, action, related_entity_type, related_entity_id, meta). Migrate all audit writes to `audit_logs` with these columns; move mutation+audit into DB RPC (app repo) for atomicity. Remove `withAudit` usage that writes to `admin_logs`. Update tasks `/:id/activity` to read from `audit_logs` with canonical shape.
2. Align team invite audit insert with canonical column names (actor_user_id, related_entity_type, related_entity_id, meta).
3. PAGE 03–04: Align finance RPC and admin_users per plan (app repo).

---

**Conclusion**: Endpoint inventory and RBAC (requireAdminRole) are in place. **Data integrity**: audit is non-atomic and uses legacy `admin_logs` in most paths; must be fixed before production-safe rollout. Evidence: verified in dashboard codebase.
