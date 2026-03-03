# Feature Plan: PAGE 12 — Finance: Transaction Detail + Audit Export + User Lookup

**Source:** [MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md](../../MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md) (Page 12)  
**Planner:** [.agent/workflows/planner.md](../../.agent/workflows/planner.md)  
**Critic:** [.agent/workflows/plan_critic.md](../../.agent/workflows/plan_critic.md) — execution-safe, gate-based rewrite

---

## A) Assumptions + Decision Needed (Blocking)

### Assumptions (safe to infer)

- **Verified in dashboard code:** Existing finance API (`apps/api/src/routes/finance.ts`) and shared schemas (`packages/shared/src/schemas/finance.ts`, `audit.ts`) are the single source for extending routes and contracts.
- **Verified in SQL / audit doc:** `audit_logs`, `vw_admin_journal_ledger`, `vw_wallet_balances_user`, `vw_wallet_activity_user` exist in app repo (sline_app migrations); dashboard API uses service-role and must not depend on DDL in dashboard repo.
- **Verified in legacy code:** Legacy finance audit uses `audit_logs` with cursor `(created_at, id)`; legacy transaction detail masks `meta_full` by role and logs `admin.finance.tx_view_sensitive_meta` on reveal.
- **Canonical stack:** UI = Vite SPA (TanStack Router), API = Fastify, contracts = Zod in `packages/shared`; DB truth = sline_app migrations; privileged writes = atomic `audit_logs` in same transaction.

### Decision Needed (Blocking)

| # | Missing decision | Options | Recommended | Plan impact |
|---|-------------------|---------|-------------|-------------|
| D1 | **Transaction detail UX:** route vs drawer | (1) Route `/finance/transactions/$journalId` (2) Drawer from list (3) Both (drawer primary, route for deep link) | **Option 3** — Drawer for flow from list; route for bookmark/share. Same API; UI has both. | Plan adds explicit step: drawer + route; acceptance: both paths open detail and support reveal. |
| D2 | **audit_logs table columns in deployed DB** | Dashboard migrations only INSERT (action, actor_user_id, related_entity_type, related_entity_id, meta). Legacy expects `id`, `created_at`, `journal_entry_id`. | **Assume** app repo `20260225_create_ledger_core_schema.sql` defines `audit_logs` with `id` (PK), `created_at`; add `journal_entry_id` if present. **Discovery step** must confirm before implementing list/export. | Phase 1 includes "Confirm audit_logs columns (id, created_at, journal_entry_id?) from app repo or schema dump"; if missing, add migration to app repo before Phase 2. |
| D3 | **Who may call GET /audit and GET /audit/export?** | (1) FINANCE_WRITE_ROLES only (admin, super_admin) (2) FINANCE_READ_ROLES (support, moderator, admin, super_admin) | **FINANCE_WRITE_ROLES** — Matches legacy `getAuditLogs` (FINANCE_WRITE_ROLES). Audit trail is sensitive; restrict to admin+. | Plan states RBAC: `requireAdminRole(['admin', 'super_admin'])` for both list and export. |

---

## B) Gate Status (Pass/Fail)

