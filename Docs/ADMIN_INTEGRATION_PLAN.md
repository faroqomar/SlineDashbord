# SLine Admin Dashboard Integration Plan (Rules + Guardrails for AI)

## Purpose

Build an Admin Dashboard that controls SLine safely without mixing concerns between:
• User App (mobile/web client used by normal users)
• Admin Dashboard (internal tool for privileged operations)

This document defines strict rules so an AI agent cannot accidentally:
• expose sensitive data,
• bypass security,
• corrupt production data,
• or create duplicated business logic.

⸻

## 1) Source of Truth and Environment Rules

### 1.1 Single Source of Truth

    •	One Supabase project per environment is the source of truth (no syncing between projects).
    •	The Admin Dashboard and the User App share the same Supabase project in each environment.

### 1.2 Environments

You must always have at least:
• Production (real users, real money, real operations)
• Preview/Branch (Supabase Branching) for every feature or risky change

**Rules**
• Never test RLS, schema changes, or admin actions directly on production.
• Every feature must be built and validated on a Supabase branch first, then merged.

### 1.3 No Data Copying / No Syncing

    •	The dashboard must never maintain its own database copy.
    •	Never create “admin-only duplicate tables” that mirror user tables unless it is explicitly a logging/analytics derived store.

⸻

## 2) Separation Model (How We “Separate” Dashboard vs App)

Separation is achieved by access boundaries, not by separate databases.

### 2.1 Identity Separation

    •	User App users authenticate normally via Supabase Auth.
    •	Admin users authenticate via Supabase Auth as well, but must be explicitly registered in DB.

**Rule**
• An account is not an admin unless it exists in admin_users.

### 2.2 Permission Separation (RBAC)

    •	Admin roles are stored in DB:
    •	`admin_users(user_id, role, created_at, …)`
    •	Roles:
    •	super_admin, admin, moderator, support

**Rule**
• Authorization is always loaded from DB (admin_users) — never from client claims or UI state.

### 2.3 Data Access Separation

There are two safe patterns. Choose ONE and apply it consistently:

**Pattern A (Recommended for strict safety): “Server-only Admin Data Access”**
• The Admin Dashboard never queries the database directly from the browser, even for reads.
• All reads/writes happen through Next.js Server Actions / Route Handlers.

**Benefits**
• Strong boundary, centralized logging, fewer leaks.

**Pattern B: “Hybrid”**
• User-visible data reads can use RLS via anon key.
• Admin-sensitive reads and all writes must go through server.

**Rule (mandatory)**
• All privileged actions (ban/refund/force changes/export/broadcast) must be server-side only.

⸻

## 3) Keys and Secrets (Hard Rules)

### 3.1 Public Key Use (Anon)

    •	User App uses only:
    •	SUPABASE_URL
    •	SUPABASE_ANON_KEY
    •	Browser code must never have access to service keys.

### 3.2 Privileged Key Use (Service Role)

    •	Admin privileged operations can use:
    •	SUPABASE_SERVICE_ROLE_KEY
    •	This key may only exist on the server (Next.js server runtime).

**Absolute Rules**
• Service Role key must never appear in:
• client bundles,
• browser env vars (NEXT*PUBLIC*\*),
• ViewModels,
• UI components,
• logs printed to the client.

⸻

## 4) Database Security (RLS + Admin Safety)

### 4.1 RLS Is Mandatory

    •	All user-facing tables must have RLS enabled.
    •	Admin-only tables must have RLS enabled too.

### 4.2 Admin Tables Are Not Visible to Regular Users

Tables like:
• admin_users
• audit_logs
• system_config
must be protected by RLS so normal users cannot access them.

### 4.3 Admin Actions Must Not Rely on RLS Alone

    •	RLS protects the public API.
    •	Admin actions must additionally enforce RBAC at the server boundary.

**Rule**
• Every admin endpoint/action performs: 1. Auth verification 2. Role check (from admin_users) 3. Input validation 4. Execution 5. Audit logging

⸻

