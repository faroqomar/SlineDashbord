# Migration Report: Next.js to TanStack-based Architecture

## 1. Executive Summary

### Why Migrate vs Not Migrate

The current architecture uses Next.js 15 (App Router). While Next.js offers robust Server-Side Rendering (SSR) and Server Actions, it introduces significant friction for building highly interactive Admin Dashboards. Next.js inherently blurs the line between server and client borders, resulting in slower development loops (HMR), complex state management, and larger server overhead.
Migrating to a TanStack-powered architecture shifts the UI rendering to the client where it belongs for internal dashboard tools, decoupling it from the backend API.

### Expected Wins

- **Faster DX (HMR/Build):** Vite processes client-side bundles orders of magnitude faster than Next.js/Turbopack.
- **Simpler Architecture:** A clear boundary between the React client (SPA) and backend API eliminates Next.js component boundary confusion (`"use client"` vs `"use server"`).
- **Rich Client-Side Caching:** TanStack Query provides a robust, predictable, and fully observable cache layer compared to Next.js's opaque caching.
- **Maintainability:** Pure React components without server-side constraints.

### What Might Get Worse

- **Initial Load Time:** Moving to an SPA means we lose Server-Side Rendering (SSR). The browser must download the JavaScript bundle before rendering the first frame. For an admin dashboard, this is an acceptable tradeoff.
- **SEO:** Zero SEO out-of-the-box. As a private admin dashboard, SEO is irrelevant.
- **Two Sub-Systems:** Instead of a single monolith, we now have a separated frontend and API tier to maintain.

### Final Recommendation: Strategy C (Hybrid Next.js API + Vite SPA)

I strongly recommend **Hybrid Next.js API + Vite SPA / TanStack Router**.
**Rationale:**

1. The currently deployed Next.js Server Actions are tightly integrated with `requireAdminRole`, `logAuditEvent`, and the `Supabase Service Role`. We **must not** lose these security guarantees or rewrite the entire backend logic from scratch right now.
2. By keeping Next.js exclusively as a BFF (Backend-For-Frontend) / API Server, we can simply expose the existing Server Actions as standard API routes without discarding the proven RBAC and audit logging code.
3. The UI can be completely migrated to a Vite + TanStack Router SPA, achieving the desired DX and client-side performance.

---

## 2. Current State Audit (Next.js)

### Architecture Map

- **Routing Layer:** Next.js App Router (`src/app/dashboard/*`).
- **Auth Layer:** Supabase SSR Auth with Middleware (`src/lib/supabase/middleware.ts`).
- **Security Check Layer:** Enforced at the Server Action level via `security_guards.ts` (`requireAdminRole`, `logAuditEvent`, `enforceRateLimit`).
- **Data Access:** Server Actions returning a predictable `ServiceResult<T>` structure (`ok(data)` / `fail(error)`).
- **State/UI:** React components consuming Server Actions directly.

### Privileged Operations (Must Stay Server-Side)

- All calls to `createAdminClient()` using `process.env.SUPABASE_SERVICE_ROLE_KEY`.
- Banning, suspending, or unbanning users (`src/features/users/services/user_actions.ts`).
- Role assignment and user verification.
- Writing to the `audit_logs` table (guarded by Service Role).
- Finance/Dispute mutations overriding RLS.

### Security Model Check

- **Enforcement Points:** Strong. Every mutation uses `requireAdminRole`.
- **Gaps:** None identified currently, as long as `createAdminClient()` stays out of the browser.
- **Risks:** The migration MUST NOT accidentally leak the `SUPABASE_SERVICE_ROLE_KEY` to the client.

### Performance Hot Spots

- Dev server bottlenecks due to Next.js App Router compilation overhead on complex dashboard views.
- Large server-rendered components re-rendering unnecessarily on state changes.

### Tech Debt Blocking Migration

- Tightly coupled UI components and Server Actions. We need to expose these actions via an explicit API contract (e.g., REST endpoints, tRPC, or a dedicated Next.js API route handler).

---

## 3. Target Architecture (TanStack)

### High-level Diagram

```text
[ Browser (Vite + TanStack) ]
       |     |
       |     | (JSON over HTTP)
       v     v
[ Next.js API Server (BFF) ] --> [ Supabase Auth ]
       |
       | (Postgres / Supabase Service Role)
       v
[ Supabase Database ]
```

### Routing Strategy (TanStack Router)

- **File Layout:** File-based routing via TanStack Router (`src/routes/*`).
- **Layouts:** Use nested routes. Root layout provides the ThemeProvider, AuthProvider, and QueryClientProvider. Dashboard layout provides Sidebar and Header.

### Data Fetching Strategy (TanStack Query)

- **Query Keys:** Strict array-based query key domains (`['users', 'list', page]`, `['users', 'detail', id]`).
- **Cache & Invalidation:** Mutations will trigger `queryClient.invalidateQueries({ queryKey: [...] })` to re-fetch stale data.
- **ServiceResult Mapping:** API endpoints will return `ServiceResult<T>`. The TanStack query function will unwrap this: if `fail`, it throws an error triggering the React Error Boundary.

