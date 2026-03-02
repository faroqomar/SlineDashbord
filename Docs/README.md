# SLine Dashboard documentation

Documentation suite for the SLine Admin Dashboard (Vite SPA + Fastify API). Defined and maintained per `.agent/workflows/architecture/doc_keeper.md`.

---

## Required docs (Doc Keeper)

| Doc | Purpose |
|-----|---------|
| [ADMIN_DEVELOPER_GUIDE.md](./ADMIN_DEVELOPER_GUIDE.md) | **The Bible** — Monorepo layout, SPA architecture (Route → Feature → ViewModel → API → Fastify), TanStack Router/Query, API client templates, List/Detail/Mutation patterns. |
| [ADMIN_SECURITY_MANUAL.md](./ADMIN_SECURITY_MANUAL.md) | **The Shield** — Trust boundaries, Service Role server-only, RBAC, canonical `audit_logs`, atomic write requirement, forbidden imports, destructive actions (reason + audit + idempotency). |
| [ADMIN_DATABASE_REF.md](./ADMIN_DATABASE_REF.md) | **The Brain** — DB objects admin touches, canonical audit table, RPCs (withdrawal, user moderation, force-logout, bookings), views, type generation, shared contracts. |
| [ADMIN_UI_KIT.md](./ADMIN_UI_KIT.md) | **The Face** — Tailwind + shadcn, layouts (Sidebar, PageHeader, tables, filters, empty states), list/detail/dialog patterns, Lucide icons. |
| [ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md) | **The Handle** — Prerequisites, install, env vars (admin-ui and api), run dev, deployment checklist, testing. |

---

## Other references

- **[APP_TEST_CHECKLIST.md](./APP_TEST_CHECKLIST.md)** — Build, test, run locally, auth, optional feature smoke and integration tests. Referenced from `ADMIN_SETUP_GUIDE.md`.
- **Feature docs** — When a feature reaches v1, add `docs/features/<feature>.md`. See [features/README.md](./features/README.md) and the Feature Docs Protocol in `ADMIN_DEVELOPER_GUIDE.md`.

---

## Do-not-miss (Doc Keeper checklist)

- No Throw: APIs return `ServiceResult<T>` (or equivalent result type).
- Zod validation before business logic in Fastify.
- No direct DB writes from admin-ui; no Service Role in client.
- Idempotency-Key on replay-sensitive admin routes.
- Every privileged mutation must be audit-atomic (DB RPC or single transaction), not “log after write”.
