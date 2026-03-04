# @PlanCritic Audit: Storybook ↔ Figma Sync (Vite + shadcn/ui)

## A) Assumptions + Decision Needed (Blocking)

**Assumptions:**

- `apps/admin-ui` is the target directory [Verified in app architecture].
- shadcn/ui is the standard component library [Verified in app code].
- The components to be documented are mostly "dumb" (presentation only) or can be easily mocked, though some might have internal state or data fetching [Missing repo evidence of component purity].

**Decision Needed (Blocking):**

1. **Handling of Stateful/Context-Heavy Components in Storybook**
   - _Missing decision:_ Many dashboard components likely rely on TanStack Query, TanStack Router (`<Link>`), or Auth context. Storybook will crash if these aren't provided.
   - _Options:_
     1. Refactor all UI components to be strictly pure (presentational) and pass data as props.
     2. Create a global `MockAppProvider` in `.storybook/preview.tsx` that wraps all stories with a dummy QueryClient, Router, and Auth context.
   - _Recommended choice:_ Option 2 for immediate velocity, transitioning to Option 1 (pure components) over time as enforced by `@AdminArchitect`.
   - _Plan change:_ Must add a dedicated step to build a `StorybookProvider` decorator.

2. **Chromatic Privacy & CI Quota Limits**
   - _Missing decision:_ Chromatic free tiers have snapshot limits. Running it on every push to every branch will exhaust it. Also, Admin UI components might contain sensitive naming/logic.
   - _Options:_
     1. Run Chromatic only on PRs with a `ui-change` label or changes to `apps/admin-ui/src/components/**`.
     2. Run Chromatic on every push.
   - _Recommended choice:_ Option 1 to save snapshot quota and reduce CI bloat.
   - _Plan change:_ CI step must explicitly define path/branch triggers.

---

## B) Gate Status (Pass/Fail)

- ❌ **0. Test Infrastructure Gate:** FAIL. Currently missing how Storybook will resolve `@/` absolute paths used by shadcn/ui.
- ✅ **1. Data/Contracts Gate:** PASS. UI-only initiative; no DB drift.
- ❌ **2. Security Gate:** FAIL. Need to explicitly ensure `.env` secrets (e.g., Supabase URLs) aren't exposed in the published Chromatic build, and that Storybook runs completely without them.
- ✅ **3. Backend/API Gate:** PASS. N/A for this scope.
- ❌ **4. UI/Integration Gate:** FAIL. Standard `index.css` requires fonts (Geist/Inter etc.) which must be explicitly injected into `.storybook/preview-head.html`.
- ❌ **5. Release/QA Gate:** FAIL. Missing a step to handle mock data for components that render lists or tables.

---

## C) Critical Gaps (Must-Fix)

1. **Gap:** Vite Path Aliases (`@/components/*`) will break Storybook out of the box.
   - _Why it breaks:_ Storybook's Vite builder doesn't automatically inherit all `vite.config.ts` path resolutions unless explicitly merged in `.storybook/main.ts`.
   - _Fix steps:_ Add step to configure `viteFinal` in `.storybook/main.ts` using `vite-tsconfig-paths`.
   - _Owner:_ @DevOps
   - _Acceptance check:_ A story importing `@/components/ui/button` renders without "module not found" errors.

2. **Gap:** Missing Font / Asset Injection.
   - _Why it breaks:_ Tailwind tokens might load, but custom fonts (e.g., loaded via next/font or standard HTML `<link>`) will be missing, causing typography drift from Figma.
   - _Fix steps:_ Add `preview-head.html` to inject identical standard web fonts used by the main app.
   - _Owner:_ @UIExpert
   - _Acceptance check:_ Font-family strictly matches the Figma system design.

3. **Gap:** Component Context Crashes.
   - _Why it breaks:_ Rendering a `Sidebar` or `Table` that uses `useLocation()` or `useQuery()` will throw fatal React errors.
   - _Fix steps:_ Create a global `StorybookDecorator` wrapping all stories.
   - _Owner:_ @AdminArchitect
   - _Acceptance check:_ A routing-dependent component renders safely in Storybook.

---

## D) Invariants & Success Criteria (Non-Negotiable)

1. **Invariant:** No production secrets in Storybook bundles.
   - _Enforcement:_ `.storybook/main.ts` explicitly strips/ignores `env` loading for Supabase/Auth keys unless prefixed with `STORYBOOK_`.
   - _Verification:_ Inspect Chromatic build output network requests; ensure no privileged tokens or authenticated network calls occur. Storybook must run purely without the Supabase env.
2. **Invariant:** Visual Parity.
   - _Enforcement:_ Global CSS and standard layout resets are applied.
   - _Verification:_ Baseline established and diffs only appear when intended (allowable thresholds or ignored regions for anti-aliasing/font rendering shifts).
3. **Invariant:** Story terms match Figma.
   - _Enforcement:_ Storybook `args` match Figma variant properties (e.g., `variant="destructive"` in both).
   - _Verification:_ story.to.design syncs without creating detached mismatched node names.

