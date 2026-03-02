# Admin Setup Guide (The Handle)

This guide covers how to set up the Sline Dashboard monorepo (Vite SPA + Fastify API) locally and what to configure for deployment.

---

## Prerequisites

- **Node.js**: v20.x or higher.
- **npm** or **pnpm**: Package manager for the workspace.
- **Supabase CLI** (optional): For running migrations or generating types in the app repo; not required to run the dashboard alone.

---

## Monorepo Install

From the repo root (`SlineDashbord`):

```bash
git clone <repo-url>
cd SlineDashbord
npm install
```

This installs dependencies for all workspaces (`apps/admin-ui`, `apps/api`, `packages/shared`).

---

## Environment Variables

### admin-ui (Vite SPA)

Create `.env` or `.env.local` in `apps/admin-ui/` (or root if the Vite config loads from root). Only variables prefixed with `VITE_` are exposed to the client.

- **VITE_SUPABASE_URL**: Supabase project URL (for auth session exchange, if login is handled in the SPA).
- **VITE_SUPABASE_ANON_KEY**: Supabase anon key (for auth only; no privileged access).
- **VITE_API_BASE_URL**: Base URL for the API (e.g. `http://localhost:3001` in dev, or same origin in production if served behind one host). If the app uses relative URLs like `/api/v1`, this may be omitted when the UI is proxied to the API.

Do **not** put Service Role key or any secret in a `VITE_*` variable.

### api (Fastify)

Create `.env` or `.env.local` in `apps/api/` (or root, depending on how the API loads env).

- **SUPABASE_URL**: Supabase project URL.
- **SUPABASE_SERVICE_ROLE_KEY**: Service Role key for privileged DB access. **Keep secret; server-only.**
- **SUPABASE_JWT_SECRET** (or equivalent): Used to verify JWT from cookies/session so the API can identify the admin user and enforce RBAC.
- **CORS allowed origins**: Configure Fastify CORS so only the admin UI origin (e.g. `http://localhost:5173` in dev, production UI URL in prod) is allowed.

---

## Run Dev

From the repo root:

```bash
npm run dev
```

This typically starts both the API and the admin-ui (e.g. via Turbo). Alternatively:

- `npm run dev:api` — start Fastify (e.g. port 3001).
- `npm run dev:admin` — start Vite dev server (e.g. port 5173).

Ensure the UI is configured to call the API (same origin or correct `VITE_API_BASE_URL` and CORS). Log in via the auth flow so cookies are set for API requests.

---

## Deployment Checklist

- **API**: Deploy Fastify to a Node host (e.g. Railway, Fly, or behind a reverse proxy). Set env vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT secret, CORS). Do not expose Service Role key to the client.
- **admin-ui**: Build with `npm run build -w @sline/admin-ui` (or equivalent). Serve the built static files (e.g. from `apps/admin-ui/dist`) via a static host or the same host as the API (e.g. same origin so `/api/v1` is proxied to Fastify).
- **Secrets separation**: API secrets only in the API environment. No `VITE_*` secrets. Use a single domain and proxy, or configure CORS and `VITE_API_BASE_URL` for cross-origin.
- **Build gates**: Before release, run build + typecheck for admin-ui and api, and the forbidden-import scan for admin-ui.

---

## Testing

- **Unit / route tests**: From repo root, `npm run -w @sline/shared test` and `npm run -w @sline/api test`. See `.TODO/APP_TEST_CHECKLIST.md` for a full test checklist.
- **Optional integration tests** (require real Supabase): Set `RUN_AUDIT_INTEGRATION=1` and/or `RUN_FINANCE_INTEGRATION=1` (and ensure `SUPABASE_URL` is not a placeholder) before running API tests to execute the skipped DB-dependent tests (e.g. mutation → one audit row, idempotency).
