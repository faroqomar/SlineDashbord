# Logs (System Logs)

## Purpose

Provide a paginated, filterable operational log view over canonical `audit_logs` data for admin troubleshooting and traceability.

## Route / Screen

- Route: `/logs`
- Route file: `apps/admin-ui/src/routes/Logs.tsx`
- ViewModel: `apps/admin-ui/src/features/logs/viewmodels/use_logs_viewmodel.ts`

## API Endpoint

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/logs` | Paginated log list with optional filters (`action`, `actorUserId`, `from`, `to`) |

## Filters / Pagination

- `page`, `limit`
- `action` (ILIKE)
- `actorUserId` (UUID)
- `from`, `to` (timestamp bounds)

## Response Shape

- `logs[]`: id, action, actor info, entity references, status tone, timestamp, optional meta
- `count`
- `totalPages`

## Shared Contracts

- `packages/shared/src/schemas/logs.ts`
  - `LogListQuerySchema`
  - `LogListResponseSchema`
  - `LOGS_READ_ROLES`

## Security / Rules

- RBAC protected (`support`, `moderator`, `admin`, `super_admin`).
- Read-only route backed by `audit_logs`.
- Validation errors return `VALIDATION_ERROR`; data failures return `DATABASE_ERROR`/`INTERNAL_ERROR`.

## Verification

- `npm --prefix apps/api run test -- src/routes/logs.test.ts`

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
