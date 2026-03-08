# Feature Plan: Dispute Card Metadata Enrichment

## Feature Goal
Replace mock card metadata (severity, category, comment count) with real backend-provided values.

## UX Behavior From Design
- Each dispute card shows:
1. Severity chip
2. Category chip
3. Comment count
4. Amount and date
- Chip text and tone are driven by real data, not generated placeholders.
- Cards remain clickable and lane behavior remains unchanged.

## Data Contracts Needed (API Endpoints / Schemas)
- Option A (preferred): extend `GET /disputes` response item shape with:
1. `severity: "low" | "med" | "high" | "crit"`
2. `category: string`
3. `comments_count: number`
- Option B: add companion endpoint `GET /disputes/metadata?ids=...`.
- Shared DTO update in `packages/shared/src/schemas/disputes.ts`.

## Steps (Backend Then Frontend)
1. Backend: decide source-of-truth fields for severity/category in DB.
2. Backend: enrich list query in `apps/api/src/routes/disputes.ts` to return required metadata.
3. Backend: compute `comments_count` from `dispute_messages` relation efficiently.
4. Backend: keep backward compatibility by making new fields additive.
5. Frontend: update disputes list typings in admin UI models/schemas.
6. Frontend: replace `getDisputeCardUIMockMeta` usage with real fields from API.
7. Frontend: keep minimal fallback for old rows missing metadata.
8. Frontend: remove mock badges related to card metadata once full parity is verified.

## Tests (Unit / Integration / Smoke)
- Unit:
1. Metadata mapping from API payload to card props.
2. Severity-to-style mapping covers all enum cases.
- Integration:
1. Disputes list endpoint includes metadata fields for all statuses.
2. `comments_count` matches relation count for known fixtures.
3. Response remains compatible with existing consumers.
- Smoke:
1. Cards display real severity/category/comment values in each lane.
2. Search and filters still work with enriched payload.

## Rollback / Safety Notes (Avoid Breaking Prod)
- Keep metadata fields additive and optional during rollout.
- Preserve frontend fallback path if metadata is absent.
- Avoid heavy per-row subqueries; precompute or aggregate safely to prevent latency spikes.
- If backend load rises, temporarily disable metadata rendering while preserving base card fields.