## 5) Backend Boundary (The Only Allowed Write Path)

### 5.1 Write Operations Policy

**User App writes**
• allowed via Supabase anon key + RLS (normal app flow)

**Admin writes**
• must go through server-only actions:
• Next.js Server Actions / Route Handlers (preferred)
• (Optional later) FastAPI for heavy jobs

**Rules**
• The Admin Dashboard browser must never execute direct writes to critical tables.
• No client-side “update/insert/delete” calls for admin operations.

⸻

## 6) Audit Logging (Non-Negotiable)

### 6.1 Audit Everything Dangerous

Any action that changes state must create an audit entry:
• ban/unban
• refunds/releases/holds
• dispute decisions
• force cancel / force status changes
• exports
• broadcasts
• role changes

### 6.2 Audit Record Requirements

Each admin action must log:
• actor_admin_user_id
• actor_role
• action_type
• target_type, target_id
• before and after JSON
• reason (required for destructive actions)
• request_id
• created_at
• (optional) ip, user_agent

**Rule**
• If audit logging fails, the action must fail. No silent changes.

⸻

## 7) Data Contract Rules (To Prevent “Mixed Meaning”)

### 7.1 Shared Models Must Be Authoritative

    •	Use Zod schemas for action inputs.
    •	Derive TS types from Zod.

**Rules**
• No duplicated types with conflicting fields across dashboard and app.
• Every payload sent from UI to server must be validated by Zod.

### 7.2 No Business Logic Duplication

    •	“Truth” about workflows must live in one place:
    •	server actions / backend services
    •	UI must not implement business decisions.

**Examples of forbidden UI logic:**
• “If dispute status is X, allow refund”
• “If user has Y flags, ban automatically”
This must be server logic.

⸻

## 8) Folder Boundaries (AI Must Respect)

### 8.1 Allowed Responsibilities

    •	UI components: render only, no DB, no secrets
    •	ViewModels: state + calling server actions, no DB, no secrets, no auth decisions
    •	Server services/actions: all privileged logic, role checks, validation, audit

### 8.2 Forbidden Imports

    •	UI / ViewModels must never import:
    •	service role client
    •	raw DB adapters
    •	secret envs
    •	RLS-bypass code

⸻

## 9) Operational Guardrails (Performance + Safety)

### 9.1 Pagination Required Everywhere

    •	Every table must be server-side paginated.
    •	Never fetch unlimited rows.

### 9.2 Bulk Operations Safety

    •	Bulk actions must have:
    •	max limit per request (e.g., 200)
    •	confirmation step
    •	audit meta containing the affected IDs

### 9.3 Export Safety

    •	Exports must be server-only.
    •	Rate-limited.
    •	Logged.

⸻

## 10) Supabase Branching Workflow (Mandatory)

For every feature: 1. Create a Supabase branch 2. Apply DB migrations only on the branch 3. Point dashboard env to the branch keys 4. Run QA + SecGuard checks 5. Merge branch to main 6. Deploy production

**Rules**
• No manual production SQL changes.
• All schema changes must be migrations committed to repo.

⸻

## 11) “Never Do” List (AI Safety Hard Stops)

The AI must NEVER:
• expose Service Role key to client code
• write admin actions as client-side Supabase calls
• bypass RBAC because “UI hides the button”
• add admin role into JWT metadata as the source of truth
• change production schema/policies without branching + review
• implement business rules inside UI/ViewModels
• perform destructive actions without:
• confirmation UI
• reason
• audit log
• role check

⸻

## 12) Minimal Implementation Sequence (Safe Start)

    1.	Create admin_users + audit_logs + RLS on a Supabase branch
    2.	Implement server-side getAdminContext():
    •	verifies session
    •	loads role from admin_users
    3.	Implement middleware guard for /admin/*
    4.	Build layout + navigation (safe, no DB writes)
    5.	Build read-only Users list (paginated)
    6.	Add first privileged action: Ban/Unban (server-only + audit + reason)
    7.	Add Audit Logs page to verify traceability