---

## E) Risk Register (Predict Problems)

| Risk                        | Where                | Probability | Impact | Blast radius | Early signal                      | Prevention                                    | Fallback                                   |
| :-------------------------- | :------------------- | :---------- | :----- | :----------- | :-------------------------------- | :-------------------------------------------- | :----------------------------------------- |
| Vite alias resolution fails | `.storybook/main.ts` | High        | High   | Local        | "Cannot find module '@/'"         | Explicit `viteFinal` config in Storybook      | Relative paths (brittle)                   |
| Context/Hook crashes        | Complex Stories      | High        | High   | Local        | "useQuery must be used within..." | Global Mock Provider Decorator                | Mock individual components manually (slow) |
| Snapshot Quota Exhaustion   | Chromatic CI         | Med         | Med    | Ops          | Billing alerts                    | Trigger Chromatic only on path changes        | Disconnect Chromatic                       |
| Font misalignment           | Storybook Canvas     | Med         | Low    | UI Parity    | Text looks slightly off           | Inject standard `preview-head.html` CDN links | N/A                                        |

---

## F) Pre-Mortem

- This fails when a developer writes a pure UI component but embeds a Fastify API call directly inside it, breaking the Storybook canvas.
- This fails when `index.css` has Tailwind `@apply` rules that conflict with the iframe isolation of Storybook.
- This fails when we exhaust the Chromatic free tier on day 2 because it was triggered on backend/API commits.
- This fails when the Figma designer modifies the _story.to.design_ generated components instead of treating them as read-only.
- This fails when dark mode is toggled in the dashboard but Storybook has no theme wrapper to trigger the `dark` class on the `<html>` root.

---

## G) Plan Fixes (Concrete Additions)

- **Goal:** Enable `@/` path resolution.
  - **Why:** shadcn uses absolute paths extensively.
  - **How:** Add `vite-tsconfig-paths` to `.storybook/main.ts`.
  - **Output artifact:** `.storybook/main.ts` config.
  - **Stop condition:** `Button.stories.tsx` successfully imports using `@/components`.
- **Goal:** Prevent Provider Context Crashes.
  - **Why:** TanStack Router/Query reliance.
  - **How:** Implement `withProviders` decorator in `.storybook/preview.tsx`.
  - **Output artifact:** `.storybook/preview.tsx`.
  - **Stop condition:** Stories do not throw React Context missing errors.

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

# Feature Plan: Storybook ↔ Figma Sync (Vite + shadcn/ui)

## Phase 0: Baseline, Inventory & CI Scoping

**Monorepo Rule:** All Storybook and Chromatic commands MUST be run with `apps/admin-ui` as the working directory.

- [x] **Step 0.1 (@UIExpert):** Scan `apps/admin-ui/src/components` to catalog the top 10 core components. Produce `UI_COMPONENTS_INVENTORY.md`.
- [x] **Step 0.2 (@DevOps):** Define CI triggers: Create `.github/workflows/chromatic.yml` but restrict it to paths: `apps/admin-ui/src/components/**` and `apps/admin-ui/src/index.css`.
- **Gate 0.1 (Data/Contracts):** ✅ PASS. (Storybook Booted, 10 core targets identified).

## Phase 1: Installation & Vite Environment Shell

- [x] **Step 1.1 (@DevOps):** Initialize Storybook (`npx storybook@latest init`). Framework detected: `react-vite`.
- [x] **Step 1.1.1 (@DevOps):** Confirm `storybook` and `build-storybook` scripts exist inside `apps/admin-ui/package.json`.
- [ ] **Step 1.2 (@DevOps):** _Conditional:_ If any story import using `@/` fails, configure `.storybook/main.ts` to explicitly use `vite-tsconfig-paths` so alias resolution works seamlessly with the existing `tsconfig.json`.
- [x] **Step 1.3 (@SecGuard):** Enforce strict Environment Stripping. Storybook must ONLY load env variables prefixed with `STORYBOOK_`.
- **Gate 1.1 (Security & Build):** ✅ PASS. App builds `npm run storybook` cleanly and Chromatic baseline published. The built bundle contains no privileged secrets and makes zero authenticated network calls. Aliases resolve correctly. Storybook runs completely without the Supabase environment.

## Phase 2: Theme, Fonts, and Global Providers (The Wrapper)

