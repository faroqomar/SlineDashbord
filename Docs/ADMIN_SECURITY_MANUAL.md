# Admin Security Manual

Welcome to the Sline Admin Dashboard. This application has absolute, unrestricted access to the database via the Supabase Service Role Key. Security is not an afterthought; it is the fundamental baseline.

> [!CAUTION]
> **Data Isolation Rule**: The Admin Dashboard connects to the exact same Postgres database as the `sline_app` mobile/web clients. You must never execute destructive operations (like cascading deletes) on core user tables without extreme caution, as it will corrupt the entire production application platform.

---

## 🔑 The Service Role Key

The Admin Dashboard relies on Supabase's `SUPABASE_SERVICE_ROLE_KEY`.

- **Why we use it**: Standard users rely on Row Level Security (RLS) to restrict their data access. Admins need a global view of all data across the platform, requiring the Service Role Key to intentionally bypass RLS.
- **How we protect it**: The service role key is ONLY loaded in the `src/lib/supabase/admin.ts` file, which includes the `import 'server-only'` directive. This ensures the Next.js compiler will flat-out reject the build if this secret is accidentally referenced inside a Client Component.

---

## 🛡 Role-Based Access Control (RBAC)

Not all admins are equal. We enforce a strict RBAC policy.

### The `requireAdminRole` Guard

Every single Server Action MUST begin by verifying the caller's identity and privilege.

```typescript
import { requireAdminRole } from '@/features/core/security/security_guards';

export async function processRefund() {
    // 1. Validates the JWT session
    // 2. Looks up the user's `active_role` in the `profiles` table
    // 3. Throws a hard Error if they do not match the required list
    const { userId, role } = await requireAdminRole(['super_admin', 'finance']);
    ...
}
```

### Route Middleware

Next.js `middleware.ts` runs on the Edge to actively block unauthenticated users from accessing the `/dashboard/*` route segments without a valid session. However, middleware cannot securely verify DB roles, so the `requireAdminRole` guard remains critical.

---

## 🕵️ Audit Logging System

Because admins operate outside of RLS restrictions, **all mutations must be historically tracked**.

The `audit_logs` table (formerly `admin_logs`) is our source of truth for accountability.
Whenever a Server Action mutates data (`INSERT`, `UPDATE`, `DELETE`), it MUST call `logAuditEvent()`.

**Schema Protocol (`audit_logs`)**:

- `action`: String identifying the event (e.g. `admin.users.ban`).
- `actor_user_id`: UUID of the Admin performing the action.
- `related_entity_type`: The table name or type (e.g., `profile`, `dispute`).
- `related_entity_id`: UUID of the target object affected.
- `meta`: JSONB payload containing specifics (e.g., the ban reason, the refund amount).

---

## 🚨 Destructive Actions & Rate Limiting

1. **Reason Required Protocol**: High-impact actions such as banning a user, reverting a task, or issuing a refund MUST carry a `reason` parameter provided by the Admin. This reason is injected into the `meta` column of the audit log.
2. **Rate Limiting Guard**: Actions that are easily spammed (like resetting passwords or generating reports) should use the `enforceRateLimit()` guard to prevent abuse or accidental Denial of Service scenarios against the database API.
