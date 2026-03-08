# Feature Plan: Task Row Metadata Enrichment (Location/Category/Poster Context)

## Feature Goal
- Replace mocked row meta text with real task metadata used in Figma row design.
- Preserve current row structure and moderation actions.

## UX Behavior From Design
- Under task title, row shows supportive metadata (category + location-like label).
- Poster area shows stable identity context (avatar/initials + name).
- Data quality should remain consistent when some fields are missing.

## Data Contracts Needed (API Endpoints / Schemas)
- **Endpoint update:** `GET /api/v1/tasks` response extension.
- **Response fields (per row):**
  - `category?: string` (already present)
  - `location_label?: string`
  - `poster_display_name?: string` (or continue deriving from `client.full_name`)
  - `poster_avatar_url?: string` (or continue deriving from `client.avatar_url`)
- **DB discovery required:**
  - Confirm where task location is stored (`tasks` columns, requirement JSON, package metadata, etc.).
- **Schema updates:**
  - `packages/shared/src/schemas/tasks.ts`
  - `apps/admin-ui/src/features/tasks/models/task.schema.ts`

## Steps (Backend then Frontend)
### Backend
1. Confirm canonical source for location metadata.
2. Add selected fields to list query payload (or derive `location_label` server-side).
3. Keep profile join stable for poster info.
4. Return normalized/nullable fields (no hard failures on missing location).

### Frontend
1. Extend DTO model with `location_label` and any new poster fields.
2. Update row renderer to prioritize real metadata over mock fallback.
3. Keep fallback for legacy records with incomplete metadata.
4. Remove `(mock)` indication once API coverage is sufficient.

## Tests (Unit / Integration / Smoke)
### Unit
- Row metadata formatter handles null/empty values without UI breakage.

### Integration
- API test returns enriched row metadata for representative tasks.
- API test with missing location still returns valid schema.

### Smoke
- Table rows show consistent category/location/presenter context.
- Mixed datasets (with/without location) remain visually aligned.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Keep enrichment fields optional and backward compatible.
- If location source is not reliable, return null and keep UI fallback.
- Do not alter task moderation mutations while shipping this read-only enhancement.