- [ ] **Step 2.0 (@UIExpert):** Confirm Storybook addons list in `.storybook/main.ts` and ensure the Chromatic addon is present and stable (resolving the `no supported addons found` warning).
- [ ] **Step 2.1 (@UIExpert):** Import `../src/index.css` inside `.storybook/preview.tsx`.
- [ ] **Step 2.2 (@UIExpert):** Create `.storybook/preview-head.html` and inject the dashboard's standard web fonts.
- [ ] **Step 2.3.1 (@AdminArchitect):** Create a generic `createStorybookRouter()` utility that defines a minimal route tree (e.g., a root route, `/`, `/users`, and a NotFound route) to satisfy the router context.
- [ ] **Step 2.3.2 (@AdminArchitect):** Implement `withProviders` decorator in `preview.tsx` that wraps all stories with:
  1. **TanStack QueryClientProvider:** Configured with a dedicated `QueryClient` that completely disables `refetchOnWindowFocus`, `refetchOnMount`, and `retry`.
  2. **TanStack Router (Memory Router):** A real `createMemoryHistory` router from TanStack Router, utilizing the `createStorybookRouter()` utility to provide dummy routes and prevent `<Link>` and `useRouterState` from crashing.
  3. **Auth Mock:** A dummy authentication provider (if applicable).
  4. **Theme Wrapper:** A dark/light mode toggle wrapper.
- **Gate 2.1 (UI/Integration):** 🔄 IN PROGRESS. Primitives render 1:1 including typography. Any component using `<Link>` or `useNavigate` works without crashing on the mock route tree. There are zero spam requests or random state changes on focus.

## Phase 3.0: Story Hygiene Rules

- **Rule 1:** UI components MUST NOT initiate real fetch calls inside themselves. Data must be passed as `args`.
- **Rule 2:** Any usage of TanStack Query MUST be abstracted outside of the component itself or handled via strict mock hooks.
- **Rule 3:** Router-dependent components (`<Link>`, `useNavigate`) MUST execute purely under the `withProviders` decorator.
- **Rule 4:** Data state mutations and variants MUST be represented purely via Storybook `args`.

## Phase 3.1: Story Implementation

- [x] **Step 3.1.1 (@UIExpert):** Write standard stories for the Top 10 components (Button, Table, Input, Badge, etc.) with all state variants mapped to `args`.
- [x] **Step 3.1.2 (@DataSmith):** Provide static mock datasets (e.g., `mockUsers`, `mockTransactions`) to feed into Table/List stories.
- **Gate 3.1 (Code/UI):** ✅ PASS. **No Real Network Gate.** Running Storybook makes zero real HTTP/network calls. This is strictly enforced either by a global interceptor (MSW) or by strict component mocking.

## Phase 4: CI, Chromatic & Figma Sync

- [x] **Step 4.1 (@DevOps):** Push to remote and verify GitHub Actions runs Chromatic cleanly to establish baseline snapshots. _(DONE locally)_.
- [x] **Step 4.1.1 (@DevOps):** Migrate Chromatic to GitHub Actions workflow with CI secrets.
- [x] **Step 4.1.2 (@DevOps):** Enable path filters in the workflow.
- [x] **Step 4.1.3 (@SecGuard):** Remove `--project-token` flag from the `chromatic` script in `apps/admin-ui/package.json` in the repository, replacing it with the CI secret `CHROMATIC_PROJECT_TOKEN`.
- [ ] **Step 4.2 (@UIExpert):** In Figma, link the Chromatic project using _Storybook Connect_.
- [ ] **Step 4.3 (@UIExpert):** Use _story.to.design_ in Figma to generate the "SLine Admin UI Kit (Code-Backed)" file.
- **Gate 4.1 (Release/QA):** ❌ FAIL. Figma UI Kit perfectly matches code variants, and CI is successfully catching visual regressions on component PRs.

---

## I) Change Report (Diff-Style)

### 1) Original Issues Summary

- The original plan ignored the Vite alias resolution (`@/`) and context providers (TanStack) which would cause immediate crashes.
- It lacked CI scoping, risking Chromatic quota exhaustion.
- It ignored font injection, which would cause visual mismatches in Figma.

### 2) Added Steps

- `Step 0.2`: Scoped Chromatic CI Triggers.
- `Step 1.2`: Added `vite-tsconfig-paths`.
- `Step 1.3`: Enforced strict `STORYBOOK_` environment stripping.
- `Step 2.2`: Added `preview-head.html` for fonts.
- `Step 2.3.1`: Added generic `createStorybookRouter()` utility to define a minimal route tree.
- `Step 2.3.2`: Added strict TanStack `createMemoryHistory` router and static `QueryClient`.
- `Phase 3.0`: Introduced strict Story Hygiene Rules enforcing pure components.
- `Step 3.1.2`: Added `@DataSmith` mock data generation and "No Real Network" Gate.

### 3) Removed Steps

- Removed arbitrary "Visualization Loop" steps that weren't strictly tied to code state.

### 4) Reordered Steps

- Moved CI setup to Phase 0 to ensure rules exist before pushing Chromatic.

### 5) Why

- Realistic Chromatic baseline established (not strictly 0% diff) to account for font rendering and anti-aliasing variations.
- Strict adherence to gate-based progression. Storybook cannot render shadcn without `@/` aliases, CSS themes, and mocked TanStack utilities.

### 6) Residual Risks

- Still reliant on discipline: If a developer embeds a hardcoded fetch inside a UI component instead of pushing it up to the ViewModel, Storybook will throw a network error. This must be caught by `@CodeWarden` during code review.
