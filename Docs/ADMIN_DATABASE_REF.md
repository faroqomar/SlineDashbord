# Admin Database Reference

This document covers the structure, types, and nuances of how the Sline Admin Dashboard interacts with the underlying Postgres Database via Supabase.

---

## 📊 Core Administrative Tables

While the Sline App has many tables, the Admin Dashboard primarily focuses on the orchestration and oversight of these entities:

| Table             | Description                                                        | Admin Permissions                               |
| ----------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| `profiles`        | User accounts, roles, and platform status.                         | View, Ban, Unban, Verify, Change Role           |
| `tasks`           | Marketplace jobs, budgets, and descriptions.                       | View, Escalate                                  |
| `disputes`        | Conflict resolution contexts generated when a task goes wrong.     | View, Mediate, Resolve (Financial Split/Refund) |
| `support_tickets` | Incoming user questions, bug reports, and complaints.              | View, Reply, Close                              |
| `audit_logs`      | Immutable ledger of all admin actions taken inside this dashboard. | Read-Only (System Appends)                      |
| `system_config`   | Global variables (Maintenance mode, forced app version, banners).  | Read / Update                                   |

---

## 🗂 Key Postgres Enums

Type-safety begins at the database level. Sline uses custom ENUMs heavily.

1. **`UserRole` / Active Roles**: `user`, `admin`, `super_admin`, `moderator`, `support`, `finance`.
2. **`TaskStatus`**: `open`, `in_progress`, `in_review`, `completed`, `cancelled`, `disputed`.
3. **`DisputeStatus`**: `open`, `investigating`, `mediation`, `resolved`, `dismissed`.
4. **`TicketStatus`**: `open`, `in_progress`, `waiting_on_user`, `resolved`, `closed`.

---

## 🛡 RLS Bypasses via Service Role

The Admin Dashboard is built entirely on the `createAdminClient()` helper, which initiates a Supabase client using the `SUPABASE_SERVICE_ROLE_KEY`.

**This intentionally BYPASSES all Row Level Security (RLS) policies.**

- **Why**: Traditional RLS requires the executing request to belong to the row owner (e.g., a freelancer selecting their own tasks). Determining administrative access natively inside Postgres RLS policies is inherently slow and complex.
- **The Result**: The Admin server actions act as a "God Mode". We rely entirely on the App-Level Application Code (`requireAdminRole` guard) to restrict viewing and mutating capabilities.

---

## 🧬 Type Generation Pipeline

We maintain 100% end-to-end type safety. Instead of manually typing database payloads, we generate them directly from the live Postgres schema.

**Command to generate types:**

```bash
npx supabase gen types typescript --project-id isddrknbjsgaantjojhm > src/types/supabase.ts
```

_(Ensure you have the Supabase CLI installed and are authenticated)._

**Consuming the Types:**
Whenever typing a raw data payload, use the `Database` interfaces:

```typescript
import { Database } from "@/types/supabase";

export type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
```

> [!TIP]
> Never use `any` when dealing with Supabase responses! Always map the raw row data into a formatted `DTO` (Data Transfer Object) inside your Service Action before handing it off to the React View Model.
