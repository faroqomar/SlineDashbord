# Admin UI Kit & Design System

The Sline Admin Dashboard utilizes a custom aesthetic powered by **Tailwind CSS**, pre-built **Shadcn/UI components**, and **Lucide-React** iconography. The goal is a highly functional, responsive, and visually cohesive workspace for staff.

---

## 🎨 Theme & Typography

- **Font Family**: We use **Inter** as the foundational sans-serif typeface. It is highly legible for data-heavy dashboard rows.
- **Color Variables**: All colors run through CSS variables defined in `@/app/globals.css`. Never hardcode colors unless necessary.

### Primary Semantic Colors

- `bg-background`: The core page background (White in light mode, dark gray in dark mode).
- `text-foreground`: The primary text color.
- `bg-primary`: High-attraction CTA color (e.g., active sidebar links, primary actions).
- `bg-destructive`: Used strictly for dangerous actions (Banning a user, Refunding money).
- `bg-muted`: Soft gray backgrounds used for secondary input areas or cards.
- `bg-secondary`: Low emphasis backgrounds.

---

## 🧩 Shadcn Components

We heavily rely on Shadcn's highly accessible React components. Rather than writing custom CSS, leverage these built-in blocks:

- **`<Button />`**: The primary interactable element. Use variants: `default`, `outline`, `ghost`, `destructive`.
- **`<Table />`**: For displaying users, tasks, and dispute lists. Use `TableHeader`, `TableRow`, and `TableHead` structural wrappers.
- **`<Dialog />`**: For intercepting workflows that require confirmation (e.g., The Resolution Modal, or Invite Admin Modal).
- **`<Form />`**: For rigorous Zod-validated data entry. Pairs seamlessly with `react-hook-form`.
- **`<Card />`**: For dashboard metrics, analytic graphs, and isolating data groups.
- **`<Select />`**: Dropdowns for applying filters on query results.

> [!TIP]
> Do not manually type out custom CSS transitions or drop-shadows. Stick to Tailwind's `shadow-sm`, `animate-in fade-in`, and semantic color classes to maintain UI consistency.

---

## 📏 Core Layouts

### 1. The `DashboardLayout` Server Component

Located at `src/app/dashboard/layout.tsx`. This checks for the Supabase Session, fetches the user's role profile to ensure they have administrative access, and wraps the authenticated view with a global `SidebarServer` wrapper and standard CSS styling.

### 2. The `Sidebar` Client Component

Provides contextual navigation. The highlighted active route uses a high-contrast standard `primary` color tag depending on the current `pathname`.

### 3. Page Headers

Every major feature screen should contain an intro header explaining the context. Utilize a Lucide Icon and an `h1` `font-bold text-3xl`.

```tsx
<h1 className="text-3xl font-bold flex items-center gap-2">
  <Users className="w-8 h-8 text-primary" />
  Platform Users
</h1>
```

---

## 🏷 Iconography (`lucide-react`)

We exclusively use the `lucide-react` library for dashboard icons.

- Use standard sizes like `w-5 h-5` or `w-4 h-4` alongside text blocks.
- Pair dangerous actions with a related danger icon (e.g., `<ShieldAlert />`, `<XCircle />`).
- Pair financial actions with money-related icons (e.g., `<Banknote />`, `<RefreshCw />`).
