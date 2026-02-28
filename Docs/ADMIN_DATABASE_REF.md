# 🧠 SLine Admin Database Reference

> [!NOTE]
> The database schema and its specific relevance to the Admin Dashboard.

## Core Tables Accessed

The Admin Dashboard interacts heavily with the following core Supabase tables:

1.  **`profiles`**: The master table of all SLine users (Clients & Freelancers). Accessed primarily as read-only, except for suspension/banning features.
2.  **`admin_users`**: The internal table managing dashboard staff, their roles, and status.
3.  **`admin_logs`**: The immutably appended audit trail of every administrative mutation.
4.  **`support_tickets`** & **`support_messages`**: The core of the Complaint/Support module. Read/Write.
5.  **`disputes`**: Mediating conflicts between clients and freelancers on active jobs. Read/Write.

## Admin Enums

- **`AdminRole`**: `viewer` | `support` | `moderator` | `admin` | `super_admin`
- **`TicketStatus`**: `open` | `in_progress` | `resolved` | `closed`
- **`TicketPriority`**: `low` | `normal` | `high` | `urgent`
- **`DisputeStatus`**: `open` | `under_review` | `resolved` | `escalated`

## RLS Bypasses

Row Level Security (RLS) is standard practice in Supabase. However, the Admin Dashboard bypasses RLS policies entirely by using the `Service Role Key`.

**Explicit Bypasses & Reasons:**

- `profiles`: Bypassed because moderators need to view all user profiles entirely, even hidden or suspended ones.
- `support_tickets`: Bypassed because support staff need global read/write access to assign tickets and resolve them regardless of the user `auth.uid()`.
- `admin_logs`: Bypassed because only the Service Role can insert into this table, which is otherwise structurally restricted.

## Type Generation

Do not manually write or update backend types. SLine uses `supabase gen types` to produce a unified `Database` TS interface.

**Command to Sync Types:**

```bash
supabase gen types typescript --project-id "your-project-id" --schema public > src/types/supabase.ts
```

**Usage Rule:**
Map the verbose `Database['public']['Tables']['x']['Row']` types to clean Data Transfer Objects (DTOs) in the feature layer (e.g. `export type TicketDTO = Database['public']['Tables']['support_tickets']['Row']`).
