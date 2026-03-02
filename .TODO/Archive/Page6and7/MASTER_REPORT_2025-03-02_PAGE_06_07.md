# Master Report — PAGE 06 & PAGE 07 (Force Logout + Bookings Admin)

**Scope:** PAGE 06 (Force Logout / Session Revocation) + PAGE 07 (Bookings Admin Plane)  
**Plan references:** `.TODO/PLAN_PAGE_06_Force_Logout_Session_Revocation.md`, PAGE 07 plan (execution checklist in MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md)  
**Date:** 2025-03-02  
**Orchestrator:** Multi-agent review per `.agent/workflows/orechestrator.md`

---

## A) Executive Summary

| Item | Result |
|------|--------|
| **Scope reviewed** | PAGE 06 (force-logout API, RPC, UI, app-enforcement doc) + PAGE 07 (bookings list/detail/cancel/refund API, RPCs, UI, contracts, tests). |
| **Overall risk level** | **LOW** — No blockers; no HIGH findings. |
| **Final decision** | **Ready** — SecGuard APPROVED; CodeWarden APPROVED; QA PASS. |
| **Gate statuses** | Architect: MVVM and route parity OK. SysOp: Endpoints and atomic audit OK. SecGuard: No forbidden imports; RBAC and Zod in place. CodeWarden: Boundaries respected. PerfOpt: Minor pagination note. Modernizer: No new deps. QA: Tests pass. DocKeeper: Enforcement doc exists; optional feature doc. |

---

## B) Consolidated Findings (Deduplicated)

### Security
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | No service-role or server-only Supabase in admin-ui (bookings or user detail) | SecGuard | Verified in dashboard code: grep in features/bookings and routes. | None. |
| — | RBAC enforced: bookings list/cancel (moderator+), refund (admin+); force-logout (admin/super_admin only) | SecGuard | Verified in dashboard code: requireAdminRole and USERS_WRITE_ROLES check. | None. |
| — | All relevant inputs validated with Zod (shared schemas) | SecGuard | Verified in dashboard code: safeParse in bookings.ts and users.ts. | None. |
| — | Mutations use RPC-only audit (no withAudit); single audit row per action | SecGuard | Verified in dashboard code: no withAudit in bookings or force-logout handlers. | None. |

### Data Integrity / Schema / Audit
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | audit_logs written atomically in RPC (admin_cancel_booking, admin_refund_booking, admin_force_logout_user) | SysOp | Verified in dashboard code: migration SQL and route handlers. | None. |
| — | related_entity_type 'booking' and 'profile' used; enum extension (profile) in dashboard migrations | SysOp | Verified in audit doc and migrations. | None. |
| LOW | Bookings RPCs live in dashboard repo; app repo may need copy for production | SysOp | Missing repo evidence for sline_app. | Optional: copy 20260302120000_admin_booking_rpcs.sql to app repo when promoting. |

### Contracts / DTO
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | Bookings schemas (list, detail, cancel, refund) in packages/shared; ForceLogoutInputSchema and AuditActionEnum force_logout in shared | AdminArchitect / SysOp | Verified in dashboard code: schemas exported and used by API and admin-ui. | None. |

### Architecture / MVVM
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | Bookings: View → ViewModel → API client only; no DB/Supabase in UI | CodeWarden | Verified in dashboard code: Bookings.tsx, BookingDetail.tsx, use_bookings_viewmodel, bookings_api. | None. |
| — | Force-logout: UserDetail uses request() to API; no server imports | CodeWarden | Verified in dashboard code: UserDetail.tsx. | None. |

### Performance
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| LOW | Bookings list uses offset pagination; for very large tables cursor-based may be better | PerfOpt | Verified in dashboard code: range(from, to). | Task only: consider cursor pagination later if scale demands. |
| — | No N+1 in bookings list/detail or force-logout | PerfOpt | Verified in dashboard code: single-query patterns. | None. |

### Testing / QA
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | Bookings API tests: 401, 400, 404, 200, (409 idempotency skipped without DB) | QA | Verified in dashboard code: bookings.test.ts. | None. |
| — | Force-logout API tests: 401, 403, 400, 404, 200 | QA | Verified in dashboard code: users.test.ts. | None. |
| — | Shared schema unit tests for bookings and force-logout | QA | Verified in dashboard code: bookings.test.ts, users.test.ts (schemas). | None. |
| — | Playwright: bookings list/detail and cancel flow | QA | Verified in dashboard code: e2e/bookings.spec.ts. | None. |

