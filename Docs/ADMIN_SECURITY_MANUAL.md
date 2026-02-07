# 🛡 Admin Security Manual (The Shield)

> [!CAUTION]
> **Data Integrity is Paramount.** This dashboard has "God Mode" access. A single mistake can wipe production data. Follow these rules or standard operating procedures strictly.

---

## 1. The Service Role Key

We use the `SUPABASE_SERVICE_ROLE_KEY` to bypass Row Level Security (RLS). This allows Admins to see and edit ANY data.

### 🔒 Protection Rules

1.  **Server-Only**: This key is only available in `src/lib/supabase/admin.ts`.
2.  **Never Leak**: Never verify or use this key in files starting with `'use client'`.
3.  **Build Check**: The project has a script (`scripts/security-check.js`) that runs before build to verify no leaks.

---

## 2. Authentication & Authorization (RBAC)

Access is controlled via `src/proxy.ts` (Middleware).

### Verification Flow

1.  **Session Check**: User must have a valid Supabase Auth session.
2.  **Domain Check**: Email must end with `@sline.com` (or exist in a specific allowed list).
3.  **Role Check**: (Future) Check `app_metadata.role` for 'admin' or 'super_admin'.

```typescript
// Middleware Logic
if (!email.endsWith("@sline.com")) {
  return NextResponse.redirect(new URL("/login?error=Unauthorized", req.url));
}
```

---

## 3. Audit Logging (Mandatory)

**Everything** must be logged. If it's not logged, it didn't happen (and is a security violation).

### The `admin_logs` Protocol

We use the `activity_log` table.

| Column        | Description                                                  |
| :------------ | :----------------------------------------------------------- |
| `admin_id`    | UUID of the admin performing actions.                        |
| `action_type` | Enum: `user_banned`, `dispute_resolved`, `refund_processed`. |
| `entity_id`   | UUID of the target (User, Task, Transaction).                |
| `entity_type` | 'user', 'task', 'dispute'.                                   |
| `details`     | JSONB. Must include `reason` and snapshot of change.         |
| `ip_address`  | (Optional) IP of the admin.                                  |

**Usage:**

```typescript
import { logAdminAction } from "@/lib/audit";
await logAdminAction(adminId, "user_banned", userId, "user", {
  reason: "ToS Violation",
});
```

---

## 4. Data Isolation (The Airlock)

The Admin Dashboard is a separate application from the Main App (`SlineDashbord`).

- **Shared**: The Supabase Database (Project ID: `isddrknbjsgaantjojhm`).
- **Separated**:
  - **Environment Vars**: Admin has its own `.env.local`.
  - **Codebase**: No shared code imports between projects. Copy types if needed.
  - **Deployment**: Admin deployed separately (e.g., `admin.sline.com`).

---

## 5. Destructive Actions Protocol

For high-risk actions (Banning, Refunds):

1.  **Reason Required**: UI must force the admin to type a reason (> 5 chars).
2.  **Confirmation Dialog**: "Are you sure?" modal is mandatory.
3.  **Atomic Transactions**: Financial moves must use SQL RPC (e.g., `admin_resolve_dispute`) to ensure money isn't lost if the server crashes mid-action.

> [!WARNING]
> Never manually update `wallet_balances` view. Always insert into `wallet_transactions` or use the RPC.
