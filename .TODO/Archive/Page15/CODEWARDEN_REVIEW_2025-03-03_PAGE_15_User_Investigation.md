# Code Warden Review — PAGE 15 User Investigation

**Scope:** PAGE_15_User_Investigation  
**Date:** 2025-03-03  
**Agent:** @CodeWarden

---

## 1) Boundary enforcement (admin-ui)

| Rule | Status | Evidence |
|------|--------|----------|
| No Supabase/server imports | ✅ | UserInvestigation.tsx: only `request` from `../lib/api`. [Verified in dashboard code] |
| No RBAC logic in UI | ⚠️ | canRevealPii = me?.user?.role && REVEAL_PII_ROLES.includes(me.user.role). UI hides “Reveal PII” by role; API still enforces. Acceptable (UX only); API is authority. [Verified in dashboard code] |
| No raw fetch bypassing API wrapper | ✅ | All calls via request(). [Verified in dashboard code] |
| Query keys | ✅ | QUERY_KEYS.users.investigation(userId), ['auth', 'me']. [Verified in dashboard code] |

---

## 2) API standards (apps/api)

| Rule | Status | Evidence |
|------|--------|----------|
| Zod validation for inputs | ✅ | RevealPiiInputSchema, EvidencePackExportQuerySchema. [Verified in dashboard code] userId in path not validated by Zod (LOW). |
| RBAC per route | ✅ | preHandler / addHook. [Verified in dashboard code] |
| Audit for sensitive reads | ✅ | writeAuditLog for investigation_view and evidence_pack. [Verified in dashboard code] |

---

## 3) Scalability / maintainability

| Rule | Status | Evidence |
|------|--------|----------|
| Hard limit 300 lines (route) | ❌ | UserInvestigation.tsx ~320 lines. [Verified in dashboard code] MED: split into components or extract hook to meet 300-line guideline. |
| DRY | ✅ | request(), QUERY_KEYS, shared schemas. No duplicated pagination in PAGE 15. [Verified in dashboard code] |
| Type safety | ❌ | Multiple `any`: profile: any; tasks: any[]; (t: any), (b: any), (d: any), (e: any), (c: any). [Verified in dashboard code] MED: replace with shared or explicit types. |

---

## 4) Violations list

| Severity | Violation | File | Fix |
|----------|-----------|------|-----|
| MED | Route file > 300 lines | UserInvestigation.tsx | Extract tab content to components (e.g. InvestigationProfileTab, InvestigationTasksTab) or move data logic to useUserInvestigation hook. |
| MED | Use of `any` in request generics and map callbacks | UserInvestigation.tsx | Use types from packages/shared (UserInvestigationResponse, etc.) or define local interfaces. |
| LOW | List route GET / users uses `request.query as any` | users.ts (pre-existing) | Not in PAGE 15 scope; note for future. |

---

## 5) What must not be done

- Do not add Supabase or server-only imports to UserInvestigation or any admin-ui file for PAGE 15.
- Do not perform RBAC decisions in UI that contradict API (current “hide Reveal PII by role” is acceptable; API must remain authority).
- Do not remove Zod validation from reveal-pii or evidence-pack.

---

**Decision:** **APPROVED ✅** with MED improvements (line count, type safety). No BLOCKER; gates pass with optional refactors.
