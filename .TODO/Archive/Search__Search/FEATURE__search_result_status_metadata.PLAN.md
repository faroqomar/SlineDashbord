# Feature Plan: Real Result Status Metadata

## 0) Objective

- Replace synthetic row metadata (status/time/relevance) with backend-provided values.
- Ensure each real search row displays accurate status and recency context per entity.
- Keep the current table layout unchanged while improving data correctness.

## 1) Current State (Evidence-labeled)

- Verified in dashboard code: `apps/admin-ui/src/features/search/models/search-ui.mock.ts` function `buildSearchRowFromApiItem` generates status/time/relevance from static maps and hash logic.
- Verified in dashboard code: `REAL_STATUS_META` is hardcoded for all real entity types.
- Verified in shared contracts: `packages/shared/src/schemas/search.ts` result items currently include only `entityType`, `id`, `title`, `subtitle`, `link`.
- Verified in API code: `apps/api/src/routes/search.ts` does not return status, updated_at, or relevance fields.
- Missing repo evidence: normalized cross-entity status metadata contract for search result rows.

## 2) Execution Checklist (Agent-assigned)

### Phase 0: Preconditions / Discovery

- [ ] Step 0.1 (@SysOp): Define normalized metadata contract across entity types:
  - `statusLabel`
  - `statusTone` (or map-friendly status category)
  - `detailLine`
  - `timeLabel` source (`updated_at`/`created_at`)
  - `relevance` score strategy
- [ ] Step 0.2 (@SecGuard): Validate metadata fields are safe to expose to all admin search roles.
- Verification (@QA): Metadata mapping matrix documented in `Docs/PAGE_11_search_result_metadata.md`.

### Phase 1: Contracts (Shared)

- [ ] Step 1.1 (@SysOp): Extend result item schemas in `packages/shared/src/schemas/search.ts` with optional or required metadata fields.
- [ ] Step 1.2 (@SysOp): Add strict constraints for `relevance` range and status tone enum.
- [ ] Step 1.3 (@QA): Expand shared tests to cover metadata presence/validation.
- Verification (@QA): Schema tests pass for all entity variants including metadata.

### Phase 2: Backend/API

- [ ] Step 2.1 (@SysOp): Update queries in `apps/api/src/routes/search.ts` to fetch status and timestamps for each entity source.
- [ ] Step 2.2 (@SysOp): Implement deterministic relevance scoring rules (exact id match > exact text > partial text).
- [ ] Step 2.3 (@SysOp): Return metadata fields per item and validate with shared response schema.
- [ ] Step 2.4 (@PerfOpt): Verify metadata enrichment does not push endpoint p95 beyond target.
- Verification (@QA): API tests assert metadata fields and relevance ordering.

### Phase 3: ViewModels

- [ ] Step 3.1 (@AdminArchitect): Refactor `buildSearchRowFromApiItem` to prefer API metadata and remove hash-derived placeholders for real rows.
- [ ] Step 3.2 (@AdminArchitect): Keep minimal fallback mapping only for missing/partial fields from API.
- Verification (@CodeWarden): VM/model mapping remains deterministic and typed.

### Phase 4: UI

- [ ] Step 4.1 (@UIExpert): Ensure `SearchResultRow` and `SearchRowPills` correctly map API metadata to visual tones and labels.
- [ ] Step 4.2 (@UIExpert): Verify no typography/spacing drift when labels vary in length.
- Verification (@QA): UI snapshot/manual review confirms status and time labels are no longer synthetic.

### Phase 5: Testing

- [ ] Step 5.1 (@QA): Add API tests for metadata shape and relevance ordering.
- [ ] Step 5.2 (@QA): Add VM tests for fallback behavior when metadata is partially missing.
- [ ] Step 5.3 (@DataSmith): Build fixtures with diverse statuses across all entity types.
- Verification (@QA): Regression suite catches metadata regressions and ordering drift.

## 3) Gate Checks (Must-Pass)

- [ ] Build Gate: metadata schema and usage compile in all packages.
- [ ] Contracts Gate: result item contracts include normalized metadata.
- [ ] Security Gate: exposed metadata fields are approved for admin scope.
- [ ] API Gate: endpoint returns accurate status/time/relevance values.
- [ ] UI Gate: table rows render real metadata with no layout regression.
- [ ] QA Gate: tests cover metadata correctness and fallback paths.

## 4) Risks & Mitigations

- Risk: Entity status semantics differ and break normalization.
  - Mitigation: maintain explicit mapping table per entity type in discovery doc.
- Risk: Relevance score is unstable across releases.
  - Mitigation: deterministic scoring function with unit tests and versioned comments.
- Risk: Missing timestamps produce confusing time labels.
  - Mitigation: strict fallback chain (`updated_at` -> `created_at` -> omitted label).
- Risk: Longer status labels overflow cells.
  - Mitigation: clamp/truncate + tooltip policy in UI.
- Risk: Extra selected columns hurt query speed.
  - Mitigation: select only required metadata fields and monitor query latency.

## 5) Definition of Done (DoD)

- Real search rows show backend-driven status/time/relevance metadata.
- Synthetic hash-based metadata is removed from the normal real-data path.
- Shared contracts and API tests enforce metadata shape.
- All gates in section 3 pass.

