# Cases (PAGE 08)

> **Status**: v1  
> **Last Updated**: 2025-03-02

## Purpose

Admins can create investigation or moderation cases, list them, open a case detail, and attach entities (task, user, conversation, booking, dispute, report) to a case. Cases are required for **case-gated chat access** (PAGE 09): viewing chat thread content is only allowed when the thread is linked to a case and the admin has opened it via that case, so every view is logged.

**Who it's for**: Support, Moderator, Admin, Super Admin (all cases roles).

---

## Routes / Screens

| Route | Component | Description |
|-------|-----------|-------------|
| `/cases` | `CasesPage` (Cases.tsx) | Paginated list; "New case" button opens create dialog; row click goes to detail. |
| `/cases/$caseId` | `CaseDetailPage` (CaseDetail.tsx) | Case workspace: overview, attached entities, evidence list, timeline, notes, assignment, status controls. |

Sidebar: **Cases** entry (FolderOpen icon).

---

## API

| Method | Path | RBAC | Description |
|--------|------|------|-------------|
| GET | `/api/v1/cases` | support, moderator, admin, super_admin | List cases (query: page, limit). Returns `{ cases, total, page, limit, totalPages }`. |
| GET | `/api/v1/cases/:caseId` | same | Case detail workspace with entities/evidence/notes/timeline. 400 if caseId is not a valid UUID. |
| POST | `/api/v1/cases` | same | Create case; body: `{ subject, source?, priority?, assignee_id? }`. Subject required. |
| POST | `/api/v1/cases/:caseId/entities` | moderator, admin, super_admin | Attach entity; body: `{ entity_type, entity_id }`. 400 if caseId invalid UUID; 409 if already attached. |
| POST | `/api/v1/cases/:caseId/assign` | moderator, admin, super_admin | Update assignee (`assignee_id`, `reason`). |
| POST | `/api/v1/cases/:caseId/status` | moderator, admin, super_admin | Update workflow status (`status`, `reason`). |
| POST | `/api/v1/cases/:caseId/note` | admin, super_admin | Add internal/system note (`note`, `visibility`). |

Request/response shapes: `packages/shared/src/schemas/cases.ts`.

Audit actions:
- `admin.case.create`
- `admin.case.attach_entity`
- `admin.case.assign`
- `admin.case.status_update`
- `admin.case.note_add`

---

## ViewModels

- **useCasesViewModel** (`features/cases/viewmodels/use_cases_viewmodel.ts`): List state (cases, count, totalPages, filters), actions (fetchCases, changeFilters, refreshCases). Uses `casesApi` only.
- **useCaseDetailViewModel** (`features/cases/viewmodels/use_case_detail_viewmodel.ts`): Detail state (caseDetail), attachEntity, assignCase, updateStatus, addNote, refreshCase. Uses `casesApi` only.

---

## Special Rules

- **RBAC**: Read uses `CASES_ROLES`. Mutations are split by sensitivity (`CASES_WRITE_ROLES` and `CASES_DESTRUCTIVE_ROLES`).
- **Audit**: Assignment/status/note paths use RPC-backed atomic audit writes.
- **Validation**: `caseId` path param must be a valid UUID (400 otherwise). Create body requires `subject` (min 1, max 500).
- **Chat access**: Viewing chat thread content is case-gated in PAGE 09; cases created here are used to grant and log access.
- **Reports linkage**: Escalated reports are linked as case evidence (`entity_type=report`) and should be reviewed in case workspace rather than in queue-only context.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
