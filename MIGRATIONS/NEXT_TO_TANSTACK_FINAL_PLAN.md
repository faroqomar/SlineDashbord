# FINAL EXECUTION PLAN: Next.js to TanStack SPA + Fastify API (Gate-Based)

_This is the @PlanCritic corrected, execution-ready roadmap to entirely remove Next.js and isolate privileged admin operations behind an air-gapped Fastify API while building a fast Vite SPA for the SLine Admin Dashboard._

---

## Phase 0: Test Infrastructure & Tooling Gate

> **Goal:** Establish monorepo scaffolding, verify foundational tooling, and establish local testing harness.
> **Why:** Prevents breaking builds halfway through migration and guarantees an automated safety net for API development.
> **How:** Convert root to npm workspaces, layout apps/packages, and configure Vitest/Playwright.

### Steps

- [ ] 0.1 (@DevOps): Create `apps/admin-ui`, `apps/api`, and `packages/shared`. Set up `package.json` workspaces.
- [ ] 0.2 (@DevOps): Move existing Next.js app to `apps/legacy-next`.
- [ ] 0.3 (@QA): Install `vitest`, `playwright`, and `supertest` in the workspace root.
- [ ] 0.4 (@QA): Create a dummy `test.spec.ts` in each workspace to prove the test runner configuration works globally.
- [ ] 0.5 (@DevOps): Install ESLint and TypeScript strictly configured for the monorepo (`"strict": true`).

> **GATE CHECK 0: Test Infrastructure Gate**
>
> - ✅ Must pass: `npm run test` executes successfully across the monorepo.
> - ✅ Must pass: TypeScript compiles without module resolution errors.
> - ✅ Must pass: `npm run lint` executes successfully.
> - ✅ Must pass: `npm run typecheck` executes successfully.

---

## Phase 1: Data Model & Contracts (The Shared Package)

> **Goal:** Isolate all data shapes and API contracts into a universally accessible package.
> **Why:** Prevents "API Contract Drift" where the Vite SPA and Fastify API disagree on JSON shapes.
> **How:** Extract Zod schemas from Next.js into `packages/shared`.

### Steps

- [ ] 1.1 (@Architect): Extract all Zod schemas (e.g., `GetUsersSchema`, `SuspendUserSchema`) from `apps/legacy-next/src/features/*/models/*.schema.ts` to `packages/shared/src/schemas/`.
- [ ] 1.2 (@Architect): Define the strict `ServiceResult<T>` TypeScript interface in `packages/shared/src/result.ts`.
- [ ] 1.3 (@DevOps): Configure `tsup` or `tsc -b` inside `packages/shared` so it compiles an internal NPM library format.
- [ ] 1.4 (@Architect): Export all schemas and types from `packages/shared/src/index.ts`.

> **GATE CHECK 1: Data/Contracts Gate**
>
> - ✅ Must pass: Both `apps/legacy-next` and a dummy script can successfully `import { GetUsersSchema } from '@sline/shared'` without compilation panics.

---

## Phase 2: Security & Backend API Construction

> **Goal:** Replace Next.js Server Actions with explicit HTTP REST endpoints in Fastify, fully secured by RBAC and Audit Logs.
> **Why:** Prevents Service Role DB Keys from leaking to the frontend bundle and provides true physical separation of concerns.
> **How:** Stand up Fastify, implement a local JWT verifier, implement the RBAC/Audit hooks, and port the feature routes.

### Steps

- [ ] 2.1 (@SysOp): Initialize `apps/api` with Fastify, `@fastify/cors`, and `zod`.
- [ ] 2.2 (@SysOp): Configure CORS for specific origins + allow Authorization header + support credentials (if using cookies) explicitly from the Vite dev server (`http://localhost:5173`) and future production domains.
- [ ] 2.3 (@SysOp): **Security Core:** Implement JWT verification using Supabase JWKS public keys with in-memory cache (TTL 6h). No per-request outbound calls. Fail closed on verification errors.
- [ ] 2.4 (@SysOp): **Security Core:** Implement `requireAdminRole(roles)` using either a Role Claim inside JWT + local verification OR a DB check with in-memory caching (LRU 30-60s) for the role, enforcing re-checks on sensitive actions.
- [ ] 2.5 (@SysOp): **Audit Core:** Remove global onSend audit enforcement. Implement a `withAudit(handler)` mutation wrapper that executes the mutation and audit insert in a single DB transaction (or via an atomic Supabase RPC).
- [ ] 2.6 (@SysOp): Create the `createAdminClient()` helper strictly within `apps/api/src/lib/supabase.ts` pulling `SUPABASE_SERVICE_ROLE_KEY` from `.env`.
- [ ] 2.7 (@SysOp): Port the logic from `user_actions.ts` into Fastify routes (e.g., `POST /api/v1/users/:id/ban`).
- [ ] 2.8 (@SysOp): Add `requestId` generation to every request and automatically attach it to the `audit_logs` entry.
- [ ] 2.9 (@QA): Write Supertest integration tests for `/api/v1/users/:id/ban` verifying 401 (No Auth), 403 (Wrong Role), and 200 (Audit Log generated).

