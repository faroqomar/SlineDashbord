# Perf Report — PAGE 06 & PAGE 07

**Scope:** PAGE 06 (Force Logout) + PAGE 07 (Bookings Admin)  
**Date:** 2025-03-02  
**Agent:** @PerfOpt per Orchestrator pipeline

---

## 1. Pagination Strategy

| Endpoint | Strategy | Evidence |
|----------|----------|----------|
| GET /api/v1/bookings | **Offset** (range from/to) | **Verified in dashboard code:** `bookings.ts` uses `(page - 1) * pageSize` and `.range(from, to)`. |
| Recommendation | For large tables (>10k rows), consider cursor-based pagination (e.g. cursor on `created_at, id`) to avoid offset cost. | Task only; no change required for current scope. |

---

## 2. N+1 Risk

| Area | Status | Evidence |
|------|--------|----------|
| Bookings list | **Low** | **Verified in dashboard code:** Single query on `bookings` with select list; no per-row profile fetch. List does not join profiles (client_id/provider_id are UUIDs only). |
| Booking detail | **Low** | **Verified in dashboard code:** Single `.select('*').eq('id', bookingId).single()`. |
| Force logout | **N/A** | Single RPC call. |

---

## 3. Bundle / Client

- Bookings and force-logout do not add heavy new deps. Shadcn AlertDialog, Table, Select already in use elsewhere.
- **Verified in dashboard code:** No large JSON or inline data in route components.

---

## 4. Indexes (Recommendations as Tasks)

| Table | Suggested index | Reason |
|-------|-----------------|--------|
| bookings | (status, created_at DESC) or (created_at DESC) | List filters by status and orders by created_at. |
| audit_logs | Existing (related_entity_type, related_entity_id) | Idempotency check in admin_refund_booking queries by action + related_entity_id + meta key. |

No code change in scope; recommend DB owner to add if not present.

---

*Report produced per Orchestrator pipeline.*
