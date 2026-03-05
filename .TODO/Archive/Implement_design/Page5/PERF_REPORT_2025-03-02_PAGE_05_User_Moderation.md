# Perf Report — PAGE 05 User Moderation

**Scope:** PAGE 05 + user routes.  
**Date:** 2025-03-02  
**Agent:** @PerfOpt

---

## Pagination

- **Verified in app code:** GET /users uses range(from, to) with PAGE_SIZE 10; count exact. Offset-based; acceptable for admin list.

## N+1

- **Verified in app code:** List users: single query profiles. Detail: Promise.all(getUserById, profiles select). No N+1 in moderation or force-logout (single RPC per request).

## Bundle / queries

- No new client-side bundles for moderation; users_api already used. RPC single round-trip per mutation.

## Indexes

- **Verified in SQL:** profiles.id used in RPC WHERE; primary key. No new index required for account_status for current “list/detail” usage. If main app filters by account_status for RLS, consider index on (account_status) where needed.

---

## Findings

- **Severity:** —  
- No performance blockers. Optional: index profiles(account_status) if main app queries by status at scale.
