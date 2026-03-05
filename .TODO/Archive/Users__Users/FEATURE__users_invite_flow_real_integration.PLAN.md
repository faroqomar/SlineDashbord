# Feature Plan: Users Invite Flow Real Integration

## 0) Objective
- Replace Users-page invite mock action with a real invitation flow using existing backend capabilities.
- Keep the Users tab visual design intact.
- Enforce role restrictions and preserve audit logging.

## 1) Current State (Evidence-labeled)
- Verified in dashboard code: Users invite button currently triggers mock toast only.
  - `apps/admin-ui/src/features/users/views/UsersScreen.tsx`
  - `apps/admin-ui/src/features/users/models/users-ui.mock.ts`
- Verified in dashboard code: Existing frontend invite client exists in Team feature (`inviteMember`).
  - `apps/admin-ui/src/features/team/services/team_api.ts`
  - `apps/admin-ui/src/features/team/views/components/InviteAdminDialog.tsx`
- Verified in API code: Existing endpoint `POST /api/v1/team/invite` exists, validates input, and writes audit log.
  - `apps/api/src/routes/team.ts`
  - `apps/api/src/app.ts` (route registration)
- Verified in shared contracts: Invite schema already exists.
  - `packages/shared/src/schemas/team.ts`
- Missing repo evidence: automated API tests for team invite route.

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Preconditions / UX Decision
- [ ] Step 0.1 (@AdminArchitect): Confirm product behavior for Users invite:
  - invite marketplace user
  - invite admin/staff user
  - or role-based choice in the dialog
- [ ] Step 0.2 (@SecGuard): Confirm allowed roles for invite action in Users tab (current backend restricts to `super_admin`).
- Verification (@QA): Approved UX matrix for allowed/forbidden states.

### Phase 1: Frontend Contracts / ViewModel
- [ ] Step 1.1 (@AdminArchitect): Add Users invite VM (`use_users_invite.vm.ts`) with strict state/actions (`open`, `fields`, `isSubmitting`, `submit`, `error`).
- [ ] Step 1.2 (@AdminArchitect): Reuse existing `inviteMember` service; no direct API calls in view.
- [ ] Step 1.3 (@AdminArchitect): Add role-aware disabled/hidden behavior for non-authorized users.
- Verification (@CodeWarden): MVVM boundaries preserved; no business logic in view.

### Phase 2: UI
- [ ] Step 2.1 (@UIExpert): Replace mock invite click handler with shadcn `Dialog` form (full name, email, role).
- [ ] Step 2.2 (@UIExpert): Match Figma CTA while wiring to real submit path.
- [ ] Step 2.3 (@UIExpert): Add loading, validation, success/error toasts, and disabled submit states.
- Verification (@QA): Manual invite happy-path and forbidden-path checks.

### Phase 3: Backend/API Hardening
- [ ] Step 3.1 (@SysOp): Ensure team invite handler consistently returns `ActionResult` shape and safe failure messages.
- [ ] Step 3.2 (@SysOp): Confirm audit payload fields are complete (`actor_user_id`, `action`, `related_entity_*`, `meta`).
- [ ] Step 3.3 (@SysOp): If needed, add idempotency guard for repeat invites.
- Verification (@SecGuard): RBAC + audit behavior approved.

### Phase 4: Testing
- [ ] Step 4.1 (@QA): Add API route tests for `/team/invite` (401/403/400/200).
- [ ] Step 4.2 (@QA): Add UI test for invite dialog flow (success + validation + forbidden).
- [ ] Step 4.3 (@DataSmith): Provide test fixture emails and role permutations.

## 3) Gate Checks (Must-Pass)
- Build Gate: admin-ui/api/shared build + typecheck pass
- Contracts Gate: shared team invite schema used end-to-end
- Security Gate: only authorized roles can invite; no client-side bypass assumptions
- API Gate: invite writes audit logs and returns consistent result shape
- UI Gate: Users invite CTA opens real form and handles loading/errors
- QA Gate: API and UI invite tests added

## 4) Risks & Mitigations
- Risk: Role mismatch between Users page and Team endpoint.
  - Mitigation: centralize role check and reflect forbidden state in UI.
- Risk: Duplicate invites for same email.
  - Mitigation: idempotency/meta check and clear conflict errors.
- Risk: UX confusion between inviting admins vs marketplace users.
  - Mitigation: explicit copy and role labels in dialog.

## 5) Definition of Done (DoD)
- Users page invite action submits real `POST /team/invite` requests.
- Unauthorized roles see blocked state and cannot trigger invite.
- Successful invites show feedback and refresh relevant data.
- Team invite API has explicit automated test coverage.
