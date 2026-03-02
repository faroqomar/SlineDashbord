# Master Report — Dashboard_Unified (2025-03-02)

**Scope**: Dashboard_Unified  
**Plan**: .TODO/PLAN_2025-03-02_Dashboard_Unified.md  
**Pipeline**: Sequential agents run; hard gates triggered.

---

## A) Executive Summary

- **Scope reviewed**: Full dashboard migration (PAGE 01–08+), with focus on current codebase state and PAGE 02 (canonical audit).
- **Overall risk level**: **HIGH** — Privileged mutations are not atomic with audit; legacy `admin_logs` used for writes; dashboard read path already uses `audit_logs` (canonical shape).
- **Final decision**: **Blocked**
- **Gate statuses**:
  - SecGuard: **BLOCKED ❌** (audit non-atomic + admin_logs)
  - CodeWarden: **BLOCKED ❌** (same)
  - QA: **FAIL ❌** (critical flow: audit atomicity)
  - Architect: No blocker in admin-ui
  - SysOp: Audit compliance and contract gaps documented
  - PerfOpt / Modernizer / DocKeeper: No blockers; recommendations only

---

## B) Consolidated Findings (Deduplicated)

### Security
| Severity | Owner | Evidence | Finding | Fix |
|----------|--------|----------|---------|-----|
| BLOCKER | SecGuard | apps/api/src/audit.ts, all withAudit call sites | Non-atomic audit; writes to admin_logs | PAGE 02: atomic audit_logs via DB RPC or transaction; remove admin_logs writes |

### Data Integrity / Schema Drift
| Severity | Owner | Evidence | Finding | Fix |
|----------|--------|----------|---------|-----|
| BLOCKER | SysOp | audit.ts, tasks.ts, users.ts, finance.ts, disputes.ts, team.ts | admin_logs used for writes; dashboard reads audit_logs | Migrate all writes to audit_logs; canonical columns; atomic with mutation |
| HIGH | SysOp | tasks.ts GET /:id/activity | Reads admin_logs (legacy columns) | Switch to audit_logs + canonical shape (actor_user_id, etc.) |

### Contracts / DTO Drift
| Severity | Owner | Evidence | Finding | Fix |
|----------|--------|----------|---------|-----|
| MED | SysOp | packages/shared/src/schemas/ | Missing audit.ts (AuditActionEnum, MutationAckSchema, AuditLogRowSchema) | Add schemas/audit.ts; use in API responses where audit data is returned |

### Architecture / MVVM
| Severity | Owner | Evidence | Finding | Fix |
|----------|--------|----------|---------|-----|
| — | Architect | admin-ui | No forbidden imports; ViewModel → API client pattern in place | Optional: route all API calls through ViewModels (some views call api directly for actions) |
| BLOCKER | CodeWarden | apps/api | Non-atomic audit; admin_logs | Same as Security/Data Integrity |

### Performance
| Severity | Owner | Evidence | Finding | Fix |
|----------|--------|----------|---------|-----|
| LOW | PerfOpt | dashboard, tasks | Cursor pagination for large lists; index audit_logs for activity/dashboard | Add when implementing PAGE 02; lazy-load charts if needed |

### Testing / QA
| Severity | Owner | Evidence | Finding | Fix |
|----------|--------|----------|---------|-----|
| BLOCKER | QA | Trust boundary | Mutations without atomic audit fail gate | After PAGE 02: Supertest + Playwright with audit evidence checks |

### Docs / Reference Integrity
| Severity | Owner | Evidence | Finding | Fix |
|----------|--------|----------|---------|-----|
| MED | DocKeeper | Security/DB docs | admin_logs vs audit_logs; atomic requirement | Update docs; add docs/features/audit-migration.md when PAGE 02 done |

---

## C) Fix Plan (Ordered, Step-by-Step)

**Step 1 — PAGE 02: Canonical audit (unblock gates)**  
- **Owner**: @SysOp  
- **What**: Add `packages/shared/src/schemas/audit.ts` (AuditActionEnum, MutationAckSchema, AuditLogRowSchema with canonical columns: actor_user_id, action, related_entity_type, related_entity_id, meta). In app repo: ensure audit_logs table and (if needed) RPC that performs mutation + single audit_logs insert in one transaction. In dashboard API: replace all withAudit usage with atomic path (call RPC or run mutation + audit_logs insert in one transaction). Update tasks GET /:id/activity to read from audit_logs with canonical columns. Remove all writes to admin_logs.  
- **Where**: packages/shared/src/schemas/audit.ts (new); apps/api/src/audit.ts (replace); apps/api/src/routes/tasks.ts, users.ts, finance.ts, disputes.ts, team.ts; app repo migrations/RPCs.  
- **Verification**: Grep for admin_logs in apps/api and apps/admin-ui → 0. Integration test: one mutation produces one audit_logs row in same transaction (or RPC succeeds atomically).

**Step 2 — SecGuard / CodeWarden re-run**  
- **Owner**: @SecGuard, @CodeWarden  
- **What**: Re-run security and architecture review after Step 1.  
- **Verification**: Both return APPROVED.

**Step 3 — QA re-run**  
- **Owner**: @QA  
- **What**: Supertest (401/403/200, Zod validation); Playwright for critical mutation flows; verify audit evidence.  
- **Verification**: QA report PASS.

**Step 4 — Docs update**  
- **Owner**: @DocKeeper  
- **What**: Update ADMIN_SECURITY_MANUAL / ADMIN_DATABASE_REF; add docs/features/audit-migration.md.  
- **Verification**: No references to admin_logs as current; atomic audit described.

**Step 5 — PAGE 03+ (Finance RPC, admin_users, moderation, etc.)**  
- **Owner**: @SysOp, @AdminArchitect, @UIExpert as per plan  
- **What**: Per MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md pages.  
- **Verification**: Per-page gates.

---

## D) Regression Checklist

- Auth: GET /api/v1/auth/me with valid/invalid cookie.
- RBAC: support cannot call admin-only endpoints (e.g. tasks list, finance approve).
- Dashboard: GET /dashboard/overview returns stats and recent activity from audit_logs.
- Users: list, detail, ban/unban (with reason) → audit row.
- Tasks: list, detail, activity (from audit_logs), force-cancel → audit row.
- Finance: withdrawals list, approve/reject → audit row, idempotency.
- Build + typecheck + forbidden-import scan (admin-ui).

---

## E) Rollback Notes

- **Contracts**: Adding audit.ts is additive; no breaking change to existing response shapes if only used for new/updated audit responses.
- **API**: Replacing withAudit with RPC or transaction: deploy API after DB migration; keep admin_logs table read-only during transition if needed for rollback.
- **DB**: Prefer forward-fix (migrate to audit_logs) over rolling back migrations; document backup/restore if required.
- **UI**: No change in this fix plan; no UI rollback.

---

## F) Next Actions (Immediate)

1. **Implement PAGE 02 (atomic audit_logs; remove admin_logs writes)** — Owner: @SysOp. Unblocks SecGuard, CodeWarden, QA.
2. **Add packages/shared/src/schemas/audit.ts** — Owner: @SysOp. Required for PAGE 02.
3. **Re-run SecGuard and CodeWarden** after Step 1 — Owner: Orchestrator / requestor.
4. **Re-run QA** (Supertest + Playwright, audit evidence) — Owner: @QA.
5. **Update security and DB docs; add audit-migration feature doc** — Owner: @DocKeeper.

---

**File**: .TODO/MASTER_REPORT_2025-03-02_Dashboard_Unified.md
