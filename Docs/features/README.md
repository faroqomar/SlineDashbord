# Feature documentation

When a feature reaches v1 (shipped), add a markdown file under `Docs/features/<feature>.md`.

Each feature document should include:
- Purpose
- Routes / screens
- API endpoints
- ViewModels / state ownership
- Security / special rules (RBAC, idempotency, audit)
- DB / contracts references

## Current feature docs

- `auth.md`
- `bookings-admin.md`
- `cases.md`
- `chat-moderation.md`
- `dashboard-overview.md`
- `disputes.md`
- `finance.md`
- `force-logout.md`
- `global-search.md`
- `logs.md`
- `PAGE_16_approval_queue.md`
- `reports-queue.md`
- `settings-system-config.md`
- `system_health.md`
- `task-activity.md`
- `user-investigation.md`
- `users.md`

This protocol is defined by:
- `.agent/workflows/architecture/doc_keeper.md`
- `Docs/ADMIN_DEVELOPER_GUIDE.md` (Feature Docs Protocol)

## Supporting docs (by feature)

- **Logs:** `logs_plan_and_sql_verification.md`, `LOGS_CHECKLIST_AND_SUMMARY.md`, `ORCHESTRATOR_REPORT_System_Logs.md`
- **System Health:** `SYSTEM_HEALTH_CHECKLIST_AND_SUMMARY.md`, `ORCHESTRATOR_REPORT_System_Health.md`, `SYSTEM_HEALTH_IMPLEMENTATION_STATUS.md`

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
