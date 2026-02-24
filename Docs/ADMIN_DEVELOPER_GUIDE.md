# 📘 ADMIN_DEVELOPER_GUIDE (The Bible)

> **Goal**: Build scalable, type-safe, and secure features for the Sline Admin Dashboard.

## 🏗 Architecture

We follow a strict **Server-Client Separation** architecture using Next.js 16 App Router.

### The Pattern: `Schema -> Action -> ServiceResult -> ViewModel -> View`

1.  **Zod Schemas (`*.schema.ts`)**: Define input validation for every action.
    - Centralized in `models/` directory per feature.
    - Must be the **first line** of every server action.

2.  **Server Actions (`features/*/actions/*`)**: The **ONLY** place that touches the database.
    - **Validation**: Zod `.safeParse()` on all inputs.
    - **Auth + RBAC**: `requireAdminRole(ROLE_CONSTANTS)` — typed role arrays.
    - **Output**: Must return `ServiceResult<T>` via `ok()` / `fail()` helpers.
    - **NO THROW**: Use `catch (e: unknown)` + `toErrorMessage()` — **NEVER** throw.
    - **Audit**: Must call `logAuditEvent()` on all mutations.
    - **Rate Limiting**: Sensitive mutations must call `enforceRateLimit()`.

3.  **Domain Models (`features/*/models/*.model.ts`)**:
    - Define types, interfaces, role constants, and shared UI utilities.
    - **NO** `any` types allowed. Use `unknown` + type guards.

4.  **ViewModels (`*.vm.ts`)**:
    - Encapsulate client-state logic (selection, loading, pagination, action handlers).
    - Call Server Actions and unwrap `ServiceResult` → `toast.error()` / `toast.success()`.
    - UI components access state **only** through the ViewModel interface.

5.  **Client Components (`features/*/components/*`)**:
    - Pure renders. Zero business logic.
    - Receive data via props from Server Components.
    - Delegate all interactions to ViewModel hooks.
    - **NEVER** import `supabase-js` directly.

---

## 🛡️ Writing Safe Server Actions

Every action must follow this template:

```typescript
"use server";

import { createAdminClient as supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminRole, logAuditEvent } from "../services/security_guards";
import { ok, fail, ServiceResult } from "../models/result";
import { MyInputSchema } from "../models/my-feature.schema";
import { WRITE_ROLES } from "../models/my-feature.model";

// Error helper (shared per feature)
function toErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Unknown error";
}

export async function mySecureAction(
  id: string,
  reason: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    // 1. Zod Validation (First Line)
    const parsed = MyInputSchema.safeParse({ id, reason });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    // 2. Auth + RBAC (typed role constants)
    const { userId } = await requireAdminRole(WRITE_ROLES);

    // 3. Perform Logic
    const adminClient = supabaseAdmin();
    const { error } = await adminClient
      .from("items")
      .delete()
      .eq("id", parsed.data.id);
    if (error) return fail(`Delete failed: ${error.message}`);

    // 4. Audit Log (Mandatory for mutations)
    await logAuditEvent({
      action: "admin.items.delete",
      actor_user_id: userId,
      related_entity_type: "item",
      related_entity_id: parsed.data.id,
      meta: { reason: parsed.data.reason },
    });

    // 5. Return typed ServiceResult
    return ok({ id: parsed.data.id });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}
```

---

## 🎨 Client Components & Hooks

Use `useTransition` for mutations to keep the UI responsive.

```tsx
"use client";

import { useTransition } from "react";
import { mySecureAction } from "@/actions/my-feature";
import { toast } from "sonner";

export function ActionButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await mySecureAction(payload);
      if (!result.success) {
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

## ⚠️ Next.js 15+ Async APIs

In Next.js 15+, `searchParams` and `params` are **Promises** and must be `await`ed:

```typescript
// ✅ Correct (Next.js 15+)
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const cursor = resolvedParams.cursor_id;
}

// ❌ Wrong (deprecated sync access)
export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const cursor = searchParams.cursor_id; // Will break!
}
```

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