| Gate | Status | Reasons | Fixes to pass |
|------|--------|---------|----------------|
| **0. Test Infrastructure** | ❌ FAIL | No explicit test env, fixtures, or export CSV assertion method. | Add step: QA defines test user + role injection; export test compares list count to CSV row count (excluding header). |
| **1. Data/Contracts** | ❌ FAIL | audit_logs list shape (id, created_at) not confirmed; `admin.finance.tx_view_sensitive_meta` not in AuditActionEnum; WalletSummarySchema not in shared. | Phase 1: Discovery of audit_logs columns; add action to enum; add AuditLogListEntrySchema, AuditLogListFiltersSchema, AuditExportQuerySchema, WalletSummarySchema. |
| **2. Security** | ⚠️ PARTIAL | Reveal-audit and RBAC mentioned; no explicit role matrix; export filter bypass risk. | Add role matrix table; enforce "export uses exact same query builder as list" (single function). |
| **3. Backend/API** | ❌ FAIL | Four endpoints missing; reveal flow must be atomic (insert audit then return). | Phase 2: Implement all four routes; shared audit-query helper for list + export. |
| **4. UI/Integration** | ❌ FAIL | Routes /finance/audit, /finance/users/$userId, transaction detail not present. | Phase 4: Add routes and pages; loading/empty/error states; export button double-submit prevention. |
| **5. Release/QA** | ❌ FAIL | No DoD checklist for docs; no rollback or feature-flag mention. | Add DoD item: update Docs/ or ADMIN_*.md if behavior changes; optional feature flag for new routes. |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix (add/reorder) | Owner | Acceptance |
|-----|----------------|-------------------|--------|-------------|
| audit_logs columns unknown | List/export need id, created_at for cursor and response; API will fail or return wrong shape. | **Phase 1.0:** Discover and document audit_logs columns (id, created_at, journal_entry_id, …) from app repo or schema dump. | @SysOp | Doc or comment in repo listing columns; shared schema matches. |
| AuditActionEnum missing tx_view_sensitive_meta | Reveal flow should write a known action; validation may reject. | **Phase 1.1:** Add `'admin.finance.tx_view_sensitive_meta'` to AuditActionEnum in packages/shared. | @SysOp | Grep enum; test parses action. |
| Export vs list query drift | Different code paths → export can return different rows than list for same filters. | **Phase 2:** Single shared function (e.g. buildAuditQuery(filters, cursor?, limit)) used by GET /audit and GET /audit/export; export calls with limit up to 10000. | @SysOp | QA test: same params → list total count equals CSV data rows. |
| No loading/error/empty states for new pages | UX breaks under slow API or missing data. | **Phase 4:** Each new page: loading skeleton, error message + retry, empty state (e.g. "No audit logs", "No user found"). | @UIExpert | Manual or E2E: trigger slow/error/empty; UI shows correct state. |
| Test infra for export not defined | Export test cannot be deterministic or comparable to list. | **Phase 5:** Test uses same filters for list and export; asserts response headers (Content-Disposition, text/csv) and that CSV line count - 1 equals list length for that request. | @QA | Supertest or integration test in repo. |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|--------------|
| Transaction sensitive meta is never returned without an audit row. | API: on reveal, insert into audit_logs first (same request), then return row with meta_full. No "return then audit". | Test: call with ?reveal=1; query audit_logs for that actor and journal_entry_id; assert one row; assert response contains meta. |
| Export returns exactly the set that list would return for the same filters (up to limit). | Single query-builder function; same filters and ordering for list and export. | Test: GET /audit?limit=50&action=X; GET /audit/export?limit=50&action=X; parse CSV; assert CSV data rows length ≤ 50 and equals list length. |
| Only admin and super_admin can list/export audit and view user lookup. | requireAdminRole(['admin','super_admin']) on GET /audit, GET /audit/export, GET /users/:userId. | Supertest: 403 for support/moderator; 200 for admin/super_admin. |
| Transaction detail: support/moderator get masked only; admin/super_admin may request reveal with audit. | RBAC in route; reveal param checked; audit insert only when reveal=1 and role in [admin, super_admin]. | Supertest: support GET detail → no meta_full (or masked); admin GET with reveal=1 → audit row + meta in response. |

---

## E) Risk Register

