# SysOp Report — PAGE 12 Finance (Transaction Detail, Audit Export, User Lookup)

**Scope:** PAGE_12_Finance_Transaction_Detail_Audit_Export_User_Lookup  
**Date:** 2026-03-03  
**Agent:** @SysOp  
**Plan:** `.TODO/PLAN_PAGE_12_Finance_Transaction_Detail_Audit_Export_User_Lookup.md`

---

## 1) Endpoint inventory (Fastify) — PAGE 12

| Method | Path | Zod input | RBAC | Evidence |
|--------|------|-----------|------|----------|
| GET | `/finance/transactions/:journalId` | TransactionDetailsSchema (journalId) | requireAdminRole(FINANCE_WRITE_ROLES) | Verified in app code: `finance.ts` L171–209 |
| GET | `/finance/audit` | AuditLogListFiltersSchema | requireAdminRole(FINANCE_WRITE_ROLES) | Verified in app code: `finance.ts` L472–512 |
| GET | `/finance/audit/export` | AuditExportQuerySchema | requireAdminRole(FINANCE_WRITE_ROLES) | Verified in app code: `finance.ts` L438–466 |
| GET | `/finance/users/:userId` | UserLookupSchema | requireAdminRole(FINANCE_WRITE_ROLES) | Verified in app code: `finance.ts` L516–556 |

---

## 2) Contract map (packages/shared)

| Schema | File | Used by |
|--------|------|--------|
| AuditLogListFiltersSchema, AuditExportQuerySchema | audit.ts | GET /audit, GET /audit/export |
| AuditActionEnum ('admin.finance.tx_view_sensitive_meta') | audit.ts | audit_logs insert on reveal |
| TransactionDetailsSchema, JournalLedgerEntrySchema | finance.ts | GET /transactions/:journalId |
| UserLookupSchema, WalletSummarySchema | finance.ts | GET /users/:userId |

**Verified in app code:** All imported from `@sline/shared` in `apps/api/src/routes/finance.ts`.

---

## 3) DB / RPC requirements

| Object | Purpose | Repo |
|--------|---------|------|
| `audit_logs` | List, export, and insert on tx reveal | App repo (canonical) |
| `vw_admin_journal_ledger` | Transaction detail + list | App repo |
| `vw_wallet_balances_user`, `vw_wallet_activity_user` | User lookup | App repo |

**Verified in dashboard code:** Discovery doc `MIGRATIONS/PAGE_12_audit_logs_and_wallet_views_columns.md` references app-repo DDL. API returns 501 for user lookup when views unavailable.

---

## 4) Audit_logs atomicity

| Flow | Atomic? | Evidence |
|------|--------|----------|
| Transaction detail with `?reveal=1` | ✅ Insert audit row then return row with meta_full (same request, no “return then audit”) | Verified in app code: `finance.ts` L186–195 |
| Withdrawal approve/reject | ✅ RPC `admin_process_withdrawal` is single writer (no API withAudit) | Verified in app code + MIGRATIONS |

---

## 5) Findings (drift / gaps)

| Severity | Finding | Location | Evidence |
|----------|---------|----------|----------|
| **MED** | GET `/finance/transactions` (list) uses `(request.query as any)` with no Zod validation | `finance.ts` L206–228 | Verified in app code — PAGE 12 does not add this route but it shares the file; list endpoint has no shared schema for query params. |
| **LOW** | `(request as any).user` used for auth user; no typed request extension | `finance.ts` multiple | Verified in app code — works but reduces type safety. |

---

## 6) Exact file paths touched (PAGE 12)

- `apps/api/src/routes/finance.ts` — buildAuditQuery, GET transactions/:journalId, GET audit, GET audit/export, GET users/:userId
- `packages/shared/src/schemas/audit.ts` — PAGE 12 schemas + tx_view_sensitive_meta
- `packages/shared/src/schemas/finance.ts` — WalletSummarySchema, UserLookupSchema (if added/used)
- `MIGRATIONS/PAGE_12_audit_logs_and_wallet_views_columns.md` — discovery

---

**Conclusion:** PAGE 12 backend and contracts are correctly implemented. Recommend adding Zod for GET /transactions list query in a follow-up (same file, non-blocking for PAGE 12).
