# Admin UI Kit (The Face)

The Sline Admin Dashboard uses **Tailwind CSS**, **shadcn/ui**, and **Lucide** icons. The goal is a consistent, accessible, and maintainable workspace for staff. The UI is built in the Vite SPA (`apps/admin-ui`).

---

## Tailwind + Shadcn Conventions

- **Theme**: Use semantic tokens (e.g. `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `bg-destructive`, `bg-muted`) so light/dark and branding stay consistent. Avoid hardcoding hex values; use CSS variables or Tailwind theme.
- **Components**: Prefer components from `components/ui/` (Shadcn). Do not reinvent buttons, tables, dialogs, or forms—customize via props and Tailwind classes.
- **Spacing and typography**: Use Tailwind scale (`space-*`, `text-*`, `font-*`) for consistency.

---

## Layouts

- **Root layout**: Wraps the app (e.g. theme provider, router). Sidebar + main content layout is typically applied to dashboard routes.
- **Sidebar**: Navigation for main areas (Dashboard, Users, Tasks, Cases, Disputes, Finance, Bookings, Logs, Reports, Settings, etc.). Highlight active route (e.g. by pathname). Implemented as a client component.
- **PageHeader**: Each major screen should have a clear header: title + optional description. Use a Lucide icon and an `h1` with consistent sizing (e.g. `text-3xl font-bold`).
- **Tables**: Use Shadcn `Table` (TableHeader, TableRow, TableHead, TableCell). Support sorting/filtering where needed; keep server-side pagination for large lists.
- **Filters**: Use `Select`, `Input`, or dedicated filter components; sync state with URL or ViewModel so filters are shareable and persist.
- **Empty states**: When a list or detail has no data, show a clear empty state (icon + message + optional CTA), not a blank area.

---

## Standard Patterns

- **List pages**: Route → View that uses a ViewModel (e.g. `useUsersViewModel`) → table + filters + pagination. Loading and error states from ViewModel.
- **Detail pages**: Route with `:id` → View that uses a detail ViewModel (e.g. `useUserDetailViewModel(id)`) → sections/cards. Same loading/error handling.
- **Action dialogs**: Use Shadcn `Dialog` (or browser `confirm`) for confirmations (e.g. ban user, force logout, force-cancel task). Require reason where policy demands it; optional reason for force logout (recommended for audit). Submit via ViewModel mutation.
- **Toasts**: Use Shadcn `Sonner` or equivalent for success/error feedback after mutations.

---

## Icons: Lucide

- Use `lucide-react` for all icons (e.g. `Users`, `TrendingUp`, `AlertCircle`, `DollarSign`). Import only what you need to keep bundle small.
- Use consistent sizes: e.g. `className="w-4 h-4"` for inline, `w-8 h-8` for page headers. Prefer semantic color classes (`text-primary`, `text-muted-foreground`, `text-destructive`) so they respect theme.

---

## Responsiveness and Accessibility

- Ensure tables and forms are usable on smaller viewports (horizontal scroll or stacked layout as appropriate).
- Use semantic HTML and Shadcn’s built-in a11y (focus, labels, ARIA) so the dashboard is keyboard-navigable and screen-reader friendly.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