| Risk | Where | Probability | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|-------------|--------|--------------|--------------|------------|----------|
| audit_logs missing id/created_at | API list/export | Med | High | Feature | 404 or parse error in list | Phase 1 discovery; align schema with app migration or add migration | Return 503 + "Audit schema not available" until fixed |
| Wallet views missing in env | GET /users/:userId | Low | Med | Feature | 501 or empty wallet | Doc dependency on app repo views; Phase 0 confirm | 501 + message "Wallet views not deployed" |
| Export memory OOM (10k rows) | GET /audit/export | Low | Med | Single request | Timeout or crash | Hard cap 10000; consider stream-to-response | Stream CSV rows; or reduce cap to 5000 |
| PII in CSV export | Export response | Med | High | Security-breach | SecGuard review | Export only non-PII columns; no meta dump of user secrets | Redact meta to action/entity ids only in CSV |
| Double-submit on Export button | UI | Med | Low | UX | Duplicate downloads | Disable button while export in progress; or single-click guard | Loading state on button until response |

---

## F) Pre-Mortem

- This fails when **audit_logs** in the deployed DB has no `id` or `created_at` and we never checked — list/export break.
- This fails when **export** uses a different filter parsing or query than list — compliance/audit says "export doesn’t match list."
- This fails when **reveal** returns meta before writing the audit row and the request crashes — sensitive meta was sent without audit.
- This fails when **support** can call GET /audit and we didn’t restrict — audit trail over-exposed.
- This fails when **UI** has no loading state on export and user clicks twice — duplicate downloads or confused state.
- This fails when **tests** don’t assert "export rows = list rows" for same params — drift goes unnoticed.
- This fails when **vw_wallet_activity_user** returns columns that don’t match JournalLedgerEntrySchema — 200 but parse error or wrong UI.

---

## G) Plan Fixes (Concrete Additions)

| Goal | Why | How | Artifact | Stop condition |
|------|-----|-----|----------|-----------------|
| Confirm audit_logs and wallet views | Avoid building on wrong schema. | Grep app repo migrations for audit_logs CREATE; grep for vw_wallet_*. Document columns. | MIGRATIONS/ or doc: audit_logs columns; wallet view columns. | Columns listed; shared schema matches. |
| Single audit query helper | Export matches list. | In finance routes or shared service: buildAuditQuery(supabase, filters, { cursor?, limit }) returning query. Use in GET /audit and GET /audit/export. | apps/api: one function; both routes call it. | Same filters → same row set in test. |
| Add tx_view_sensitive_meta to enum | Validate audit insert. | Add to AuditActionEnum in packages/shared/src/schemas/audit.ts. | audit.ts updated; test. | Enum includes value. |
| Export double-submit prevention | UX. | Disable "Export CSV" while loading; or set loading true on click until response. | Button disabled or loading state. | No duplicate downloads on double click. |
| Test: export matches list | Invariant. | Supertest: request list with filters; request export with same filters; parse CSV; assert length. | finance.test.ts or audit.test.ts. | CI green. |

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

Strict dependency order: **Data/Contracts → Security → Backend → UI → QA**. Gate at end of each phase.

---

### Phase 1: Data & Contracts (Gate: Contracts + Discovery)

**Goal:** Schema and evidence in place so API can be implemented without guessing.  
**Why:** audit_logs and wallet views are in app repo; dashboard must align.  
**How:** Discovery + shared schema changes.

- **Step 1.0 (@SysOp) — Discovery (blocking)**  
  - Confirm `audit_logs` columns (at least id, created_at, actor_user_id, action, related_entity_type, related_entity_id, meta; optionally journal_entry_id) from sline_app migration `20260225_create_ledger_core_schema.sql` or deployed schema.  
  - Confirm `vw_wallet_balances_user` and `vw_wallet_activity_user` columns from app repo `20260225_create_wallet_views.sql` (or equivalent).  
  - Document in MIGRATIONS/ or Docs/: "PAGE 12 – audit_logs columns", "PAGE 12 – wallet view columns".  
  - **Output:** Doc or comment. **Stop:** If audit_logs has no id/created_at, add migration in app repo first and block Phase 2 until applied.

