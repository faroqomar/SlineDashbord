# Security Review — PAGE 15 User Investigation

**Scope:** PAGE_15_User_Investigation  
**Date:** 2025-03-03  
**Agent:** @SecGuard

---

## 1) Forbidden imports (admin-ui)

| Check | Result | Evidence |
|-------|--------|----------|
| No `@/lib/supabase/admin` | ✅ | [Verified in dashboard code] UserInvestigation.tsx uses only `request` from `../lib/api`. |
| No `createAdminClient` / `auth.admin` | ✅ | [Verified in dashboard code] Not present in PAGE 15 files. |
| No server-only Supabase in admin-ui | ✅ | [Verified in dashboard code] Grep on UserInvestigation.tsx: no matches. |

---

## 2) RBAC enforcement

| Endpoint | Required roles | Implementation | Evidence |
|----------|-----------------|----------------|----------|
| GET investigation | support, moderator, admin, super_admin | fastify.addHook(requireAdminRole([...])) on router | [Verified in dashboard code] users.ts |
| GET conversations | support+ | Same hook | [Verified in dashboard code] |
| GET evidence-pack | moderator, admin, super_admin | preHandler: requireAdminRole(EVIDENCE_PACK_ROLES) | [Verified in dashboard code] |
| POST reveal-pii | admin, super_admin | preHandler: requireAdminRole(USERS_WRITE_ROLES) | [Verified in dashboard code] |

Tests verify 403 for support on evidence-pack and reveal-pii. [Verified in dashboard code] users.test.ts.

---

## 3) PII masking and reveal

| Requirement | Status | Evidence |
|-------------|--------|----------|
| PII masked by default | ✅ | maskProfile() sets email/phone to '[MASKED]' in investigation and evidence-pack responses. [Verified in dashboard code] |
| Reveal only via dedicated endpoint | ✅ | POST reveal-pii; no PII in GET investigation/conversations. [Verified in dashboard code] |
| Reveal logged | ✅ | Insert into admin_pii_access_logs (entity_type, entity_id, field_scope, viewer_admin_id, case_id, reason) before returning. [Verified in dashboard code] |
| Reveal RBAC | ✅ | admin, super_admin only. [Verified in dashboard code] |

---

## 4) Case-gated chat

Chat thread content remains behind existing GET `/api/v1/chat/threads/:threadId` with `case_id` and admin_chat_access_logs. PAGE 15 does not add new chat endpoints; investigation/conversations return only masked summaries. [Verified in dashboard code]

---

## 5) Audit compliance

| Action | Logged where | Atomic with op? |
|--------|----------------|------------------|
| Investigation view | audit_logs (writeAuditLog) | After successful read; acceptable for read. |
| Evidence-pack export | audit_logs (writeAuditLog) | After successful read; acceptable. |
| PII reveal | admin_pii_access_logs | Insert before response; not in audit_logs. |

No “write then audit” for mutations; reveal is “read + log” (insert log then return). No privileged mutation without audit in PAGE 15.

---

## 6) Input validation

| Endpoint | Validation | Note |
|----------|------------|------|
| POST reveal-pii | RevealPiiInputSchema.safeParse(body) | reason required; case_id optional. [Verified in dashboard code] |
| GET evidence-pack | EvidencePackExportQuerySchema (query) | format, limit (max 10k). [Verified in dashboard code] |
| userId in path | Not Zod-validated in route | Could add UUID check to avoid unnecessary DB round-trips for malformed IDs. LOW. |

---

## 7) Secrets

No new secrets. Service-role key remains server-side (apps/api). [Verified in dashboard code]

---

**Decision:** **APPROVED ✅**  
No blockers. RBAC, PII masking/reveal, and audit logging satisfy security gates. Optional: UUID validation for userId in paths; optional: add audit_logs row for admin.pii.reveal if policy requires.
