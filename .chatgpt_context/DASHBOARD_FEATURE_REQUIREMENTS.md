# Dashboard Feature Requirements

## Global Requirements

- [Verified in dashboard code] Global search, audit logs UI, exports, and observability are partially implied by current shared schemas and legacy screens, but not fully implemented in Vite parity. Refs: Zod schema names `GetSystemLogsSchema`, `ExportCSVSchema`, `EntityTraceSchema`, `UserLookupSchema` in `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/logs.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/finance.ts`; legacy pages in `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx`.
- [Missing repo evidence] A single global search contract spanning users, tasks, bookings, disputes, chats, and finance is not defined in shared schemas or app SQL. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas` and `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "global search|search_profiles|search_tasks|search_.*users|search_.*disputes"`.
- [Missing repo evidence] Export endpoints for logs, investigations, and analytics are not fully exposed by current Fastify routes. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes` with `rg -n "export|csv|download"`.

## User Review / Investigation Spec

- [Verified in dashboard code] The dashboard already exposes basic user review entry points through `/users` and `/users/$userId`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/Users.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/UserDetail.tsx`.
- [Verified in dashboard code] Legacy user review is broader than current Vite parity because the old user detail page includes wallet and audit tabs that the new route does not yet reproduce. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/users/[id]/page.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/routes/UserDetail.tsx`.
- [Verified in app code] Full investigation requires user activity from tasks, bids or offers, bookings, disputes, ledger, reports, work logs, and conversations because those domains are spread across app services and dashboard route queries. Refs: `/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/direct_offers/services/direct_offers_service.dart`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/booking/services/booking_service.dart`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/management/services/work_log_service.dart`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts`.
- [Verified in SQL] Conversations can already be grouped by task or direct offer using `conversations.task_id`, `messages.conversation_id`, and `direct_offers.conversation_id`. Refs: `/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart`, SQL object `public.direct_offers` in `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql`.
- [Missing repo evidence] Conversations grouped by booking are not verified in the inspected repos. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app` with `rg -n "booking.*conversation|conversation.*booking"`.
- [Missing repo evidence] Case-gated chat access, PII masking with explicit reveal flow, and reveal audit actions are not implemented as a general investigation workflow. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord` and `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "case|reveal|mask|chat access|redact_message"`.

## Module Requirements

### Users

- [Verified in dashboard code] Required pages: `/users`, `/users/$userId`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx`.
- [Verified in dashboard code] Required API endpoints already present: `GET /api/v1/users/`, `GET /api/v1/users/:userId`, `POST /api/v1/users/:userId/ban`, `POST /api/v1/users/:userId/unban`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts`.
- [Verified in dashboard code] Required shared input schemas already present: `GetUsersSchema`, `GetUserDetailsSchema`, `BanUserSchema`, `UnbanUserSchema`, `SuspendUserSchema`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/users.ts`.
- [Verified in dashboard code] Current audit action names in code are `user_ban` and `user_unban`, which do not match the stricter admin namespace used elsewhere. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/users.ts`.
- [Missing repo evidence] Required DB objects and RPCs for complete admin user management should include `public.admin_users`, `admin_suspend_user(...)`, `admin_ban_user(...)`, and `admin_force_logout_user(...)`, but app SQL evidence is missing. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "admin_users|admin_suspend_user|admin_ban_user|admin_force_logout_user"`.

### Tasks

