# Admin Developer Guide (The Bible)

This document is the core architectural reference for the Sline Dashboard **NEW STACK**: Vite SPA + TanStack Router/Query + Fastify API. It dictates how features are built, structured, and maintained.

---

## Monorepo Layout

```
SlineDashbord/
├── apps/
│   ├── admin-ui/          # Vite + React + TypeScript SPA (no server-only code)
│   └── api/               # Fastify REST API (server-only; Service Role here only)
├── packages/
│   └── shared/            # Zod schemas + ServiceResult<T>; consumed by admin-ui and api
└── Docs/                  # This documentation suite
```

- **admin-ui**: Routes, features (ViewModels + API clients), and UI only. Never imports Supabase server helpers or `next/*`.
- **api**: Fastify routes, RBAC middleware, Supabase Service Role client. All privileged DB access and audit writes.
- **shared**: Single source of truth for request/response shapes and error envelope. No runtime platform coupling.

---

## SPA Architecture: Route → Feature → ViewModel → API Client → Fastify

We strictly follow MVVM with a clear boundary: the browser talks only to the Fastify API.

1. **Route** (`apps/admin-ui/src/routes/*.tsx`): TanStack Router route component. Renders the feature view and may use `beforeLoad` for auth redirect.
2. **Feature** (`apps/admin-ui/src/features/<feature>/`): Domain folder containing `viewmodels/`, `services/` (API client wrappers), `models/` (TS types), `views/` or `components/`.
3. **ViewModel** (e.g. `use_*.vm.ts`): React hook that holds state, calls the API client, and exposes `data`, `isLoading`, `error`, and mutation functions. No DB, no RBAC logic.
4. **API client** (`features/<feature>/services/*_api.ts`): Thin wrapper around the central `request()` from `lib/api.ts`. Calls `GET/POST /api/v1/...` with cookie auth; optional `Idempotency-Key` for replay-sensitive mutations.
5. **Fastify** (`apps/api/src/routes/*.ts`): Validates with Zod (schemas from `packages/shared`), enforces RBAC, performs DB/RPC, returns `ServiceResult<T>`.

---

## TanStack Router Patterns

- **Route files**: Under `apps/admin-ui/src/routes/` (e.g. `DashboardIndex.tsx`, `Users.tsx`, `TaskDetail.tsx`). Use TanStack Router conventions (`createRoute`, `createFileRoute`, etc.).
- **Typed routes**: Define route params and search params so links and loaders are type-safe.
- **Auth redirect**: Use `beforeLoad` to check session (e.g. call `/api/v1/auth/me` or read cookie); redirect to `/login` if unauthenticated.
- **Loaders**: Optional route-level loaders for data needed before first paint; otherwise ViewModels fetch on mount via TanStack Query.

---

## TanStack Query Patterns

- **Query keys**: Use stable, hierarchical keys (e.g. `['dashboard', 'overview']`, `['users', 'list', { page, role }]`) so invalidation is predictable.
- **Pagination**: Prefer cursor-based pagination for large lists; expose `cursor`/`nextCursor` from API and pass to `queryKey` and `queryFn`.
- **Mutations**: Use `useMutation` with `onSuccess` → `queryClient.invalidateQueries({ queryKey: [...] })` so lists/details refresh after create/update/delete.
- **Error handling**: Map API `ServiceResult<T>` (ok/error) to `isError` and `error` in the ViewModel; never throw from the API client wrapper—return the result.

---

## API Client Templates

Central wrapper lives in `apps/admin-ui/src/lib/api.ts`:

- **Base**: `baseURL: '/api/v1'`, `withCredentials: true` (cookies sent).
- **Method**: `request<T>(method, url, data?)` returns `Promise<ServiceResult<T>>`.
- **Idempotency**: For replay-sensitive mutations (e.g. approve withdrawal, resolve dispute), send `Idempotency-Key` header (e.g. UUID) so the server can deduplicate.

Example feature API client:

```typescript
// apps/admin-ui/src/features/dashboard/services/dashboard_api.ts
import { request } from '@/lib/api';

export const dashboardApi = {
  getOverview: () => request<DashboardOverview>('GET', '/dashboard/overview'),
};
```

Example with Idempotency-Key (extend `request` or use axios instance with header when needed):

```typescript
// For POST that must be idempotent: add Idempotency-Key to headers in that call.
api.post('/finance/withdrawals/123/approve', body, {
  headers: { 'Idempotency-Key': idempotencyKey },
});
```

---

## Copy-Paste Templates

### List Page (Route + ViewModel + API)

**Route** (`routes/Items.tsx`):

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { ItemsScreen } from '@/features/items/views/ItemsScreen';

export const Route = createFileRoute('/items')({
  component: ItemsScreen,
});
```

**ViewModel** (`features/items/viewmodels/use_items_viewmodel.ts`):

```tsx
export function useItemsViewModel() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['items', 'list'],
    queryFn: () => itemsApi.getList(),
  });
  return { items: data?.data ?? [], isLoading, error };
}
```

**API client** (`features/items/services/items_api.ts`):

```ts
import { request } from '@/lib/api';
export const itemsApi = { getList: () => request<ItemListResponse>('GET', '/items') };
```

### Detail Page

ViewModel: `useQuery({ queryKey: ['items', 'detail', id], queryFn: () => itemsApi.getById(id) })`. API: `GET /items/:id`. Route renders detail view with `useItemDetailViewModel(id)`.

### Mutation (Create / Update / Action)

ViewModel: `useMutation({ mutationFn: itemsApi.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items', 'list'] }) })`. API client: `request('POST', '/items', body)`. API route: Zod parse body, RBAC, DB + atomic audit_logs (via RPC), return `success(payload)`.

---

## Do-Not-Miss Checklist

- **No Throw**: APIs return `ServiceResult<T>`. ViewModels map that to state; they do not throw.
- **Zod first**: In Fastify, validate every request body and path param with Zod from `packages/shared` before business logic.
- **No `any`**: Use shared DTOs and generated types; avoid `any` in API and UI.
- **No direct DB from admin-ui**: The SPA never imports Supabase server client or touches the database.
- **Idempotency-Key**: Required on replay-sensitive admin routes (refunds, withdrawals, dispute resolution, etc.).
- **Audit atomic**: Every privileged mutation must write to `audit_logs` in the same transaction as the mutation (DB RPC), not "log after write."

---

## Feature Docs Protocol

When a feature reaches v1 (shipped), add a short feature doc under `docs/features/<feature>.md`. Include: purpose, main routes/screens, API endpoints used, ViewModels, and any special rules (e.g. idempotency, audit). This keeps the docs in sync with the codebase as features evolve.
