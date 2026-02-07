# SLine Admin Dashboard - Comprehensive Detailed Master Plan

> **Core Objective**: Build a robust, secure, and pixel-perfect Admin Dashboard for SLine.
> **Philosophy**: "Visual Perfection First, Logic Integration Second."
> **Strict Rule**: The Admin Dashboard data flow must be **completely isolated** from the main application's client-side logic to prevent data overlap or corruption.

---

## 🤖 Agent Roster & Responsibilities

| Agent Tag      | Role          | Workflow File        | Responsibility                                          |
| :------------- | :------------ | :------------------- | :------------------------------------------------------ |
| **@Architect** | **Tech Lead** | `admin_architect.md` | MVVM Structure, Folder conventions, Logic validation.   |
| **@UIExpert**  | **Frontend**  | `ui_expert.md`       | Tailwind, Shadcn, Animations, Pixel-perfect UI porting. |
| **@SysOp**     | **Backend**   | `sys_op.md`          | Supabase, Server Actions, Database, RLS.                |
| **@SecGuard**  | **Security**  | `sec_guard.md`       | Auth Guard, Audit Logs, permission checks.              |
| **@QA**        | **Testing**   | `qa_tester.md`       | Verification, Bug hunting, UI Consistency check.        |
| **@DocKeeper** | **Scribe**    | `doc_keeper.md`      | Keeping docs in sync with code.                         |

---

## 🚀 Phase 1: The Visual Twin (Frontend Reconstruction)

**Goal**: Create a pixel-perfect, interactive clone of the `Dasbord_Design` using Next.js.
**Constraint**: **ZERO BACKEND CONNECTION**. All data must be hardcoded "Dummy Data" within the ViewModels or Mock Data files. This ensures the UI is perfect before we introduce logic complexity.
**Strict Rule**: No `supabase-js` imports, no API calls, no `useEffect` data fetching. Pure UI components rendering props.

### 🆕 Sub-Phase 1.1: Foundation & Design System

**Objective**: Set up the project skeleton and styling engine to match `Dasbord_Design` 1:1.

- [x] **Project Configuration**:
  - Verify `sline-admin-temp` is running Next.js 15+ (App Router).
  - Ensure `tsconfig.json` has `strict: true` and path aliases configured (`"@/*": ["./src/*"]`).
  - **Action**: Clean `src/app/page.tsx` and `src/app/layout.tsx` to remove default Next.js boilerplate.
- [x] **Tailwind & CSS Migration**:
  - **Config**: Port `Dasbord_Design/tailwind.config.ts` to `tailwind.config.ts`.
    - _Critical_: Preserve all `extend.colors` (sidebar, chart, etc.) and `extend.animation`.
  - **Global Styles**: Copy `Dasbord_Design/src/index.css` to `src/app/globals.css`.
    - _Critical_: Ensure all `@layer base` CSS variables (HSL values) are present.
  - **Fonts**: Setup `Inter` via `next/font/google` in `layout.tsx`.
- [x] **Shadcn Core Integration**:
  - Run `npx shadcn@latest init` (if not done).
  - **Batch Install Components**:
    `npx shadcn@latest add button card input dropdown-menu badge avatar table sheet dialog select tabs scroll-area calendar popover separator form`
  - **Verification**: Create `src/app/design-test/page.tsx` rendering every installed component to check style parity with Design System.

### 🆕 Sub-Phase 1.2: Shell Architecture (The Layout)

**Objective**: Build the responsive, collapsible layout frame.

- [x] **Layout Structure**:
  - Create `src/components/layout/DashboardLayout.tsx`.
  - Create `src/app/dashboard/layout.tsx` to wrap all dashboard routes.
- [x] **Sidebar Component** (`src/components/layout/Sidebar.tsx`):
  - **State**: `isCollapsed` (Zustand store or Context, to persist across navigations - _optional for MVP, local state ok_).
  - **Navigation Menu**:
    - Dashboard (Home Icon)
    - Users (Users Icon)
    - Disputes (Scale Icon)
    - Finance (Banknote Icon)
    - System Logs (FileText Icon)
    - Settings (Settings Icon)
  - **Active State**: Use `usePathname()` to highlight the current route.
- [x] **Header Component** (`src/components/layout/Header.tsx`):
  - **Breadcrumbs**: specific breadcrumb component based on route segments.
  - **Theme Toggle**: Use `next-themes` (ensure hydration safety).
  - **User Dropdown**: Static "Admin User" avatar + "Log out" button (visual only).
- [x] **Mobile Responsiveness**:
  - Implement `Sheet` (Drawer) from Shadcn for the Sidebar on mobile screens (`hidden md:block`).

### 🆕 Sub-Phase 1.3: Dashboard Overview (Command Center)

**Objective**: Build the landing page with high-level metrics.

