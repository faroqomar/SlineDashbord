---
description: You are `@DocKeeper`. Your mission is to create a complete, developer-grade documentation suite for the `sline_admin` (Next.js 15) project, mirroring the high standards of the `sline_app` documentation.
---

Generate Admin Dashboard Documentation

**Goal**: You are `@DocKeeper`. Your mission is to create a complete, developer-grade documentation suite for the `sline_admin` (Next.js 15) project, mirroring the high standards of the `sline_app` documentation.

**Context**:
This is a mission-critical Admin Dashboard for a Freelance Marketplace. It uses:

- **Framework**: Next.js 15 (App Router, Server Actions).
- **Backend**: Supabase (Service Role Key, RLS Bypass).
- **UI**: Shadcn/UI + Tailwind CSS.
- **Security**: Strict RBAC, Audit Logging, Zod Validation.

---

## 📂 Required Output Files

Please generate the following 5 markdown files. Do not summarize; be exhaustive.

### 1. `ADMIN_DEVELOPER_GUIDE.md` (The Bible)

**Focus**: How to build features.

- **Architecture**: Explain the "Service -> ViewModel -> View" pattern in Next.js.
- **Server Actions**: How to write a secure action (Zod + Auth Check + DB Call + Audit).
- **Client Components**: How to use `useViewModel` hook.
- **State Management**: When to use React State vs URL State.
- **Code Snippets**: Provide a "Copy-Paste" template for a standard CRUD feature (List, Detail, Create, Update).

### 2. `ADMIN_SECURITY_MANUAL.md` (The Shield)

**Focus**: Security protocols and strict rules.

- **Service Role**: explain WHY we use it and HOW we protect it (Server-side only).
- **RBAC**: Document the `verifyAdminRole()` function and middleware rules.
- **Audit Logs**: Explain the mandatory `admin_logs` table (Schema: Actor, Action, Target, Metadata).
- **Data Isolation**: Rules for not corrupting `sline_app` user data.
- **Destructive Actions**: The "Reason Required" protocol for bans and refunds.

### 3. `ADMIN_DATABASE_REF.md` (The Brain)

**Focus**: Database schema specific to Admin needs.

- **Tables**: List all tables the Admin touches (`profiles`, `jobs`, `admin_logs`, `disputes`).
- **Enums**: Document `UserRole`, `JobStatus`, `DisputeStatus`.
- **RLS Bypasses**: Explicitly list which RLS policies are bypassed by the Service Role and why.
- **Type Generation**: Command to run (`supabase gen types`) and how to use `Database` type.

### 4. `ADMIN_UI_KIT.md` (The Face)

**Focus**: Design System and Components.

- **Theme**: Colors (Primary, Destructive, Muted), Fonts (Inter).
- **Components**: List available Shadcn components (`Button`, `Table`, `Dialog`, `Form`).
- **Layouts**: Document `DashboardLayout`, `Sidebar`, `PageHeader`.
- **Icons**: Lucide icon usage guide.

### 5. `ADMIN_SETUP_GUIDE.md` (The Handle)

**Focus**: Getting started for new devs.

- **Prerequisites**: Node.js, npm, Supabase CLI.
- **Installation**: `npm install`.
- **Environment**: List all required `.env.local` variables (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.).
- **Running**: `npm run dev`.
- **Deployment**: Vercel deployment checklist.

---

## 💡 Critical "Do Not Miss" Checklist

Ensure the documentation explicitly covers:

1.  **"No Throw" Rule**: Server actions must return `{ success: false, error: ... }`, never throw.
2.  **Zod Validation**: MUST be the first line of every Server Action.
3.  **Type Safety**: No `any`. Use generated Supabase types.
4.  **Middleware**: How `middleware.ts` protects `/admin` routes.
5.  **Direct DB Access**: Forbidding `supabase-js` usage in Client Components.

**Tone**: Authoritative, Technical, Concise. Use emojis for sections. use "Access Denied" alerts for security warnings.

---

## 🔄 Continuous Documentation Protocol

**Rule**: Every new feature implemented MUST have its own dedicated documentation file.

- **Location**: `docs/features/[feature_name].md`
- **Trigger**: When a feature reaches "v1" or "MVP" status.

### Feature Documentation Template

When creating a feature doc, use this structure:

```markdown
# [Feature Name]

## Overview

What does this feature do? Who is it for?

## Architecture

- **Components**: List key UI components.
- **Actions**: List Server Actions used.
- **Models**: Link to data models.

## How It Works

Step-by-step flow of the feature (e.g., "User clicks button -> Action validates -> DB updates -> UI refreshes").

## Future Work

- [ ] Known limitations
- [ ] Planned enhancements
```
