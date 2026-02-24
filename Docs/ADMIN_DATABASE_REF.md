# 🧠 ADMIN_DATABASE_REF (The Brain)

> **Goal**: Understand the data models powering the Admin Dashboard.

## 🗄️ Core Tables

### Admin-Specific

| Table             | Description                     | Key Columns                                                                   |
| :---------------- | :------------------------------ | :---------------------------------------------------------------------------- |
| **`admin_users`** | Whitelist of authorized admins. | `id` (FK `auth.users`), `role` (super_admin, moderator), `email`              |
| **`audit_logs`**  | Audit trail for all actions.    | `action`, `actor_user_id`, `related_entity_type`, `related_entity_id`, `meta` |

### Finance Module (Double-Entry Ledger)

| Table                     | Admin Access Level | Notes                                                        |
| :------------------------ | :----------------- | :----------------------------------------------------------- |
| **`journal_entries`**     | **Read Only**      | Core double-entry ledger. Each entry has debit/credit lines. |
| **`journal_lines`**       | **Read Only**      | Individual debit/credit line items per journal entry.        |
| **`withdrawal_requests`** | **Read/Write**     | Queue for admin approval. Write `status` (approve/reject).   |

### Finance Views (Read-Only)

| View                                | Purpose                                          |
| :---------------------------------- | :----------------------------------------------- |
| **`vw_admin_journal_ledger`**       | Flattened journal entries with amounts, metadata |
| **`vw_financial_metrics_realtime`** | Platform cash, escrow held, lifetime revenue     |
| **`vw_wallet_balances_user`**       | Per-user available/held/pending balances         |
| **`vw_wallet_activity_user`**       | Per-user transaction history                     |

### Finance RPCs

| RPC                               | Purpose                            |
| :-------------------------------- | :--------------------------------- |
| **`admin_process_withdrawal`**    | Atomic approve/reject withdrawal   |
| **`admin_process_wallet_freeze`** | Atomic freeze/unfreeze user wallet |

### App Integration (ReadOnly/Mutation)

| Table          | Admin Access Level | Notes                                                           |
| :------------- | :----------------- | :-------------------------------------------------------------- |
| **`profiles`** | **Read/Write**     | We read all profiles. Write `status` (ban), `is_wallet_frozen`. |
| **`tasks`**    | **Read Only**      | Used for dispute context.                                       |
| **`disputes`** | **Read/Write**     | Core admin workspace. Write `resolution`, `status`.             |

> [!NOTE]
> The legacy `wallet_transactions` table is **frozen and read-only**. All new finance data flows through the double-entry `journal_entries` / `journal_lines` tables.

---

## 🔢 Enums

### `booking_status_enum`

- `pending`: Initial state.
- `confirmed`: Accepted by freelancer.
- `in_progress`: Work started.
- `delivered`: Work submitted.
- `completed`: Client approved.
- `canceled`: Cancelled before start.
- `refunded`: Money returned.
- `disputed`: (Implicit state via `disputes` table join).

### `message_type_enum`

- `text`: Standard chat.
- `system`: Automated alerts.
- `offer`: Price/Time proposal.
- `dispute_report`: Flag processing.

### `payment_status_enum`

- `unpaid`: Escrow empty.
- `held`: Funds in Escrow.
- `released`: Paid to Freelancer.
- `refunded`: Returned to Client.

### `FinanceRole` (String Literal — `finance.model.ts`)

- `super_admin`: Full access. Can approve/reject withdrawals.
- `admin`: Can freeze wallets, export CSV, view audit logs.
- `moderator`: Can view transactions and user wallets.
- `support`: Read-only access to transactions (metadata masked).

**Role Constants** (defined in `finance.model.ts`):

| Constant                   | Roles                                  | Used For                      |
| -------------------------- | -------------------------------------- | ----------------------------- |
| `FINANCE_READ_ROLES`       | support, moderator, admin, super_admin | All queries                   |
| `FINANCE_WRITE_ROLES`      | admin, super_admin                     | Mutations, exports, audit     |
| `FINANCE_SUPERADMIN_ROLES` | super_admin                            | Withdrawal approval/rejection |

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
type BookingStatus = Database["public"]["Enums"]["booking_status_enum"];
```