- [x] **Mock Data Layer**:
  - Create `src/data/mock/overview.ts`.
  - Export typed constants: `MOCK_KPI_STATS`, `MOCK_REVENUE_DATA`, `MOCK_RECENT_ACTIVITY`.
- [x] **Smart Components**:
  - **StatsGrid**: 4-card grid displaying Total Revenue, Active Users, Pending Disputes, Active Jobs.
  - **RevenueChart**: `Recharts` AreaChart component (port from design).
  - **ActivityFeed**: List component with status indicators (Green=Success, Red=Issue, Blue=Info).
- [x] **Page Assembly**:
  - `src/app/dashboard/page.tsx`.
  - Import mock data -> Pass to Components -> Render.

### 🆕 Sub-Phase 1.4: User Management (The Directory)

**Objective**: Detailed tables and profile views for managing generic users.

- [x] **The User Table**:
  - **Mock Data**: `src/data/mock/users.ts` (Generate 50 users using a loop or faker-like static data).
  - **Columns**: Avatar+Name, Role (Badge), Status (Active/Suspended), Join Date, Actions (Three-dot menu).
  - **Features**:
    - **Pagination**: Client-side logic for the table.
    - **Filtering**: Text input for name, Dropdown for Role.
  - **Page**: `src/app/dashboard/users/page.tsx`.
- [x] **User Detail Profile**:
  - **Route**: `src/app/dashboard/users/[id]/page.tsx`.
  - **Header**: Large card with Profile Pic, "Ban User" (Red Button), "Reset Pass" (Ghost Button).
  - **Tabs**:
    - _Overview_: Key stats (Total Spend, Rating).
    - _History_: List of past jobs/transactions.
    - _Logs_: Mock audit logs for this user.

### 🆕 Sub-Phase 1.5: Disputes & Finance (Operations)

**Objective**: The core operational tools for Support Agents.

- [x] **Dispute Center** (`src/app/dashboard/disputes/page.tsx`):
  - **Kanban/List Toggle**: View disputes by status (Open, Investigating, Resolved).
  - **Dispute Detail View**:
    - **Chat Replica**: Visual mockup of a chat between Client/Freelancer (read-only).
    - **Admin Controls**: Panel with "Refund Client", "Release to Freelancer" buttons.
- [x] **Finance Treasury** (`src/app/dashboard/finance/page.tsx`):
  - **Transaction Table**: All system payments.
  - **Status Badging**: Pending (Yellow), Cleared (Green), Failed (Red).
  - **Mock Data**: `src/data/mock/finance.ts`.

### 🆕 Sub-Phase 1.6: System Logs & Settings

**Objective**: Observability and configuration controls.

- [x] **Global Settings**:
  - `src/app/dashboard/settings/page.tsx`.
  - **Toggles**: "Maintenance Mode", "Disable Signups", "Force Update".
  - **Visuals**: Use Shadcn `Switch` component.
- [x] **System Logs**:
  - `src/app/dashboard/logs/page.tsx`.
  - **Console View**: Dark-themed table looking like a terminal.
  - **Mock Data**: Log entries with Timestamps and Severity Levels.

## 🧠 Phase 2: The Neural Connection (Backend Integration)

**Goal**: Breathe life into the UI by connecting it to the **real SLine Supabase Project**.
**Constraint**: **STRICT DATA SEPARATION**. The Admin App must use the `Service Role Key` and effectively act as a "Super User". It must NEVER use the public/anon key methods used by the main app for data fetching.

### 🆕 Sub-Phase 2.1: The Secure Gateway (Server-Side Only)

**Objective**: Establish a secure, high-privilege connection tunnel that is physically impossible to leak to the client.

