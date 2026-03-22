# Logs (System Logs)

## Purpose

Provide a paginated, filterable operational log view over canonical `audit_logs` data for admin troubleshooting and traceability. Includes summary cards, hourly chart, level/source filters, and CSV export.

## Route / Screen

- **Route:** `/logs`
- **Route file:** `apps/admin-ui/src/routes/Logs.tsx`
- **View:** `apps/admin-ui/src/features/logs/view/LogsScreen.tsx`
- **ViewModel:** `apps/admin-ui/src/features/logs/viewmodels/use_logs_viewmodel.ts`
- **API client:** `apps/admin-ui/src/features/logs/services/logs_api.ts`

UI: hero (title “System Logs”, subtitle), summary cards (total today, errors/critical, warnings, info), “Today by hour” bar chart, Live/Refresh/Export, search, source dropdown, level tabs (All, CRITICAL, ERROR, WARN, INFO, DEBUG), sort (newest/oldest), table (timestamp + level icon, level pill, source, message with eventCode, expand for details), pagination.

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/logs` | Paginated log list with filters and summary |
| GET | `/api/v1/logs/export` | CSV export (same filters, limit cap) |

**Query params (list):** `page`, `limit`, `q` (search), `action`, `actorUserId`, `from`, `to`, `level` (all | critical | error | warning | info | debug), `source`, `sort` (newest | oldest).

## Response Shape (list)

- `logs[]`: id, timestamp, level, source, message, eventCode, actor, meta, etc.
- `summary`: totalToday, errorsCritical, warnings, info (with optional deltas for “+N” trend).
- `count`, `totalPages`

## Shared Contracts

- `packages/shared/src/schemas/logs.ts`
  - `LogListQuerySchema`, `LogListResponseSchema`, `LogExportQuerySchema`
  - `LogLevel`, `LogSort`, `LOGS_READ_ROLES`

## Security / Rules

- RBAC: `requireAdminRole(LOGS_READ_ROLES)` (e.g. support, moderator, admin, super_admin).
- Read-only: no mutations; reads from `audit_logs` (+ `profiles` for actor).
- Validation via Zod; invalid input returns validation error; data failures return appropriate error envelope.

## Observability

- **appLogger** in `logs_api.ts` (scope `Logs:API`) and `use_logs_viewmodel.ts` (scope `Logs:VM`) for debug/info/error on params, success, failure, export, and live toggle.

## Verification

- API tests: `npm run test -w @sline/api -- --run src/routes/logs.test.ts` (401, 403, 400, 200/500).
- E2E: `apps/admin-ui/e2e/logs.spec.ts` (open Logs, heading/controls, level filter, table, expand row, export toast).

## Related docs

- `Docs/features/LOGS_CHECKLIST_AND_SUMMARY.md` — checklist for verifying the feature in the app and summary of changes.
- `Docs/features/ORCHESTRATOR_REPORT_System_Logs.md` — orchestrator audit and fixes applied.
- `Docs/features/logs_plan_and_sql_verification.md` — plan verification and SQL scope (no DB changes required for logs).

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
