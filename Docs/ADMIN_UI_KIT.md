# 🎨 ADMIN_UI_KIT (The Face)

> **Goal**: A consistent, professional, and accessible interface.

## 🎨 Theme

### Colors

We use Tailwind CSS variables defined in `global.css`.

- **Primary**: Brand color (Teal/Emerald). Used for main actions.
- **Destructive**: Red. Used for bans, deletions, and errors.
- **Muted**: Gray. Used for secondary text and backgrounds.
- **Background**: White (Light) / Dark Gray (Dark).

### Fonts

- **Sans**: `Inter` (Google Fonts).
- **Mono**: `JetBrains Mono` (for code/IDs).

---

## 🧩 Components (Shadcn/UI)

We use a curated set of components from [ui.shadcn.com](https://ui.shadcn.com).

### Core Inputs

- **`Button`**: Primary, Secondary, Ghost, Destructive variants.
- **`Input`**: Text fields.
- **`Select`**: Dropdowns.
- **`Switch`**: Toggles.
- **`Checkbox`**: Multi-select.
- **`Textarea`**: Long text.
- **`Form`**: Wrappers for React Hook Form + Zod.

### Data Display

- **`Table`**: The backbone of the dashboard.
- **`Badge`**: Status indicators (e.g., "Active", "Banned").
- **`Card`**: Containers for content sections.
- **`Avatar`**: User profile images.

### Feedback & Overlays

- **`Dialog`**: Modals for complex actions.
- **`Sheet`**: Side panels for filters/details.
- **`AlertDialog`**: Confirmations for destructive actions.
- **`Popover`**: Small overlays.
- **`Sonner`**: Toast notifications.

---

## 📐 Layouts

### `DashboardLayout`

- **Sidebar**: Navigation links.
- **Header**: Breadcrumbs, User Menu, Theme Toggle.
- **Main**: Content area with `max-w-7xl` centered.

---

## 🔮 Icons

We use **Lucide React**.

```tsx
import { User, Shield, AlertTriangle } from "lucide-react";

<User className="h-4 w-4" />;
```
