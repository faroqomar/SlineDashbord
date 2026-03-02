# Dashboard migrations

Migrations in this folder are applied to the Supabase project used by the dashboard (and optionally the same DB as the app).

## Migration order (shared DB)

When the dashboard and **sline_app** use the same database:

1. **Apply sline_app migrations first** (canonical schema: ledger, `audit_logs`, `withdrawal_requests`, etc.).
2. Then apply dashboard migrations (e.g. `supabase/migrations/*.sql` from this repo).

The RPC `admin_process_withdrawal` is defined in this repo with canonical signature (`p_request_id`, `p_decision`, `p_admin_id`, `p_reason`). For production, the same RPC can be added to **sline_app** so the app repo remains the single source of truth for schema and RPCs.
