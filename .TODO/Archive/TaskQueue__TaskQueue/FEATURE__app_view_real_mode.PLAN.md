# Feature Plan: Real App View Mode

## Feature Goal
- Convert current `App View` placeholder into a real alternate representation of Task Queue data.
- Keep `Table` as default and maintain parity for key moderation actions.

## UX Behavior From Design
- `Table` / `App View` segmented control switches between two visual modes.
- App View presents task entries in compact card/list style consistent with design intent.
- Core actions available in table mode remain accessible (or intentionally deferred with clear UX note).

## Data Contracts Needed (API Endpoints / Schemas)
- **Primary assumption:** existing `GET /api/v1/tasks` can be reused.
- **Potential extensions (if required):**
  - `offers_count`
  - `views_count`
  - `location_label`
  - lightweight pagination metadata (already exists: count/totalPages)
- **No new mutation endpoint required** for initial App View parity.

## Steps (Backend then Frontend)
### Backend
1. Validate existing list payload is sufficient for App View card fields.
2. If insufficient, extend list endpoint with minimal optional fields only.
3. Preserve existing pagination/filter contract.

### Frontend
1. Replace current mock placeholder with `TaskAppViewList` component.
2. Reuse existing ViewModel filters/search/pagination state.
3. Support row open action (`/tasks/$taskId`) in app cards.
4. Keep status update action either:
   - included in card actions, or
   - intentionally deferred with product-approved parity note.
5. Persist selected view mode in URL query (optional but recommended for UX consistency).

## Tests (Unit / Integration / Smoke)
### Unit
- View mode toggle state management and persistence logic.
- App card render with empty and partial data.

### Integration
- E2E/component test: switch table->app->table with filters preserved.
- Ensure task detail navigation works from App View.

### Smoke
- App View renders real tasks, not placeholder text.
- No regressions in table mode behavior.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Keep feature flag or guarded rollout path (`viewMode === "table"` fallback always available).
- If App View regression occurs, disable App View rendering and retain table-only experience.
- Avoid introducing new dependencies for layout switch.
