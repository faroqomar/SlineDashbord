# 💅 ADMIN_UI_KIT (The Face)

> **Goal**: Consistent, beautiful, and functional UI using Shadcn & Tailwind.

## 🎨 Theme System

We use a customized Tailwind theme defined in `helpers/themes.ts`.

- **Primary**: Deep Indigo/Blue (Professional, Trust).
- **Destructive**: Red (Bans, Deletions).
- **Muted**: Grays (Secondary text, borders).
- **Dark Mode**: Fully supported via `next-themes`.

---

## 🧩 Key Components

We use **Shadcn/UI** components located in `src/components/ui`.

| Component              | Usage                                                             |
| :--------------------- | :---------------------------------------------------------------- |
| **`DataTable`**        | The workhorse. Supports sorting, pagination, and bulk actions.    |
| **`Dialog` / `Sheet`** | Use for complex interactions (Edit Forms, Details View).          |
| **`Card`**             | Use for dashboard widgets and summary metrics.                    |
| **`Badge`**            | Use for status indicators (Active, Banned, Pending).              |
| **`Button`**           | Standard actions. Use `variant="destructive"` for dangerous acts. |

---

## 📐 Layouts

### 1. `DashboardLayout`

- **Sidebar**: Collapsible navigation.
- **Header**: Breadcrumbs, User Menu, Theme Toggle.
- **Main Area**: Padding and max-width containers.

### 2. `PageHeader`

Standard header for every page.

```tsx
<div className="flex items-center justify-between space-y-2">
  <h2 className="text-3xl font-bold tracking-tight">Users</h2>
  <div className="flex items-center space-x-2">
    <Button>Download CSV</Button>
  </div>
</div>
```

---

## 🖼️ Icons

We use **Lucide React**.

- Import: `import { User, Settings, ShieldAlert } from 'lucide-react';`
- Style: Keep them consistent in size (`h-4 w-4` for buttons, `h-6 w-6` for nav).