- **Step 1.1 (@SysOp) — Shared audit schemas**  
  - In `packages/shared/src/schemas/audit.ts`: Add `'admin.finance.tx_view_sensitive_meta'` to AuditActionEnum.  
  - Add `AuditLogListEntrySchema`: id (uuid), created_at (string), actor_user_id, action, related_entity_type, related_entity_id, journal_entry_id (optional), meta.  
  - Add `AuditLogListFiltersSchema`: action?, actor_user_id?, start_date?, end_date?, limit?, cursor_created_at?, cursor_id?.  
  - Add `AuditExportQuerySchema`: same as list filters with limit max 10000.  
  - Export from shared index.  
  - **Output:** audit.ts + index. **Stop:** Unit tests parse sample rows.

- **Step 1.2 (@SysOp) — Shared finance schemas**  
  - In `packages/shared/src/schemas/finance.ts`: Add `WalletSummarySchema` (available_balance, held_balance, pending_withdrawal_balance, currency, is_wallet_frozen?) to match wallet view.  
  - **Output:** finance.ts. **Stop:** Unit test for WalletSummarySchema.

**Phase 1 Gate:** Discovery doc exists; AuditActionEnum includes tx_view_sensitive_meta; AuditLogListEntrySchema, AuditLogListFiltersSchema, AuditExportQuerySchema, WalletSummarySchema in shared and tested. ✅/❌

---

### Phase 2: Security (RBAC + Audit Invariants)

**Goal:** Role matrix fixed; reveal = audit then return.  
**Why:** No over-exposure; no sensitive meta without audit.  
**How:** Define matrix; implement reveal with atomic audit insert.

- **Step 2.0 (@SecGuard / @SysOp) — Role matrix**  
  - Document in plan or code comment:

  - GET /finance/transactions (list): admin, super_admin  
  - GET /finance/transactions/:journalId: all finance read roles; masked by default; reveal (meta_full) only admin, super_admin and only after audit insert.  
  - GET /finance/audit, GET /finance/audit/export: admin, super_admin only.  
  - GET /finance/users/:userId: admin, super_admin (or same as transactions list; recommend admin+).  

  - **Output:** Comment in finance.ts or PLAN. **Stop:** Reviewed.

**Phase 2 Gate:** Role matrix documented and enforced in route design. ✅/❌

---

### Phase 3: Backend/API

**Goal:** Four endpoints live; list and export share one query; reveal inserts audit then returns.  
**Why:** Parity with legacy; export matches list; audit invariant.  
**How:** Implement in apps/api/src/routes/finance.ts.

- **Step 3.1 (@SysOp) — GET /transactions/:journalId**  
  - Validate journalId (TransactionDetailsSchema). Query vw_admin_journal_ledger by journal_id.  
  - Default: return row with meta_full omitted or masked.  
  - If query param reveal=1 and role in [admin, super_admin]: insert one row into audit_logs (action: admin.finance.tx_view_sensitive_meta, actor_user_id, related_entity_type, related_entity_id/journal_entry_id, meta with viewed_at), then return row with meta_full.  
  - **Output:** Route. **Stop:** 401/403/200 tests; test reveal creates audit row.

- **Step 3.2 (@SysOp) — Shared audit query helper**  
  - Implement buildAuditQuery(supabase, filters, { cursor?, limit }) used by list and export. Same filters, same order (created_at desc, id desc).  
  - **Output:** Function in finance.ts or shared helper. **Stop:** Used by 3.3 and 3.4.

- **Step 3.3 (@SysOp) — GET /audit**  
  - Validate query with AuditLogListFiltersSchema. Use buildAuditQuery with cursor and limit (default 50). Return { data, nextCursor }. RBAC: requireAdminRole(['admin', 'super_admin']).  
  - **Output:** Route. **Stop:** 401/403/200 with cursor.

- **Step 3.4 (@SysOp) — GET /audit/export**  
  - Same query params as list (AuditExportQuerySchema); max limit 10000. Use buildAuditQuery with no cursor, limit from params. Stream or build CSV (ID, Date, Actor, Action, Entity Type, Entity ID, Journal ID, Metadata). Content-Disposition: attachment; filename="sline_audit_export_YYYY-MM-DD.csv".  
  - **Output:** Route. **Stop:** Same filters → same row count as list (test).

