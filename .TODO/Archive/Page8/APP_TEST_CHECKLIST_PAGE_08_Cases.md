# App test checklist — PAGE 08 Cases (report fixes)

Use this checklist to verify in the **running admin app** that the report fixes and Cases feature work as expected.

**Prerequisites**: Admin UI running (`npm run -w @sline/admin-ui dev`), API running with DB/migrations applied, logged in as a user with a cases role (support, moderator, admin, or super_admin).

---

## 1. Navigation & entry points

- [ ] **Sidebar**: "Cases" link is visible (e.g. under a section with FolderOpen icon).
- [ ] **URL**: Clicking "Cases" goes to `/cases`.
- [ ] **Cases list**: Page title is "Cases" and subtitle mentions investigation/moderation and chat access gating.

---

## 2. Cases list & list response fix

- [ ] **Load**: List loads without error (either "No cases yet" or a table of cases).
- [ ] **Total count**: The card or text shows "Total cases: N" (or similar) and N matches the number of cases (or 0).
- [ ] **Pagination text**: If there are cases, the footer shows "Showing X of **N** cases" where N is the total from the API (not only the current page size). So with 25 total and limit 10, you see "Showing 10 of 25 cases".
- [ ] **Refresh**: "Refresh" button reloads the list without error.

---

## 3. Create case (and static import)

- [ ] **Open dialog**: "New case" opens a create-case dialog.
- [ ] **Subject required**: Submitting with empty subject shows a validation error (no success).
- [ ] **Valid submit**: Filling subject (e.g. "Test case"), optional source/priority, then submit:
  - Request succeeds (no unhandled error).
  - Dialog closes and you are **navigated to** `/cases/<new-case-id>` (case detail).
- [ ] **List update**: Going back to `/cases`, the new case appears in the list (or after refresh).

---

## 4. Case detail

- [ ] **Open detail**: Clicking a case row goes to `/cases/$caseId` (URL has a UUID).
- [ ] **Content**: Detail shows case info (subject, status, priority, source, dates, etc.).
- [ ] **Back**: "Back to cases" (or similar) returns to `/cases` without error.
- [ ] **Invalid ID**: Manually changing URL to `/cases/not-a-uuid` and loading: API returns 400 (you may see an error message in the UI or in network tab).

---

## 5. Attach entity

- [ ] **Form**: On case detail, there is an "Attach entity" (or similar) form with entity type (e.g. task, user, conversation, booking, dispute) and entity ID.
- [ ] **Submit**: Enter a valid `entity_type` and a valid UUID `entity_id`; submit.
  - Request succeeds and the new row appears in the "Attached entities" table (or list).
- [ ] **Duplicate**: Attaching the same entity again: API returns 409 or UI shows already-attached; no duplicate row.
- [ ] **Invalid caseId**: If the app ever calls attach with a malformed case ID, API returns 400 (can check in network tab if needed).

---

## 6. Optional — API response shape (DevTools)

- [ ] **List response**: In Network tab, GET `/api/v1/cases?page=1&limit=10` response body has `cases`, `total`, `page`, `limit`, and optionally `totalPages` (no `count`).
- [ ] **Detail**: GET `/api/v1/cases/<uuid>` returns 200 with case and entities (or 404 if not found).

---

## 7. Docs & migrations (files on disk)

- [ ] **MIGRATIONS/README.md**: Contains a "PAGE 08 — Cases domain" section describing `20260308100000_admin_cases.sql`.
- [ ] **Docs/features/cases.md**: Exists and describes list/detail UI, create, attach, API (`total`/`totalPages`), and case-gated chat (PAGE 09).

---

## Sign-off

| Date       | Tester | All items passed |
|------------|--------|------------------|
| __________ | ________ | ☐ Yes  ☐ No (notes: ________) |
