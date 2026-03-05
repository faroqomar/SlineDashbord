# Security Review — PAGE 12 Finance (Transaction Detail, Audit Export, User Lookup)

**Scope:** PAGE_12_Finance_Transaction_Detail_Audit_Export_User_Lookup  
**Date:** 2026-03-03  
**Agent:** @SecGuard  
**Plan:** `.TODO/PLAN_PAGE_12_Finance_Transaction_Detail_Audit_Export_User_Lookup.md`

---

## 1) Forbidden imports (admin-ui)

**Requirement:** admin-ui must not contain server-only Supabase or service-role code.

**Result:** ✅ **PASS**  
**Evidence (dashboard code):** Grep for `supabase|createAdminClient|auth.admin|@/lib/supabase` in `apps/admin-ui/src/features/finance` — no matches. Finance feature uses only `@/lib/api` and `financeApi` (client wrapper).

---

## 2) RBAC enforcement

| Endpoint | Required roles | Implementation |
|----------|----------------|----------------|
| GET /finance/transactions/:journalId | FINANCE_WRITE_ROLES (admin, super_admin) | preHandler: requireAdminRole(FINANCE_WRITE_ROLES) |
| GET /finance/audit | admin, super_admin | preHandler: requireAdminRole(FINANCE_WRITE_ROLES) |
| GET /finance/audit/export | admin, super_admin | preHandler: requireAdminRole(FINANCE_WRITE_ROLES) |
| GET /finance/users/:userId | admin, super_admin | preHandler: requireAdminRole(FINANCE_WRITE_ROLES) |

**Evidence (app code):** `finance.ts` — all four PAGE 12 routes use `requireAdminRole(FINANCE_WRITE_ROLES)`. Role matrix comment at top of file documents intent.

---

## 3) PII masking / reveal

| Flow | Requirement | Status |
|------|-------------|--------|
| Transaction detail default | meta_full masked (not returned) | ✅ API strips meta_full when reveal≠1 (L197–198). |
| Transaction detail ?reveal=1 | Audit row inserted first, then return meta_full | ✅ Insert then reply (L187–195). |
| Audit export CSV | Plan: avoid full PII dump in meta | ⚠️ **MED** — CSV currently exports `JSON.stringify(r.meta)`. If meta contains PII, export exposes it. Recommend redacting meta to action/entity ids only for export, or document as known risk. |

---

## 4) Audit compliance

- **No “write then audit”:** Reveal flow inserts audit then returns; no “return then audit”. ✅  
- **Canonical table:** `audit_logs` used (not admin_logs). ✅  
- **Action:** `admin.finance.tx_view_sensitive_meta` in AuditActionEnum and used on insert. ✅  

---

## 5) Input validation

All PAGE 12 routes validate input with Zod (TransactionDetailsSchema, AuditLogListFiltersSchema, AuditExportQuerySchema, UserLookupSchema) before DB access. ✅  

---

## Decision

**APPROVED ✅** for PAGE 12 scope.

**Conditional recommendation (non-blocking):** Restrict or redact `meta` in audit CSV export to reduce PII exposure; document until then.
