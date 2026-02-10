# 🛡️ ADMIN_SECURITY_MANUAL (The Shield)

> **Goal**: Zero data leaks, absolute accountability, and strict isolation.
>
> **Compliance**: All security implementations MUST follow this manual without exception.

## 🔑 The Service Role Strategy

We use the **Supabase Service Role Key** (`SUPABASE_SERVICE_ROLE_KEY`) to bypass Row Level Security (RLS) for Admin actions.

> [!CAUTION]
> **NEVER** expose this key to the client (browser). It resides ONLY in `.env.local` and is accessed via `src/lib/supabase/admin.ts`.

### How we protect it:

1.  **Server-Only Execution**: It is imported only in `src/actions/*` files marked with `'use server'`.
2.  **Double Auth Check**: Before **ANY** Service Role query, we verify:
    - Is the user authenticated? (`supabase.auth.getUser()`)
    - Is the user an ADMIN? (Check `admin_users` table).

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

All mutations call `logAdminAction()`.

- **Table**: `admin_logs`
- **Schema**:
  - `actor_id`: UUID of the admin.
  - `action`: e.g., `ban_user`, `refund_dispute`.
  - `target_resource`: e.g., `user`, `dispute`.
  - `target_id`: UUID of the affected item.
  - `metadata`: JSON blob with details (reason, previous value).

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

For high-risk actions (Bans, Refunds, Deletions):

1.  **UI**: Must use a Modal/Dialog ("Are you sure?").
2.  **Reason**: Must require a typed "Reason" string from the admin.
3.  **Logs**: The "Reason" must be saved in the Audit Log metadata.

> [!WARNING]
> Never implement a "Delete" button without a confirmation dialog and a reason input.
