# PAGE 15 User Investigation — Verification Checklist

Use this checklist to verify the Master Report fixes in the **running app** and **codebase**.

---

## 1. API (running or tests)

- [ ] **Invalid userId returns 400**  
  Call `GET /api/v1/users/not-a-uuid/investigation` with a valid admin cookie → expect **400** and a validation error (not 404 or 500).
- [ ] **Valid userId works**  
  Call `GET /api/v1/users/<real-user-uuid>/investigation` with admin auth → expect **200** (or **404** if user does not exist).
- [ ] **Reveal PII is audited**  
  After a successful `POST /api/v1/users/:userId/reveal-pii`, check DB:  
  - Row in `admin_pii_access_logs` (entity_id, viewer_admin_id, reason).  
  - Row in `audit_logs` with `action = 'admin.pii.reveal'`.
- [ ] **Tests pass**  
  From repo root: `cd apps/api && npm test -- users.test` → all 22 tests pass.

---

## 2. Admin UI — Navigation & page

- [ ] **Route exists**  
  Open app → go to **Users** → click a user → confirm you see an **Investigation** link/button.
- [ ] **Investigation opens**  
  Click **Investigation** → URL is `/users/<userId>/investigation` and the Investigation page loads.
- [ ] **Back links**  
  On the Investigation page: “User detail” link goes to user detail; back arrow/link goes to user list (or expected parent).

---

## 3. Admin UI — Tabs & data

- [ ] **Profile tab**  
  Shows masked profile (e.g. email/phone as `[MASKED]` or similar).
- [ ] **Other tabs**  
  Tasks, Offers, Bookings, Disputes, Finance, Reports, Conversations switch correctly; empty state or data shows per tab.
- [ ] **Reveal PII (admin/super_admin)**  
  Log in as admin or super_admin → on Profile tab, “Reveal PII” is visible → click it, enter a reason → email/phone appear (or “—” if null). As support/moderator, button should not be shown (or API returns 403 if called).
- [ ] **Evidence pack**  
  Click “Evidence pack (JSON)” → a JSON file downloads (or a clear error if export fails).

---

## 4. Codebase (quick spot-checks)

- [ ] **No `any` in investigation UI**  
  In `apps/admin-ui/src/routes/UserInvestigation.tsx` and `apps/admin-ui/src/features/investigation/`: no `any` in request generics or map callbacks for investigation/reveal/evidence-pack.
- [ ] **Route file under 300 lines**  
  `wc -l apps/admin-ui/src/routes/UserInvestigation.tsx` → line count &lt; 300.
- [ ] **Hook and tab component**  
  `apps/admin-ui/src/features/investigation/viewmodels/useUserInvestigation.ts` and `apps/admin-ui/src/features/investigation/view/InvestigationTabContent.tsx` exist and are used by `UserInvestigation.tsx`.
- [ ] **API: UUID + audit**  
  In `apps/api/src/routes/users.ts`: `uuidSchema.safeParse(userId)` and 400 for invalid UUID on GET investigation and GET conversations; `writeAuditLog(..., 'admin.pii.reveal', ...)` after `admin_pii_access_logs` insert in reveal-pii.

---

## 5. Docs

- [ ] **Feature doc**  
  `docs/features/user-investigation.md` exists and describes routes, API, RBAC, PII, and audit.
- [ ] **Audit doc updated**  
  In `MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md`, the “User Investigation view” row says the route and API are implemented and points to the correct files.

---

## Quick smoke (minimal)

1. Log in as admin.  
2. Users → open a user → Investigation.  
3. Switch tabs (Profile, Tasks, etc.).  
4. Profile → Reveal PII (reason) → see email/phone or “—”.  
5. Click Evidence pack (JSON) → file downloads.  
6. Check DB: one row in `admin_pii_access_logs` and one in `audit_logs` with `admin.pii.reveal` for that reveal.

---

*Generated from Master Report fixes (2025-03-03).*
