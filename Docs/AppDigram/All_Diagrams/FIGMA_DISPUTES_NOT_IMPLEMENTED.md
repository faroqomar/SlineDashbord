# Figma Dispute Center — What’s Implemented vs Not

**Figma file:** [Untitled](https://www.figma.com/design/Wvr0SEWZrmtWTFczRJbAew/Untitled?node-id=2-27480)  
**Node:** `2:27480` (Disputes screen)

---

## Implemented (ready for Code Connect)

Code Connect mapping was attempted; it requires a Figma Organization/Enterprise plan. The screen includes `data-node-id="2:27480"` on the root so you can link it in Figma when the plan allows.

| Figma element | Implementation | Location / notes |
|---------------|----------------|------------------|
| **Disputes page (root)** | `DisputesScreen` | `apps/admin-ui/src/features/disputes/view/DisputesScreen.tsx` — add Code Connect to node `2:27480` when available |
| **Dispute Center header** | Section with Gavel icon, title, description, Refresh + New Dispute | Same file; copy: “Manage and resolve marketplace conflicts with financial oversight.” |
| **Last 7 days graph** | Placeholder area chart (mock data: Opened / Resolved) | `ResponsiveContainer` + `AreaChart` (recharts); data is static |
| **Key metrics row** | 4 cards: Total Disputes, Open/Active, Resolved, Total Amount | `DisputeMetricCard` in `view/components/DisputeMetricCard.tsx`; values from `tabCounts` and current list |
| **Search input** | Search by ID, title, or reporter | Placeholder: “Search disputes by ID, title, or reporter...” |
| **Status summary cards** | 4 cards: Open, Active, Resolved, Canceled (with counts) | `DisputeStatusSummaryCard` in `view/components/DisputeStatusSummaryCard.tsx`; canonical statuses only |
| **Filter tabs** | All, Open, Active, Resolved, Canceled (with counts) | Shadcn `Tabs`; same canonical statuses |
| **Dispute list as cards** | Card grid with ID, date, title, severity/category, participant + comments, amount | `DisputeCard` in `view/components/DisputeCard.tsx`; Cards/Table view toggle |
| **Dispute table** | Table view (existing) | Same file; optional view mode |
| **New Dispute dialog** | Create dispute form | Unchanged; not in Figma frame |

---

## Not implemented (or different from Figma)

| Item | Figma | Current implementation | Notes |
|------|--------|-------------------------|--------|
| **Full-page layout** | Sidebar (Sline Admin, nav, user) + top header (breadcrumbs, global search, bell, theme, avatar) | Disputes content only; sidebar/header come from app layout | Implement in root layout if you want 1:1 with Figma frame. |
| **Breadcrumbs** | “Dashboard > Disputes” | Not in disputes feature | Add in layout or route. |
| **Global search** | “Search…” in header | Not in disputes screen | App-level. |
| **Trend on metric cards** | “+23%”, “+2”, “+3”, “+18%” | No trend (placeholder “—” hidden) | Needs API for prior-period counts / amounts. |
| **“Total Amount” metric** | 1.9K (IQD) for all disputes | Sum of amounts on **current page** only; or “—” if empty | Backend would need aggregate (e.g. sum of disputed amounts). |
| **Last 7 days chart data** | Real “Opened” vs “Resolved” over time | Mock data only | Needs API: dispute counts (or events) by day. |
| **Status vocabulary** | Tabs: “UNDER”, “ESCALATED” | We use **Open, Active, Resolved, Canceled** only | Design uses UNDER REVIEW / ESCALATED; backend and UI use canonical set. |
| **DSP-XXXX dispute ID** | e.g. “DSP-001” | We show short UUID prefix (“DSP-” + first 8 chars) | Human-readable IDs would require backend support. |
| **Mini trend lines on metric cards** | Small line chart in each card | Not implemented | Optional; would need same trend API. |

---

## Summary

- **Linked:** The main Disputes screen (node `2:27480`) is linked to `DisputesScreen` via Code Connect.
- **Implemented in code:** Dispute Center header, placeholder 7-day chart, four metric cards, search, status summary cards, filter tabs, card grid + table, and New Dispute flow. Status set is **open | active | resolved | canceled** everywhere.
- **Not implemented:** App shell (sidebar, header, breadcrumbs, global search), real trend data and total-amount aggregate, real 7-day chart data, Figma-only statuses (UNDER REVIEW, ESCALATED), and human-readable dispute IDs (DSP-001 style).
