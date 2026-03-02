# @PlanCritic Audit Report: Next.js to TanStack Migration

## A) Assumptions + Decision Needed (Blocking)

- **Assumptions:**
  - The team has basic familiarity with Fastify and its plugin ecosystem.
  - Supabase Auth is currently using email/password or OAuth, but relies entirely on JWTs (which Fastify can parse).
  - The monorepo setup will use `npm workspaces` based on the package installation scripts.
- **Decision Needed (Blocking): CORS & Cookie Strategy**
  - **Missing Decision:** The plan states "Bearer tokens in local storage" but doesn't explicitly address how we securely pass tokens across domains if the API (e.g., `api.admin.sline.com`) and UI (e.g., `admin.sline.com`) live on different subdomains, or how to prevent XSS vs CSRF trade-offs.
  - **Options:**
    1. Pure `localStorage` + `Authorization: Bearer` (Vulnerable to XSS).
    2. HTTP-Only Cookies set by Fastify on a shared root domain (Vulnerable to CSRF, requires strict CORS).
  - **Recommendation:** Stick to Option 1 for SPA simplicity, but _strictly enforce short-lived JWTs_ and robust Content Security Policies (CSP).
  - **Impact on Plan:** Phase 2 must explicitly document the CSP headers required in Vite to prevent XSS if we use local storage.

## B) Gate Status (Pass/Fail)

1. **Gate 0: Test Infrastructure Gate**
   - **Status:** ❌ FAIL
   - **Reason:** Testing is mentioned (Phase 9), but there is zero scaffolding during Phase 0 to ensure tests actually run. No mention of `vitest` vs `jest`, or how Playwright will authenticate in CI.
   - **Fix:** Add `vitest` and `playwright` to Phase 0 dependencies. Establish a local `supabase start` container or a dedicated staging project for E2E tests before writing API endpoints.

2. **Data/Contracts Gate**
   - **Status:** ❌ FAIL
   - **Reason:** The plan assumes Zod schemas exist (`packages/shared`), but it lacks a step to actually extract and centralize them _before_ building the API.
   - **Fix:** Add a dedicated Phase 0.5: Extract existing `.schema.ts` from Next.js into `packages/shared`, ensure it compiles independently, and publish types.

3. **Security Gate**
   - **Status:** ✅ PASS (Conditionally)
   - **Reason:** The physical boundary (Fastify) and mandatory `requireAdminRole` + `logAuditEvent` hooks are mathematically secure.
   - **Fix:** Must ensure the Fastify preHandler hook executes _before_ any payload parsing to drop requests early.

4. **Backend/API Gate**
   - **Status:** ❌ FAIL
   - **Reason:** Fastify setup lacks explicit mention of a Supabase JWT validation plugin. The plan says "Fastify uses supabase.auth.getUser()", but calling the Supabase API on every single backend request will cause massive latency and rate-limit issues.
   - **Fix:** Fastify must _locally_ verify the JWT signature using the `SUPABASE_JWT_SECRET` rather than making a network call to Supabase Auth on every request.

5. **UI/Integration Gate**
   - **Status:** ✅ PASS
   - **Reason:** TanStack + Vite architecture is sound and well-standardized.

6. **Release/QA Gate**
   - **Status:** ✅ PASS
   - **Reason:** "Parallel Run" strategy (Phase 3) completely mitigates cutover risk.

## C) Critical Gaps (Must-Fix)

1. **Gap:** Fastify JWT Verification Latency
   - **Why it breaks:** Calling `supabase.auth.getUser(token)` over the network on every API request adds 50-100ms latency and scales poorly.
   - **Fix:** Decode and verify the JWT signature locally using jsonwebtoken/jose and the Supabase JWT secret.
   - **Owner:** @SysOp
   - **Acceptance:** Fastify auth middleware executes in < 2ms.

2. **Gap:** Shared Types Publishing
   - **Why it breaks:** If `apps/api` and `apps/admin-ui` try to import relative paths from `packages/shared` without proper TS configuration (or `tsc --build`), the Vite/Fastify build tools will panic on unresolved TypeScript files.
   - **Fix:** Configure `packages/shared` with a proper `package.json` (`main`, `types`, `exports`) and run `tsc -b` or use a bundler like `tsup` for the shared lib.
   - **Owner:** @DevOps

## D) Invariants & Success Criteria (Non-Negotiable)

- **Invariant:** "No Service Role Key exists in the Vite App."
  - **Enforce:** CI script: `grep -r "SUPABASE_SERVICE_ROLE_KEY" apps/admin-ui/ && exit 1 || exit 0`.
- **Invariant:** "Every HTTP mutating method writes an audit log."
  - **Enforce:** Fastify global `onSend` or `preHandler` hook that throws if `req.method !== 'GET'` and `req.auditLogWritten !== true` (or automated inside the route wrapper).

## E) Risk Register (Additions)

| Risk                        | Where   | Probability | Impact   | Blast radius | Early signal                                      | Prevention                                           | Fallback                              |
| --------------------------- | ------- | ----------- | -------- | ------------ | ------------------------------------------------- | ---------------------------------------------------- | ------------------------------------- |
| Monorepo Build Panic        | CI/CD   | High        | High     | Delivery     | TS compilation fails on missing `shared` imports  | Use Turborepo caching + exact `package.json` exports | Copy-paste types temporarily (bad DX) |
| SSR Env Var Leak            | Vite    | Med         | Critical | Security     | `VITE_SUPABASE_SERVICE` appears in bundle payload | Automated bundle scanner in CI                       | N/A                                   |
| JWT Verification Rate Limit | Fastify | High        | High     | App-wide     | Supabase dashboard warns of Auth API limits       | Local JWT verification via secret                    | Scale up Supabase instance            |

## F) Pre-Mortem (How this fails)

- This fails when Devs try to import a Next.js component containing `"use server"` into the shared package, breaking the Vite build instantly.
- This fails when the Fastify API attempts to hit Supabase Auth to validate a user 500 times a second, bringing down the DB.
- This fails when the `fastify-cors` plugin defaults to locking out the Vite local dev server (`localhost:5173`), costing a day of debugging.

## G) Plan Fixes (Concrete Additions)

1. **Goal:** Ensure Test Harness Exists First (Gate 0).
   - **How:** Add `npm i -D vitest playwright` to workspace root. Create `vitest.workspace.ts`.
   - **Stop condition:** `npm run test` passes a dummy test in all 3 workspaces.
2. **Goal:** Local JWT Verification (Backend Gate).
   - **How:** Add Fastify JWT plugin. Feed it the `SUPABASE_JWT_SECRET` from `.env`.
   - **Stop condition:** API rejects invalid tokens locally without internet access.
3. **Goal:** Secure Shared Package Builds (Data/Contracts Gate).
   - **How:** Setup `tsup` or `tsc --build` inside `packages/shared`.
   - **Stop condition:** Fastify and Vite can both cleanly `import { GetUsersSchema } from '@sline/shared'`.
