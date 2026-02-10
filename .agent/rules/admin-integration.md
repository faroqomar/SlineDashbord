---
description: Critical Integration Rules and Safety Guardrails for SLine Admin Dashboard
globs: ["sline_admin/**", "src/**"]
alwaysApply: true
---

# SLine Admin Integration Rules (AI Compliance)

These rules are MANDATORY for all AI agents working on the SLine Admin Dashboard. Failure to follow these rules will result in security violations.

## 1. Source of Truth & Environment

- **Single Source of Truth**: Admin Dashboard and User App share the SAME Supabase project. NO SYNCING.
- **Environments**: Changes MUST be built on a Supabase Branch first. NEVER directly on Production.
- **No Data Copying**: Dashboard never has its own DB copy. No "admin-only duplicate tables" mirroring user tables.

## 2. Separation Model

- **Identity**: Admin users must exist in `admin_users` table. Auth via Supabase Auth + DB check.
- **RBAC**: Roles (`super_admin`, `admin`, etc.) stored in DB (`admin_users`). NEVER rely on client claims/UI state.
- **Data Access**: Pattern A (Server-Only) is standard. Admin dashboard does NOT query DB from browser directly. All reads/writes via Server Actions.

## 3. Keys & Secrets (HARD RULES)

- **Public**: `SUPABASE_URL`, `SUPABASE_ANON_KEY` only.
- **Privileged**: `SUPABASE_SERVICE_ROLE_KEY` is SERVER-ONLY.
- **ABSOLUTE BAN**: Service Role Key must NEVER appear in client bundles, browser env vars (`NEXT_PUBLIC_*`), ViewModels, UI components, or client logs.

## 4. Database Security

- **RLS**: Mandatory for ALL tables (User-facing AND Admin-only).
- **Admin Visibility**: `admin_users`, `audit_logs`, `system_config` must be RLS-protected from normal users.
- **Admin Actions**: MUST enforce RBAC at server boundary (verify session -> check role -> validate input -> execute -> audit).

## 5. Write Operations

- **Admin Writes**: MUST go through Server Actions / Route Handlers.
- **Constraint**: Admin Dashboard browser never executes direct writes to critical tables.

## 6. Audit Logging (NON-NEGOTIABLE)

- **Trigger**: Any state change (ban, refund, dispute decision, role change, etc.).
- **Requirement**: Log `actor_id`, `role`, `action`, `target`, `diff` (before/after), `reason`.
- **Failure Mode**: If audit fails, action MUST fail.

## 7. Operational Guardrails

- **Pagination**: Server-side pagination REQUIRED for all lists. No unlimited fetches.
- **Bulk Actions**: Must have cap (e.g., 200), confirmation, and batched audit.
- **Exports**: Server-only, rate-limited, logged.

## 8. "Never Do" List (Hard Stops)

The AI must NEVER:

1. Expose Service Role key to client code.
2. Write admin actions as client-side Supabase calls.
3. Bypass RBAC because "UI hides the button".
4. Add admin role into JWT metadata as source of truth.
5. Change production schema without branching.
6. Implement business rules inside UI/ViewModels.
7. Perform destructive actions without confirmation + reasoning + audit.

Ref: [Detailed Plan](file:///Users/eros/Dev/Eros_Projects/SlineDashbord/Docs/ADMIN_INTEGRATION_PLAN.md)
