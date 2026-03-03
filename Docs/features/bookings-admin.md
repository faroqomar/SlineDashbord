# Bookings Admin (PAGE 07)

> **Status**: v1  
> **Last Updated**: 2025-03-02

## Purpose

Admins can list bookings, open a booking detail, cancel a booking (with reason), and refund a booking (with reason and optional idempotency key). All mutations write exactly one `audit_logs` row atomically via DB RPCs.

**Who it's for**: Moderators (list, detail, cancel); Admins and Super Admins (list, detail, cancel, refund).

---

## Routes / Screens

| Route | Component | Description |
|-------|-----------|-------------|
| `/bookings` | `BookingsPage` (Bookings.tsx) | Paginated list with status filter; links to detail. |
| `/bookings/$bookingId` | `BookingDetailPage` (BookingDetail.tsx) | Detail card; Cancel and Refund actions with confirmation dialogs. |

Sidebar: **Bookings** entry under Finance.

---

## API

| Method | Path | RBAC | Description |
|--------|------|------|-------------|
| GET | `/api/v1/bookings` | moderator, admin, super_admin | List bookings (query: page, pageSize, status). |
| GET | `/api/v1/bookings/:bookingId` | moderator, admin, super_admin | Booking detail. |
| POST | `/api/v1/bookings/:bookingId/cancel` | moderator, admin, super_admin | Cancel booking; body: `{ reason }`. |
| POST | `/api/v1/bookings/:bookingId/refund` | admin, super_admin | Refund booking; body: `{ reason, idempotency_key? }`. |

All request/response shapes are defined in `packages/shared/src/schemas/bookings.ts`.

---

## ViewModels

- **useBookingsViewModel** (`features/bookings/viewmodels/use_bookings_viewmodel.ts`): List state (bookings, count, totalPages, filters), detail state (selectedBooking), actions (fetchList, loadDetail, cancel, refund). Calls `bookingsApi` only; no DB or Supabase.

---

## Special Rules

- **RBAC**: Refund is restricted to admin and super_admin; list/detail/cancel allow moderator.
- **Audit**: Cancel and refund are implemented via RPCs that perform the mutation and insert one `audit_logs` row in the same transaction. The API does not use `withAudit`.
- **Idempotency**: Refund supports optional `idempotency_key` in body; RPC deduplicates by key so replay returns success without double-processing.
- **Destructive actions**: Cancel and Refund use confirmation dialogs with required reason (Shadcn AlertDialog).

---

## DB / Migrations

- **20260302120000_admin_booking_rpcs.sql** (dashboard repo): Defines `admin_cancel_booking` and `admin_refund_booking`. For production with a shared DB, equivalent SQL can be added to **sline_app** so the app repo remains source of truth. See `MIGRATIONS/README.md`.

---

*This document is part of the Admin documentation suite. Maintained per `.agent/workflows/architecture/doc_keeper.md`. See `Docs/ADMIN_DEVELOPER_GUIDE.md` for the documentation index.*
