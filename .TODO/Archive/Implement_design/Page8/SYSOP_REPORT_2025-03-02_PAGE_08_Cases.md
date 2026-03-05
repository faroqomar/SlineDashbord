# SysOp Report — PAGE 08 Cases Domain

**Scope:** PAGE_08_Cases  
**Date:** 2025-03-02  
**Agent:** @SysOp

---

## 1) Endpoint inventory (Fastify)

| Method | Path | RBAC | Audit | Evidence |
|--------|------|------|-------|----------|
| GET | /api/v1/cases | requireAdminRole(CASES_ROLES) | — | Verified in dashboard code: `apps/api/src/routes/cases.ts` |
| GET | /api/v1/cases/:caseId | requireAdminRole(CASES_ROLES) | — | Verified in dashboard code |
| POST | /api/v1/cases | requireAdminRole(CASES_ROLES) | writeAuditLog(admin.case.create) | Verified in dashboard code |
| POST | /api/v1/cases/:caseId/entities | requireAdminRole(CASES_ROLES) | withAudit(admin.case.attach_entity) | Verified in dashboard code |

Cases routes registered in `apps/api/src/app.ts` at prefix `/api/v1/cases`. Verified in dashboard code.

---

## 2) Contract map (packages/shared)

| Schema | Used by | Evidence |
|--------|---------|----------|
| AdminCaseCreateInputSchema | POST /cases body | Verified in dashboard code: cases.ts safeParse |
| AdminCaseAttachEntityInputSchema | POST /cases/:id/entities body | Verified in dashboard code |
| AdminCase, AdminCaseDetail | GET responses | Verified in dashboard code |
| CASES_ROLES | requireAdminRole | Verified in dashboard code |

**Drift:** GET list returns `{ cases, count, totalPages }`; `AdminCaseListResponseSchema` defines `{ cases, total, page, limit }`. API does not use AdminCaseListResponseSchema for response validation; UI consumes count/totalPages. Optional: align schema or rename response fields.

---

## 3) DB / RPC requirements

| Object | Evidence | Owner |
|--------|----------|--------|
| admin_cases | Verified in SQL | `supabase/migrations/20260308100000_admin_cases.sql` — dashboard repo; production truth in sline_app per migration comment. |
| admin_case_entities | Verified in SQL | Same migration; UNIQUE(case_id, entity_type, entity_id). |
| related_entity_type_enum | Verified in SQL | Extended with `admin_case` in same migration (DO block). |
| RLS | Verified in SQL | service_role only for both tables. |

No RPCs for cases; direct table insert/select. Audit writes via `audit_logs` (canonical columns).

---

## 4) audit_logs atomicity compliance

| Operation | Atomic? | Evidence |
|-----------|--------|----------|
| Create case | No | Verified in dashboard code: insert then `writeAuditLog()`; documented non-atomic in audit.ts. Plan accepted for PAGE 08. |
| Attach entity | No | Verified in dashboard code: `withAudit()` runs handler then audit insert. Same pattern as other routes. |

**Verdict:** Compliant with current project pattern (non-atomic audit). Future: consider DB RPC that does mutation + audit in one transaction.

---

## 5) Exact paths / SQL objects

- **API:** `apps/api/src/routes/cases.ts`, `apps/api/src/audit.ts` (writeAuditLog)
- **Shared:** `packages/shared/src/schemas/cases.ts`
- **Migration:** `supabase/migrations/20260308100000_admin_cases.sql`
- **Tables:** `public.admin_cases`, `public.admin_case_entities`
- **Enums:** `admin_case_status_enum`, `admin_case_priority_enum`, `admin_case_entity_type_enum`

---

## 6) Fix recommendations (SysOp)

1. **MED** — Make `subject` required in `AdminCaseCreateInputSchema`: remove `.optional()` so empty body fails validation before DB (subject NOT NULL).
2. **LOW** — Align list response with `AdminCaseListResponseSchema` (e.g. add `page`, `limit`, rename `count`→`total`) or document current shape and leave schema for future use.
3. **LOW** — Remove `(inserted as any).assignee_id` in cases.ts line 149; use typed select so assignee_id is known.
