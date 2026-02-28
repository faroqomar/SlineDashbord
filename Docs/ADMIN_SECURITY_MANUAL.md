# 🛡️ SLine Admin Security Manual

> [!CAUTION]
> This document outlines the absolute security protocols for the SLine Admin Dashboard. **These rules are unbreakable under any circumstances.** Code violating these rules will be rejected.

## The Service Role (God Mode)

The Admin Dashboard connects to Supabase using the `SUPABASE_SERVICE_ROLE_KEY`.

**Why we use it:**
The Admin dashboard needs absolute read/write access to all tables (`profiles`, `jobs`, `finances`) across the entire SLine ecosystem to provide administrative oversight, support, and moderation.

**How we protect it:**

1.  **Server-Side ONLY**: The Service Role Key is ONLY available to Next.js Server Actions running in a secure Node environment.
2.  **Environment Check**: Attempting to use `NEXT_PUBLIC_SUPABASE_ANON_KEY` for database queries inside server actions is an anti-pattern. Always import `createAdminClient()`.
3.  **No Client-Side Supabase-JS**: Client components are completely barred from using `supabase-js` to read/write data. They MUST call Server Actions.

## Role-Based Access Control (RBAC)

Every single server action MUST be prepended with a call to `requireAdminRole()`.

```typescript
// features/core/security/security_guards.ts
export async function requireAdminRole(allowedRoles: string[]) {
  // 1. Verifies the user's JWT from cookies
  // 2. Checks the `admin_users` table for their explicit role
  // 3. Rejects if role is not in `allowedRoles`
}
```

**Implementation Rule:**
Do not hardcode roles inside actions. Define role constants in the feature's `.schema.ts` file (e.g. `export const FINANCE_WRITE_ROLES = ['admin', 'super_admin'];`).

## Audit Logs (The Paper Trail)

> [!IMPORTANT]
> **The Golden Rule of Mutations**: You NEVER write, update, or delete from the database without inserting into `admin_logs` immediately afterward.

The `logAuditEvent` helper dictates the exact shape required:

- `actor_id`: The ID of the admin performing the action.
- `action`: The namespaced action taken (e.g. `ticket.replied`, `user.suspended`).
- `target_id`: The ID of the entity affected.
- `target_type`: The table/domain affected.
- `metadata`: A JSONB snapshot of relevant before/after context.

## Data Isolation

The Admin Dashboard does not own user data; it curates it.

- **Rule 1**: Do NOT corrupt `sline_app` user data. Modifications to user profiles must go through strict API boundaries.
- **Rule 2**: Read generously, but modify cautiously. Validate data extensively to ensure admin mutations do not break mobile-app client logic.

## Destructive Actions

For bans, suspensions, deep deletions, or manual refunds:

- **Reason Required**: A "Reason" or "Justification" string must be passed through the UI to the Server Action. It must be mandated by the Zod Schema.
- **Audit**: The reason must be stored in the `metadata` object of the `admin_logs` entry.
