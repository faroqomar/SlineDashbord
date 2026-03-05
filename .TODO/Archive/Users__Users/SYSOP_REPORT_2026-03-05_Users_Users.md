# SysOp Report — Users / Users (2026-03-05)

## Scope
- Users/Profile API behavior for list, detail, investigation, moderation, and wallet lookup integrations.

## Findings
- `Verified in app code`: endpoint surface is unchanged (no new endpoints):
  - `GET /api/v1/users`
  - `GET /api/v1/users/:userId`
  - `GET /api/v1/users/:userId/investigation`
  - `POST /api/v1/users/:userId/suspend|ban|unban|force-logout`
- `Verified in app code`: investigation regression fixed in `apps/api/src/routes/users.ts` by avoiding hard-fail when profile lookup drifts/fails; the route now returns a safe minimal profile and preserves available activity arrays.
- `Verified in app code`: non-critical data sources in investigation (tasks/bookings/disputes/ledger) are handled as degradable sources with fallback-to-empty behavior.
- `Verified in dashboard code`: frontend profile blocks consume existing real endpoints via `users_api.ts` and do not introduce mock-only fake backend behavior.
- `Verified in app code`: users route tests pass for auth/validation/moderation/investigation behavior.

## Blockers / Regressions
- None.

## Decision
- **APPROVED ✅**

## Evidence Paths
- `apps/api/src/routes/users.ts`
- `apps/admin-ui/src/features/users/services/users_api.ts`
- `apps/api/src/routes/users.test.ts`
