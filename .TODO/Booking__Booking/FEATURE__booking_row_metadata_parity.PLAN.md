# Feature Plan: Booking Row Metadata Parity

## Feature Goal

Replace mock row enrichment data with real backend-provided booking display metadata to match table-level design parity.

## UX Behavior From Design

1. Each row displays stable real values for booking code, service title, category, client identity, provider identity.
2. Row metadata remains consistent between table mode and app-preview mode.
3. Search/filter targets real backend values, not synthetic placeholders.
4. If some metadata is missing, row still renders with safe fallback labels.

## Data Contracts Needed (API Endpoints / Schemas)

1. Extend existing list endpoint response:
- `GET /api/v1/bookings`

2. Extend `BookingRow` shape with additive fields:
- `booking_code: string | null`
- `service_title: string | null`
- `category_label: string | null`
- `client_display_name: string | null`
- `provider_display_name: string | null`
- `provider_short_name: string | null`

3. Shared schema updates:
- Extend `BookingRowSchema` in `packages/shared/src/schemas/bookings.ts`
- Keep fields optional/nullable for phased rollout

## Steps (Backend then Frontend)

### Backend

1. [@SysOp] Identify canonical sources for row display fields (bookings/tasks/profiles or view).
2. [@SysOp] Extend list query in `apps/api/src/routes/bookings.ts` to include joined display fields.
3. [@SysOp] Add schema-safe mapping for nullable metadata.
4. [@SysOp] Validate response with extended `BookingListResponseSchema`.
5. [@SecGuard] Ensure only allowed profile fields are exposed (no sensitive PII leakage).

### Frontend

1. [@AdminArchitect] Update booking types consumption after shared schema extension.
2. [@UIExpert] Replace `getBookingDisplayMock()` usage in table rows with real row fields.
3. [@UIExpert] Keep local fallback labels when nullable fields are absent.
4. [@UIExpert] Preserve current visual hierarchy and row alignment from Figma.
5. [@DataSmith] Retain mock helper only as temporary fallback utility during rollout.

## Tests (Unit / Integration / Smoke)

### Unit

1. Row display mapper tests for null-safe rendering.
2. Initials/short-name fallback tests when display names are absent.

### Integration

1. API list tests verify extended row payload shape.
2. RBAC tests ensure same access control after response extension.
3. Contract tests in shared schemas for optional/nullable new fields.

### Smoke

1. Verify table rows show real display metadata on Bookings page.
2. Verify row click navigation still opens correct detail.
3. Verify mixed datasets (with/without metadata) render without layout break.

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep new row fields additive and nullable to prevent breaking existing clients.
2. Keep mock fallback path in UI until all production rows have metadata coverage.
3. If joins impact performance, move enrichment to a DB view/materialized strategy before full rollout.
4. Validate no sensitive profile fields are added accidentally to list payload.
