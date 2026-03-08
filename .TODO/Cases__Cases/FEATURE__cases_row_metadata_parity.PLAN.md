# Feature Plan: Cases Row Metadata Parity

## Feature Goal

Replace mock row metadata (`caseCode`, `tags`, `links`) with real API-backed fields so the Cases table matches design semantics without synthetic placeholders.

## UX Behavior From Design

1. Each row shows a stable case code (`CAS-xxx` style label).
2. Subject row includes real tags/chips.
3. Links column shows real related-link count.
4. Assignee/source/status/priority remain visually unchanged.
5. If metadata fields are absent for legacy rows, UI still renders safely with fallback placeholders.

## Data Contracts Needed (API Endpoints / Schemas)

1. Extend case list payload from:
- `GET /api/v1/cases`

2. Shared schema updates (`packages/shared/src/schemas/cases.ts`):
- Extend `AdminCaseSchema` with optional:
  - `case_code`
  - `tags`
  - `links_count`

3. Backend data requirements:
- Stable case code source (stored or deterministic derivation)
- Tags source (stored in case row or related table)
- Links count source (derived from related entities/evidence/attachments definition)

## Steps (Backend then Frontend)

### Backend

1. Define canonical source for each metadata field:
- `case_code`
- `tags`
- `links_count`
2. Add schema/migration only if fields do not already exist in canonical DB.
3. Extend cases list query projection to include metadata fields.
4. Keep fields optional in response for backward compatibility with older rows.
5. Document metadata definitions so design/UI and API semantics remain aligned.

### Frontend

1. Remove row metadata dependency on `getCaseRowMetaMock()` for normal path.
2. Bind row label/tags/links directly from API payload.
3. Keep fallback UI for missing metadata values:
- case code fallback to shortened id
- empty tags state hidden or placeholder
- links count fallback to `0`
4. Retain existing row styling and interaction behavior.

## Tests (Unit / Integration / Smoke)

### Unit

1. Shared schema tests for optional metadata fields.
2. ViewModel/UI mapping tests for:
- full metadata row
- partial metadata row
- no metadata row

### Integration

1. API tests asserting metadata fields are returned when available.
2. API tests ensuring backward-compatible behavior for legacy rows without metadata.

### Smoke

1. Manual smoke on `/cases`:
- verify visible case code, tags, and links count from real data
- verify rows without metadata do not break layout
- verify row click navigation remains intact

## Rollback / Safety Notes (Avoid Breaking Prod)

1. Keep metadata fields optional in contracts to avoid hard failures for older records.
2. Maintain frontend fallbacks until metadata coverage is complete in production data.
3. If metadata query path causes regressions, disable rendering of non-critical metadata fields while preserving core list functionality.
4. Avoid destructive data migrations; prefer additive columns/derived views.
