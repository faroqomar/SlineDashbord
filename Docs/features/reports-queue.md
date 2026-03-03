# Reports Queue (PAGE 10)

Moderation queue for user-submitted reports on **tasks**, **users**, **chats**, and **bookings**.

## UI

- **Route:** `/reports`
- **Access:** Authenticated admin (support, moderator, admin, super_admin can read; moderator+ can run report mutations).
- **List:** Decision-ready queue with status, severity, reporter summary, entity summary, reason preview, SLA, and assignment signals.
- **Filters:** status (`open`, `triaged`, `escalated`, `closed`), entity type (`task`, `user`, `chat`, `booking`), severity, assigned-to-me.
- **Detail:** Click "View" to open a modal with reporter card, entity card, report content/evidence, and timeline.
- **Actions (reason required):**
  - **Dismiss (Ignore):** closes report with `resolution=dismissed`.
  - **Close as Resolved:** closes report with `resolution=resolved`.
  - **Escalate:** creates/attaches a case and links report as evidence; returns `case_id` and redirects to case workspace.

## API

| Method | Path | Description | Roles |
|--------|------|-------------|--------|
| GET | /api/v1/reports | List reports (query: status, entity_type, severity, assigned_admin_id, assigned_to_me, page, limit) | REPORTS_READ_ROLES |
| GET | /api/v1/reports/:reportId | Single report + report_actions | REPORTS_READ_ROLES |
| POST | /api/v1/reports/:reportId/dismiss | Dismiss report with reason | REPORTS_WRITE_ROLES |
| POST | /api/v1/reports/:reportId/escalate | Escalate report and return `case_id` | REPORTS_WRITE_ROLES |
| POST | /api/v1/reports/:reportId/triage | Triage (action + reason) | REPORTS_WRITE_ROLES |
| POST | /api/v1/reports/:reportId/close | Close report (reason) | REPORTS_WRITE_ROLES |

`/triage` is retained for backward compatibility. New UI uses explicit endpoints (`dismiss`, `escalate`, `close`).

Mutations are performed via DB RPCs that update report status, insert into `report_actions`, and insert one row into `audit_logs` in a single transaction.

## ViewModels

- **useReportsViewModel** (`features/reports/viewmodels/use_reports_viewmodel.ts`): List state (reports, total, totalPages, page, limit, filters), loading/error, actions (fetchReports, changeFilters, refreshReports). Uses reports API only. When any list-affecting filter changes (status, entity_type, severity, assigned_to_me), pagination is reset to page 1 so the list stays in sync with the filtered result set.

## Audit actions

- `admin.report.triage` — compatibility triage path (legacy `warn_user` path).
- `admin.report.dismiss` — report dismissed as invalid/duplicate.
- `admin.report.escalate` — report escalated to case workspace.
- `admin.report.resolve` — report closed (via triage action "close" or dedicated close endpoint).

## DB

- **Tables:** `reports`, `report_actions` (see migration `20260302130000_reports_queue.sql`).
- **RPCs:** `admin_triage_report`, `admin_dismiss_report`, `admin_escalate_report`, `admin_close_report`.
- **Docs:** `MIGRATIONS/README.md` (PAGE 10 section).

## Contracts

- **Shared:** `packages/shared/src/schemas/reports.ts` — report queue/detail schemas, dismiss/escalate/close inputs, timeline and context blocks.
- **Audit:** `admin.report.triage` (legacy compatibility), `admin.report.dismiss`, `admin.report.escalate`, and `admin.report.resolve` in `packages/shared/src/schemas/audit.ts`.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
