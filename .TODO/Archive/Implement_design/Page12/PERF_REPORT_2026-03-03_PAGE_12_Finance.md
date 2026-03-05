# Perf Opt Report — PAGE 12 Finance (Transaction Detail, Audit Export, User Lookup)

**Scope:** PAGE_12_Finance_Transaction_Detail_Audit_Export_User_Lookup  
**Date:** 2026-03-03  
**Agent:** @PerfOpt  
**Plan:** `.TODO/PLAN_PAGE_12_Finance_Transaction_Detail_Audit_Export_User_Lookup.md`

---

## 1) Pagination strategy

| Endpoint | Strategy | Status |
|----------|----------|--------|
| GET /finance/audit | Cursor `(created_at, id)` | ✅ — Verified in app code: buildAuditQuery uses .or() cursor, limit. |
| GET /finance/audit/export | Same buildAuditQuery, limit cap 10000 | ✅ — Export matches list query; no offset. |
| GET /finance/users/:userId (timeline) | Limit 20, no cursor | ✅ — Bounded; acceptable for “recent activity”. |

**Evidence (app code):** `finance.ts` buildAuditQuery, GET /audit, GET /audit/export.

---

## 2) N+1 / request patterns

| Flow | Risk | Status |
|------|------|--------|
| User lookup | Two reads (balance + timeline) | ✅ — Promise.all for vw_wallet_balances_user and vw_wallet_activity_user; single round-trip. |
| Audit list / export | Single query each | ✅ — No N+1. |

---

## 3) Bundle / frontend

- PAGE 12 adds no new heavy deps. Audit and user lookup use existing table/components (TransactionsTable, UserWalletCard).
- Export CSV: blob download; no large in-memory DOM. ✅

---

## 4) Recommended indexes (tasks, not code)

- **audit_logs:** Composite index `(created_at DESC, id DESC)` (and optionally action, actor_user_id) if list/export become slow at scale. Evidence: app repo migrations (canonical); add in app repo if needed.
- **vw_wallet_activity_user:** Ensure view definition is efficient for `user_id + order by created_at`; app repo owns view.

---

**Conclusion:** No performance blockers for PAGE 12. Cursor pagination and export cap are in place; user lookup is bounded.
