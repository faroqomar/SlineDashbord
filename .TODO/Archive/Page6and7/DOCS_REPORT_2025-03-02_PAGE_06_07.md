# Docs Report — PAGE 06 & PAGE 07

**Scope:** PAGE 06 (Force Logout) + PAGE 07 (Bookings Admin)  
**Date:** 2025-03-02  
**Agent:** @DocKeeper per Orchestrator pipeline

---

## 1. Documentation Delta

| Doc | Status | Note |
|-----|--------|------|
| **MIGRATIONS/README.md** | **Verified in dashboard code:** Exists; migration order and app-repo ownership noted. | Consider adding PAGE 07 bookings migration filename (20260302120000_admin_booking_rpcs.sql) to migration list if not already. |
| **MIGRATIONS/for_sline_app/README.md** | **Verified in dashboard code:** References force_logout migration and FORCE_LOGOUT_APP_ENFORCEMENT.md. | — |
| **MIGRATIONS/for_sline_app/FORCE_LOGOUT_APP_ENFORCEMENT.md** | **Verified in dashboard code:** Exists; describes app must read profiles.force_logout_after and force re-auth. | PAGE 06 DoD satisfied. |

---

## 2. New Feature Docs (Optional)

| Feature | Recommendation |
|---------|----------------|
| Bookings Admin | Optional: add `docs/features/bookings-admin.md` (or section in existing admin features doc) describing list/detail/cancel/refund and RBAC (moderator vs admin/super_admin for refund). |
| Force Logout | Already documented in FORCE_LOGOUT_APP_ENFORCEMENT.md and plan. |

---

## 3. Broken Refs / Outdated Assumptions

- No broken refs identified in scope.
- **MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md** (PAGE 06, PAGE 07) is the source of truth; implementation aligns with described outcomes.

---

*Report produced per Orchestrator pipeline.*
