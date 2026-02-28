# 📘 SLine Admin Developer Guide

> [!NOTE]
> This guide outlines the core architecture and development patterns for building features in the SLine Admin Dashboard.

## Architecture: MVVM + Service Layer

The Admin Dashboard strictly adheres to a Model-View-ViewModel (MVVM) architecture, adapted for Next.js 15 App Router and React Server Components. Features are encapsulated within `src/features/[feature_name]/`.

- **View (UI Components)**: Pure React components responsible only for rendering UI and handling user interactions. They strictly consume data and methods provided by the ViewModel.
- **ViewModel (Custom Hooks)**: React hooks (`use[Feature].vm.ts`) that manage local component state, loading states, and orchestrate calls to the Service layer. **No security checks or direct database calls happen here.**
- **Service (Server Actions)**: Backend logic executing on the server (`use server`). This layer enforces security (RBAC), validates input (Zod), performs database operations, and writes Audit Logs.
- **Model (Schemas & Types)**: Zod schemas and TypeScript interfaces defining the shape of data flowing through the system.

## Server Actions (The Backend)

All Server Actions must follow a strict, unified pattern to guarantee security and reliable error handling.

> [!IMPORTANT]
> **The "No Throw" Rule:** Server Actions must NEVER throw exceptions. All outcomes (success or failure) must be returned using the `ServiceResult<T>` pattern.

### The Standard Server Action Flow:

1.  **Validate Input**: Use Zod `.safeParse()` on all incoming arguments.
2.  **Enforce RBAC**: Call `requireAdminRole(ALLOWED_ROLES)`.
3.  **Execute Logic**: Perform the necessary database operations using `createAdminClient()`.
4.  **Audit Log**: If the action modifies data, invoke `logAuditEvent()`.
5.  **Return Result**: Return `ok(data)` or `fail("error message")`.

## Client Components (The Frontend)

Client components should use the `useViewModel` pattern to abstract complex state.

### State Management

- **React State (`useState`)**: Use for ephemeral UI state (e.g., toggling a dropdown, managing a simple modal's open state).
- **URL State (Query Params)**: Use for state that should be shareable or persistent across reloads (e.g., pagination, search filters, active tabs).
- **ViewModel State**: Use for managing the async state of Server Action calls (`isPending`, `error`).

## Code Snippet: Standard CRUD Feature Template

### 1. Model & Schema (`src/features/example/models/example.schema.ts`)

```typescript
import { z } from "zod";

export const CreateExampleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});
export type CreateExampleDTO = z.infer<typeof CreateExampleSchema>;

export const EXAMPLE_WRITE_ROLES = ["admin", "super_admin"];
```

### 2. Service (`src/features/example/services/example_actions.ts`)

```typescript
"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  ok,
  fail,
  ServiceResult,
  toErrorMessage,
} from "@/features/core/models/result";
import {
  requireAdminRole,
  logAuditEvent,
} from "@/features/core/security/security_guards";
import {
  CreateExampleSchema,
  CreateExampleDTO,
  EXAMPLE_WRITE_ROLES,
} from "../models/example.schema";

export async function createExample(
  input: CreateExampleDTO,
): Promise<ServiceResult<any>> {
  try {
    // 1. Validate
    const parsed = CreateExampleSchema.safeParse(input);
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    // 2. Authorize
    const { userId } = await requireAdminRole(EXAMPLE_WRITE_ROLES);

    // 3. Execute
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("examples")
      .insert(parsed.data)
      .select()
      .single();
    if (error) return fail("Failed to create example");

    // 4. Audit
    await logAuditEvent({
      action: "example.created",
      actor_id: userId,
      target_id: data.id,
      target_type: "example",
      metadata: { new_data: data },
    });

    // 5. Return
    return ok(data);
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}
```

### 3. ViewModel (`src/features/example/viewmodels/useExample.vm.ts`)

```typescript
import { useState, useTransition } from "react";
import { createExample } from "../services/example_actions";
import { CreateExampleDTO } from "../models/example.schema";

export function useExample() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (data: CreateExampleDTO) => {
    setError(null);
    startTransition(async () => {
      const result = await createExample(data);
      if (!result.success) {
        setError(result.error);
      } else {
        // Handle success
      }
    });
  };

  return { createItem: handleCreate, isPending, error };
}
```

### 4. View (`src/features/example/views/ExampleForm.tsx`)

```tsx
"use client";

import { useExample } from "../viewmodels/useExample.vm";
import { Button } from "@/components/ui/button";

export function ExampleForm() {
  const { createItem, isPending, error } = useExample();

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <Button
        onClick={() => createItem({ title: "New Item" })}
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Create Item"}
      </Button>
    </div>
  );
}
```
