# Security Review — PAGE 08 Cases Domain

**Scope:** PAGE_08_Cases  
**Date:** 2025-03-02  
**Agent:** @SecGuard (Hard Security Gate)

---

## 1) Forbidden imports (admin-ui)

| Check | Evidence | Result |
|-------|----------|--------|
| No server-only Supabase in cases feature | Verified in dashboard code | `apps/admin-ui/src/features/cases/` — grep for supabase, service_role, createAdminClient, server: **0 matches**. |
| cases_api uses request() only | Verified in dashboard code | `cases_api.ts` — imports from `@/lib/api` and `@sline/shared`; no Supabase. |

**Verdict:** No forbidden imports in cases feature. **PASS**

---

## 2) RBAC enforcement

| Route | Required role | Evidence |
|-------|----------------|----------|
| GET /api/v1/cases | support | moderator | admin | super_admin | Verified in dashboard code: `requireAdminRole(roles)` with `CASES_ROLES`. |
| GET /api/v1/cases/:caseId | same | Verified in dashboard code |
| POST /api/v1/cases | same | Verified in dashboard code |
| POST /api/v1/cases/:caseId/entities | same | Verified in dashboard code |

**Verdict:** All cases endpoints protected by RBAC. **PASS**

---

## 3) PII / case-gated chat

- **PAGE 08 scope:** Cases only; no chat content, no PII in case subject/source. Case IDs are internal.
- **Chat access:** Case-gating is PAGE 09; not in scope for this review.

**Verdict:** N/A for PAGE 08. No PII exposure in cases API responses beyond subject/source (admin-only).

---

## 4) Audit compliance

| Rule | Evidence | Result |
|------|----------|--------|
| Every privileged mutation produces audit | Verified in dashboard code | Create case: `writeAuditLog(admin.case.create, admin_case, inserted.id)`. Attach: `withAudit(admin.case.attach_entity, ...)`. |
| Canonical columns only | Verified in dashboard code | `audit.ts` — actor_user_id, action, related_entity_type, related_entity_id, meta. |
| No "write then audit" in UI | Verified in dashboard code | Audit only in API; admin-ui has no audit writes. |

**Note:** Audit is non-atomic (handler then insert). Documented in audit.ts; plan accepted. **PASS**

---

## 5) Input validation

| Input | Validation | Evidence |
|-------|------------|----------|
| POST /cases body | AdminCaseCreateInputSchema.safeParse | Verified in dashboard code; 400 on parse failure. |
| POST /cases/:id/entities body | AdminCaseAttachEntityInputSchema.safeParse | Verified in dashboard code; 400 on parse failure. |
| :caseId param | Used as UUID in Supabase query; 404 if not found | Verified in dashboard code. No explicit UUID regex; Supabase returns error for invalid UUID. |

**Recommendation (LOW):** Optionally validate `caseId` as UUID before DB call to return 400 instead of 500 on malformed ID.

---

## Decision: **APPROVED**

No blockers. Cases feature complies with RBAC, no server-only code in admin-ui, audit written per mutation, input validated with Zod.