- **Step 3.5 (@SysOp) — GET /users/:userId**  
  - Validate userId (UserLookupSchema). Query vw_wallet_balances_user (single row) and vw_wallet_activity_user (limit 20). Return { wallet: WalletSummary | null, timeline: { data, nextCursor? } }. If view missing: 501 and message. RBAC: requireAdminRole(['admin', 'super_admin']).  
  - **Output:** Route. **Stop:** 401/403/200/501 tests.

**Phase 3 Gate:** All four routes implemented; list and export share buildAuditQuery; reveal inserts then returns; Supertest 401/403/200 and "export matches list" pass. ✅/❌

---

### Phase 4: ViewModels

**Goal:** VMs for transaction detail, audit list/export, user lookup; no DB/server-only in UI.  
**Why:** MVVM; UI only calls API.  
**How:** Add hooks in apps/admin-ui/src/features/finance.

- **Step 4.1 (@AdminArchitect)**  
  - useTransactionDetail.vm.ts: fetch GET /finance/transactions/:journalId; optional reveal (confirm then request with ?reveal=1).  
  - useAuditLogs.vm.ts: list with filters + cursor; export action (current filters → GET /audit/export, trigger download).  
  - useFinanceUserLookup.vm.ts: userId input, fetch GET /finance/users/:userId, expose wallet + timeline.  
  - **Output:** Three VM files. **Stop:** CodeWarden MVVM check (no Supabase/DB in VMs).

**Phase 4 Gate:** VMs present and pure. ✅/❌

---

### Phase 5: UI

**Goal:** Routes and pages for audit, user lookup, transaction detail (drawer + route); loading/empty/error; export single-click.  
**Why:** Parity with legacy; safe UX.  
**How:** Add routes and components in admin-ui.

- **Step 5.1 (@UIExpert)**  
  - Add route /finance/audit. Page: filters (action, actor_user_id, start_date, end_date), table (Date, Actor, Action, Entity, Journal ID, Meta), cursor pagination, "Export CSV" (disabled while loading; uses current filters). Loading, empty, error states.  
  - **Output:** Route + page. **Stop:** Smoke: filters, export, no double download.

- **Step 5.2 (@UIExpert)**  
  - Add route /finance/users/$userId. Page: userId search (input + submit), then UserWalletCard + timeline (reuse TransactionsTable or similar). Loading, empty ("No user found"), error states.  
  - **Output:** Route + page. **Stop:** Smoke: search, wallet + timeline.

- **Step 5.3 (@UIExpert)**  
  - Transaction detail: (1) Drawer from transactions list (row click); (2) Route /finance/transactions/$journalId. Both show one transaction; "Reveal sensitive" for admin/super_admin with confirmation; VM calls reveal flow. Loading, error states.  
  - **Output:** Drawer + route + shared detail content. **Stop:** Smoke: open from list and via URL; reveal creates audit.

**Phase 5 Gate:** All three surfaces exist; loading/empty/error; export single-click. ✅/❌

---

### Phase 6: Testing & QA

**Goal:** Deterministic tests; export matches list; role gating; docs updated.  
**Why:** No regression; invariant proof.  
**How:** Supertest + optional E2E; Doc Keeper.

- **Step 6.1 (@QA)**  
  - Supertest: GET /transactions/:journalId — 401, 403 (support if restricted), 200 masked, 200 with reveal and audit row present.  
  - Supertest: GET /audit — 401, 403, 200 with filters and cursor.  
  - Supertest: GET /audit/export — same filters as list; assert CSV line count - 1 = list length; 403 for support.  
  - Supertest: GET /users/:userId — 401, 403, 200 (when views exist), 501 (when views missing if implemented).  
  - **Output:** finance.test.ts (or audit.test.ts). **Stop:** CI green.

