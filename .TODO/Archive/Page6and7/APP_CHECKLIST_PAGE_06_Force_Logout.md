# PAGE 06 — Force Logout: App Checklist

Use this checklist to verify the implementation **in the running app** (admin UI + API).  
Tick each item after you’ve confirmed it.

---

## Prerequisites

- [ ] Admin UI is running (e.g. `npm run -w @sline/admin-ui dev`).
- [ ] API is running (e.g. `npm run -w @sline/api dev`).
- [ ] Migration `20260302140000_force_logout.sql` has been applied to your Supabase project (dashboard and/or app DB).
- [ ] You have at least:
  - One **admin** or **super_admin** account (to perform force-logout).
  - One **support** account (to verify 403).
  - One **normal user** to force-logout (or use a test profile id).

---

## 1. Navigation & User Detail

- [ ] Log in as **admin** or **super_admin**.
- [ ] Go to **Users** (or equivalent list).
- [ ] Open a **user detail** page (click a user or go to `/users/<userId>`).
- [ ] Page loads and shows user info (name, email, status, “Administrative Actions” section).

---

## 2. Force Logout Button (UI)

- [ ] **“Force logout”** button is visible in the “Administrative Actions” section.
- [ ] Button has distinct styling (e.g. amber/orange; different from “Ban User”).
- [ ] Button shows a **log-out icon** (e.g. LogOut from lucide).
- [ ] Button is **not** disabled when the page first loads (unless you’re not admin/super_admin).

---

## 3. Confirmation & Reason Flow

- [ ] Click **“Force logout”**.
- [ ] A **browser confirm** appears: e.g. “Force logout this user? They will need to sign in again.”
- [ ] Click **Cancel** → nothing is sent; no error.
- [ ] Click **“Force logout”** again, then **OK** on the confirm.
- [ ] An **optional reason** prompt appears (e.g. “Optional reason (for audit):”).
- [ ] You can leave it **empty** and press OK, or enter a short reason and press OK.

---

## 4. Success Path (Admin/Super Admin)

- [ ] After confirming and (optionally) entering a reason, the request completes.
- [ ] Button shows loading state (e.g. “Logging out…”) while the request is in progress.
- [ ] On success: no error toast/alert; user detail view **reloads or invalidates** (e.g. data refetches).
- [ ] No unhandled error in the browser console.

---

## 5. Error Handling (UI)

- [ ] Force-logout a **non-existent userId** (e.g. edit URL to `/users/00000000-0000-0000-0000-000000000099`) and trigger force-logout → you see an error (e.g. “User not found” or similar from API).
- [ ] If your API returns 404/500 with a message, that message (or a generic error) is shown to the user (e.g. toast or inline), not a silent fail.

---

## 6. RBAC: Support Cannot Force-Logout

- [ ] Log out from admin, then log in as **support**.
- [ ] Go to **Users** → open the same user detail page.
- [ ] **Either:**
  - **Option A:** “Force logout” is **hidden or disabled** for support, **or**
  - **Option B:** “Force logout” is visible, but when clicked and confirmed, the API returns **403** and the UI shows an error (e.g. “Forbidden” or “Force logout requires admin or super_admin role”).
- [ ] In both cases, the support user **cannot** successfully force-logout another user.

---

## 7. Unauthenticated: No Token → 401

- [ ] In a private/incognito window (or after clearing session), open the app **without** logging in.
- [ ] If you can reach a user detail URL (e.g. via direct link), trigger force-logout (e.g. via devtools or a test script) → API returns **401**.
- [ ] **Or** confirm in your auth flow that unauthenticated users cannot reach the user detail page at all; then this is implicitly satisfied.

---

## 8. API (Optional — e.g. via curl or Postman)

- [ ] **POST** `/api/v1/users/<valid-userId>/force-logout` **with** valid admin auth header → **200** and body like `{ "ok": true, "data": { "userId": "<id>" } }`.
- [ ] **POST** with **support** auth → **403** and error code `FORBIDDEN`.
- [ ] **POST** with **no auth** → **401** and error code `UNAUTHORIZED`.
- [ ] **POST** to `/api/v1/users/not-a-uuid/force-logout` → **400** and `VALIDATION_ERROR`.
- [ ] **POST** with valid auth to a **non-existent** userId → **404** (or **500** if your DB returns an error).

---

## 9. Backend / Audit (Optional)

- [ ] After a successful force-logout, in Supabase **Table Editor** (or SQL):
  - **profiles**: row for that user has `force_logout_after` set to a recent timestamp.
  - **audit_logs**: one new row with `action = 'admin.users.force_logout'`, `related_entity_type = 'profile'`, `related_entity_id = <userId>`, and `meta` containing the reason if you provided one.

---

## 10. Consistency Fix (Post-Review)

- [ ] Force-logout is triggered via the **users API client** (no raw `request()` in the route for this action).  
  *(If you’re not sure: in `UserDetail.tsx` the force-logout mutation should call `forceLogoutUser(userId, reason)` from `@/features/users/services/users_api`.)*

---

## Sign-off

| Done by | Date | Notes |
|--------|------|--------|
|         |      |        |

---

**Reference:** PAGE 06 plan `.TODO/PLAN_PAGE_06_Force_Logout_Session_Revocation.md`; execution `.TODO/EXECUTION_REPORT_PAGE_06_Force_Logout.md`.
