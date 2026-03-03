# Feature documentation

When a feature reaches **v1 (shipped)**, add a markdown file here: `Docs/features/<feature>.md`.

Each feature doc should cover:

- **Purpose**: What the feature does and for whom.
- **Routes / screens**: Which TanStack routes and main views.
- **API**: Endpoints used (e.g. `GET /api/v1/users`, `POST /api/v1/users/:id/ban`).
- **ViewModels**: Hooks and state exposed to the UI.
- **Special rules**: Idempotency, audit, RBAC, or destructive-action requirements.
- **DB / Migrations** (when relevant): Migration file(s) and RPCs used; cross-reference `Docs/ADMIN_DATABASE_REF.md` and `MIGRATIONS/README.md`.

This protocol is defined in `Docs/ADMIN_DEVELOPER_GUIDE.md` (Feature Docs Protocol) and `.agent/workflows/architecture/doc_keeper.md`.

**Current feature docs**: `auth.md`, `bookings-admin.md`, `cases.md`, `chat-moderation.md`, `disputes.md`, `finance.md`, `force-logout.md`, `global-search.md`, `PAGE_16_approval_queue.md`, `reports-queue.md`, `settings-system-config.md`, `system_health.md`, `task-activity.md`, `user-investigation.md`, `users.md`.
