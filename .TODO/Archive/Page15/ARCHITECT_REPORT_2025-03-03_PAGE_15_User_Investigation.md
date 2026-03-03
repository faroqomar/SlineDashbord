# Architect Report — PAGE 15 User Investigation

**Scope:** PAGE_15_User_Investigation  
**Date:** 2025-03-03  
**Agent:** @AdminArchitect

---

## 1) MVVM boundary check

| Layer | Status | Evidence |
|-------|--------|----------|
| **View (UserInvestigation.tsx)** | ✅ | No Supabase/server imports. Uses `request()` from `../lib/api` only. [Verified in dashboard code] |
| **ViewModel / state** | ✅ | State and data fetching live in the same route file (no separate VM hook). TanStack Query + `request()`; no DB. [Verified in dashboard code] |
| **API client** | ✅ | Central `request()` in `apps/admin-ui/src/lib/api.ts`; no direct Supabase in admin-ui. [Verified in dashboard code] |

**Finding:** No blocking defect. Route is a combined View + inline “VM” (hooks + state). Plan did not require a separate `features/investigation/viewmodels/`; current structure is acceptable. Optional: extract a `useUserInvestigation(userId)` hook to a viewmodel file for reuse and to satisfy “VM hook” pattern.

---

## 2) Route parity (TanStack Router)

| Item | Status | Evidence |
|------|--------|----------|
| Route path | ✅ | `/users/$userId/investigation` registered in App.tsx. [Verified in dashboard code] |
| Entry from User Detail | ✅ | Link in UserDetail.tsx to `/users/$userId/investigation` with params. [Verified in dashboard code] |
| Navigation back | ✅ | Link to `/users/$userId` (User detail) and `/users`. [Verified in dashboard code] |

---

## 3) Contract wiring

| Contract | Location | Status |
|----------|----------|--------|
| Investigation response | `packages/shared` → `UserInvestigationResponseSchema` | ✅ Used in API; UI uses inline types / `any` for response. [Verified in dashboard code] |
| Reveal PII | `RevealPiiInputSchema`, `UserDetailRevealed` | ✅ API validates and returns; UI calls POST with `{ reason }`. [Verified in dashboard code] |
| Evidence-pack query | `EvidencePackExportQuerySchema` | ✅ API parses query; UI sends format and limit in URL. [Verified in dashboard code] |

**Finding (MED):** UI uses `any` for investigation and evidence-pack response types (e.g. `request<{ profile: any; tasks: any[]; ... }>`). Recommendation: import and use shared types or define a local interface that mirrors shared schemas to satisfy Code Warden type-safety gate.

---

## 4) Structure and file paths

| Path | Purpose |
|------|--------|
| `apps/admin-ui/src/routes/UserInvestigation.tsx` | Page + tabs + loading/empty/error + Reveal PII + evidence-pack. |
| `apps/admin-ui/src/App.tsx` | Route registration `userInvestigationRoute`. |
| `apps/admin-ui/src/routes/UserDetail.tsx` | Link “Investigation” to investigation route. |
| `apps/admin-ui/src/lib/query-keys.ts` | `QUERY_KEYS.users.investigation(id)`. |

No dedicated `features/investigation/` folder. Acceptable for a single-page feature; optional to add if investigation grows (e.g. shared components, viewmodel hook).

---

## 5) Gate checklist (Architect)

- [x] No server-only Supabase in admin-ui (forbidden-import scan clean for PAGE 15 files).
- [x] Routes use TanStack Router; entry/exit links present.
- [x] Data flow: View → request() → Fastify only.
- [ ] **Optional:** Replace `any` in UserInvestigation with shared or explicit types.
- [ ] **Optional:** Extract `useUserInvestigation` to a viewmodel hook and/or add `features/investigation/` if scaling.

---

**Decision:** **APPROVED ✅** (no blocking defects; optional improvements above).
