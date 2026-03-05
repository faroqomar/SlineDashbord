# Security Review: PAGE 11 — Global Search

**Scope:** PAGE_11_Global_Search  
**Plan:** .TODO/PLAN_PAGE_11_Global_Search.md  
**Role:** @SecGuard (Hard Security Gate)

---

## 1. Forbidden imports (admin-ui)

- **Verified in dashboard code:** No `@/lib/supabase/admin`, `@/lib/supabase/server`, `createAdminClient`, `auth.admin`, `@/types/supabase`, or `next/*` in:
  - `apps/admin-ui/src/features/search/**`
  - `apps/admin-ui/src/routes/Search.tsx`
- Service-role and Supabase server code remain in apps/api only.

**Result:** PASS.

---

## 2. RBAC enforcement

- **Verified in dashboard code:** `apps/api/src/routes/search.ts` uses `fastify.addHook('preHandler', requireAdminRole(['support', 'moderator', 'admin', 'super_admin']))`. All authenticated admin roles may call GET /api/v1/search. No per-entity restriction (documented in Discovery doc).
- **Verified in dashboard code:** Integration test (search.test.ts) asserts 401 when no auth.

**Result:** PASS.

---

## 3. Input validation (Zod)

- **Verified in dashboard code:** GET /api/v1/search validates query with `AdminGlobalSearchQuerySchema.safeParse(...)`; returns 400 on failure. Schema enforces q min 2 max 200, limit max 50, types enum.
- **Verified in dashboard code:** Response validated with AdminGlobalSearchResultSchema before sending.

**Result:** PASS.

---

## 4. Audit compliance

- **Verified in dashboard code:** Search is read-only. No mutations; no audit_logs insert. No “write then audit” pattern.

**Result:** PASS (N/A).

---

## 5. PII / case-gated chat

- Search returns user title/subtitle (name/email) and entity ids/links. No chat content; no case-gated access in scope. PII exposure is limited to what existing list/detail routes already expose to admins.

**Result:** PASS (no additional PII risk beyond existing admin routes).

---

## 6. Secrets

- **Verified in dashboard code:** Supabase client in search.ts uses `process.env.SUPABASE_URL` and `process.env.SUPABASE_SERVICE_ROLE_KEY`; no hardcoded secrets. admin-ui uses only public api client (no service role).

**Result:** PASS.

---

## 7. Injection / filter safety

- **Finding (MED):** Query string `q` is escaped for `%` and `_` but then interpolated into PostgREST `.or()` filter strings (e.g. `full_name.ilike.%${escaped}%`). A value containing single quotes (e.g. `a'b`) could break or alter the filter. Schema allows any string in [2, 200] chars.
- **Recommendation:** Sanitize `q` (remove or escape single quotes) or use parameterized filters. Evidence: Verified in dashboard code (search.ts lines 50, 60, 78).

**Result:** PASS with one MED recommendation (not blocking).

---

## Decision

**APPROVED ✅** — No BLOCKER. RBAC, Zod, no audit misuse, no forbidden imports, no secrets in client. One MED: harden filter construction for `q`.

**File:** .TODO/SECURITY_REVIEW_2025-03-03_PAGE_11_Global_Search.md
