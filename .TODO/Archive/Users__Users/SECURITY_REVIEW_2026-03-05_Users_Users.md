# Security Review — Users / Users (2026-03-05)

## Scope
- Security posture for Users/Profile flows after regression fixes.

## Findings
- `Verified in app code`: users endpoints remain protected by RBAC middleware (`requireAdminRole`) in `apps/api/src/routes/users.ts`.
- `Verified in app code`: moderation operations remain backend-authoritative and unchanged in route surface.
- `Verified in app code`: investigation payload still applies profile masking (`maskProfile`) for sensitive fields.
- `Verified in dashboard code`: admin-ui continues to consume API only; no service-role Supabase key usage was introduced client-side.
- `Verified in app code`: team/user route tests covering role-based access and validation pass.

## Blockers / Regressions
- None.

## Decision
- **APPROVED ✅**

## Evidence Paths
- `apps/api/src/routes/users.ts`
- `apps/api/src/middleware/rbac.ts`
- `apps/api/src/routes/users.test.ts`
- `apps/api/src/routes/team.test.ts`
