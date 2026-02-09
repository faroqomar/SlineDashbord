# 📘 ADMIN_DEVELOPER_GUIDE (The Bible)

> **Goal**: Build scalable, type-safe, and secure features for the Sline Admin Dashboard.

## 🏗 Architecture

We follow a strict **Server-Client Separation** architecture using Next.js 15 App Router.

### The Pattern: `Action -> Model -> View`

1.  **Server Actions (`src/actions/*`)**: The **ONLY** place that touches the database.
    - Must define a Zod schema for input.
    - Must verify Authentication (`getUser`).
    - Must verify Admin Role (`admin_users` check).
    - Must return `{ success, error, data }`.
    - **NEVER** throw errors to the client; catch and return objects.

2.  **Domain Models (`src/features/*/models/*.model.ts`)**:
    - Define the shape of data (Interfaces).
    - **NO** `any` types allowed.

3.  **Client Components (`src/components/*`)**:
    - Pure UI.
    - Call Server Actions directly or via `useTransition`.
    - **NEVER** import `supabase-js` directly for data fetching.

---

## 🛡️ Writing Safe Server Actions

Every action must follow this template:

```typescript
"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { logAdminAction } from "@/lib/admin-logger";

// 1. Define Input Schema
const InputSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().min(5),
});

export async function mySecureAction(formData: FormData) {
  // 2. Validate Input
  const parsed = InputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Invalid input" };

  const supabase = await createClient();
  const adminDb = createAdminClient();

  // 3. Auth & Role Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: admin } = await adminDb
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!admin) return { error: "Access Denied" };

  // 4. Perform Logic
  const { error } = await adminDb
    .from("items")
    .delete()
    .eq("id", parsed.data.id);
  if (error) return { error: error.message };

  // 5. Audit Log (Mandatory)
  await logAdminAction(user.id, "delete_item", "items", parsed.data.id, {
    reason: parsed.data.reason,
  });

  return { success: true };
}
```

---

## 🎨 Client Components & Hooks

Use `useTransition` for mutations to keep the UI responsive.

```tsx
"use client";

import { useTransition } from "react";
import { mySecureAction } from "@/actions/my-feature";

export function ActionButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await mySecureAction(payload);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Done!");
      }
    });
  };

  return (
    <Button disabled={isPending} onClick={handleClick}>
      Execute
    </Button>
  );
}
```

---

## 🧠 State Management

- **Global State**: Avoid it. Use Server State (fetched via Server Components).
- **URL State**: Use search params for Filters, Pagination, and Tabs. This makes views shareable.
- **Local State**: Use `useState` only for ephemeral UI (modals open/close, form inputs).

---

## ⚡ Quick Snippets (Copy-Paste)

### Standard CRUD Feature Structure

```
src/features/
  └── my-feature/
      ├── models/
      │   └── item.model.ts
      ├── components/
      │   ├── ItemList.tsx
      │   └── ItemForm.tsx
```

`src/app/dashboard/my-feature/page.tsx` (Server Component) -> Fetches data -> Renders `ItemList`.
