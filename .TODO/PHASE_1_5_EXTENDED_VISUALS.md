# Phase 1.5: Extended Visual Twin (Execution Plan)

> **Objective**: Bridge the 40% functional gap between `Dasbord_Design` and the current implementation using **Mock Data**.
> **Goal**: 100% Visual and Functional Parity before backend integration.
> **Primary Strategy**: "Mock First, Logic Later".

## 1. ⚖️ Disputes Center (The Case File)

> **Goal**: Transform the simple ticket list into a complex legal case management interface.
> **Primary Agent**: @UIExpert

### Sub-Phase 1.1: Data Architecture

- [ ] **Step 1 (@DataSmith)**: Extend `Dispute` interface in `src/data/mock/disputes.ts` to include `evidence` (files array) and `timeline` (event array).
- [ ] **Step 2 (@DataSmith)**: Updates the mock generator to create "rich" disputes with mixed status, multiple evidence files, and long conversation histories.
- **Verification (@QA)**: Check `MOCK_DISPUTES[0].evidence` exists and has data.

### Sub-Phase 1.2: Evidence & Timeline UI

- [ ] **Step 3 (@UIExpert)**: Create `components/disputes/CaseFileLayout.tsx`. A 3-column layout (Summary | Evidence/Messages | Timeline).
- [ ] **Step 4 (@UIExpert)**: Implement `EvidenceGallery.tsx` using Shadcn `Dialog` for file previews.
- [ ] **Step 5 (@MotionMaster)**: Add smooth transition when switching between "Message View" and "Evidence View".
- **Verification (@QA)**: Click an image in evidence gallery -> Should open modal.

### Sub-Phase 1.3: Resolution Workflow

- [ ] **Step 6 (@UIExpert)**: Create `ResolutionModal.tsx` with 3 actions: "Refund", "Release", "Split".
- [ ] **Step 7 (@DataSmith)**: Add `resolutionOptions` to mock data to test "disabled" states (e.g., can't split if status is 'Resolved').
- **Verification (@QA)**: Drag "Split" slider -> Amounts update dynamically.

## 2. 📊 Analytics (Business Intelligence)

> **Goal**: PROPER charts. No more empty placeholders.
> **Primary Agent**: @UIExpert

### Sub-Phase 2.1: Visualization Engine

- [ ] **Step 1 (@Modernizer)**: Install `recharts` and ensure compatibility with React 19 / Next.js 15.
- [ ] **Step 2 (@DataSmith)**: Create `src/data/mock/analytics.ts` with `REVENUE_SERIES`, `USER_GROWTH_SERIES`, `CATEGORY_DISTRIBUTION`.

### Sub-Phase 2.2: The Dashboard

- [ ] **Step 3 (@UIExpert)**: Create `RevenueAreaChart.tsx` (Gradient fill, tooltip).
- [ ] **Step 4 (@UIExpert)**: Create `UserBarChart.tsx` (Stacked bars for Active vs Banned).
- [ ] **Step 5 (@MotionMaster)**: Animate the charts on load (Draw effect).
- **Verification (@QA)**: Verify tooltips appear on hover.

## 3. 👥 Admin Management (Security UI)

> **Goal**: Interface for managing the "Watchers".
> **Primary Agent**: @UIExpert

### Sub-Phase 3.1: Admin Directory

- [ ] **Step 1 (@DataSmith)**: Create `src/data/mock/admin_users.ts` with `AdminRole` permissions matrix.
- [ ] **Step 2 (@UIExpert)**: Build `AdminTable.tsx` with "Last Active" and "MFA Status" badges.

### Sub-Phase 3.2: Permissions

- [ ] **Step 3 (@UIExpert)**: Build `InviteAdminDialog.tsx` with Role Selector.
- [ ] **Step 4 (@UIExpert)**: Build `PermissionMatrix.tsx` (Read-only view of what Super Admin vs Support can do).
- **Verification (@QA)**: "Super Admin" role should show all checks as true.

## 4. 🛡️ Audit Logs (The Trace)

> **Goal**: Make logs readable for humans, not just machines.
> **Primary Agent**: @UIExpert

### Sub-Phase 4.1: Diff Viewer

- [ ] **Step 1 (@DataSmith)**: Add `changes: { field, old, new }[]` to `MOCK_LOGS`.
- [ ] **Step 2 (@UIExpert)**: Create `LogDiffViewer.tsx`. Renders a "Before -> After" comparison card.
- [ ] **Step 3 (@UIExpert)**: Update `LogsPage` to use a `Table` with expandable rows.
- **Verification (@QA)**: Expand a "Profile Update" log -> Show "Old Name" vs "New Name".

## 5. ⚙️ Settings (Configuration)

> **Goal**: Centralized control panel.
> **Primary Agent**: @UIExpert

### Sub-Phase 5.1: Tabbed Interface

- [ ] **Step 1 (@UIExpert)**: Refactor `settings/page.tsx` to use Shadcn `Tabs`.
- [ ] **Step 2 (@UIExpert)**: Create `SecurityTab.tsx` (MFA toggle, Session timeout).
- [ ] **Step 3 (@UIExpert)**: Create `IntegrationsTab.tsx` (API Keys input fields).
- **Verification (@QA)**: Switching tabs preserves state within the session.
