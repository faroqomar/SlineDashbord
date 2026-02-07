# 🎨 Admin UI Kit (The Face)

**Design System**: Shadcn/UI + Tailwind CSS
**Font**: Inter (Sans-serif)

---

## 🌈 Theme & Colors

We use a professional, data-dense aesthetic.

- **Background**: `bg-gray-50` (Light), `bg-gray-950` (Dark)
- **Primary**: `bg-gray-900` (text-white)
- **Destructive**: `bg-red-500` (For Bans/Deletes)
- **Muted**: `text-gray-500` (For secondary labels)
- **Borders**: `border-gray-200` (Light), `border-gray-800` (Dark)

---

## 🧩 Components

We use standard Shadcn components located in `src/components/ui`.

### Core Components

| Component       | Usage                                                            | Import                   |
| :-------------- | :--------------------------------------------------------------- | :----------------------- |
| **Button**      | Actions. Variants: `default`, `destructive`, `outline`, `ghost`. | `@/components/ui/button` |
| **Card**        | Content containers. Use `CardHeader`, `CardContent`.             | `@/components/ui/card`   |
| **Table**       | Data listings. Use `TableHeader`, `TableRow`, `TableCell`.       | `@/components/ui/table`  |
| **Dialog**      | Modals for confirmations (Banning, resolving disputes).          | `@/components/ui/dialog` |
| **Badge**       | Status indicators (Green for Active, Red for Banned).            | `@/components/ui/badge`  |
| **Input/Label** | Form fields.                                                     | `@/components/ui/input`  |

### Layout Components

1.  **`DashboardLayout`** (`src/app/dashboard/layout.tsx`)
    - Contains the `Sidebar` and `Header`.
    - Handles responsiveness (Mobile menu).
2.  **`Sidebar`**
    - Navigation links using `ucide-react` icons.
3.  **`PageHeader`**
    - Standard top-of-page title and breadcrumbs.

---

## 🖼 Icons

We use **Lucide React**.

```tsx
import { Users, ShieldAlert, BadgeDollarSign } from "lucide-react";

<Users className="h-4 w-4 mr-2" />;
```

**Common Icons:**

- `Users`: User Management
- `ShieldAlert`: Disputes/Security
- `BadgeDollarSign`: Finance/Transactions
- `Activity`: Logs/Overview
