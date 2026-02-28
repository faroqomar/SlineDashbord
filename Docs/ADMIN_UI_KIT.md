# 🎨 SLine Admin UI Kit

> [!TIP]
> The Design System and visual constraints for the SLine Admin Dashboard, powered by Tailwind CSS and Shadcn/UI.

## Theme & Palette

The admin dashboard uses a clean, deeply professional theme emphasizing data visibility over visual flair.

- **Primary (`bg-primary`)**: Deep SLine Blue. Used for primary call-to-action buttons.
- **Muted (`text-muted-foreground`)**: Used heavily in tables and secondary labels to reduce visual noise.
- **Destructive (`text-destructive`)**: Deep Red. Used strictly for deletions, suspensions, and critical errors.
- **Fonts**: The standard font stack is `Inter`, forced dynamically via `next/font`.

## Available Shadcn Components

The project heavily utilizes the standard Shadcn/UI component library. Run `npx shadcn-ui@latest add [component]` if a component is missing.

- **`Button`**: Includes variants like `default`, `outline`, `ghost`, `destructive`.
- **`Table`**: The backbone of the dashboard. Always use the segmented components (`TableHeader`, `TableRow`, `TableCell`).
- **`Dialog` / `AlertDialog`**: Used for forms (creation, assignment, refunding). Always use `AlertDialog` for destructive actions requiring explicit confirmation.
- **`Form`**: Integrates tightly with `react-hook-form` and `@hookform/resolvers/zod`.
- **`Card`**: Used to segment distinct widgets and metrics blocks on the main dashboard views.

## Layouts

1.  **`DashboardLayout` (`src/app/dashboard/layout.tsx`)**: Wraps the entire logged-in experience. Handles authentication redirection checks.
2.  **`Sidebar`**: The primary navigation tree. Add new routes here under `src/components/layout/Sidebar.tsx`.
3.  **`PageHeader`**: A consistent top-bar component passing in Breadcrumbs and the authenticated user's dropdown.

## Icons

We standardise on **Lucide React** (`lucide-react`). Do not install alternative icon libraries like FontAwesome or HeroIcons.

```tsx
import { ShieldAlert, Users, CreditCard } from "lucide-react";

<Button variant="outline">
  <ShieldAlert className="w-4 h-4 mr-2 text-destructive" />
  Suspend User
</Button>;
```