- [Verified in dashboard code] Required pages: `/tasks`, `/tasks/$taskId`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx`.
- [Verified in dashboard code] Required API endpoints already present: `GET /api/v1/tasks/`, `GET /api/v1/tasks/:id`, `GET /api/v1/tasks/:id/activity`, `POST /api/v1/tasks/:id/status`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts`.
- [Verified in dashboard code] Required shared input schema already present: `UpdateTaskStatusSchema`. Refs: Zod schema `UpdateTaskStatusSchema` in `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/tasks.ts`.
- [Verified in dashboard code] Current audit action names are `admin.tasks.force_cancel` and `admin.tasks.update_status.<status>`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts`.
- [Verified in SQL] Required DB objects already participating in force-cancel flows are `public.tasks`, `public.task_requests`, `public.bookings`, and `public.process_payment_event_ledger(...)`. Refs: task objects as queried in `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/tasks.ts`; booking refund and payment SQL in `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260228_bookin_server_authority.sql`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260304_direct_offer_accept_then_pay.sql`.
- [Missing repo evidence] A dedicated atomic RPC `admin_update_task_status(...)` is missing in app SQL. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "admin_update_task_status"`.

### Bids / Direct Offers

- [Verified in SQL] Direct-offer review requires `public.direct_offers` because the app uses it as the negotiated-offer path with `conversation_id` and `payment_status`. Refs: SQL object `public.direct_offers` in `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260303_direct_offers_table_rls_trigger.sql`.
- [Verified in app code] Offer investigations require admin visibility into related work logs and ledger events because the app creates work logs and payment events around offer lifecycle transitions. Refs: `/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/direct_offers/services/direct_offers_service.dart`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/wallet/services/ledger_service.dart`.
- [Missing repo evidence] No current Vite route or Fastify route exposes direct-offer administration explicitly. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src` and `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes` with `rg -n "direct offer|direct_offer|offer"`.
- [Missing repo evidence] No shared Zod schema currently defines direct-offer admin filters or mutations. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas` with `rg -n "offer|bid"`.

### Bookings

- [Verified in app code] Booking administration is operationally necessary because the app has server-authoritative booking payment creation and refund finalization flows. Refs: `/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/booking/services/booking_service.dart`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260228_bookin_server_authority.sql`.
- [Missing repo evidence] No current dashboard page or API route provides dedicated booking administration. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src` and `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes` with `rg -n "booking"`.
- [Missing repo evidence] Required admin RPCs `admin_cancel_booking(...)` and `admin_refund_booking(...)` are not present in app SQL evidence. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "admin_cancel_booking|admin_refund_booking"`.
- [Missing repo evidence] Required audit action names should include `admin.bookings.cancel` and `admin.bookings.refund`, but no repo evidence defines them. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord` and `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "admin\\.bookings\\.(cancel|refund)"`.

### Disputes / Reports

- [Verified in dashboard code] Required pages: `/disputes`, `/disputes/$disputeId`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx`.
- [Verified in dashboard code] Required API endpoints already present: `GET /api/v1/disputes/`, `GET /api/v1/disputes/:id`, `POST /api/v1/disputes/:id/resolve`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts`.
- [Verified in dashboard code] Required shared input schema already present: `UpdateDisputeStatusSchema`. Refs: Zod schema `UpdateDisputeStatusSchema` in `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/disputes.ts`.
- [Verified in dashboard code] Current audit action name is `admin.disputes.resolve`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts`.
- [Verified in dashboard code] The current route calls RPC `admin_resolve_dispute(...)` only for the `resolved` path with a `decision`, and falls back to direct table updates otherwise. Refs: RPC name `admin_resolve_dispute` in `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/disputes.ts`.
- [Missing repo evidence] App SQL creation of `admin_resolve_dispute(...)` is not found in the inspected migrations. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "admin_resolve_dispute"`.

### Chat Moderation

- [Verified in app code] Chat inspection requires access to `conversations`, `messages`, `start_task_conversation_v1`, `archive_conversation_v1`, and `can_access_chat_attachment(...)`. Refs: `/Users/eros/Dev/Eros_Projects/Sline/sline_app/lib/features/chat/services/message_service.dart`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260302_chat_archive_rpc_and_storage_helper.sql`.
- [Missing repo evidence] No current Vite pages or Fastify endpoints provide chat moderation screens or moderation APIs. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src` and `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes` with `rg -n "chat|message|conversation|attachment"`.
- [Missing repo evidence] Required admin RPCs `admin_redact_message(...)`, `admin_delete_message_attachment(...)`, `admin_create_case_for_chat_access(...)`, and `admin_grant_case_chat_access(...)` are not present in app SQL evidence. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "admin_redact_message|admin_delete_message_attachment|admin_create_case_for_chat_access|admin_grant_case_chat_access"`.
- [Missing repo evidence] Required audit action names should include `admin.chat.message_redact`, `admin.chat.attachment_delete`, `admin.investigation.case_create`, and `admin.investigation.case_chat_access_grant`, but no repo evidence defines them. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord` and `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "admin\\.chat|admin\\.investigation"`.

### Finance / Ledger / Wallet