### Auth & Security Strategy

- **Session Validation:** The Vite app uses standard `@supabase/supabase-js` to handle the session. TanStack Router implements a `beforeLoad` guard to check for an active user session before entering `/dashboard`.
- **RBAC Enforcement:** Remains on the Next.js API server. The API routes will extract the user's JWT from the request header, validate it, and call `requireAdminRole()`.
- **Service Role Leakage Prevention:** The Vite SPA is compiled completely separately from the Next.js API. The Next.js API `.env` containing service role keys cannot physically be bundled into Vite.
- **Audit Logs:** The Next.js API tier will continue executing `logAuditEvent()` for every privileged mutation before returning the HTTP response.

---

## 4. Migration Strategy (Low Downtime)

### Recommendation: Incremental Migration Strategy

Since we are keeping Next.js as the backend, we can migrate the frontend incrementally. We will stand up the Vite SPA alongside the Next.js app in a monorepo structure.

### Incremental Phases:

**Phase 0: Infrastructure & Scaffolding (@DevOps)**

- Setup a monorepo (e.g., using Turborepo or npm workspaces).
- Move existing Next.js code to `apps/api`.
- Create new Vite + TanStack React app in `apps/admin-ui`.
- Configure shared packages (`packages/ui`, `packages/schema`, `packages/types`).

**Phase 1: API Contract Layer (@Architect)**

- In `apps/api` (Next.js), create Route Handlers (`app/api/v1/*`) that wrap the existing Server Actions.
- Ensure all API routes validate the Auth header token and return standard JSON `ServiceResult` payloads.
- _Exit Criteria:_ We can hit API routes via Postman and get the exact same results as the old Server Actions.

**Phase 2: Core Frontend Setup (@UIExpert)**

- Setup TanStack Router, TanStack Query, and Supabase client in `apps/admin-ui`.
- Implement Login page and Auth Guard (`beforeLoad` in TanStack Router).
- _Exit Criteria:_ User can log in and view a blank secured dashboard layout.

**Phase 3: Domain Migration (Iterative) (@UIExpert & @SysOp)**

- Migrate domains one by one (e.g., Users, Finance, Disputes).
- Rewrite data fetching inside components to use `useQuery` and `useMutation` pointing to the new API routes.
- _Exit Criteria:_ All dashboard routes are operational in the Vite SPA.

**Phase 4: Cutover (@DevOps)**

- Route `admin.sline.com` traffic to the Vite SPA static build.
- Route `api.admin.sline.com` to the Next.js backend.
- _Exit Criteria:_ Production traffic is successfully served by the new architecture.

---

## 5. File-by-File Action Plan

