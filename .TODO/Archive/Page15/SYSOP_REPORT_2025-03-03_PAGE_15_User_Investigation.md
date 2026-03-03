# SysOp Report — PAGE 15 User Investigation

**Scope:** PAGE_15_User_Investigation  
**Date:** 2025-03-03  
**Agent:** @SysOp

---

## 1) Endpoint inventory (Fastify)

| Method | Path | RBAC | Audit / log | Evidence |
|--------|------|------|-------------|----------|
| GET | `/api/v1/users/:userId/investigation` | support+ (preHandler) | `writeAuditLog(..., 'admin.users.investigation_view', 'profile', userId)` | [Verified in dashboard code] apps/api/src/routes/users.ts |
| GET | `/api/v1/users/:userId/conversations` | support+ | None (read-only list) | [Verified in dashboard code] |
| GET | `/api/v1/users/:userId/evidence-pack` | moderator+ (preHandler EVIDENCE_PACK_ROLES) | `writeAuditLog(..., 'admin.export.evidence_pack', ...)` | [Verified in dashboard code] |
| POST | `/api/v1/users/:userId/reveal-pii` | admin, super_admin (USERS_WRITE_ROLES) | Insert `admin_pii_access_logs`; no `audit_logs` row | [Verified in dashboard code] |

---

## 2) Contract map (packages/shared)

| Schema | File | Used by API | Evidence |
|--------|------|-------------|----------|
| UserInvestigationResponseSchema | investigation.ts | GET investigation | [Verified in dashboard code] |
| UserConversationsResponseSchema | investigation.ts | GET conversations | [Verified in dashboard code] |
| EvidencePackExportQuerySchema | investigation.ts | GET evidence-pack query | [Verified in dashboard code] |
| RevealPiiInputSchema | users.ts | POST reveal-pii body | [Verified in dashboard code] |
| UserDetailRevealed | users.ts | POST reveal-pii response | [Verified in dashboard code] |
| UserDetailMasked (maskProfile) | users.ts (concept) | Investigation profile | API uses inline mask; shared has UserDetailMaskedSchema. [Verified in dashboard code] |

---

## 3) DB / RPC requirements

| Object | Location | Evidence |
|--------|----------|----------|
| admin_pii_access_logs | supabase/migrations/20260303100000_admin_pii_access_logs.sql | [Verified in dashboard code] Table + RLS + indexes. |
| admin_cases, admin_chat_access_logs | 20260302130000_admin_cases_and_chat_access.sql | [Verified in dashboard code] Referenced by admin_pii_access_logs (case_id FK). |
| audit_logs | App repo canonical | writeAuditLog writes from API; not an RPC. [Verified in dashboard code] |

**Note:** writeAuditLog is non-atomic with the GET (audit after success). Plan required "log every investigation view"; acceptable for read-only. Reveal-pii does not write to `audit_logs`, only to `admin_pii_access_logs`. If project policy requires every privileged action in audit_logs, add an `admin.pii.reveal` row (optional).

---

## 4) Audit atomicity

| Operation | Atomic with mutation? | Note |
|-----------|------------------------|------|
| GET investigation | N/A (read) | writeAuditLog after success. [Verified in dashboard code] |
| GET evidence-pack | N/A (read) | writeAuditLog after success. [Verified in dashboard code] |
| POST reveal-pii | N/A (no RPC) | Insert admin_pii_access_logs then return; no single DB transaction with mutation. Reveal is "read + log"; acceptable. [Verified in dashboard code] |

No privileged *mutation* (e.g. ban, withdraw) in PAGE 15 that would require RPC-with-audit atomics.

---

## 5) Input validation (Zod)

| Endpoint | Input | Schema | Evidence |
|----------|--------|--------|----------|
| GET investigation | params.userId | Not validated by Zod in route; UUID implied by 404 from DB | MED: add userId UUID check. |
| GET conversations | params.userId | Same | MED: add UUID validation. |
| GET evidence-pack | params.userId, query | EvidencePackExportQuerySchema.safeParse(request.query) | [Verified in dashboard code] Query validated. |
| POST reveal-pii | params.userId, body | RevealPiiInputSchema.safeParse(body) | [Verified in dashboard code] Body validated. |

---

## 6) Findings summary

| Severity | Finding | Owner | Fix |
|----------|---------|-------|-----|
| LOW | GET investigation/conversations do not validate userId format (UUID) before DB call | @SysOp | Add z.string().uuid().safeParse(userId) and 400 if invalid. |
| LOW | Optional: add audit_logs row for admin.pii.reveal for consistency | @SysOp | writeAuditLog after admin_pii_access_logs insert. |

---

**Decision:** No blocker. Endpoints, contracts, and migration are in place and consistent. Optional: UUID validation on userId, optional audit_logs for reveal.
