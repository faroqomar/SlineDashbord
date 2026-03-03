# Reports Queue (PAGE 10)

Moderation queue for user-submitted reports on **tasks**, **users**, and **chats**.

## UI

- **Route:** `/reports`
- **Access:** Authenticated admin (support, moderator, admin, super_admin can read; moderator+ can triage/close).
- **List:** Table of reports with filters by status (open, triaged, closed) and entity type (task, user, chat). Pagination (page/limit).
- **Detail:** Click "View" to open a dialog with report fields, action history, and actions:
  - **Triage:** Choose action (dismiss, warn_user, escalate, close) and required reason; submits to API.
  - **Close:** Required reason; closes the report and refreshes the list.

## API

| Method | Path | Description | Roles |
|--------|------|-------------|--------|
| GET | /api/v1/reports | List reports (query: status, entity_type, page, limit) | REPORTS_READ_ROLES |
| GET | /api/v1/reports/:reportId | Single report + report_actions | REPORTS_READ_ROLES |
| POST | /api/v1/reports/:reportId/triage | Triage (action + reason) | REPORTS_WRITE_ROLES |
| POST | /api/v1/reports/:reportId/close | Close report (reason) | REPORTS_WRITE_ROLES |

All mutations are performed via DB RPCs that update report status, insert into `report_actions`, and insert one row into `audit_logs` in a single transaction.

## Audit actions

- `admin.report.triage` — triage (dismiss, warn_user, escalate, or close that sets status to triaged).
- `admin.report.resolve` — report closed (via triage action "close" or dedicated close endpoint).

## DB

- **Tables:** `reports`, `report_actions` (see migration `20260302130000_reports_queue.sql`).
- **RPCs:** `admin_triage_report`, `admin_close_report`.
- **Docs:** `MIGRATIONS/README.md` (PAGE 10 section).

## Contracts

- **Shared:** `packages/shared/src/schemas/reports.ts` — ReportEntityTypeEnum, ReportStatusEnum, TriageActionEnum, list/detail/triage/close schemas.
- **Audit:** `admin.report.triage` and `admin.report.resolve` in `packages/shared/src/schemas/audit.ts`.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
