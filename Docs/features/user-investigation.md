# User Investigation (PAGE 15)

> **Status**: v1  
> **Last Updated**: 2025-03-03

## Purpose

Admins can open a **deep user review** for a given user: aggregated profile (masked by default), tasks, offers, bookings, disputes, ledger activity, reports stub, and conversation summaries. PII (email, phone) is masked in all GET responses; **Reveal PII** is a separate action (admin/super_admin only) logged in `admin_pii_access_logs`. Evidence-pack export (JSON/CSV) is available for moderator+ and is audited.

**Who it's for**: Support+ for investigation/conversations; Moderator+ for evidence-pack; Admin/Super Admin for Reveal PII.

---

## Routes / Screens

| Route | Component | Description |
|-------|-----------|-------------|
| `/users/$userId/investigation` | `UserInvestigationPage` (UserInvestigation.tsx) | Tabs: Profile, Tasks, Offers, Bookings, Disputes, Finance, Reports, Conversations. Profile shows masked PII; Reveal PII button (admin/super_admin). Evidence pack (JSON) export button. |

Entry: from **User Detail** (`/users/$userId`), click **Investigation**.

---

## API

| Method | Path | RBAC | Description |
|--------|------|------|-------------|
| GET | `/api/v1/users/:userId/investigation` | support, moderator, admin, super_admin | Full investigation graph (profile masked, tasks, bookings, disputes, ledger, reportsStub, conversationsSummary). 400 if userId is not a valid UUID. Audit: `admin.users.investigation_view`. |
| GET | `/api/v1/users/:userId/conversations` | same | Masked conversation summaries. 400 if userId invalid UUID. |
| GET | `/api/v1/users/:userId/evidence-pack` | moderator, admin, super_admin | Export JSON or CSV (query: `format`, `limit` max 10k). Audit: `admin.export.evidence_pack`. |
| POST | `/api/v1/users/:userId/reveal-pii` | admin, super_admin | Body: `{ reason, case_id? }`. Inserts `admin_pii_access_logs`; writes `audit_logs` with action `admin.pii.reveal`; returns revealed email/phone. |

Request/response shapes: `packages/shared/src/schemas/users.ts` (masked/revealed, RevealPiiInput), `packages/shared/src/schemas/investigation.ts` (UserInvestigationResponse, EvidencePackExportQuery).

---

## ViewModels

- **useUserInvestigation(userId)** (`features/investigation/viewmodels/useUserInvestigation.ts`): Investigation query, reveal PII mutation, evidence-pack mutation, `canRevealPii`, `revealedProfile`. Uses `request()` from `lib/api` only (no Supabase).

---

## Special Rules

- **RBAC**: Investigation and conversations use router-level support+; evidence-pack uses `EVIDENCE_PACK_ROLES` (moderator+); reveal-pii uses `USERS_WRITE_ROLES` (admin, super_admin).
- **PII**: Masked by default in all GET responses. Reveal only via POST reveal-pii; every reveal is logged in `admin_pii_access_logs` and in `audit_logs` with action `admin.pii.reveal`.
- **Validation**: `userId` path param must be a valid UUID for GET investigation and GET conversations (400 otherwise). Reveal-pii body requires `reason` (min 1, max 500).
- **Chat**: Thread content remains case-gated (PAGE 09); investigation only returns masked conversation summaries. Full thread view requires case and GET `/api/v1/chat/threads/:threadId` with `case_id`.

---

## DB / Migrations

- **admin_pii_access_logs**: `supabase/migrations/20260303100000_admin_pii_access_logs.sql` (dashboard repo). Columns: entity_type, entity_id, field_scope, viewer_admin_id, case_id, reason, created_at. RLS and indexes applied.
- **audit_logs**: Used by API via `writeAuditLog` for `admin.users.investigation_view`, `admin.export.evidence_pack`, `admin.pii.reveal`.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
