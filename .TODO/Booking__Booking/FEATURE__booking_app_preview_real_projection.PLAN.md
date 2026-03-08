# Feature Plan: Booking App Preview Real Projection

## Feature Goal

Replace mock mobile app-preview payload with real booking-derived sections so App View reflects actual booking lifecycle data.

## UX Behavior From Design

1. App View carousel navigates bookings and shows detail card, participants, timeline, and notes.
2. Preview content is derived from real booking data and related entities.
3. App View keeps dedicated loading skeleton and empty state behavior.
4. If preview data is incomplete, section-level fallbacks appear without collapsing the entire phone frame.

## Data Contracts Needed (API Endpoints / Schemas)

1. Preferred new endpoint:
- `GET /api/v1/bookings/:bookingId/preview`

2. Preview response contract:
- `title`
- `location`
- `description`
- `schedule: { dateLabel; timeLabel; durationLabel }`
- `pricing: { servicePrice; platformFee; total; currency }`
- `participants: Array<{ role; name; rating }>`
- `timeline: Array<{ label; dateTime; tone }>`
- `notes`

3. Shared schema updates:
- Add `BookingPreviewSchema`
- Add `BookingPreviewParticipantSchema`
- Add `BookingPreviewTimelineItemSchema`

## Steps (Backend then Frontend)

### Backend

1. [@SysOp] Inventory available data sources for preview sections (bookings + related entities/events).
2. [@SysOp] Define preview schema in shared contracts and add route handler.
3. [@SysOp] Implement preview mapping with null-safe defaults for missing fields.
4. [@SysOp] Enforce booking read RBAC for preview endpoint.
5. [@SecGuard] Validate preview payload excludes sensitive/private fields.

### Frontend

1. [@AdminArchitect] Add `getPreviewById()` to `bookings_api.ts`.
2. [@AdminArchitect] Add preview cache/state in `use_bookings_viewmodel.ts` keyed by booking id.
3. [@UIExpert] Replace `getBookingAppPreviewMock()` usage in `Bookings.tsx` App View.
4. [@UIExpert] Keep section-level fallback labels and current skeleton/empty states.
5. [@CodeWarden] Verify App View logic stays viewmodel-driven and MVVM-pure.

## Tests (Unit / Integration / Smoke)

### Unit

1. Preview mapper tests for partial payloads.
2. Timeline sort/format tests for stable rendering order.

### Integration

1. API tests for `GET /api/v1/bookings/:bookingId/preview`:
- `401/403` RBAC
- `404` missing booking
- `200` valid preview payload

### Smoke

1. Open Bookings App View and cycle through rows.
2. Confirm preview sections are populated from live data.
3. Confirm fallback rendering when optional fields are null.

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep App View on mock fallback when preview endpoint fails or is disabled.
2. Release preview endpoint as additive; do not alter existing detail endpoint contract.
3. Use per-booking lazy fetch/caching to limit load impact and avoid UI stalls.
4. If data quality is poor, gate real preview behind a runtime feature flag.
