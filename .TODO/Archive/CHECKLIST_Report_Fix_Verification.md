# Checklist — Verify Report Fix on the Actual App

**Scope:** Fix from Master Report (PAGE 05): remove `server-only` from admin-ui `data_masking.ts`.  
**Ref:** `.TODO/MASTER_REPORT_2025-03-02_PAGE_05_User_Moderation.md`

---

## 1. Code change (what was done)

| Step | Check | Expected |
|------|--------|----------|
| 1.1 | Open `apps/admin-ui/src/features/core/security/data_masking.ts` | File has **no** `import 'server-only'` and **no** `import { FinanceRole }`. |
| 1.2 | Read the top comment | Comment says role-based masking is "client-safe; no server-only in Vite SPA". |
| 1.3 | Function `maskMetaForRole(role, meta_full)` | Still present; returns full `meta_full` for `admin` / `super_admin`, else masked object. |

---

## 2. Build & tests (automated)

| Step | Command | Expected |
|------|---------|----------|
| 2.1 | `npm run -w @sline/admin-ui build` | `tsc && vite build` succeeds (no "server-only" or module errors). |
| 2.2 | `npm run -w @sline/api test -- --run` | All API tests pass (e.g. 79 passed, 3 skipped). |

---

## 3. Run the app locally

| Step | Command / action | What to check |
|------|------------------|----------------|
| 3.1 | `npm run dev:api` (terminal 1) | API starts; `GET /health` returns 200. |
| 3.2 | `npm run dev:admin` (terminal 2) | Admin UI starts; login page loads. |
| 3.3 | Log in as admin/super_admin | Dashboard loads; no console errors about `server-only` or failed imports. |

---

## 4. Where masking might show up (optional)

`maskMetaForRole` is **not** currently imported anywhere in the active admin-ui app (only in legacy-source). So there is no specific screen that “uses” it to click through. If you later add a screen that uses this helper (e.g. finance metadata by role), that screen should still work because the function logic was not changed—only the invalid `server-only` import was removed.

| Step | Action | Expected |
|------|--------|----------|
| 4.1 | Navigate: Users, Tasks, Finance, Cases | All sections load; no runtime errors. |
| 4.2 | (Optional) If you have a page that shows masked metadata by role | Same behavior as before (admin sees full, support/moderator sees masked). |

---

## 5. Quick copy-paste

```bash
# From repo root
npm run -w @sline/admin-ui build
npm run -w @sline/api test -- --run
# Then run app
npm run dev:api    # terminal 1
npm run dev:admin  # terminal 2
```

---

## Summary

- **Single code fix:** `data_masking.ts` — removed `server-only` (and unused `FinanceRole` import), added client-safe comment.
- **Verification:** Build + API tests pass; run admin UI and use main sections; no console/import errors.
- No other code changes were required by the report; remaining items (migrations, main app RLS) are outside this repo or optional.
