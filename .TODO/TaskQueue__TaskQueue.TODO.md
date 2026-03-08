# Task Queue / Task Queue TODO Summary

## 1. Page Overview
- **Page:** `Task Queue`
- **Tab:** `Task Queue`
- **Route:** `/tasks`
- **Scope:** Figma-driven UI refresh for moderation queue with hero, KPI cards, filters, status chips, and table-first task management.
- **Current state:** UI has been upgraded to match the target visual direction while preserving existing backend integrations. Any missing backend-supported features are intentionally mocked.

## 2. Existing Features Already Linked
- Route wiring is active:
  - Sidebar item **Tasks Queue** -> `/tasks`
  - Route definition for `/tasks` and `/tasks/$taskId`
- Real task list loading from existing API:
  - `GET /tasks` with pagination
  - Status filter (server query)
  - Search query (currently title-based backend search)
- Real refresh flow:
  - Manual refresh button reloads current filters/page
- Real row navigation:
  - Row click / action opens task detail `/tasks/$taskId`
- Real moderation action:
  - Status update dialog requires reason
  - `POST /tasks/:id/status` is used for task status mutation

## 3. Missing Features (Design Referenced but Backend/Feature Not Implemented)
- Real analytics data for hero chart:
  - Posted vs Completed trend for last 7 days is not backed by API yet.
- Real KPI deltas/sparklines:
  - Delta percentages and sparkline trends are not provided by backend.
- Real `Offers` count per task:
  - Table includes offers column visually, but no backend field is currently exposed.
- Real `Views` count per task:
  - Table includes views column visually, but no backend field is currently exposed.
- Real location/meta enrichment for each row:
  - Design uses richer task meta (location-style line) not reliably available from current task payload.
- Real `App View` mode:
  - Toggle exists, but non-table layout behavior/data model is not implemented backend-side.
- Multi-field search parity with design placeholder:
  - Placeholder suggests title/category/poster/UUID. Current backend search is title query only.
- Sortable table headers parity:
  - Design suggests sortable columns; server-side sorting contract is not implemented for this page.

## 4. What We Mocked and Why
- **Hero posted/completed series**: mocked to render the design chart until analytics API exists.
- **KPI sparkline + delta values**: mocked because no existing endpoint returns trend/delta aggregates.
- **Offers + views per row**: mocked because current `GET /tasks` payload does not expose these metrics.
- **Row location/category fallback meta**: mocked deterministic values used when backend does not provide full design fields.
- **App View mode**: mocked placeholder mode to keep the design toggle without inventing new backend behavior.
- **Mock visibility**: page includes a mock notice to avoid ambiguity during QA/review.

## 5. Implementation Plan for Missing Features (High-Level)
1. **Define API contracts**
   - Add a tasks queue analytics endpoint for hero + KPI aggregates by time range.
   - Extend tasks list response with optional moderation metrics (`offers_count`, `views_count`, row meta fields).
   - Add explicit sorting params (`sort_by`, `sort_dir`) with allowlisted columns.
2. **Update shared schemas and admin DTOs**
   - Add typed fields for new analytics and row metrics in shared/admin models.
   - Keep all fields optional until backend rollout is fully stable.
3. **Wire UI from real data**
   - Replace mocked hero/KPI/row metrics incrementally with backend values.
   - Retain graceful fallback if new fields are absent.
4. **Implement real App View (if product-confirmed)**
   - Define behavior and data contract first.
   - Keep table mode as default and parity-tested fallback.
5. **Search improvements**
   - Upgrade backend query to support category/poster/UUID matching.
   - Keep current title search path as compatibility fallback.
6. **Validation and QA**
   - Add tests for sorting/filter combinations and mock-to-real switch paths.
   - Verify pagination, role access, and status update flow remain stable.

## 6. Risks / Dependencies / Required APIs
- **Data model dependency:** availability of metrics sources for offers/views (table ownership and cardinality must be confirmed).
- **Performance risk:** aggregated counts + joins in tasks list can degrade latency without indexes/materialized strategy.
- **Contract drift risk:** UI currently supports optional/mocked fields; backend rollout must preserve backward compatibility.
- **RBAC and audit dependency:** any new write actions or moderation commands must stay aligned with existing role guards/audit logging.
- **Sorting consistency risk:** server-side sorting must be deterministic across pages to prevent row jumps.
- **Search scope risk:** expanding multi-field search may require query optimization and relevance tuning.
- **Build pipeline note:** workspace typecheck currently has unrelated pre-existing errors in `features/cases` (not caused by Task Queue changes), which can affect full CI signal if not addressed separately.
