# Docs Report — PAGE 05 User Moderation

**Scope:** PAGE 05 + user routes.  
**Date:** 2025-03-02  
**Agent:** @DocKeeper

---

## Documentation delta

- **Verified in dashboard code:** MIGRATIONS/README.md documents PAGE 05 (profiles columns, RPC admin_set_user_moderation, enforcement note for main app). No broken refs.

## New feature doc

- Optional: docs/features/user-moderation.md describing ban/unban/suspend and force-logout (API + main-app enforcement). Not required for gate.

## Outdated assumptions

- None. README states dashboard API returns account_status via profiles select; list/detail use select('*').

---

## Finding

- **Severity:** —  
- No doc blockers. MIGRATIONS/README is up to date for PAGE 05.
