# Master Report — PAGE 08 Cases Domain

**Scope:** PAGE_08_Cases (Case Management Core)  
**Plan reference:** Execution per plan (PAGE 08 — Cases Domain)  
**Date:** 2025-03-02  
**Orchestrator:** `.agent/workflows/orechestrator.md`

---

## A) Executive Summary

| Item | Result |
|------|--------|
| **Scope reviewed** | Cases API (GET/POST /cases, GET /cases/:id, POST /cases/:id/entities), shared contracts, admin_cases + admin_case_entities migration, admin-ui list/detail/create/attach. |
| **Overall risk level** | **LOW** — No BLOCKERs; SecGuard APPROVED, CodeWarden APPROVED, QA PASS. |
| **Final decision** | **Ready** — No pipeline stop; optional fixes below. |
| **Gate statuses** | SecGuard: APPROVED. CodeWarden: APPROVED. QA: PASS. Architect/SysOp/PerfOpt/Modernizer/DocKeeper: no blockers. |

---

## B) Consolidated Findings (Deduplicated)

### Security
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | No service-role or server-only Supabase in admin-ui cases feature | SecGuard | Verified in dashboard code: grep 0 in cases feature. | None. |
| — | All cases routes gated by requireAdminRole(CASES_ROLES) | SecGuard | Verified in dashboard code: cases.ts. | None. |
| — | Audit written per create and attach; canonical columns only | SecGuard | Verified in dashboard code: audit.ts, cases.ts. | None. |
| LOW | Optional: validate :caseId as UUID for 400 on malformed ID | SecGuard | Verified in dashboard code: no UUID check on param. | Optional. |

### Data Integrity / Schema
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| MED | AdminCaseCreateInputSchema has subject optional; DB has subject NOT NULL | SysOp | Verified in dashboard code: packages/shared cases.ts. | Make subject required (remove .optional() or add .refine). |
| LOW | List response { cases, count, totalPages } vs AdminCaseListResponseSchema { total, page, limit } | SysOp | Verified in dashboard code: API returns count/totalPages; schema has total/page/limit. | Align schema or document; optional. |
| LOW | (inserted as any).assignee_id in cases.ts | SysOp | Verified in dashboard code: line 149. | Type select so assignee_id is typed. |

### Architecture / MVVM
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | Views use VM only; no DB in UI | CodeWarden | Verified in dashboard code. | None. |
| — | cases_api used by VM and by CasesScreen (dynamic import for create) | CodeWarden | Verified in dashboard code. | Optional: static import in Screen. |

### Performance
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | Offset pagination; N+1 absent; indexes present | PerfOpt | Verified in dashboard code + SQL. | None. |
| LOW | Cursor pagination preferred for large lists (project rule) | PerfOpt | Verified in dashboard code. | Future task if list scales. |

### Testing / QA
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| — | 401/400/404/200/201/500 covered; integration create+attach | QA | Verified in dashboard code: cases.test.ts. | None. |

### Docs
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| LOW | Migration README could note admin_cases migration | DocKeeper | Verified in dashboard code. | Optional. |
| LOW | Feature doc for cases (list/detail/create/attach) | DocKeeper | — | Optional: docs/features/cases.md. |

---

## C) Fix Plan (Ordered)

| Step | Owner | What | Where | Verification |
|------|--------|------|--------|---------------|
| 1 | @SysOp | Make subject required for create: AdminCaseCreateInputSchema — subject with .min(1).max(500), remove .optional(). | packages/shared/src/schemas/cases.ts | Unit test: {} or { subject: '' } fails. |
| 2 | @SysOp | (Optional) Align GET list response with AdminCaseListResponseSchema or document current shape. | packages/shared or API | Typecheck. |
| 3 | @SysOp | (Optional) Remove (inserted as any).assignee_id; ensure select type includes assignee_id. | apps/api/src/routes/cases.ts | Typecheck. |
| 4 | @DocKeeper | (Optional) Add sentence to MIGRATIONS/README.md re 20260308100000_admin_cases. | MIGRATIONS/README.md | — |
| 5 | @DocKeeper | (Optional) Add docs/features/cases.md. | docs/ or .TODO/ | — |

**Note:** Step 1 is the only recommended fix for correctness (subject required). Steps 2–5 are optional.

---

## D) Regression Checklist

- [ ] **Auth:** 401 without token on all cases endpoints (covered by tests).
- [ ] **Cases list:** GET /api/v1/cases returns 200 with cases array when authenticated (or 500 if DB missing).
- [ ] **Create case:** POST with valid subject returns 201; one audit row (admin.case.create).
- [ ] **Attach entity:** POST with valid caseId and body returns 200; one audit row (admin.case.attach_entity).
- [ ] **UI:** /cases and /cases/:caseId load; create dialog and attach form work.
- [ ] **Build/tests:** `npm run -w @sline/api test -- src/routes/cases.test.ts` and `npm run -w @sline/shared test` pass.

---

## E) Rollback Notes

| Area | Rollback |
|------|----------|
| **Contracts** | Revert packages/shared/src/schemas/cases.ts and index export for cases. |
| **API** | Remove cases routes from app.ts; delete apps/api/src/routes/cases.ts. |
| **DB** | Migration is additive (tables, enums, RLS). Rollback = drop admin_case_entities then admin_cases; remove enum value only if no audit rows use admin_case. |
| **UI** | Remove cases routes and feature from App.tsx and Sidebar; delete apps/admin-ui/src/features/cases, routes/Cases.tsx, CaseDetail.tsx. |

---

## F) Next Actions (Immediate)

| # | Action | Owner |
|---|--------|--------|
| 1 | Apply fix step 1: subject required in AdminCaseCreateInputSchema. | @SysOp |
| 2 | Run `npm run -w @sline/api test -- src/routes/cases.test.ts` and shared tests after fix. | @QA |
| 3 | (Optional) Apply migration to Supabase if not yet applied. | DevOps |
| 4 | (Optional) Add MIGRATIONS/README note and feature doc. | @DocKeeper |
| 5 | Proceed to PAGE 09 (chat moderation / case-gated access) when ready. | — |

---

*Generated per Orchestrator workflow. SecGuard APPROVED; CodeWarden APPROVED; QA PASS. No pipeline block.*
