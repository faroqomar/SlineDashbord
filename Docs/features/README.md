# Feature documentation

When a feature reaches **v1 (shipped)**, add a markdown file here: `docs/features/<feature>.md`.

Each feature doc should cover:

- **Purpose**: What the feature does and for whom.
- **Routes / screens**: Which TanStack routes and main views.
- **API**: Endpoints used (e.g. `GET /api/v1/users`, `POST /api/v1/users/:id/ban`).
- **ViewModels**: Hooks and state exposed to the UI.
- **Special rules**: Idempotency, audit, RBAC, or destructive-action requirements.

This protocol is defined in `Docs/ADMIN_DEVELOPER_GUIDE.md` (Feature Docs Protocol).