- [x] **Environment Security**:
  - Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`.
  - **GitGuardian Rule**: Verify `.gitignore` explicitly excludes `.env*.local`.
  - **Runtime Check**: Add a check in `next.config.ts` or a start-up script to fail the build if `SUPABASE_SERVICE_ROLE_KEY` is missing in production.
- [x] **Server Client Infrastructure**:
  - Install `server-only` package to prevent accidental client-side import.
  - Create `src/lib/supabase/admin.ts`:
    - Export `createAdminClient()` which initializes Supabase with `SUPABASE_SERVICE_ROLE_KEY`.
    - **CRITICAL**: Import `server-only` at the top of this file.
- [x] **Type Synchronization**:
  - Run `supabase gen types --project-id <sline-project-id> > src/types/supabase.ts`.
  - Create `src/types/admin-types.ts` to map database rows to UI-friendly interfaces (DTOs).

### 🆕 Sub-Phase 2.2: Read-Only Integration (Server Actions)

**Objective**: Replace Mock Data with Real Data using Next.js Server Actions.
_Note: All fetching happens on the server. Client components receive plain JSON._

- [ ] **Dashboard Metrics (`src/actions/dashboard.ts`)**:
  - `getOverviewStats()`:
    - Query `users` count.
    - Query `jobs` count (active vs completed).
    - Calculate total system revenue (sum of platform fees).
- [ ] **User Directory (`src/actions/users.ts`)**:
  - `getUsers(page: number, filters: UserFilter)`:
    - Implement server-side pagination (OFFSET/LIMIT).
    - Implement ILIKE search for names/emails.
    - Return `{ data: UserDTO[], count: number }`.
- [ ] **User Deep Verification (`src/actions/users.ts`)**:
  - `getUserFullProfile(id: string)`:
    - Parallel fetch: `profiles`, `auth.users` (admin API), `wallets`, `jobs` (as client), `jobs` (as freelancer).
    - **Safety**: Scrub sensitive headers or metadata before returning to UI.

### 🆕 Sub-Phase 2.3: Write Action Integration (Mutations)

**Objective**: Enable Admin Powers with mandatory Audit Logging.

- [x] **The Audit Logger** (`src/lib/audit.ts`):
  - Create internal helper `logAdminAction(adminId, actionType, targetId, metadata)`.
  - **Rule**: This function MUST be perfectly reliable. If logging fails, the action should ideally fail (or alert critical).
- [x] **User Management Actions** (`src/actions/mutations/user.ts`):
  - `banUser(reason: string)`:
    - Update `profiles.status` to 'banned'.
    - Kill active sessions (Revoke Refresh Token via Admin API).
    - calls `logAdminAction`.
  - `verifyIdentity()`: Manual override to mark a user as 'Verified'.
- [x] **Dispute Resolution** (`src/actions/mutations/dispute.ts`):
  - `resolveDispute(disputeId, decision, amount)`:
    - Uses Supabase RPC or Edge Function `admin_resolve_dispute` to ensure atomic transactions (money movement).
    - **NEVER** perform raw math on the client or simple row updates for money. Always use the secure backend function.

---

## 🛡️ Phase 3: The Safety Wall & Verification

**Goal**: Ensure the Admin Dashboard is safe, secure, and doesn't break the main app.
**Philosophy**: "Trust, but Verify." Automated checks are good, but manual smoke tests are mandatory for this financial tool.

### 🆕 Sub-Phase 3.1: Data Isolation Verification (QA Manual)

**Objective**: Verify that Admin actions don't corrupt user data or leak info.

- [x] **The "Overlap" Audit**:
  - Scan `src/types/admin-types.ts` vs Main App `database.types.ts`.
  - **Fail Condition**: If Admin App defines a field that doesn't exist in Prod DB, halt.
- [x] **Cross-Application Smoke Test**:
  - **Scenario A (Ban)**:
    1. Login to Main App as "User A".
    2. Login to Admin Panel as "Admin".
    3. Admin clicks "Ban User A".
    4. **Verify**: User A's session in Main App is terminated within 60s (RLS rejection).
  - **Scenario B (Refund)**:
    1. Note "Client B" wallet balance ($50.00).
    2. Admin processes $10.00 refund for "Job #123".
    3. **Verify**: Client B wallet is now $60.00.
    4. **Verify**: "Job #123" status is `refunded` in Main App.

### 🆕 Sub-Phase 3.2: Security Hardening (Automated)

**Objective**: Lock down the fortress with code.

- [x] **Middleware Defense (`src/middleware.ts`)**:
  - **Rule**: Intercept ALL requests to `/dashboard/*`.
  - **Check 1**: Session exists? If no -> Redirect to `/login`.
  - **Check 2**: `user.app_metadata.role === 'service_role'` OR `user.email` ends with `@sline.com`.
- [x] **Build-Time Sweeps**:
  - Add `npm run security-check` script.
  - **Step 1**: Grep for `SUPABASE_SERVICE_ROLE_KEY` in `src/app/*` (Client Components). Fail if found.
  - **Step 2**: Ensure `no-store` or `force-dynamic` is set on all Admin Pages to prevent caching sensitive data.

### 🆕 Sub-Phase 3.3: Production Deployment

**Objective**: Ship to Vercel with zero leaks.

- [x] **Vercel Project Setup**:
  - **Project Name**: `sline-admin-internal`.
  - **Framework**: Next.js.
  - **Build Command**: `next build`.
- [x] **Environment Constraints**:
  - Input `NEXT_PUBLIC_SUPABASE_URL` (Safe).
  - Input `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Safe - needed for Auth).
  - Input `SUPABASE_SERVICE_ROLE_KEY` (Secret).
  - **Check**: Enable "Automatically expose System Environment Variables" = OFF (if possible, or just be careful).
- [x] **Post-Deploy**:
  - Log in with the Master Admin account.
  - Verify the "Audit Log" correctly recorded the login event.