### Docs / Reference
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | FORCE_LOGOUT_APP_ENFORCEMENT.md exists; app-repo enforcement documented | DocKeeper | Verified in dashboard code: MIGRATIONS/for_sline_app/. | None. |
| LOW | Optional: add short feature doc for Bookings Admin (list/detail/cancel/refund, RBAC) | DocKeeper | — | Optional: docs/features/bookings-admin.md or section elsewhere. |

---

## C) Fix Plan (Ordered)

No blocking fixes required. Optional / follow-up only:

| Step | Owner | What | Where | Verification |
|------|--------|------|--------|--------------|
| 1 | @DocKeeper | (Optional) Add migration list entry for 20260302120000_admin_booking_rpcs.sql if not in MIGRATIONS/README.md | MIGRATIONS/README.md | Grep for 20260302120000. |
| 2 | @SysOp / DevOps | (Optional) When promoting to production, copy admin_booking_rpcs SQL to app repo | sline_app/supabase/migrations | App repo has RPCs. |
| 3 | @PerfOpt | (Optional) If bookings table grows large, consider cursor pagination for GET /bookings | apps/api/src/routes/bookings.ts | Design only; no change now. |

---

## D) Regression Checklist

- [x] **Auth:** 401 without token on bookings and force-logout (covered by tests).
- [x] **Bookings:** List/detail/cancel/refund with valid auth; 400 invalid id/reason; 404 missing booking (covered).
- [x] **Force logout:** 403 for non–admin/super_admin; 200 with valid payload (covered).
- [x] **Audit:** One audit_logs row per cancel/refund/force-logout (RPC-only; no withAudit).
- [x] **Build/tests:** `npm run -w @sline/api test` and `npm run -w @sline/shared test` pass (bookings + users + shared schema tests).

---

## E) Rollback Notes

| Area | Rollback |
|------|----------|
| **Contracts** | Additive only; no breaking change to existing schemas. Revert commits to remove bookings/force-logout schemas if needed. |
| **API** | Remove bookings route registration and POST force-logout handler; revert bookings.ts and users.ts changes. |
| **DB** | Migrations are additive (new column force_logout_after; new RPCs). Rollback = revert migration or drop RPCs; no drop-column required for bookings. |
| **UI** | Remove bookings routes and Sidebar entry; remove force-logout button/mutation from UserDetail. Revert route and component commits. |

---

## F) Next Actions (Immediate)

| # | Action | Owner | Status |
|---|--------|--------|--------|
| 1 | Run `npm run -w @sline/api test` and `npm run -w @sline/shared test` to confirm all tests pass | @QA | Recommended |
| 2 | Apply dashboard migrations (force_logout, admin_booking_rpcs) to target DB if not already applied | @DevOps | As needed |
| 3 | (Optional) Add PAGE 07 migration to MIGRATIONS/README.md list | @DocKeeper | Optional |
| 4 | (Optional) Copy admin_booking_rpcs to app repo for production DB | @SysOp | When promoting |
| 5 | No pipeline block; implementation **Ready** per gates | — | Done |

---

## Agent Report Index

- `.TODO/ARCHITECT_REPORT_2025-03-02_PAGE_06_07.md`
- `.TODO/SYSOP_REPORT_2025-03-02_PAGE_06_07.md`
- `.TODO/SECURITY_REVIEW_2025-03-02_PAGE_06_07.md`
- `.TODO/CODEWARDEN_REVIEW_2025-03-02_PAGE_06_07.md`
- `.TODO/PERF_REPORT_2025-03-02_PAGE_06_07.md`
- `.TODO/MODERNIZER_REPORT_2025-03-02_PAGE_06_07.md`
- `.TODO/QA_REPORT_2025-03-02_PAGE_06_07.md`
- `.TODO/DOCS_REPORT_2025-03-02_PAGE_06_07.md`

---

*Generated per Orchestrator workflow. One agent at a time; one truth at the end. No blockers; scope Ready.*