| Current Path (Next.js)                        | New Path                                             | Action   | Notes                                                                                                  |
| :-------------------------------------------- | :--------------------------------------------------- | :------- | :----------------------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`                          | `apps/admin-ui/src/routes/__root.tsx`                | Rewrite  | Root layout for TanStack Router.                                                                       |
| `src/app/dashboard/layout.tsx`                | `apps/admin-ui/src/routes/dashboard.tsx`             | Rewrite  | Dashboard layout route.                                                                                |
| `src/app/dashboard/users/page.tsx`            | `apps/admin-ui/src/routes/dashboard/users/index.tsx` | Rewrite  | Replace server-rendered table with client-side query.                                                  |
| `src/features/users/services/user_actions.ts` | `apps/api/src/app/api/users/route.ts`                | Refactor | Wrap server action logic inside standard GET/POST Next.js route handlers.                              |
| `src/lib/supabase/middleware.ts`              | N/A                                                  | Refactor | Backend API needs CORS and Bearer token auth validation instead of Next.js middleware cookie handling. |
| `src/components/ui/*`                         | `packages/ui/src/*`                                  | Move     | Move shadcn/ui components to a shared package for the Vite app to consume.                             |

**New Folder Structure (Domain-First Frontend):**

```text
apps/admin-ui/src/
 ├─ routes/               # TanStack Router definitions
 ├─ features/
 │   ├─ users/
 │   │   ├─ components/
 │   │   ├─ queries.ts    # TanStack Query logic
 │   │   └─ mutations.ts
 ├─ lib/                  # API client / Supabase client
```

---

## 6. Risk Register (Hard Mode)

1. **Risk:** API Contract Drift
   - _Impact:_ High. UI breaks because data shapes changed during refactor.
   - _Likelihood:_ Medium.
   - _Mitigation:_ Extract all Zod schemas to a shared `packages/schema`. Create e2e tests for contracts.
2. **Risk:** Leaked Service Role Key
   - _Impact:_ Critical. Total DB compromise.
   - _Likelihood:_ Low.
   - _Mitigation:_ Strict isolation of `apps/api`. No Supabase env vars containing `SERVICE` in `apps/admin-ui`.
3. **Risk:** Broken Caching / Stale Data
   - _Impact:_ Medium. Admins view outdated data leading to wrong actions.
   - _Likelihood:_ High.
   - _Mitigation:_ Strict Query Key factory pattern. Invalidate specific keys on every mutation.
4. **Risk:** Auth Regressions (CORS / Cookies)
   - _Impact:_ High. Admins cannot log in.
   - _Likelihood:_ High. Moving from Next.js cookie-auth to API Bearer tokens can cause friction.
   - _Mitigation:_ Configure exact CORS headers on the API and send JWT in `Authorization` header.
5. **Risk:** Loss of Audit Logs
   - _Impact:_ Critical. Compliance violation.
   - _Likelihood:_ Low.
   - _Mitigation:_ Hardcode `logAuditEvent` inside the generalized API route wrapper.
6. **Risk:** SSR Removal causing massive initial load time
   - _Impact:_ Low. Dashboards are generally long-lived sessions.
   - _Likelihood:_ High.
   - _Mitigation:_ Aggressive code-splitting via TanStack Router.
7. **Risk:** Mismatched Routing Paths
   - _Impact:_ Low. Bookmarked URLs 404.
   - _Likelihood:_ Medium.
   - _Mitigation:_ Keep 1:1 path parity in TanStack router tree. Add redirects if needed.
8. **Risk:** Build Pipeline Failures
   - _Impact:_ Medium. Cannot deploy.
   - _Likelihood:_ High (Monorepo complexity).
   - _Mitigation:_ Implement Turborepo early to handle workspace graphs correctly.
9. **Risk:** Missing Env Variables in new SPA
   - _Impact:_ High. App crashes on boot.
   - _Likelihood:_ Medium.
   - _Mitigation:_ Provide `.env.example` in UI app and run an env validator at Vite boot time.
10. **Risk:** Rate Limit Bypasses
    - _Impact:_ High. Spamming sensitive admin actions.
    - _Likelihood:_ Low.
    - _Mitigation:_ Keep `enforceRateLimit` logic strictly tied to the API route hit.
11. **Risk:** Double Fetches on Mount
    - _Impact:_ Low. Wasted API calls.
    - _Likelihood:_ High (React Strict Mode).
    - _Mitigation:_ Properly configure TanStack Query `staleTime` defaults globally.
12. **Risk:** Type safety failures across bounds
    - _Impact:_ Medium. Silent UI errors.
    - _Likelihood:_ Medium.
    - _Mitigation:_ Export API return types from the Next.js routes and import them into frontend `useQuery` definitions.

---

## 7. Verification & Testing Plan

### Automated Tests

- **Unit Tests:** Move existing logic tests to the shared packages. Test Zod schemas independently.
- **Integration Tests:** Verify the Next.js API routes independently using Supertest. Ensure they reject requests without Bearer tokens and log audit events.
- **Security Tests:** Execute negative tests against API endpoints. Attempt actions with `moderator` token that require `super_admin` role. Ensure they return 403 Forbidden.

### Manual Verification

- Verify the exact dev startup time and HMR time before and after Phase 2 (Expectation: < 1s HMR).
- Verify bundle analyzer output of the Vite build.
- Manually test the complete ban/unban user flow:
  1. Click "Ban".
  2. Verify UI updates immediately (Optimistic Update or Invalidation).
  3. Verify `audit_logs` DB table for the entry.

### Definition of Done

- [ ] Monorepo structure implemented.
- [ ] All previous Server Actions are accessible as JSON API endpoints.
- [ ] UI completely migrated to Vite + TanStack Router.
- [ ] JWT authentication successfully integrated between SPA and API.
- [ ] All privileged actions generate an `audit_logs` entry.
- [ ] Dev HMR is functionally instant.

---

## 8. “Minimal Error” Execution Rules

To ensure a seamless transition, developers MUST strictly adhere to these rules:

1. **Strict Client/Server Separation:** The Vite app is strictly UI and client-side logic. The Next.js API app is strictly backend and database. No code sharing outside of the `packages/*` folders (types, schemas, UI components).
2. **Never Import Service Role into Client:** It is strictly prohibited to import or copy `lib/supabase/admin.ts` anywhere inside the Vite app.
3. **Mandatory Audit Logging:** Every single POST/PUT/DELETE API route MUST invoke `logAuditEvent` before yielding a successful response.
4. **Query Key Conventions:** Declare all Query Keys in a central `features/*/queries.ts` file using objects (e.g., `userKeys.list(page)`). Never hardcode query key arrays in components.
5. **Typed API Contracts:** Every fetch call must cast or validate the response against the expected `ServiceResult<T>` exported from the backend.
6. **No Phantom Errors:** If an API call fails, the TanStack Query must throw, and the error must be gracefully caught by a TanStack Router Error Boundary with a clear UI banner.
