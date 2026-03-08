# Disputes Page / Disputes Tab TODO

## 1. Page Overview

The `Disputes` tab in `apps/admin-ui` is implemented as a UI-first moderation board with a dark visual style that matches the provided design direction.

Current layout includes:
- Hero section (`Dispute Center`) with refresh action, trend legend, and trend graphic area.
- KPI cards row (`Total Disputes`, `Open / Active`, `Resolved`, `Total Amount`).
- Search input and segmented status filter (`All`, `Open`, `Under`, `Escalated`, `Resolved`).
- Four dispute lanes (`OPEN`, `UNDER REVIEW`, `ESCALATED`, `RESOLVED`) with cards and empty states.
- Lane skeleton loading states.

Primary files:
- `apps/admin-ui/src/features/disputes/view/DisputesScreen.tsx`
- `apps/admin-ui/src/features/disputes/viewmodels/use_disputes_viewmodel.ts`
- `apps/admin-ui/src/features/disputes/models/disputes-ui.mock.ts`

## 2. Existing Features Already Linked

- Route wiring:
  - `GET /disputes` page route is active in `apps/admin-ui/src/App.tsx`.
  - Detail route `/disputes/$disputeId` is active and linked from cards.
- Real data loading:
  - Four status-based queries are wired via existing API (`open`, `in_progress`, `escalated`, `resolved`).
  - Search term is wired to existing backend `query` parameter.
- Refresh behavior:
  - Refresh button invalidates disputes query cache and reloads lane data.
- Card navigation:
  - Clicking a card opens the existing dispute detail page.
- Existing backend APIs used without backend changes:
  - `GET /disputes`
  - `GET /disputes/:id`
  - `POST /disputes/:id/resolve` (detail flow)

## 3. Missing Features (Design References But Backend/Feature Not Implemented)

- Create dispute action from admin UI:
  - Design shows `New Dispute`, but no existing admin create endpoint/flow is available for this tab.
- Real trend analytics:
  - Design implies “last 7 days” opened vs resolved trend data, but no dedicated trend API is available.
- Real KPI delta metrics:
  - Design includes percent/increment deltas (for example `+23%`, `+18%`), but no backend summary endpoint currently provides these values.
- Rich card metadata:
  - Design includes severity/category/comment-count style metadata in list cards, but list API payload does not provide these fields directly.

## 4. What We Mocked and Why

Mock source file:
- `apps/admin-ui/src/features/disputes/models/disputes-ui.mock.ts`

Mocked items:
- Hero trend series (`opened`, `resolved`) for chart drawing.
- KPI delta labels (`totalDisputes`, `openActive`, `resolved`, `totalAmount`).
- Card metadata:
  - Severity label
  - Category label
  - Comment count
- `New Dispute` CTA behavior:
  - Button is rendered as disabled and explicitly tagged as mock in the UI.

Reason:
- These fields/actions are not currently returned by existing dispute list APIs or exposed as existing admin actions.
- Rule followed: no new backend features were introduced in this UI pass.

## 5. Implementation Plan for Missing Features (High-Level Only)

1. Add disputes summary/trend backend contract:
- Introduce a read endpoint that returns:
  - 7-day opened/resolved trend arrays
  - KPI totals and deltas

2. Extend disputes list response with optional UI metadata:
- Add fields for severity/category/comment_count in the list payload, or provide a companion metadata endpoint keyed by dispute id.

3. Add admin “create dispute” flow only if product-approved:
- Define endpoint contract, validation, RBAC, and audit requirements.
- Add modal/page flow in admin UI only after API is stable.

4. Replace mock bindings incrementally:
- Switch hero trend and KPI deltas to real API data.
- Switch card metadata to real fields.
- Remove mock badges once real data parity is achieved.

5. QA and rollout:
- Validate status filters, search behavior, and fallback states.
- Confirm no regressions in dispute detail and resolve flows.

## 6. Risks / Dependencies / Required APIs

Risks:
- Query fan-out: four parallel status queries can increase request load and perceived latency.
- Search consistency: backend search fields may not perfectly match user expectations from design copy.
- Data mismatch: if summary and lane data come from different aggregation windows, KPI totals can appear inconsistent.

Dependencies:
- API route ownership: `apps/api/src/routes/disputes.ts`.
- DB relations currently used by disputes:
  - `disputes`
  - `tasks`
  - `profiles`
  - `dispute_messages`
  - `dispute_evidence`
- Admin RBAC and audit middleware behavior for any future write action.

Required APIs for full de-mock:
- `GET /disputes/summary` (or equivalent): totals + deltas.
- `GET /disputes/trends?window=7d` (or equivalent): opened/resolved series.
- List enrichment in `GET /disputes` for card metadata (severity/category/comment_count), or a separate metadata endpoint.
- Optional: `POST /disputes` if admin-created disputes are intentionally supported.
