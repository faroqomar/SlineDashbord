# Reports Queue (PAGE 10) — App verification checklist

Use this list to verify in the **running admin app** what was implemented. Run the admin-ui dev server and an authenticated session, then go through each item.

---

## 1. Navigation & route

- [ ] **Sidebar:** "Reports" link is visible (Flag icon), points to `/reports`.
- [ ] **Navigate:** Click "Reports" → URL is `/reports`, page title is "Reports Queue" (or equivalent).
- [ ] **No crash:** Page loads without white screen or console errors.

---

## 2. Reports list

- [ ] **Table:** A table (or empty state) is shown with columns: ID, Entity, Status, Created, and a "View" action.
- [ ] **Empty state:** If there are no reports, "No reports found." (or similar) is shown.
- [ ] **Loading:** On first load, a loading state appears briefly (e.g. "Loading reports…").
- [ ] **Refresh:** "Refresh" button is visible; clicking it refetches the list (loading state appears again).

---

## 3. Filters

- [ ] **Status filter:** A dropdown to filter by status (e.g. All / Open / Triaged / Closed). Changing it refetches the list.
- [ ] **Entity type filter:** A dropdown to filter by type (e.g. All / Task / User / Chat). Changing it refetches the list.
- [ ] **Page reset:** After changing status or type, list shows page 1 (no "page 2" with empty list).

---

## 4. Pagination

- [ ] **When many reports:** If total > page size, "Previous" / "Next" (or page numbers) appear.
- [ ] **Previous:** On page 2+, "Previous" goes back one page; list updates.
- [ ] **Next:** "Next" goes to next page; list updates.
- [ ] **Disabled:** "Previous" disabled on page 1; "Next" disabled on last page.

---

## 5. Report detail dialog

- [ ] **Open:** Click "View" on a report row → a dialog opens with report details.
- [ ] **Content:** Dialog shows at least: report ID, entity type/id, status, reason, reporter, and action history (if any).
- [ ] **Loading:** If detail is fetched on open, a short loading state appears in the dialog.
- [ ] **Close:** "Done" or closing the dialog closes it and returns to the list.

---

## 6. Triage (when report is not closed)

- [ ] **Triage section:** In the detail dialog, a "Triage" section with: action dropdown (e.g. dismiss, warn_user, escalate, close), reason textarea, and "Triage" button.
- [ ] **Validation:** "Triage" is disabled when reason is empty; enabling after typing reason works.
- [ ] **Submit:** Filling action + reason and clicking "Triage" shows loading (e.g. "Sending…"), then dialog updates or list refreshes; no uncaught error.
- [ ] **Error:** If API returns an error, an error message appears in the dialog (e.g. red alert).

---

## 7. Close report

- [ ] **Close section:** A "Close report" section with reason textarea and "Close" button.
- [ ] **Validation:** "Close" is disabled when reason is empty.
- [ ] **Submit:** Filling reason and clicking "Close" shows loading, then dialog/list update; report status becomes closed (or dialog shows "This report is closed").
- [ ] **Error:** On API error, error message is shown in the dialog.

---

## 8. Closed report

- [ ] **When status is closed:** Dialog does not show triage/close forms (or shows "This report is closed" only).
- [ ] **List:** Closed reports show with a "closed" badge (or equivalent) in the list.

---

## 9. Errors & robustness

- [ ] **Network error:** With devtools offline (or bad API), list shows an error alert (e.g. "Error" with message); refresh or retry works when back online.
- [ ] **No duplicate requests:** Changing filters or pagination does not trigger an obvious flood of requests (e.g. single request per change).

---

## 10. Code / docs (optional)

- [ ] **ViewModel:** `ReportsScreen` uses `useReportsViewModel()` only (no local `useState` for list/detail/triage/close; no direct `reportsApi` in the view). *Can check in IDE.*
- [ ] **Feature doc:** File `docs/features/reports-queue.md` exists and describes `/reports` UI, API, and audit actions.

---

## Quick smoke (minimal)

If short on time, at least:

1. Open `/reports` → page loads, table or empty state visible.
2. Use status/entity filters → list updates.
3. Click "View" on a report (or confirm empty state) → dialog opens and closes.
4. (If you have open reports) Submit triage or close with a reason → no crash, UI updates.

---

*Checklist for PAGE 10 Reports Queue implementation. Adjust checkboxes as you verify.*
