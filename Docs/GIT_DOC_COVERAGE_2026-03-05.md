# Git Change Documentation Coverage (2026-03-05)

This matrix maps active source changes to updated documentation so the current git working set is documented.

## Covered source domains

| Source area | Primary paths | Documentation |
|---|---|---|
| Users list + profile + actions | `apps/admin-ui/src/features/users/**`, `apps/admin-ui/src/components/users/UserActionsMenu.tsx`, `apps/api/src/routes/users.ts`, `packages/shared/src/schemas/users.ts`, `packages/shared/src/schemas/investigation.ts` | `Docs/features/users.md`, `Docs/features/user-investigation.md`, `Docs/ADMIN_SECURITY_MANUAL.md`, `.TODO/Users__Users/MASTER_REPORT_2026-03-05_Users_Users.md` |
| Search UI + insights contracts | `apps/admin-ui/src/features/search/**`, `apps/api/src/routes/search.ts`, `packages/shared/src/schemas/search.ts` | `Docs/features/global-search.md`, `Docs/PAGE_11_search_discovery.md` |
| Dashboard overview | `apps/admin-ui/src/features/dashboard/**`, `apps/api/src/routes/dashboard.ts`, `packages/shared/src/schemas/dashboard.ts` | `Docs/features/dashboard-overview.md` |
| Logs page + API | `apps/admin-ui/src/features/logs/**`, `apps/api/src/routes/logs.ts`, `packages/shared/src/schemas/logs.ts` | `Docs/features/logs.md`, `Docs/ADMIN_DATABASE_REF.md` |
| Route wiring | `apps/admin-ui/src/routes/Users.tsx`, `UserDetail.tsx`, `DashboardIndex.tsx`, `Logs.tsx` | `Docs/features/users.md`, `Docs/features/dashboard-overview.md`, `Docs/features/logs.md` |
| App shell/layout updates | `apps/admin-ui/src/components/layout/Header.tsx`, `Sidebar.tsx`, `apps/admin-ui/src/components/ui/button.tsx` | `Docs/ADMIN_UI_KIT.md`, `Docs/ADMIN_DEVELOPER_GUIDE.md` |
| Shared setup/security architecture | Monorepo + env + trust boundaries | `Docs/ADMIN_DEVELOPER_GUIDE.md`, `Docs/ADMIN_SETUP_GUIDE.md`, `Docs/ADMIN_SECURITY_MANUAL.md`, `Docs/ADMIN_DATABASE_REF.md` |

## Notes

- Generated build artifacts under `dist/` are excluded from feature documentation requirements.
- `.TODO/` planning and report files are documented by their own report chain and master report.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
