# Code Warden Review — PAGE 05 User Moderation

**Scope:** PAGE 05 + user routes.  
**Date:** 2025-03-02  
**Agent:** @CodeWarden

---

## MVVM purity

- **Verified in dashboard code:** Views (UserDetail, UsersScreen) do not import Supabase or call `.from()`. They use VM state and VM actions (e.g. handleBan).
- **Verified in dashboard code:** use_user_actions.vm.ts calls banUser from users_api only; no DB access.

## Structure / God files

- users.ts (API): single plugin; ban/unban/suspend/force-logout are focused handlers. Acceptable.
- users_api.ts: list, detail, ban, unban, suspend, forceLogout, verify. Single responsibility (user API client). OK.

## What must not be done

- Do not add Supabase service role or createAdminClient in admin-ui.
- Do not move audit write out of RPC into API layer for these actions.

---

## Decision: **APPROVED**

No violations. MVVM preserved; no UI logic in Views for DB.
