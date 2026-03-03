# Cases (PAGE 08)

> **Status**: v1  
> **Last Updated**: 2025-03-02

## Purpose

Admins can create investigation or moderation cases, list them, open a case detail, and attach entities (task, user, conversation, booking, dispute) to a case. Cases are required for **case-gated chat access** (PAGE 09): viewing chat thread content is only allowed when the thread is linked to a case and the admin has opened it via that case, so every view is logged.

**Who it's for**: Support, Moderator, Admin, Super Admin (all cases roles).

---

## Routes / Screens

| Route | Component | Description |
|-------|-----------|-------------|
| `/cases` | `CasesPage` (Cases.tsx) | Paginated list; "New case" button opens create dialog; row click goes to detail. |
| `/cases/$caseId` | `CaseDetailPage` (CaseDetail.tsx) | Case details, attached entities table, "Attach entity" form (type + entity ID). |

Sidebar: **Cases** entry (FolderOpen icon).

---

## API

| Method | Path | RBAC | Description |
|--------|------|------|-------------|
| GET | `/api/v1/cases` | support, moderator, admin, super_admin | List cases (query: page, limit). Returns `{ cases, total, page, limit, totalPages }`. |
| GET | `/api/v1/cases/:caseId` | same | Case detail with entities. 400 if caseId is not a valid UUID. |
| POST | `/api/v1/cases` | same | Create case; body: `{ subject, source?, priority?, assignee_id? }`. Subject required. |
| POST | `/api/v1/cases/:caseId/entities` | same | Attach entity; body: `{ entity_type, entity_id }`. 400 if caseId invalid UUID; 409 if already attached. |

Request/response shapes: `packages/shared/src/schemas/cases.ts`. Every create and attach writes one `audit_logs` row (`admin.case.create`, `admin.case.attach_entity`).

---

## ViewModels

- **useCasesViewModel** (`features/cases/viewmodels/use_cases_viewmodel.ts`): List state (cases, count, totalPages, filters), actions (fetchCases, changeFilters, refreshCases). Uses `casesApi` only.
- **useCaseDetailViewModel** (`features/cases/viewmodels/use_case_detail_viewmodel.ts`): Detail state (caseDetail), createCase, attachEntity, refreshCase. Uses `casesApi` only.

---

## Special Rules

- **RBAC**: All cases endpoints use `CASES_ROLES` (support, moderator, admin, super_admin).
- **Audit**: Create uses `writeAuditLog` after insert; attach uses `withAudit`. Both write to `audit_logs` with canonical columns only. Non-atomic (handler then audit); acceptable for PAGE 08.
- **Validation**: `caseId` path param must be a valid UUID (400 otherwise). Create body requires `subject` (min 1, max 500).
- **Chat access**: Viewing chat thread content is case-gated in PAGE 09; cases created here are used to grant and log access.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
