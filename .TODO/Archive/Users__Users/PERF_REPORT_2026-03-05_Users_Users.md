# Perf Report — Users / Users (2026-03-05)

## Scope
- Performance risks for Users/Profile after regression fixes.

## Findings
- `Verified in app code`: investigation endpoint degrades non-critical sources to empty arrays instead of retry/error loops, reducing repeated failure churn in UI.
- `Verified in dashboard code`: profile UI splits heavy sections into modular components, limiting rerender blast radius.
- `Verified in dashboard code`: row action menu uses one portal and recomputes position only on open/viewport events.
- `Missing repo evidence`: production index audit for all investigation filters remains outside this blockers/regressions cycle.

## Blockers / Regressions
- None.

## Decision
- **APPROVED ✅**

## Evidence Paths
- `apps/api/src/routes/users.ts`
- `apps/admin-ui/src/features/users/views/components/UserProfileWorkOverview.tsx`
- `apps/admin-ui/src/components/users/UserActionsMenu.tsx`
