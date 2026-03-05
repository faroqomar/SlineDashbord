# QA Report — Dashboard_Unified (2025-03-02)

**Scope**: Dashboard_Unified  
**Plan**: .TODO/PLAN_2025-03-02_Dashboard_Unified.md  
**Evidence**: Plan + agent reports; no test execution in this run

---

## 1) Supertest List (API)

**Recommended verification commands (run after API + env):**

| Endpoint | Auth | Expected |
|----------|------|----------|
| GET /api/v1/auth/me | No cookie | 401 |
| GET /api/v1/auth/me | Valid admin cookie | 200, role in body |
| GET /api/v1/dashboard/overview | No cookie | 401 |
| GET /api/v1/dashboard/overview | support role | 200 |
| GET /api/v1/tasks | admin/super_admin | 200 |
| GET /api/v1/tasks | support only | 403 |
| POST /api/v1/users/:id/ban | admin, body with reason | 200 (and audit; currently admin_logs) |
| POST /api/v1/finance/withdrawals/:id/approve | super_admin | 200 + idempotency behavior |

- **Validation**: Invalid UUID, missing required body → 400 (Zod). **Evidence**: RBAC and route structure from SysOp/Architect.

---

## 2) Playwright Flows (Critical / Destructive)

- **Recommend**: Login → Dashboard load → Users list → User detail → Ban user (with reason) → Verify UI update and (when atomic audit exists) audit evidence. Same for force-cancel task, approve/reject withdrawal.
- **Bounded waits**: Use waitForResponse or waitForSelector with timeout; no arbitrary sleep. **Evidence**: QA Tester workflow.

---

## 3) Fixture / Seed Expectations

- **Delegate to @DataSmith** if needed: seed admin_users, profiles, tasks, disputes, withdrawal_requests for consistent 401/403/200 and mutation tests.
- **Evidence**: Plan and QA workflow.

---

## 4) Trust Boundary Tests

- **Hard-fail if**: admin-ui bundle contains Supabase service-role or server-only imports (forbidden-import scan). **Verified**: None in admin-ui per SecGuard/CodeWarden.
- **Blocking for sign-off**: Privileged mutation must write audit atomically. **Current state**: Non-atomic; QA cannot sign off on mutation flows until PAGE 02 fix.

---

## Decision: **FAIL ❌** (Critical Flow)

**Reason**: Audit atomicity is a trust-boundary requirement. Until mutations are atomic with audit_logs, critical flows (ban, force-cancel, approve/reject, etc.) **fail** the gate. After PAGE 02: re-run Supertest + Playwright and confirm audit evidence per mutation.

---

**File**: .TODO/QA_REPORT_2025-03-02_Dashboard_Unified.md
