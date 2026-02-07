# 🧠 Admin Database Reference (The Brain)

**Project ID**: `isddrknbjsgaantjojhm`

---

## 🗄 Core Tables

These are the primary tables the Admin Dashboard interacts with.

### 1. User Management

- **`auth.users`**: Returns Auth ID, Email, Last Sign In. (Requires Service Role to list all).
- **`public.profiles`**: Public profile data.
  - `id` (UUID, PK) -> Links to `auth.users`.
  - `status` (Text) -> 'active', 'banned' (Added for Admin).
  - `metadata` (JSONB) -> Stores Verification status, Ban history.

### 2. Work & Tasks

- **`public.tasks`**: The core unit of work.
  - `status`: 'open', 'assigned', 'in_progress', 'review', 'completed', 'canceled', 'closed'.
  - `budget`: Numeric amount.
- **`public.disputes`** (Admin Specific):
  - `id`, `task_id`, `initiator_id`.
  - `status`: 'open', 'resolved'.
  - `resolution`: 'refund_client', 'release_freelancer'.

### 3. Finance

- **`public.wallet_transactions`**: The ledger.
  - **Write-Only** mostly.
  - `type`: 'deposit', 'withdrawal', 'refund', 'payment_release'.
- **`public.wallet_balances`**: **VIEW**. Read-only aggregation of transactions.
  - Do not try to update this directly.

### 4. System

- **`public.activity_log`** (Admin Specific):
  - Stores the audit trail of all admin actions.

---

## ⚡ RLS Bypasses

The Admin Dashboard uses `SUPABASE_SERVICE_ROLE_KEY` which **bypasses ALL Row Level Security policies**.

| Table      | Normal Policy                | Admin Access                             |
| :--------- | :--------------------------- | :--------------------------------------- |
| `profiles` | Users edit own. Public read. | **Full RW** (Can ban/edit anyone).       |
| `tasks`    | Participants only.           | **Full RW** (Can cancel/force complete). |
| `wallet_*` | User sees own.               | **Full RW** (Can correct balances).      |

> [!NOTE]
> We rely on **Code-Level Security** in `src/actions` rather than Database Policies for the Admin App.

---

## 🛠 Type Generation

We use Supabase CLI to generate TypeScript definitions.

**Command to Update Types:**

```bash
npx supabase gen types typescript --project-id "isddrknbjsgaantjojhm" --schema public > src/types/supabase.ts
```

**Using the Types:**

```typescript
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];
```