> **GATE CHECK 2: Backend/API & Security Gate**
>
> - ✅ Must pass: `SUPABASE_SERVICE_ROLE_KEY` does not exist outside `apps/api`.
> - ✅ Must pass: All mutating API integration tests generate an entry in the `audit_logs` table automatically.
> - ✅ Must pass: Auth verification does not perform outbound network calls, and P95 auth middleware time is < 20ms locally without DB checks (or < 60ms with DB role checks).

---

## Phase 3: UI Architecture & Client Wiring (Vite + TanStack)

> **Goal:** Stand up the client SPA without Next.js overhead, maximizing Developer Experience (HMR).
> **Why:** Next.js slows down internal dashboard building. Vite SPA is fast, and TanStack Router gives full type-safety.
> **How:** Scaffold Vite, integrate Tailwind v4 + Shadcn, map routes using TanStack.

### Steps

- [ ] 3.1 (@UIExpert): Scaffold `apps/admin-ui` with Vite, `@tanstack/react-router`, and `@tanstack/react-query`.
- [ ] 3.2 (@UIExpert): API client MUST NOT read/write access tokens from LocalStorage. Use either A) in-memory token from Supabase session on demand, or B) HttpOnly cookie session issued by API after a one-time token exchange.
- [ ] 3.3 (@UIExpert): Implement the Login flow (`/login`). The API client attaches token from in-memory supabase session (or uses cookie credentials).
- [ ] 3.4 (@UIExpert): Define the `beforeLoad` interceptor in TanStack Router's `dashboard.tsx` to redirect unauthenticated users back to login (as a UX convenience; the API is the ultimate enforcer).
- [ ] 3.5 (@Architect): Define standard TanStack Query key factories (`features/users/queries.ts`).
- [ ] 3.6 (@UIExpert): Port the Dashboard Layout, Users Table, and User Detail pages from Next.js to the new Vite app, replacing Server Components with standard React components wrapper in `useQuery()`.

> **GATE CHECK 3: UI/Integration Gate**
>
> - ✅ Must pass: A dev running `npm run dev` in `apps/admin-ui` sees a sub-second HMR refresh upon saving a file.
> - ✅ Must pass: Logging in triggers real JWT requests to the local Fastify API, returning live DB data over HTTP without CORS errors.

---

## Phase 4: Polish, QA, and Release

> **Goal:** Guarantee zero downtime and safe deployment.
> **Why:** Admin dash is a critical business tool; we cannot break existing ops.
> **How:** Run Vite and Next.js in parallel, verify E2E tests, and cutover DNS.

### Steps

- [ ] 4.1 (@QA): Execute Playwright E2E tests executing the "Ban User" flow via the Vite UI, verifying exactly one audit log is generated.
- [ ] 4.2 (@QA): Verify all Zod validation errors from Fastify correctly bubble up to Shadcn Toast notifications in the UI.
- [ ] 4.3 (@DevOps): Define deployment tasks (Dockerfile for Fastify, static build outputs for Vite).
- [ ] 4.4 (@SysOp): Parallel Run verification—ensure `apps/legacy-next` and `apps/admin-ui` can be used interchangeably against a staging database without data corruption.
- [ ] 4.5 (@DevOps): Cutover. Deploy Fastify to `api.admin.sline.com`. Deploy Vite to `admin.sline.com`. Redirect old `legacy-next` traffic.
- [ ] 4.6 (@Architect): Delete `apps/legacy-next` completely.

> **GATE CHECK 4: Release/QA Gate**
>
> - ✅ Must pass: E2E Playwright tests pass in CI against a clean staging database.
> - ✅ Must pass: `apps/legacy-next` is permanently removed from the repository.

---

## Change Report (PlanCritic Diff vs Original Draft)

1. **Original Issues Fixed:** Missing testing safety-net, vague module dependency rules, and catastrophic JWT latency.
2. **Added Steps:**
   - **Phase 0** now mandates Test Infrastructure configuration (`vitest`, `playwright`).
   - **Phase 0** and **1** now mandate extracting Zod schemas to a strictly compiled `packages/shared` to guarantee the monorepo builds.
   - **Phase 2 (Step 2.3)** requires _Local JWT verification_ rather than outbound Supabase API calls, preventing massive backend latency and auth rate limits.
   - **Phase 2 (Step 2.5)** enforces a global `onSend` audit log check wrapper for mutations.
3. **Reordered Steps:** Data/Contracts extraction was moved _before_ API construction to ensure the API has schemas to rely upon immediately.
4. **Why:** To make the plan physically executable by a developer without them encountering instant TS compiler panics or unworkable latency issues.
5. **Residual Risks:** "Loss of HTTP Only Cookies Security" remains. Using Bearer tokens in LocalStorage inside Vite is susceptible to XSS. _Mitigation required during Vite deployment: Strict Content-Security-Policy (CSP) headers blocking inline scripts._
