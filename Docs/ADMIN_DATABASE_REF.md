# 🧠 ADMIN_DATABASE_REF (The Brain)

> **Goal**: Understand the data models powering the Admin Dashboard.

## 🗄️ Core Tables

### Admin-Specific

| Table             | Description                     | Key Columns                                                    |
| :---------------- | :------------------------------ | :------------------------------------------------------------- |
| **`admin_users`** | Whitelist of authorized admins. | `id` (FK auth.users), `role` (super_admin, moderator), `email` |
| **`admin_logs`**  | Audit trail for all actions.    | `actor_id`, `action`, `target_id`, `metadata`                  |

### App Integration (ReadOnly/Mutation)

| Table                     | Admin Access Level | Notes                                                       |
| :------------------------ | :----------------- | :---------------------------------------------------------- |
| **`profiles`**            | **Read/Write**     | We read all profiles. Write `status` (ban) and `metadata`.  |
| **`tasks`**               | **Read Only**      | (Previously `projects` / `jobs`). Used for dispute context. |
| **`disputes`**            | **Read/Write**     | Core admin workspace. Write `resolution`, `status`.         |
| **`wallet_transactions`** | **Read/Write**     | Read for finance stats. Write for refunds/payouts.          |

---

## 🔐 RLS Policies & Bypasses

The Admin Dashboard primarily uses the **Service Role Client**, which **bypasses RLS**.

> [!NOTE]
> We bypass RLS because Admins need to see data across the entire platform, which typical "User-centric" RLS policies (e.g., `auth.uid() = user_id`) would hide.

### Explicit Bypasses

- **Fetching User List**: Bypasses `profiles` RLS to see all users.
- **Fetching Disputes**: Bypasses `disputes` RLS to see cases between other parties.
- **Global Stats**: Bypasses all tables to aggregate counts/sums.

---

## 🛠️ Type Generation

We use Supabase CLI to generate strictly typed interfaces.

**Command**:

```bash
npx supabase gen types typescript --project-id "your-project-id" > src/types/supabase.ts
```

**Usage**:

```typescript
import { Database } from "@/types/supabase";
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
```
