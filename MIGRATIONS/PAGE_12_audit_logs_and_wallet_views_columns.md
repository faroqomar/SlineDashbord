# PAGE 12 — audit_logs and Wallet View Columns (Discovery)

**Purpose:** Document expected columns for PAGE 12 Finance (Transaction Detail, Audit Export, User Lookup). Dashboard API aligns with these shapes; canonical DDL lives in **sline_app** repo.

---

## audit_logs (canonical: sline_app)

**Source:** `sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql` (and RLS in `20260225_create_ledger_rls_policies.sql`).  
**Reference:** [SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md](./SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md) — "Canonical repo-verified audit table exists".

### Expected columns (for list/export and reveal insert)

| Column             | Type        | Required | Notes |
|--------------------|-------------|----------|--------|
| `id`               | uuid (PK)   | yes      | For cursor pagination and list response. |
| `created_at`       | timestamptz | yes      | Ordering and cursor. |
| `actor_user_id`    | uuid (nullable) | yes | Admin who performed action. |
| `action`           | text        | yes      | e.g. `admin.finance.tx_view_sensitive_meta`. |
| `related_entity_type` | text (nullable) | yes | e.g. `journal_entry`. |
| `related_entity_id`   | uuid (nullable) | yes | e.g. journal_id. |
| `journal_entry_id`    | uuid (nullable) | no  | Optional; legacy uses for finance. |
| `meta`             | jsonb       | yes      | Default `{}`. |

**Insert shape (dashboard API):** `action`, `actor_user_id`, `related_entity_type`, `related_entity_id`, `meta`. If app table has `journal_entry_id`, set it for finance reveal; otherwise use `related_entity_type` = `'journal_entry'`, `related_entity_id` = journalId.

**Stop condition:** If deployed DB has no `id` or `created_at`, add migration in app repo before implementing GET /audit and GET /audit/export.

---

## vw_wallet_balances_user (canonical: sline_app)

**Source:** `sline_app/supabase/migrations/20260225_create_wallet_views.sql`.  
**Reference:** [.chatgpt_context/DASHBOARD_FEATURE_REQUIREMENTS.md](../.chatgpt_context/DASHBOARD_FEATURE_REQUIREMENTS.md), [Docs/ADMIN_FINANCE_INTELLIGENCE.md](../Docs/ADMIN_FINANCE_INTELLIGENCE.md).

### Expected columns (for GET /finance/users/:userId)

| Column                      | Type   | Notes |
|-----------------------------|--------|--------|
| `user_id`                   | uuid   | Key for .eq('user_id', userId). |
| `available_balance`         | number | |
| `held_balance`              | number | |
| `pending_withdrawal_balance`| number | |
| `currency`                  | text   | e.g. IQD. |
| `is_wallet_frozen`          | boolean (optional) | If present, include in WalletSummarySchema. |

---

## vw_wallet_activity_user (canonical: sline_app)

**Source:** `sline_app/supabase/migrations/20260225_create_wallet_views.sql`.

### Expected columns (for user timeline)

Per-user activity; shape compatible with journal/ledger fields for UI (e.g. journal_id, created_at, event_type, status, amounts). Dashboard uses same limit and ordering as legacy: `order('created_at', { ascending: false }), limit(20)`. Response typed as `JournalLedgerEntry[]` or equivalent; if view columns differ, map in API layer.

---

*Discovery complete for PAGE 12. Shared schemas (AuditLogListEntrySchema, WalletSummarySchema) must match these columns.*
