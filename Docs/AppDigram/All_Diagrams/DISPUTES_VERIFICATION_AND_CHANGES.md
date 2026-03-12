# Disputes Tab Workflow — Verification Checklist & Change Summary

## Checklist: What to Check in the Actual App

Use this when testing the admin dashboard and API.

### Disputes UI (Admin Dashboard)

- [ ] **Disputes page loads** — Open the Disputes section in the sidebar.
- [ ] **Tabs appear** — You see tabs: **All**, **Open**, **Active**, **Resolved**, **Canceled** (with counts if the API returns them).
- [ ] **Tab counts** — Numbers on tabs match the list (e.g. “Open (3)” shows 3 open disputes when you click Open).
- [ ] **Switch tabs** — Clicking a tab filters the table; list updates without full page reload.
- [ ] **Pagination** — If there are many disputes, you can change page; URL or table updates correctly.
- [ ] **Search** — Typing in the search box and submitting filters the list (by reason or ID). Try a short query and one with a single quote (e.g. `test'`) — app should not break.
- [ ] **Open a dispute** — Click a row to open the dispute detail screen.
- [ ] **Detail: Accept** — For an **open** dispute, you see an Accept action; clicking it opens a modal, reason is required; submitting accepts the dispute (status → active).
- [ ] **Detail: Cancel** — For **open** or **active**, you see Cancel; modal requires a reason; submitting cancels the dispute.
- [ ] **Detail: Resolve** — For **active**, you see Resolve; modal has reason (required), optional outcome, and booking selector when multiple bookings exist; submitting resolves the dispute.
- [ ] **New Dispute** — “New Dispute” (or similar) opens a create form; submitting creates a dispute (if you have write permission).

### API / Backend (if you can call the API)

- [ ] **GET /disputes** — Returns `disputes`, `totalDisputes`, `totalPages`, and `tabCounts` (all, open, active, resolved, canceled).
- [ ] **GET /disputes?status=open** — List filtered by status.
- [ ] **GET /disputes?query=something** — Search works; long or special-character queries don’t error (search is sanitized).
- [ ] **GET /disputes/:id** — Returns detail with `booking_candidates` and `action_availability` (can_accept, can_cancel, can_resolve, requires_booking_id).
- [ ] **POST /disputes/:id/accept** — Accepts only when status is open; requires auth.
- [ ] **POST /disputes/:id/cancel** — Body `{ "reason": "..." }`; works for open/active; requires auth.
- [ ] **POST /disputes/:id/resolve** — Body `{ "reason": "...", "outcome": "...", "booking_id": "..." }` (outcome/booking_id optional when not required); requires auth.

### Build & Tests (from repo)

- [ ] **Shared build** — `npm run build -w @sline/shared` passes.
- [ ] **API build** — `npm run build -w @sline/api` passes.
- [ ] **Shared tests** — `npm exec vitest run` (or run shared package tests) — disputes schema tests pass.

---

## What Was Done — Short Summary

### Why we did it

- Implement the **Disputes Tab Bar + A-to-Z workflow**: canonical statuses, tabbed queue, accept/cancel/resolve via RPCs with audit, and a clear UI.
- Then fix the two **orchestrator report blockers**: API build failure (finance route) and disputes list search safety.

---

### What was **added**

| Where | What | Why |
|-------|------|-----|
| **Shared** | Schemas: `DisputeQueueRow`, `DisputeTabCounts`, `DisputeDetail` with `booking_candidates` and `action_availability`; input schemas for accept/cancel/resolve; `DISPUTES_READ_ROLES` / `DISPUTES_WRITE_ROLES` | One place for API and UI contracts and RBAC roles. |
| **DB** | Migration + RPCs: `admin_accept_dispute`, `admin_cancel_dispute`, `admin_resolve_dispute` (each with audit in same transaction) | All dispute state changes go through RPCs with audit; no direct UPDATE from API. |
| **API** | List endpoint: `tabCounts`, status filter, pagination; detail endpoint: `booking_candidates`, `action_availability`; POST routes: `/:id/accept`, `/:id/cancel`, `/:id/resolve` calling only RPCs | Tab counts and actions driven by backend; mutations are RPC-only. |
| **API** | `sanitizeDisputeSearchQuery()` — trim, max 200 chars, escape single quotes for list search | Safe use of search query in filter (report fix). |
| **Admin UI** | Tabbed queue (All / Open / Active / Resolved / Canceled), server-paginated table, search, “New Dispute” entry | Replace kanban with tabbed list and creation. |
| **Admin UI** | Dispute detail: Accept / Cancel / Resolve buttons and modals (reason required; outcome/booking when resolving) | Let admins perform workflow actions from the detail screen. |
| **Admin UI** | `disputes_api`: `acceptDispute`, `cancelDispute`, `resolveDispute`; list response type includes `tabCounts` | Wire UI to new API endpoints. |
| **Docs** | `14_dispute-lifecycle.md` — short admin workflow paragraph; orchestrator review and this verification doc | Document behavior and how to verify. |

---

### What was **removed**

| Where | What | Why |
|-------|------|-----|
| **Disputes code only** | Non-canonical statuses: `in_progress`, `escalated`, `under_review` (and any other non-standard ones) from shared schema, admin-ui, and API | Single vocabulary: **open \| active \| resolved \| canceled**. |
| **Admin UI** | Old disputes kanban view | Replaced by tabbed table. |
| **API** | Direct `UPDATE disputes` or custom audit wrappers for accept/cancel/resolve | All mutations go through the three RPCs that do status change + audit in one transaction. |

---

### What was **modified**

| Where | What | Why |
|-------|------|-----|
| **Shared** | Dispute status enum and all dispute-related types to use only open/active/resolved/canceled | Canonical status everywhere. |
| **Admin UI** | Disputes feature: models, viewmodels, views, services — status handling, list/detail data shape, actions | Use new API (tabs, counts, detail, accept/cancel/resolve). |
| **API** | `disputes.ts`: list returns `tabCounts` and uses canonical status; detail returns `booking_candidates` and `action_availability`; accept/cancel/resolve call RPCs only; list search uses `sanitizeDisputeSearchQuery(query)` | Align with contracts and fix search safety. |
| **API** | `finance/workflow.ts`: `requireAdminRole(WORKFLOW_ROLES)` → `requireAdminRole([...WORKFLOW_ROLES])` | Fix TypeScript: pass `string[]` so API build passes (report fix). |
| **Root** | `vitest.config.ts` (simplified so Vitest runs without Storybook for api + shared) | Allow running tests from root without Storybook. |
| **Docs** | Orchestrator review: blockers marked fixed, readiness set to Ready | Reflect fixes and current status. |

---

### One-line summary

**We added** a full disputes tab workflow (tabs, counts, detail, accept/cancel/resolve via RPCs and safe search), **removed** non-canonical statuses and direct dispute updates from the API, and **modified** shared types, API, and admin UI to use one status set and the new endpoints, plus fixed the API build and list search so the orchestrator report is satisfied.
