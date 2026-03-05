# Perf Report — PAGE 06 Force Logout

**Scope:** PAGE 06 (force-logout API + RPC + UI).  
**Date:** 2025-03-02  
**Agent:** @PerfOpt

---

## Pagination

- N/A — Force-logout is a single-user mutation; no list endpoint added.

## N+1

- **Verified in app code:** One RPC call per request; no N+1. RPC does single UPDATE profiles + single INSERT audit_logs.

## Bundle / queries

- No new client bundles; UserDetail already loaded for user detail. Force-logout adds one POST per action; minimal payload.

## Indexes

- **Verified in SQL:** RPC updates by profiles.id (primary key). No new index required for force-logout.

---

## Findings

- **Severity:** —  
- No performance blockers for PAGE 06.
