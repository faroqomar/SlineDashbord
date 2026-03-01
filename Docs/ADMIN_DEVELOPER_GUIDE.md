# Admin Developer Guide

This document is the core architectural reference for the Sline Dashboard (Next.js 15). It dictates how features are built, structured, and maintained in this repository.

## 🏗 Architecture Pattern (Service -> ViewModel -> View)

We strictly follow an MVVM (Model-View-ViewModel) architectural pattern adapted for Next.js App Router. This isolates standard UI rendering from complex state and database interactions.

1. **Service (Server Actions / Data Layer):** Located in `src/features/[feature]/services/`. These files run strictly on the server (`'use server'`). They handle database fetching, Zod validations, RLS bypasses via the Admin Client, and Audit Logging.
2. **ViewModel (State / Logic):** Located in `src/features/[feature]/viewmodels/`. These are custom React Hooks (e.g., `useTasksViewModel`) that encapsulate the state, mutations, and optimistic UI updates. The UI component simply reads state and triggers actions from the ViewModel.
3. **View (UI Layer):** Located in `src/features/[feature]/view/`. These are React Components (`'use client'`). They contain strictly JSX and design system components (Shadcn/Tailwind), pulling their logic from the ViewModel.

---

## 🔒 Server Actions Protocol

Server Actions are the lifeblood of the dashboard. Due to the high-security nature of an Admin Panel, **every Server Action must follow these rules**:

> [!CAUTION]
> **"No Throw" Rule:** Server actions must _never_ throw native JS errors. All endpoints must return a `ServiceResult<T>` object mapping `{ success: false, error: "..." }` to gracefully handle boundaries.

1. **Zod Validation**: Input parameters must be parsed via Zod immediately.
2. **Auth & RBAC Check**: `requireAdminRole(['role_name'])` must be invoked.
3. **DB Execution**: Execute logic using the `createAdminClient()` (Bypasses RLS).
4. **Audit Logging**: Any mutation must be recorded via `logAuditEvent()`.
5. **Revalidation**: Call `revalidatePath()` to clear the Next.js cache.

---

## 💻 Client Components & State Management

**React State vs URL State (`nuqs` / `next/navigation`)**

- **URL State**: Use for pagination, filtering, searching, and tabs. This ensures dashboards can be bookmarked and shared among admins.
- **React State (`useState`)**: Use strictly for ephemeral UI state (e.g., "Is this modal currently open?", "Is this dropdown expanded?").

**Using ViewModels**
Always wrap client-side logic in a custom hook.

```tsx
// ❌ BAD: Mixing logic and UI
export function UserList() {
    const [isLoading, setIsLoading] = useState(false);
    const deleteUser = async () => { ... }
    return <div>...</div>
}

// ✅ GOOD: Clean View consuming a ViewModel
export function UserList() {
    const vm = useUsersViewModel();
    return <Button disabled={vm.isLoading} onClick={vm.deleteUser}>Delete</Button>
}
```

---

## 📋 Copy-Paste Feature Template

### 1. Model / Schema (`src/features/items/models/item.schema.ts`)

```typescript
import { z } from "zod";

export const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  status: z.enum(["active", "archived"]),
});

export type ItemDTO = z.infer<typeof ItemSchema>;
export const MANAGE_ITEMS_ROLES = ["admin", "super_admin"];
```

### 2. Service Action (`src/features/items/services/item_actions.ts`)

```typescript
"use server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  requireAdminRole,
  logAuditEvent,
} from "@/features/core/security/security_guards";
import {
  ServiceResult,
  ok,
  fail,
  toErrorMessage,
} from "@/features/core/models/result";
import { revalidatePath } from "next/cache";

export async function deleteItem(
  id: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const { userId } = await requireAdminRole(["admin", "super_admin"]);
    const supabase = createAdminClient();

    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) return fail("Failed to delete item");

    await logAuditEvent({
      action: "admin.items.delete",
      actor_user_id: userId,
      related_entity_type: "item",
      related_entity_id: id,
      meta: {},
    });

    revalidatePath("/dashboard/items");
    return ok({ id });
  } catch (e) {
    return fail(toErrorMessage(e));
  }
}
```
