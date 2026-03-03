# Architect Report — PAGE 12 Finance (Transaction Detail, Audit Export, User Lookup)

**Scope:** PAGE_12_Finance_Transaction_Detail_Audit_Export_User_Lookup  
**Date:** 2026-03-03  
**Agent:** @AdminArchitect  
**Plan:** `.TODO/PLAN_PAGE_12_Finance_Transaction_Detail_Audit_Export_User_Lookup.md`

---

## 1) Feature Page ID

PAGE 12 — Finance: Transaction Detail + Audit Export + User Lookup

---

## 2) Architecture / VM / Route Structure

### MVVM boundary check

| Layer | Status | Evidence (dashboard code) |
|-------|--------|---------------------------|
| **Views (Routes)** | ✅ | `FinanceAuditPage`, `FinanceUserLookupPage`, `FinanceTransactionDetailPage`, `FinanceUsersPage` use only ViewModel hooks; no direct API or DB. |
| **ViewModels** | ✅ | `useTransactionDetailVM`, `useAuditLogsVM`, `useFinanceUserLookupVM` call only `financeApi` (client wrapper); no Supabase, no RBAC logic. |
| **API client** | ✅ | `finance_api.ts` uses `request()` / `api` from `@/lib/api`; no server-only imports. |

**Verified in dashboard code:** No `@/lib/supabase/*`, no `createAdminClient`, no `next/*` in `apps/admin-ui/src/features/finance/**`.

### Route parity (TanStack Router)

| Route | File | Purpose |
|-------|------|--------|
| `/finance/audit` | `FinanceAudit.tsx` | Audit list + filters + Export CSV |
| `/finance/users` | `FinanceUsers.tsx` (FinanceUsersPage) | User ID search → navigate to `/finance/users/$userId` |
| `/finance/users/$userId` | `FinanceUsers.tsx` (FinanceUserLookupPage) | User wallet + timeline |
| `/finance/transactions/$journalId` | `FinanceTransactionDetail.tsx` | Transaction detail + Reveal sensitive |

**Verified in dashboard code:** Routes registered in `App.tsx`; `useParams` used for `journalId` / `userId`.

### Contract needs

| Contract | Source | Status |
|----------|--------|--------|
| Audit list/export filters + response | `packages/shared` AuditLogListFiltersSchema, AuditExportQuerySchema, AuditLogListEntrySchema | ✅ Used in API; admin-ui uses local `AuditLogFilters` / `AuditLogEntry` from `finance.model` (aligns with shared shape). |
| Transaction detail | JournalLedgerEntrySchema, TransactionDetailsSchema | ✅ API validates; UI uses `JournalLedgerEntry` from `finance.model`. |
| User lookup | UserLookupSchema, WalletSummarySchema | ✅ API validates; UI uses `WalletSummary`, `JournalLedgerEntry` from `finance.model`. |

**Recommendation (LOW):** Optionally import/derive UI types from `@sline/shared` where response schemas exist to reduce drift risk. Not blocking.

---

## 3) Structure (feature-first)

- `apps/admin-ui/src/features/finance/`
  - `services/finance_api.ts` — API client (GET transaction detail, audit list/export, user lookup).
  - `viewmodels/useTransactionDetail.vm.ts`, `useAuditLogs.vm.ts`, `useFinanceUserLookup.vm.ts`.
  - `components/` — UserWalletCard, TransactionsTable (reused).
  - `models/finance.model.ts` — TS types for UI (PlatformMetrics, JournalLedgerEntry, WalletSummary, AuditLogEntry, etc.).

**Verified in dashboard code:** Feature folder exists; no `api/` subfolder (services used instead), which is acceptable.

---

## 4) Gate checklist

| Gate | Result |
|------|--------|
| Build / typecheck | ✅ (verified in execution) |
| Forbidden-import gate | ✅ No server/Supabase imports in admin-ui finance |
| Route reachable | ✅ Routes wired in App.tsx |
| View → VM → API only | ✅ |

---

## 5) Handoff notes

- **@SysOp:** No further API contract changes required for PAGE 12 scope. Optional: Zod for GET /transactions list query (same file).
- **@UIExpert:** All PAGE 12 pages have loading/empty/error states; Export CSV disabled while loading. Optional: explicit confirmation dialog before "Reveal sensitive" (currently one-click then load with reveal=1).

---

**Conclusion:** Architecture and MVVM boundaries for PAGE 12 are satisfied. No blocking defects.
