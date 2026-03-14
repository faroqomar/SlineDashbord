# App View Feature — Plan Critic Audit (Execution-Ready)

**Source plan:** [FEATURE__app_view_real_mode.PLAN.md](FEATURE__app_view_real_mode.PLAN.md)  
**Design reference:** Figma [Task Queue App View](https://www.figma.com/design/Wvr0SEWZrmtWTFczRJbAew/Untitled?node-id=11-43)  
**Aligned with:** [.agent/workflows/plan_critic.md](../../.agent/workflows/plan_critic.md)

---

## A) Assumptions + Decision Needed (Blocking)

### Assumptions (inferred from repo and Figma)

- **Verified in dashboard code:** Task Queue lives at `/tasks`; Table/App View toggle exists in [TaskFilters.tsx](../../apps/admin-ui/src/features/tasks/view/components/TaskFilters.tsx); App View currently shows mock placeholder in [TasksScreen.tsx](../../apps/admin-ui/src/features/tasks/view/TasksScreen.tsx) (lines 293–298).
- **Verified in dashboard code:** `GET /api/v1/tasks` returns `tasks`, `count`, `totalPages`; list item shape includes `id`, `title`, `description`, `status`, `budget`, `created_at`, `deadline`, `category`, `client` (id, full_name, avatar_url), `freelancer`. Refs: [tasks.ts](../../apps/api/src/routes/tasks.ts), [task.schema.ts](../../apps/admin-ui/src/features/tasks/models/task.schema.ts).
- **Verified in dashboard code:** ViewModel `useTasksViewModel` exposes `tasks`, `totalTasks`, `filters`, `changeFilters`, `isLoading`; no view-mode or carousel index in VM today.
- **Figma design:** App Preview = panel title “App Preview — Browse tasks as users see them”, device frame (~340px), one task per “slide” with: status bar, “Task Details” header, poster (avatar, name, rating, status), title, description, location, category, date, budget, views/saves/shares, then “Offers” (count, avg, offer cards). Prev/Next + “1 / 12”, pagination dots. No new mutations in design.

### Decision Needed (Blocking)

| # | Missing decision | Options | Recommended | Plan impact |
|---|------------------|---------|-------------|-------------|
| 1 | Scope of “as users see them”: full fidelity vs. admin-only subset | (A) Match Figma 1:1 including offers list, views/saves/shares, location. (B) Ship with existing API fields only; use placeholders for offers/views/saves/location. (C) Add only `offers_count` (and optionally list) from backend; rest placeholders. | **B** for first release; then extend with **C** when [FEATURE__task_offers_count.PLAN.md](FEATURE__task_offers_count.PLAN.md) is done. Avoids blocking on missing tables/APIs. | Phase 2: no new list API fields in v1. Phase 4: App Preview shows real task data + “Offers —” with count from detail or placeholder “—”. |
| 2 | Offers in App Preview: list or count only? | (A) Count only (from future list/detail). (B) List of offers (needs new endpoint or detail extension). (C) Placeholder “Offers —” with no number in v1. | **C** for v1; replace with **A** when task offers count is available. | No `GET /tasks/:id/offers` in this plan. |
| 3 | View mode persistence | (A) URL query `?view=app`. (B) LocalStorage. (C) Session only (no persistence). | **A** for shareability and back/forward. | Phase 4: read/write `view` from TanStack Router search params. |

---

## B) Gate Status (Pass/Fail)

| Gate | Status | Reasons | Fixes to pass |
|------|--------|---------|----------------|
| 0. Test infrastructure | ✅ PASS | Vitest + Playwright present; [apps/api/src/routes/tasks.test.ts](../../apps/api/src/routes/tasks.test.ts) exists. | None. |
| 1. Data/Contracts | ❌ FAIL | Task list DTO has no `offers_count`, `views_count`, `location_label`; Figma shows them. Optional fields not yet decided for v1. | Decide v1 = existing fields only (no contract change). Document optional future fields. Then PASS. |
| 2. Security | ✅ PASS | App View is read-only; uses same `GET /tasks` and RBAC as table. No new mutations. | None. |
| 3. Backend/API | ✅ PASS | No new endpoints required for v1. Existing list + detail sufficient for task card + placeholder offers. | None. |
| 4. UI/Integration | ❌ FAIL | No component for App Preview panel/device frame/carousel; mock placeholder only. | Add Phase 4 steps: build `TaskAppPreview` (panel + device + carousel), wire `vm.tasks` and index state. |
| 5. Release/QA | ❌ FAIL | No explicit smoke/E2E for “switch to App View and see real task in device”. | Add Phase 5: smoke test view toggle + App View shows current page tasks. |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix | Owner | Acceptance |
|-----|----------------|-----|--------|------------|
| No measurable “done” for App View | Execution can’t be verified. | Add DoD: “When view=app, device frame shows one task per slide from current page; prev/next and index (e.g. 1/10) work; open in new tab with ?view=app shows same.” | @AdminArchitect | DoD in §5 and in corrected plan. |
| View mode not in URL | Back/forward and sharing lose App View. | Add step: sync `viewMode` with route search param `view` (table | app). | @UIExpert | Navigating to `/tasks?view=app` shows App View. |
| Carousel index out of sync with page | Changing page resets or shows wrong task. | Carousel index scoped to current page; on `filters.page` or `tasks` change, reset index to 0 or clamp. | @UIExpert | After “Next page”, first slide is first task of new page. |
| No loading/empty state for App View | Poor UX when loading or zero tasks. | Reuse table loading skeleton for App Preview area; empty state “No tasks” when `tasks.length === 0`. | @UIExpert | No blank device frame; skeleton or empty message. |
| Figma assets as remote URLs | Figma MCP asset URLs expire in 7 days. | Use project icons (e.g. Lucide) and existing design tokens; do not rely on Figma asset URLs in code. | @UIExpert | No `figma.com/api/mcp/asset` in codebase. |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|---------------|
| App View is read-only. | No new mutation endpoints; no status update from device frame in v1 (link to detail only). | Code review; no `handleUpdateStatus` or POST from App Preview. |
| Same RBAC as Task Queue. | Reuse existing `GET /tasks`; no new route. | Same `requireAdminRole` as list route. |
| Table remains default. | Default `view` = table when param missing. | Manual/automated: open `/tasks` → table. |
| View state driven by VM/route. | View mode from URL; carousel index in view state (useState or VM). | No view mode in random component state only. |

---

## E) Risk Register

| Risk | Where | Probability | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|-------------|--------|--------------|--------------|------------|----------|
| Carousel index > length after filter | App View when filters reduce list | Med | Low | Feature | Wrong “3 / 0” or crash | Clamp index to `[0, tasks.length-1]`; reset to 0 when tasks change | Reset to 0 on `tasks` or `page` change |
| Performance with large page size | App View with e.g. 50 tasks | Low | Med | Feature | Slow interaction | Keep page size default 10; pagination unchanged | Cap carousel to first N if needed |
| Build/typecheck already failing | DASHBOARD_CURRENT_STATE | High | Med | App-wide | CI red | Fix calendar/react-day-picker before adding UI | Unblock build in Phase 0 |
| Offers/location/views shown as “—” | App Preview content | Certain | Low | Feature | User expects real data | Document v1 as “task + placeholder stats”; plan follow-up for offers_count | Product note in UI or doc |

---

## F) Pre-Mortem

- This fails when **view mode is not in the URL** and users refresh or share the link and lose App View.
- This fails when **carousel index is not reset** on page change and the device shows a task from the previous page.
- This fails when **we add new API fields** (offers_count, etc.) before the backend supports them and the UI breaks or shows wrong data.
- This fails when **Figma asset URLs** are baked into components and they expire after 7 days.
- This fails when **loading/empty states** are missing and the device frame is blank or confusing.
- This fails when **DoD is vague** and “implement App View” is signed off without a testable criterion.
- This fails when **table view regresses** (e.g. filters or pagination) because App View and table share the same VM and we change assumptions.

---

## G) Plan Fixes (Concrete Additions)

| Goal | Why | How | Artifact | Stop condition |
|------|-----|-----|----------|-----------------|
| Stabilize build | DASHBOARD_CURRENT_STATE reports admin-ui typecheck failure. | Fix calendar/react-day-picker or exclude from build until fixed. | Green `npm run build -w @sline/admin-ui` | Build passes. |
| Define v1 data boundary | Avoid scope creep and broken UI. | Document: v1 App View uses only existing TaskDTO fields; location/views/saves/offers as “—” or optional label. | DoD §5 + Phase 2 note | Contract unchanged; UI uses only existing fields. |
| Persist view in URL | Shareability and back/forward. | Use TanStack Router search params `view=table|app`; default `table`. Read in TasksScreen; set on toggle. | Route + TasksScreen + TaskFilters | `/tasks?view=app` shows App View. |
| Carousel index lifecycle | No out-of-bounds or stale slide. | On `vm.tasks` or `vm.filters.page` change, set carousel index to 0. Clamp index to `[0, tasks.length - 1]` when rendering. | TaskAppPreview or TasksScreen | No crash; index always valid. |
| Loading and empty states | UX. | When `vm.isLoading` and no tasks: show skeleton for App Preview. When `!vm.isLoading` and `tasks.length === 0`: show “No tasks” in device area. | TaskAppPreview component | No blank frame. |
| Smoke test for App View | Regression and DoD. | E2E or smoke: go to /tasks, click App View, see device with at least one task or “No tasks”; prev/next if multiple. | E2E or smoke test | Automated or manual run. |

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

### Phase 0: Preconditions / Build Stabilization

- **Goal:** Build and typecheck pass so UI work is testable.
- **Why:** DASHBOARD_CURRENT_STATE reports admin-ui build failure (e.g. calendar).
- **How:** Fix or isolate failing deps; run `npm run typecheck` and `npm run build` at repo root and for admin-ui.
- **Result:** Green build.
- **Gate:** Build Gate — `npm run build` succeeds for `@sline/admin-ui`.

**Steps:**

- 0.1 (@DevOps): Resolve admin-ui typecheck/build failure (e.g. react-day-picker in calendar).  
  - Verification (@QA): `npm run build -w @sline/admin-ui` exits 0.

---

### Phase 1: Contracts (Shared)

- **Goal:** No contract change for v1; document optional future fields.
- **Why:** Avoid breaking existing list API; Figma shows fields we don’t have yet.
- **How:** Leave `TaskDTO` and `GET /tasks` response as-is. In feature doc or DoD, list: “v1 App View uses existing fields only; offers_count, views_count, location_label deferred.”
- **Result:** Clear v1 boundary; no schema/API change.
- **Gate:** Contracts Gate — No change to `packages/shared` or list response; DoD updated.

**Steps:**

- 1.1 (@SysOp): Confirm no change to `GET /api/v1/tasks` or TaskDTO for v1.  
  - Verification (@QA): Existing tasks tests still pass.
- 1.2 (@AdminArchitect): Document in DoD/feature doc: v1 = existing fields; placeholders for offers/views/location.  
  - Verification (@CodeWarden): DoD and optional-fields note present.

---

### Phase 2: Backend/API

- **Goal:** No new endpoints; existing list + detail sufficient.
- **Why:** App View is read-only; list gives task card data; detail can be used for “View full” later.
- **How:** No backend code change. Optional: ensure `GET /api/v1/tasks/:id` returns enough for a single-task preview if we add “open in new tab” from device.
- **Result:** No API changes.
- **Gate:** API Gate — No new routes; existing tasks routes unchanged.

**Steps:**

- 2.1 (@SysOp): Confirm `GET /api/v1/tasks` and `GET /api/v1/tasks/:id` are sufficient for App Preview (title, description, status, budget, client, etc.).  
  - Verification (@QA): Existing tasks API tests pass.

---

### Phase 3: ViewModels

- **Goal:** View mode and carousel index available for UI without breaking MVVM.
- **Why:** View must read from URL; carousel index is UI state but must reset on data change.
- **How:** Either (a) extend VM to expose `viewMode` (from URL) and `carouselIndex` + setter with reset on `tasks`/`page` change, or (b) keep view mode and index in TasksScreen and sync view to URL. Prefer (b) for v1 to avoid VM bloat; URL sync in view layer.
- **Result:** View mode in URL; carousel index scoped to current page and reset on page/tasks change.
- **Gate:** MVVM — No Supabase/DB in view; VM still single source for task list and filters.

**Steps:**

- 3.1 (@AdminArchitect): Define contract: view mode from route search param `view` (default `table`); carousel index state in screen or VM, reset when `vm.filters.page` or `vm.tasks` identity/length changes.  
  - Verification (@CodeWarden): No direct DB in views; VM used for data.
- 3.2 (@UIExpert): Implement URL sync: read `view` from router search params in TasksScreen; on Table/App toggle, navigate with `?view=table` or `?view=app`.  
  - Verification (@QA): Navigate to `/tasks?view=app` → App View; refresh keeps view.

---

### Phase 4: UI

- **Goal:** Replace mock App View with Figma-aligned App Preview: panel title, device frame, one task per slide, prev/next, index, dots; loading and empty states.
- **Why:** Design and user request; current placeholder is “App View (Mock)”.
- **How:** Build `TaskAppPreview` (or equivalent) used when `viewMode === 'app'`: “App Preview — Browse tasks as users see them”, device frame (~340px), scrollable content for one task (poster, title, description, budget, status, category, date; use existing TaskDTO; location/views/saves/offers as “—” or “Offers —” in v1). Prev/Next buttons; “currentIndex + 1 / total” (e.g. 1/10); pagination dots. Use Lucide/icons and existing tokens; no Figma asset URLs. When `vm.isLoading` and no tasks: skeleton. When `!vm.isLoading` and `tasks.length === 0`: “No tasks” in device. Clamp index to `[0, tasks.length - 1]`; reset index to 0 when `vm.tasks` or `vm.filters.page` change. Link “View full” or title to `/tasks/:id` if desired.
- **Result:** App View shows real tasks in device frame; table default; no regression to table.
- **Gate:** UI Gate — App View shows current page tasks; table unchanged; loading/empty handled.

**Steps:**

- 4.1 (@UIExpert): Add `TaskAppPreview` (or split into `TaskAppPreviewPanel` + `TaskDeviceFrame` + `TaskDeviceCard`): panel title, device frame, single-task card from `vm.tasks[carouselIndex]`, prev/next, “index/total”, dots. Use only TaskDTO fields; placeholders for location, views, saves, offers.  
  - Verification (@QA): Manual: switch to App View, see device with task or “No tasks”.
- 4.2 (@UIExpert): Wire carousel index: state in TasksScreen; reset to 0 when `vm.tasks` or `vm.filters.page` change; clamp to valid range.  
  - Verification (@QA): Change page → first slide is first task of new page.
- 4.3 (@UIExpert): Loading: when `vm.isLoading` and `vm.tasks.length === 0`, show skeleton in App Preview area. Empty: when `!vm.isLoading` and `vm.tasks.length === 0`, show “No tasks” in device.  
  - Verification (@QA): No blank frame.
- 4.4 (@MotionMaster) [optional]: Subtle transition on slide change.  
  - Verification: Optional polish.

---

### Phase 5: Testing

- **Goal:** Smoke and regression coverage for App View and table.
- **Why:** Gate 5 and DoD.
- **How:** Unit: view mode from URL; carousel index reset/clamp. Smoke/E2E: open /tasks → Table; switch to App View → device visible; if tasks exist, at least one slide; prev/next if applicable. Table: filters and pagination still work.
- **Result:** Automated or manual checks for DoD.
- **Gate:** QA Gate — Smoke passed; table regression none.

**Steps:**

- 5.1 (@QA): Smoke test: go to `/tasks`, click App View, see App Preview with device; with data, see task in device; prev/next and index; “No tasks” when empty. Table view still works.  
  - Verification: Checklist or E2E run.
- 5.2 (@QA): Optional unit tests: URL view param; carousel index reset when page or tasks change.  
  - Verification: Unit tests pass.
- 5.3 (@DataSmith): Optional: fixture with 2–3 tasks for stable E2E.  
  - Verification: E2E uses fixture.

---

## 5) Definition of Done (DoD)

**v1 data boundary (Phase 1):** App View uses only existing `TaskDTO` fields. `offers_count`, `views_count`, `saves_count`, `location_label` are not in the list API; the UI shows "—" or "Offers —" for those in v1. Optional future fields documented in [FEATURE__task_offers_count.PLAN.md](FEATURE__task_offers_count.PLAN.md).

- When user opens `/tasks?view=app` (or toggles to App View), the main content shows the **App Preview** panel: title “App Preview — Browse tasks as users see them”, device frame, and either:
  - **With tasks:** One task per slide from current page; prev/next and “current / total” (e.g. 1/10); pagination dots; task card shows at least title, description, status, budget, client (name/avatar), category, date (from TaskDTO); location/views/saves/offers may be “—” or “Offers —” in v1.
  - **Empty:** “No tasks” (or equivalent) inside the device area.
- Loading: While loading and no tasks, a skeleton is shown in the App Preview area (no blank device).
- Table remains default at `/tasks`; filters and pagination work in both views.
- View mode is reflected in URL (`view=table` | `view=app`); refreshing or opening `/tasks?view=app` shows App View.
- Carousel index is always valid (clamped); changing page resets to first task of new page.
- No new backend endpoints; no new mutations from App View in v1.
- No Figma asset URLs in code; use project icons and tokens.

---

## I) Change Report (Diff-Style)

1. **Original issues**
   - No measurable DoD; no URL persistence; no carousel lifecycle; no loading/empty; risk of Figma URLs; no explicit gate order; optional API fields undefined for v1.

2. **Added**
   - Phase 0 (build stabilization).
   - URL persistence for view mode (Phase 3.2, 4).
   - Carousel index reset and clamp (Phase 4.2).
   - Loading and empty states (Phase 4.3).
   - Explicit v1 data boundary: existing TaskDTO only; placeholders for offers/views/location (Phase 1, DoD).
   - Gate table and Risk Register and Pre-Mortem.
   - DoD with testable criteria.

3. **Removed**
   - Nothing; original steps folded into phased steps.

4. **Reordered**
   - Strict order: Phase 0 (build) → 1 (contracts) → 2 (API) → 3 (VM/URL) → 4 (UI) → 5 (QA).

5. **Expanded**
   - Each phase has Goal/Why/How/Result and gate.
   - Steps have owner and verification.
   - Decisions 1–3 with options and recommended choice.

6. **Why**
   - Plan Critic rules: evidence, gates, no fake progress, explicit decisions, and execution-ready order.

7. **Residual risks**
   - Build may stay red if calendar fix is deferred.
   - Product may want full offers list in App View later; this plan defers to follow-up.

---

*End of Plan Critic audit.*
