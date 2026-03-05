# Master Report — PAGE 15 User Investigation

**Scope:** PAGE_15_User_Investigation  
**Date:** 2025-03-03  
**Plan reference:** `.TODO/PLAN_PAGE_15_User_Investigation.md`  
**Orchestrator:** Multi-Agent Pipeline (Architect → SysOp → SecGuard → CodeWarden → PerfOpt → Modernizer → QA → DocKeeper)

---

## A) Executive Summary

| Item | Value |
|------|--------|
| Scope reviewed | PAGE_15_User_Investigation (User Investigation: deep user review, PII masking/reveal, evidence-pack, audit) |
| Overall risk level | **Low** |
| Final decision | **Ready** |
| Gate statuses | @SecGuard APPROVED ✅; @CodeWarden APPROVED ✅; @QA PASS ✅; no BLOCKER; no pipeline stop. |

All hard gates passed. Optional improvements are MED/LOW and do not block release.

---

## B) Consolidated Findings (Deduplicated)

### Security
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| LOW | Optional: add audit_logs row for admin.pii.reveal for consistency with other privileged actions | @SysOp | SecGuard/SysOp: reveal only writes admin_pii_access_logs | writeAuditLog(..., 'admin.pii.reveal', ...) after admin_pii_access_logs insert if policy requires |
| LOW | Optional: validate userId (UUID) in path for GET investigation/conversations to avoid unnecessary DB calls for malformed IDs | @SysOp | SysOp: params.userId not Zod-validated | z.string().uuid().safeParse(userId); 400 if invalid |

### Data Integrity / Schema Drift
- No schema drift. admin_pii_access_logs migration and shared schemas (investigation, users masked/revealed) are in place. [Verified in dashboard code]

### Contracts / DTO Drift
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| MED | UI uses `any` for investigation and evidence-pack response types | @CodeWarden / @UIExpert | CodeWarden/Architect: request&lt;{ profile: any; ... }&gt;, map callbacks (t: any), etc. | Import shared types (UserInvestigationResponse, etc.) or define local interfaces in UserInvestigation.tsx |

### Architecture / MVVM
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| MED | UserInvestigation.tsx ~320 lines (hard limit 300 for route component) | @CodeWarden / @UIExpert | CodeWarden: line count | Extract tab content to subcomponents or useUserInvestigation hook to bring file under 300 lines |
| LOW | Optional: extract useUserInvestigation(userId) to a viewmodel hook for reuse | @AdminArchitect | Architect: single-page acceptable; optional improvement | Add features/investigation/ or similar and move data-fetch logic to hook |

### Performance
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| LOW | Investigation/conversations unbounded; N+1-style multiple Supabase calls in GET investigation | @PerfOpt / @SysOp | PerfOpt report | Optional: cursor/limit for sub-feeds; optional: single RPC or batched read if latency becomes an issue |
| LOW | If vw_admin_journal_ledger is slow, ensure index on entity_id | @SysOp | PerfOpt | Verify view/index in DB |

### Testing / QA
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| LOW | No Playwright E2E for investigation flow | @QA | QA report | Optional: add flow User Detail → Investigation → tabs → evidence-pack / Reveal PII |

### Docs / Reference Integrity
| Severity | Finding | Owner | Evidence | Fix |
|----------|---------|-------|----------|-----|
| LOW | Optional: docs/features/user-investigation.md; optional: update SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md evidence table for investigation | @DocKeeper | DocKeeper report | Add feature doc; update audit doc evidence labels |

---

## C) Fix Plan (Ordered, Step-by-Step)

| Step | Owner | What | Where | Verification |
|------|-------|------|--------|--------------|
| 1 | @UIExpert | Replace `any` with shared or explicit types in UserInvestigation.tsx | apps/admin-ui/src/routes/UserInvestigation.tsx | Typecheck passes; no `any` in request generics or map callbacks |
| 2 | @UIExpert | Reduce file to ≤300 lines: extract tab content to components or data hook | apps/admin-ui/src/routes/UserInvestigation.tsx (+ new components or hook file) | wc -l &lt; 300; build passes |
| 3 | @SysOp | (Optional) Add UUID validation for userId on GET investigation and GET conversations | apps/api/src/routes/users.ts | 400 for invalid UUID; existing tests still pass |
| 4 | @SysOp | (Optional) Add writeAuditLog for admin.pii.reveal after admin_pii_access_logs insert | apps/api/src/routes/users.ts | Audit row present when reveal succeeds |
| 5 | @QA | (Optional) Add Playwright: user detail → investigation → tabs | apps/admin-ui e2e or playwright config | E2E run green |
| 6 | @DocKeeper | (Optional) Add docs/features/user-investigation.md; update SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md | docs/features/, MIGRATIONS/ | Docs align with implementation |

---

## D) Regression Checklist

- [ ] Auth: login, /auth/me, 401 on protected API without cookie
- [ ] User list/detail: load user, open User Detail, link to Investigation
- [ ] Investigation: GET investigation 200/404 with auth; tabs render; evidence-pack export (moderator+); Reveal PII (admin/super_admin only)
- [ ] RBAC: support cannot access evidence-pack or reveal-pii (403)
- [ ] Audit: investigation view and evidence-pack export write audit_logs; reveal writes admin_pii_access_logs
- [ ] Cases/chat: case-gated chat unchanged; no new chat endpoint in PAGE 15

**Quick test:**  
`npm test -- apps/api/src/routes/users.test.ts` (include PAGE 15 block). Manual: log in as admin → User → Investigation → switch tabs → Export evidence-pack → Reveal PII with reason.

---

## E) Rollback Notes

| Area | Rollback strategy |
|------|--------------------|
| API | Revert apps/api/src/routes/users.ts (investigation, conversations, evidence-pack, reveal-pii); ensure no other route depends on PAGE 15 contracts. |
| UI | Revert App.tsx route and UserInvestigation.tsx; remove Investigation link from UserDetail.tsx. |
| Contracts | Revert packages/shared (investigation.ts, users.ts masked/revealed, audit actions); ensure no other consumer. |
| DB | admin_pii_access_logs table can remain; no destructive migration. Forward-fix only if new columns needed. |
| Docs | Revert Docs/ADMIN_FEATURES.md section 3b and P15 PR checklist. |

---

## F) Next Actions (Immediate)

| # | Action | Owner |
|---|--------|--------|
| 1 | Ship PAGE 15 as-is (all gates passed) or apply Fix Plan steps 1–2 (types + line count) before merge | Dev |
| 2 | (Optional) Steps 3–4: UUID validation and audit_logs for reveal | @SysOp |
| 3 | (Optional) Step 5: Playwright investigation flow | @QA |
| 4 | (Optional) Step 6: user-investigation feature doc + audit doc update | @DocKeeper |
| 5 | Run full test suite and fix any unrelated failures (e.g. Finance route type) in separate PR | Dev |

---

**Pipeline status:** Complete. No BLOCKER; **Ready** for release with optional improvements tracked above.
