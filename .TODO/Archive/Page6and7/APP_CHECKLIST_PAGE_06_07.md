# App checklist — PAGE 06 & PAGE 07 (verify in the actual app)

Use this list to confirm in the **running** admin UI and API that Force Logout (PAGE 06) and Bookings Admin (PAGE 07) work as intended.

---

## Prerequisites

- [ ] API running (e.g. `npm run -w @sline/api dev` or your deployed URL).
- [ ] Admin UI running (e.g. `npm run -w @sline/admin-ui dev`).
- [ ] Logged in as a user with **admin** or **super_admin** role (for full checks).
- [ ] Optional: a **moderator** account to confirm moderator can list/cancel but not refund.

---

## PAGE 06 — Force Logout (Session Revocation)

### In the admin UI

- [ ] **Users list** — Open the Users section; confirm you can open a user detail page.
- [ ] **User detail** — On a user’s detail page, confirm a **Force logout** (or similar) button is visible.
- [ ] **Confirmation** — Click it; a confirmation dialog appears (e.g. “Are you sure?”, reason or warning).
- [ ] **Submit** — Confirm/cancel works; on confirm, the request succeeds (no error toast).
- [ ] **RBAC** — If you have a moderator account: moderator **cannot** see or use Force logout (or gets 403). Only admin/super_admin can.

### API (optional)

- [ ] `POST /api/v1/users/:userId/force-logout` with body `{ "reason": "Test" }`:
  - Without auth → **401**.
  - As moderator → **403**.
  - As admin/super_admin with valid `userId` → **200** (or 404 if user not found).

---

## PAGE 07 — Bookings Admin

### In the admin UI

- [ ] **Sidebar** — Under Finance (or equivalent), there is a **Bookings** link.
- [ ] **List** — Click Bookings; the list page loads with a table of bookings (or empty state).
- [ ] **Pagination** — If there are enough rows, change page; list updates.
- [ ] **Status filter** — If the UI has a status filter (e.g. confirmed, canceled), changing it updates the list.
- [ ] **Detail** — Click a booking row (or “View”); you are taken to `/bookings/:bookingId` (detail page).
- [ ] **Detail content** — Detail shows booking info (id, status, amounts, etc.).
- [ ] **Cancel** — On detail, **Cancel** button opens a confirmation dialog; a reason is required. Submit → success (booking status becomes canceled or UI updates).
- [ ] **Refund** — On detail, **Refund** button opens a confirmation dialog; reason required. Submit → success (booking status becomes refunded or UI updates).
- [ ] **RBAC** — As **moderator**: can open list and detail, can cancel; **Refund** is hidden or returns 403. As **admin/super_admin**: Refund is available and works.

### API (optional)

- [ ] `GET /api/v1/bookings` (auth: moderator or admin):
  - No auth → **401**.
  - With auth → **200** and body with `bookings` array and `total` (or equivalent).
- [ ] `GET /api/v1/bookings/:bookingId` — 200 with booking detail or 404.
- [ ] `POST /api/v1/bookings/:bookingId/cancel` with `{ "reason": "Test cancel" }` — 200 (or 400/404 as appropriate).
- [ ] `POST /api/v1/bookings/:bookingId/refund` with `{ "reason": "Test refund" }`:
  - As moderator → **403**.
  - As admin → **200** (or 404).

---

## Docs & repo (what was added)

- [ ] **Bookings feature doc** — `Docs/features/bookings-admin.md` exists and describes routes, API, RBAC, and destructive flows.
- [ ] **Feature list** — `Docs/features/README.md` includes `bookings-admin.md` in the current feature docs list.
- [ ] **Migrations README** — `MIGRATIONS/README.md` mentions PAGE 06 (force logout) and PAGE 07 (bookings) migration filenames.
- [ ] **RPC copy for app** — `MIGRATIONS/for_sline_app/20260302120000_admin_booking_rpcs.sql` exists; `MIGRATIONS/for_sline_app/README.md` lists it as step 4 (PAGE 07).
- [ ] **Force logout enforcement** — `MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md` exists (PAGE 06 app-repo guidance).

---

## Quick reference

| Area        | Where to look in the app                          |
|------------|----------------------------------------------------|
| Force logout | Users → pick user → User detail → Force logout button + dialog |
| Bookings list | Sidebar → Bookings → table, pagination, status filter |
| Bookings detail | Bookings list → click row → Cancel / Refund + dialogs |
| API base   | Same origin as admin UI, e.g. `/api/v1`           |

When everything above checks out, PAGE 06 and PAGE 07 are verified in the actual app.
