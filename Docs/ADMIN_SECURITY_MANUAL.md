# 🛡️ ADMIN_SECURITY_MANUAL (The Shield)

> **Goal**: Zero data leaks, absolute accountability, and strict isolation.
>
> **Compliance**: All security implementations MUST follow this manual without exception.

## 🔑 The Service Role Strategy

We use the **Supabase Service Role Key** (`SUPABASE_SERVICE_ROLE_KEY`) to bypass Row Level Security (RLS) for Admin actions.

> [!CAUTION]
> **NEVER** expose this key to the client (browser). It resides ONLY in `.env.local` and is accessed via `src/lib/supabase/admin.ts`.

### How we protect it:

1.  **Server-Only Execution**: It is imported only in files marked with `'use server'`. The `server-only` package enforces this at build time.
2.  **Double Auth Check**: Before **ANY** Service Role query, `requireAdminRole()` verifies:
    - Is the user authenticated? (`supabase.auth.getUser()`)
    - Is the user in `admin_users` with the required role?

---

## 🚧 RBAC & Middleware

### 1. Middleware (`src/middleware.ts`)

The first line of defense.

1.  Intercepts ALL requests to `/dashboard`.
2.  Checks strictly against the **`admin_users` table**.
3.  If user is not in `admin_users` -> Redirect to `/unauthorized`.
4.  If user is in `admin_users` -> Allow access.

> [!IMPORTANT]
> The middleware handles **Routing Security**. Server Actions handle **Data Security**. You must have BOTH.

### 2. `verifyAdminRole()`

Helper function used in Server Actions to enforce identical logic.

---

## 📜 Audit Logging (Mandatory)

**Rule**: If it changes data, it must be logged.

All mutations call `logAuditEvent()` from `services/security_guards.ts`.

- **Table**: `audit_logs`
- **Schema**:
  - `action`: e.g., `admin.finance.withdrawal_approve`, `admin.users.soft_delete`.
  - `actor_user_id`: UUID of the admin performing the action.
  - `event_type`: Optional category (e.g., `finance`, `moderation`).
  - `journal_entry_id`: Optional FK to journal entry.
  - `related_entity_type`: e.g., `withdrawal_request`, `profile`.
  - `related_entity_id`: UUID of the affected item.
  - `meta`: JSON blob with details (reason, filters, row count).

---

## 🚦 Rate Limiting

Sensitive mutations use `enforceRateLimit()` to prevent abuse:

```typescript
enforceRateLimit("approve_withdrawal", userId, 5, 60000); // 5 per 60s
```

This is an in-memory sliding-window rate limiter applied per-action, per-user.

---

## 🏝️ Data Isolation Protocol

Dashboard Admins and App Users are completely separate entities.

- **App Users**: Stored in `auth.users` + `public.profiles`.
- **Admins**: Stored in `auth.users` + `public.admin_users`.
- **Isolation**:
  - Admins login via `/login` (checks `admin_users`).
  - App users login via App (checks `profiles`).
  - Accounts created via `/signup` (Admin) are **namespaced** (e.g., `admin.user@email.com` internally) to prevent collisions if the same email exists in the App.

---

## 🧨 Destructive Actions

For high-risk actions (Bans, Refunds, Deletions, Wallet Freezes):

1.  **UI**: Must use a Modal/Dialog or `confirm()` ("Are you sure?").
2.  **Reason**: Must require a typed "Reason" string from the admin (validated by Zod: `z.string().min(1).max(500)`).
3.  **Logs**: The "Reason" must be saved in the Audit Log `meta` field.
4.  **Returns**: Must return `ServiceResult<T>` — never throw.

> [!WARNING]
> Never implement a destructive button without: (1) confirmation, (2) reason input, (3) audit log, (4) rate limit.
