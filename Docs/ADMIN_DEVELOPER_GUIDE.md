# 📘 Admin Developer Guide (The Bible)

**Version**: 1.0.0
**Framework**: Next.js 15 (App Router)

---

## 🏗 Architecture

The Admin Dashboard follows a strict **Server-Centric** architecture to ensure security and performance.

### 1. The "Service -> Action -> View" Pattern

We do not use client-side fetching (no `useEffect` or `react-query` for initial data).

1.  **Server Actions (`src/actions/*`)**: The only way to read/write data.
2.  **Server Components (`page.tsx`)**: Fetch initial data using Server Actions.
3.  **Client Components (`components/*`)**: Receive data as props and call Server Actions for mutations.

### 2. File Structure

```
src/
├── actions/        # Server Actions (Your API layer)
├── app/            # Routes (Pages & Layouts)
├── components/     # UI Components (Client & Server)
├── lib/            # Utilities (Supabase, Audit, Zod)
├── types/          # TypeScript Definitions (DTOs)
└── proxy.ts        # Middleware (Security Wall)
```

---

## ⚡ Server Actions (How to Write Backend Logic)

Every Server Action must follow this template. **No exceptions.**

### The "Safe Action" Template

```typescript
'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { logAdminAction } from '@/lib/audit';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// 1. Define Input Schema
const UpdateUserSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(['active', 'banned']),
  reason: z.string().min(5)
});

export async function updateUserStatus(formData: FormData) {
  // 2. Validate Input
  const parsed = UpdateUserSchema.safeParse({
    userId: formData.get('userId'),
    status: formData.get('status'),
    reason: formData.get('reason')
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const { userId, status, reason } = parsed.data;

  // 3. Authenticate & Authorize
  // (Middleware handles session, but we use Admin Client here)
  const supabase = await createAdminClient();
  // TODO: Get current admin ID from session if needed for logs

  // 4. Perform DB Operation
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId);

  if (error) {
    console.error('Update failed:', error);
    return { success: false, error: 'Database update failed.' };
  }

  // 5. Audit Log (MANDATORY for writes)
  await logAdminAction('ADMIN_ID', 'user_updated', userId, 'user', { status, reason });

  // 6. Revalidate & Return
  revalidatePath(\`/dashboard/users/\${userId}\`);
  return { success: true };
}
```

> [!IMPORTANT]
> **NEVER THROW ERRORS**. Always return `{ success: false, error: string }` so the UI can handle it gracefully.

---

## 🧩 Client Components (The ViewModel)

When building complex forms, use the standard interaction pattern.

```tsx
"use client";

import { useState } from "react";
import { updateUserStatus } from "@/actions/user-mutations";
import { toast } from "sonner";

export function UserStatusForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    // Call Server Action
    const result = await updateUserStatus(formData);

    if (!result.success) {
      toast.error(result.error);
    } else {
      toast.success("User updated successfully");
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="userId" value={userId} />
      {/* ... inputs ... */}
    </form>
  );
}
```

---

## 🚦 State Management Rules

1.  **URL State**: For Filters, Pagination, and Search.
    - _Why?_ Shareable links, browser history support.
    - _How?_ Use `searchParams` prop in `page.tsx`.
2.  **React State**: For Form Inputs, Modals, Toggles.
    - _Why?_ Ephemeral interaction.
3.  **Server State**: Do NOT use a global store (Redux/Zustand). Rely on `revalidatePath`.

---

## 📋 Copy-Paste CRUD Cheat Sheet

### Fetching Data (Read)

```typescript
// src/actions/items.ts
export async function getItems() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from("items").select("*");
  if (error) return []; // Or throw if page should crash
  return data;
}
```

### Creating Data (Create)

```typescript
// src/actions/items.ts
export async function createItem(data: ItemDTO) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("items").insert(data);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/items");
  return { success: true };
}
```