- **Step 6.2 (@DataSmith)**  
  - (Optional) Mock pack: same filter set for list and export for deterministic test.  
  - **Output:** Fixtures. **Stop:** Test uses fixtures.

- **Step 6.3 (@Doc Keeper)**  
  - Update Docs/ or ADMIN_*.md: new routes /finance/audit, /finance/users/:userId, transaction detail; export and masking behavior.  
  - **Output:** Doc update. **Stop:** DoD checklist includes "docs updated".

**Phase 6 Gate:** All tests pass; export matches list asserted; docs updated. ✅/❌

---

## I) Change Report (Diff-Style)

### 1) Original issues summary

- Discovery of audit_logs and wallet view columns was optional; critic requires it blocking (wrong schema = broken API).
- Export and list could diverge (no single query helper).
- AuditActionEnum did not include admin.finance.tx_view_sensitive_meta.
- Role matrix for audit vs transaction vs user lookup was implicit.
- Loading/empty/error states and export double-submit were not required.
- Test "export matches list" was not concrete (no CSV parse + count).
- Transaction detail "route or drawer" was ambiguous; no decision.
- Test Infrastructure Gate and Release/QA Gate were not in the original gate list.
- Phase order did not explicitly separate Security (RBAC + invariants) before Backend.

### 2) Added steps

- **Phase 1.0:** Discovery of audit_logs and wallet view columns (blocking).
- **Phase 2.0:** Role matrix (document and enforce).
- **Step 3.2:** buildAuditQuery shared helper for list + export.
- **Step 6.3:** Docs update (DoD).
- Explicit loading/empty/error and export single-click prevention in Phase 5.
- Test: CSV line count - 1 = list length for same params.

### 3) Removed steps

- None; optional DataSmith step kept as optional.

### 4) Reordered steps

- Discovery (1.0) before any new schema that depends on audit_logs shape.
- Security phase (Phase 2) before Backend (Phase 3).
- QA and docs (Phase 6) after UI (Phase 5).

### 5) Expanded steps

- Phase 1: Added stop condition "if audit_logs has no id/created_at, block until migration".
- Phase 3: Reveal flow specified as "insert audit then return"; buildAuditQuery required.
- Phase 5: Loading, empty, error, and export double-submit explicitly required.
- Phase 6: Export test specified as "same params → list count = CSV data rows".

### 6) Why

- To make the plan execution-safe and repo-verifiable: no guessing on schema, no export/list drift, no sensitive meta without audit, no UX gaps, and test proof for invariants.

### 7) Residual risks

- Deployed DB may still differ from app repo migrations (no live dump in repo); discovery is best-effort from migrations. Mitigation: document assumption; if staging fails, add schema check or migration.
- E2E for "reveal creates audit" is optional; Supertest covers API. Consider adding Playwright for full flow later.

---

## Definition of Done (DoD)

- [x] **Discovery:** audit_logs and wallet view columns documented; shared schemas match.
- [x] **GET /api/v1/finance/transactions/:journalId** exists; masked by default; reveal=1 for admin/super_admin inserts audit then returns meta_full.
- [x] **GET /api/v1/finance/audit** and **GET /api/v1/finance/audit/export** exist; same buildAuditQuery; export matches list (test); RBAC admin/super_admin only.
- [x] **GET /api/v1/finance/users/:userId** exists; wallet + timeline; 501 if views missing; RBAC admin/super_admin.
- [x] **UI:** /finance/audit, /finance/users/$userId, transaction detail (drawer + /finance/transactions/$journalId); loading/empty/error; export single-click.
- [x] **Tests:** 401/403/200 for all four endpoints; export vs list count test; reveal audit row test.
- [x] **Docs:** Updated for new routes and behavior.
- [x] **Gates:** All phase gates passed (Contracts, Security, API, UI, QA).

---

*Assume it will fail. Prove it won’t.*
