# Feature Plan: Multi-Field Task Search (Title/Category/Poster/UUID)

## Feature Goal
- Upgrade Task Queue search to match design intent:
  - title
  - category
  - poster identity
  - task UUID
- Preserve existing search input UX and pagination behavior.

## UX Behavior From Design
- Search placeholder indicates broad field support.
- Typing query should return relevant rows across supported fields.
- Search remains responsive and compatible with status filters.

## Data Contracts Needed (API Endpoints / Schemas)
- **Endpoint update:** `GET /api/v1/tasks?query=...`
- **Behavioral contract:**
  - `query` applies across allowlisted fields.
  - UUID-like query should perform exact id match path.
  - Free text query should support partial matching for title/category/poster name.
- **Schema impact:**
  - No response schema change required unless relevance metadata is added.

## Steps (Backend then Frontend)
### Backend
1. Refactor tasks route search logic from title-only to multi-field allowlist.
2. Add UUID exact-match branch for high precision and performance.
3. Join/filter on poster profile name safely (no SQL injection risk, allowlisted fields only).
4. Keep status filter and pagination behavior unchanged.
5. Add request validation for search length and sanitization.

### Frontend
1. Keep current search input component and placeholder.
2. Ensure ViewModel query param continues using `query` for server-side search.
3. Add debounce (if not present) to reduce unnecessary requests.
4. Update mock notice/documentation once backend parity is shipped.

## Tests (Unit / Integration / Smoke)
### Unit
- Query parser recognizes UUID vs general text.
- Search validation constraints (min/max length).

### Integration
- API test: title search works.
- API test: category search works.
- API test: poster search works.
- API test: UUID search exact match works.
- API test: status + query combined filtering works.

### Smoke
- Search experience returns expected results for each field type.
- Pagination remains correct under active search.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Keep title-search fallback path available if multi-field query causes regressions.
- Use allowlisted server-side query construction to prevent injection-like patterns.
- If performance degrades, temporarily disable profile-name search branch and keep title/category + UUID exact match.