- [Verified in dashboard code] Required pages currently present: `/finance`, `/finance/transactions`, `/finance/withdrawals`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx`.
- [Verified in dashboard code] Required pages still missing for full parity: `/finance/audit` and `/finance/users`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/audit/page.tsx`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/finance/users/page.tsx`.
- [Verified in dashboard code] Required API endpoints already present: `POST /api/v1/finance/withdrawals/:requestId/approve`, `POST /api/v1/finance/withdrawals/:requestId/reject`, `POST /api/v1/finance/wallets/:userId/freeze`, `GET /api/v1/finance/metrics`, `GET /api/v1/finance/transactions`, `GET /api/v1/finance/withdrawals`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts`.
- [Verified in dashboard code] Current audit action names are `admin.finance.withdrawal_approve`, `admin.finance.withdrawal_reject`, and `admin.finance.wallet_freeze`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/finance.ts`.
- [Verified in SQL] Required DB objects are `public.accounts`, `public.journal_entries`, `public.ledger_lines`, `public.withdrawal_requests`, `public.audit_logs`, `public.vw_financial_metrics_realtime`, `public.vw_wallet_balances_user`, `public.vw_wallet_activity_user`, and `public.process_payment_event_ledger(...)`. Refs: `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_ledger_core_schema.sql`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_wallet_views.sql`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260225_create_process_payment_event_ledger_rpc.sql`, `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations/20260304_direct_offer_accept_then_pay.sql`.
- [Missing repo evidence] Required admin RPCs `admin_freeze_wallet(...)`, `admin_unfreeze_wallet(...)`, and `admin_adjust_wallet(...)` are not present as verified app SQL function names. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "admin_freeze_wallet|admin_unfreeze_wallet|admin_adjust_wallet|admin_process_wallet_freeze"`.
- [Missing repo evidence] Dual approval for dangerous finance actions is not implemented. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src` and `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "approval|approver|dual"`.

### Settings / Feature Flags

- [Verified in dashboard code] Required page present: `/settings`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/App.tsx`.
- [Verified in dashboard code] Shared contracts already exist for `SystemConfigSchema`, `MaintenanceModeSchema`, and `AppBannerSchema`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/settings.ts`.
- [Verified in dashboard code] Legacy settings logic still depends on Next server-action helpers, so the Vite migration is incomplete. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/admin-ui/src/features/settings/services/settings_actions.ts`.
- [Missing repo evidence] No current Fastify route file exposes settings or feature-flag endpoints. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes` with `rg -n "settings|config|feature flag|maintenance"`.
- [Missing repo evidence] App SQL backing objects for admin-managed settings are not verified. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "system_config|maintenance|banner|feature_flag"`.

### Analytics

- [Verified in dashboard code] Dashboard analytics currently rely on `GET /api/v1/dashboard/overview` and shared DTOs `OverviewStats`, `ActivityItem`, `PendingItem`, `RevenueChartData`, and `UserGrowthChartData`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes/dashboard.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/analytics.ts`.
- [Missing repo evidence] The analytics SQL views `public.vw_analytics_monthly_revenue` and `public.vw_analytics_monthly_user_growth` are referenced by dashboard code but not verified in app migrations. Search `/Users/eros/Dev/Eros_Projects/Sline/sline_app/supabase/migrations` with `rg -n "vw_analytics_monthly_revenue|vw_analytics_monthly_user_growth"`.
- [Missing repo evidence] No explicit audit action namespace exists for analytics exports or report access. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord` with `rg -n "analytics.*audit|report.*audit|export.*audit"`.

### Audit Logs / Observability / Exports

- [Verified in dashboard code] A logs module is still expected because shared log schemas exist and the legacy dashboard includes `/dashboard/logs`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/packages/shared/src/schemas/logs.ts`, `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/logs/page.tsx`.
- [Verified in dashboard code] A system-health or observability surface is still expected because the legacy dashboard includes `/dashboard/system-health`. Refs: `/Users/eros/Dev/Eros_Projects/SlineDashbord/legacy-source/src/app/dashboard/system-health/page.tsx`.
- [Missing repo evidence] The current Fastify API does not expose `/logs`, `/system-health`, or export endpoints. Search `/Users/eros/Dev/Eros_Projects/SlineDashbord/apps/api/src/routes` with `rg -n "logs|health|export|csv"`.
