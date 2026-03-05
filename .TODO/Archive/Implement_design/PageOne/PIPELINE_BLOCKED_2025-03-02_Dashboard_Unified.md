# Pipeline Blocked — Dashboard_Unified (2025-03-02)

**Scope**: Dashboard_Unified  
**Stopped at**: Hard gate (SecGuard + CodeWarden + QA)

---

## Why Blocked

1. **@SecGuard** returned **BLOCKED ❌**: Privileged mutations do not write to `public.audit_logs` atomically. Current code uses "log after write" and writes to legacy `admin_logs`, violating the security manual and project context.
2. **@CodeWarden** returned **BLOCKED ❌**: Same architecture violation — API must use DB RPC (or single transaction) for mutation + audit; no non-atomic withAudit or admin_logs.
3. **@QA** returned **FAIL ❌** on critical flow: Trust boundary requires audit to be written atomically with the mutation; current state fails this gate.

---

## What to Fix First

- **Implement PAGE 02 (Canonical Audit: Kill admin_logs Drift)**:
  - Add `packages/shared/src/schemas/audit.ts` with canonical audit DTOs.
  - Ensure all privileged mutations write to `audit_logs` (not `admin_logs`) with canonical columns (actor_user_id, action, related_entity_type, related_entity_id, meta).
  - Make every such write **atomic** with the mutation (DB RPC or single transaction in API).
  - Update GET `/api/v1/tasks/:id/activity` to read from `audit_logs` with canonical shape.
  - Remove all usage of `admin_logs` in apps/api and packages/shared.

---

## Which Agents Must Rerun After Fix

- **@SecGuard** — Re-run security review; must return APPROVED.
- **@CodeWarden** — Re-run architecture review; must return APPROVED.
- **@QA** — Re-run test plan and critical flows; must return PASS.

---

**File**: .TODO/PIPELINE_BLOCKED_2025-03-02_Dashboard_Unified.md
