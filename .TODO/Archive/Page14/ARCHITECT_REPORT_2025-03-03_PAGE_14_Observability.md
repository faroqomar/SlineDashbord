# Architect Report — PAGE 14 Observability / System Health

**Scope:** PAGE_14_Observability_System_Health  
**Date:** 2025-03-03  
**Agent:** @AdminArchitect  
**Evidence:** Verified in dashboard code

---

## MVVM boundary check

| Layer | Path | Status | Notes |
|-------|------|--------|-------|
| View | `apps/admin-ui/src/features/system-health/views/SystemHealthView.tsx` | ✅ | Dumb: uses only `useSystemHealth()` and UI components; no API/DB calls. Route `SystemHealth.tsx` is a thin shell. |
| ViewModel | `apps/admin-ui/src/features/system-health/viewmodels/useSystemHealth.ts` | ✅ | State only: loading, error, data, refetch; calls `observabilityApi` only. |
| Service (API client) | `apps/admin-ui/src/features/system-health/services/observability_api.ts` | ✅ | Calls `request()` to GET /observability; no Supabase/server imports. |

**Verdict:** MVVM boundaries respected. View does not call API or DB; VM does not contain view logic.

---

## Route parity

- **TanStack Router:** Route `/system-health` registered in `App.tsx` under `authLayoutRoute`. Verified in dashboard code.
- **Navigation:** Sidebar nav item "System Health" → `/system-health` in `Sidebar.tsx`. Verified in dashboard code.

---

## Contract needs

- **Schemas:** `ObservabilityResponseSchema`, `ServiceStatusSchema`, optional `rpcStatus`/`queueStatus`/`errorRates` live in `packages/shared/src/schemas/observability.ts`. Exported from shared index. No missing contract for this scope.

---

## Exact file paths (structure)

```
apps/admin-ui/src/
  routes/SystemHealth.tsx          (thin shell → SystemHealthView)
  features/system-health/
    services/observability_api.ts
    viewmodels/useSystemHealth.ts
    views/SystemHealthView.tsx
apps/api/src/routes/observability.ts
packages/shared/src/schemas/observability.ts, observability.test.ts
```

---

## Findings

- **MED:** None. Architecture is aligned with plan and MVVM.
- **LOW:** ~~Optional: consider a dedicated `features/system-health/views/`~~ **Addressed:** `features/system-health/views/SystemHealthView.tsx` added; route is thin shell.

**Post-report fix (security):** API 500 handler no longer sends raw `err.message` to client; generic "An error occurred" returned; full error logged server-side only.

---

**Decision:** APPROVED ✅
