# PAGE 17 — Route Parity Complete + Remove legacy-source (Plan Critic Rewrite)

**Source:** [MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md](../MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md) (lines 503–519)  
**Planner:** `.agent/workflows/planner.md`  
**Critic:** `.agent/workflows/plan_critic.md`

---

## A) Assumptions + Decision Needed (Blocking)

**Assumptions (safely inferred):**
- Page 17 runs only after Pages 01–16 are complete; parity matrix rows (Support, Logs, Team, Notifications, System health, Finance audit, Finance user lookup) are delivered by those pages. [Verified in audit doc]
- `legacy-source` is a directory at repo root and is not a workspace package. [Verified in dashboard code — audit refs]
- Removing the directory is a single commit (or short PR); no staged rollout of “no Next” is required.
- Playwright is the chosen E2E framework per audit gate “Playwright suite passes.” [Verified in audit line 516]

**Decision Needed (Blocking):**

| # | Missing decision | Options | Recommended | Why | Plan impact |
|---|------------------|---------|-------------|-----|-------------|
| 1 | Is archiving `legacy-source` mandatory before delete? | A) Mandatory — no delete without archive. B) Optional — delete and rely on git history. | **A) Mandatory** | Git history can be pruned; tarball/branch is recoverable evidence and rollback. | Phase “Archive” becomes a hard gate; Step 2.1 has stop condition: “Do not run Phase 3 until archive artifact exists and path is documented.” |
| 2 | Where must the parity matrix sign-off artifact live? | A) `.TODO/PAGE_17_PARITY_MATRIX_SIGNOFF.md` (checked in). B) PR description only. C) External doc. | **A) Checked-in file** | Repo-verifiable; auditor can confirm “matrix all ✅” from file. | Step 0.1 output artifact: exact path and required columns (route name, Vite path, API path, schema path, Status ✅/❌). |
| 3 | Playwright suite: run in CI or manual-only for Page 17? | A) Must run in CI before merge. B) Manual run + doc. | **A) CI** | “Playwright suite passes” is a gate; CI is the proof. | Add step: Playwright runs in CI (e.g. on PR); gate fails if suite fails. |

---

## B) Gate Status (Pass / Fail)

| Gate | Status | Reasons | Fixes required to pass |
|------|--------|---------|------------------------|
| **0. Test Infrastructure Gate** | ❌ FAIL | Playwright not required as first-class gate; no explicit config/env/selectors/bounded waits; “define and pass” is after removal in original order. | Add Test Infra Gate before any removal: Playwright installed and runnable (e.g. `npm run e2e` or `playwright test`); config file present; env/secrets injection documented; at least one smoke test (e.g. login) passes. Reorder plan so Playwright is green *before* deleting legacy. |
| **1. Data/Contracts Gate** | ✅ PASS | No new data; gate is “shared schemas used by parity routes; no broken imports.” Plan verifies parity matrix includes schema parity. | None. |
| **2. Security Gate** | ✅ PASS | Forbidden imports, RBAC, no legacy-source in runtime path. Explicit in plan. | None. |
| **3. Backend/API Gate** | ✅ PASS | Parity endpoints must exist (from prior pages); Step 0.1 verifies API path per matrix row. | Add explicit stop: “If any parity row is missing API route, do not proceed to Phase 3.” |
| **4. UI/Integration Gate** | ✅ PASS | Parity Vite routes must exist and load. Step 0.1 verifies. | Same as above: stop if any row missing UI route. |
| **5. Release/QA Gate** | ❌ FAIL | No rollback plan; no explicit “artifact capture” for E2E; archive optional weakens release safety. | Add rollback step: “If removal breaks build or CI: restore from archive (branch/tarball); document in MIGRATIONS.” Make archive mandatory per Decision 1. |

---

## C) Critical Gaps (Must-Fix)

| Gap | Why it breaks | Fix steps | Owner | Acceptance check |
|-----|---------------|-----------|--------|------------------|
| Playwright runs after removal | Removing legacy before E2E is green means no regression net at the moment of delete. | Reorder: Phase “Playwright suite green” must complete before Phase “Remove legacy-source.” Add subphase “Test Infra Gate” with runnable Playwright + one smoke test. | @QA @DevOps | Playwright suite passes while `legacy-source` still exists; then removal runs. |
| No repo-verifiable parity sign-off | “One-page checklist” is vague; cannot prove “matrix all ✅” from repo. | Add Step 0.1 output: create `.TODO/PAGE_17_PARITY_MATRIX_SIGNOFF.md` with columns: Legacy surface, Vite route path, API route path, Shared schema path, Status (✅/❌). All Status must be ✅. | @QA | File exists; grep “❌” returns no match. |
| Archive optional | If archive is skipped and history is lost, rollback is impossible. | Per Decision 1: make archive mandatory. Step “Create archive” has stop condition: “Do not run Remove until archive exists and path/tag is documented.” | @DevOps | Documented archive path in MIGRATIONS or README; tarball or branch exists. |
| No rollback plan | If delete breaks CI or build, unclear how to revert. | Add step: “Rollback: restore `legacy-source` from archive (branch/tarball); re-add to repo; document in MIGRATIONS that rollback was used.” | @DevOps | MIGRATIONS or runbook contains “Page 17 rollback” instructions. |
| Test Infra Gate missing | Plan includes testing but does not require test infra to be in place first. | Add Gate 0: Playwright config present; `npm run e2e` (or equivalent) runs; at least login smoke passes; env (e.g. baseURL, test user) documented. | @QA @DevOps | Gate 0 section in plan; checklist item “Test Infra Gate passed.” |

---

## D) Invariants & Success Criteria (Non-Negotiable)

| Invariant | Enforcement | Verification |
|-----------|-------------|--------------|
| No delete before parity matrix all ✅ | Step 0.1 produces sign-off file; Phase 3 has entry condition: “Parity sign-off file exists and contains no ❌.” | Read `.TODO/PAGE_17_PARITY_MATRIX_SIGNOFF.md`; no ❌. |
| No delete before Playwright suite passes | Phase “Playwright green” completes before Phase “Remove legacy-source”; CI runs Playwright. | CI job “e2e” or “playwright” passes. |
| No delete before archive exists | Phase “Archive” is mandatory; Phase “Remove” has entry condition: “Archive path documented.” | Documented path; artifact exists (branch or tarball). |
| No active code or CI depends on `legacy-source` after removal | Phase “References and CI” removes all references; grep step. | Grep repo (excl. docs/archive) for `legacy-source` in code/CI config returns no hits. |
| Canonical dashboard is Vite + Fastify only | Doc update in same PR as removal. | MIGRATIONS or README states legacy Next removed; canonical UI = apps/admin-ui, API = apps/api. |

---

## E) Risk Register

| Risk | Where | Probability | Impact | Blast radius | Early signal | Prevention | Fallback |
|------|--------|-------------|--------|--------------|--------------|------------|----------|
| Delete before parity | Phase 3 run too early | High | High | App-wide (missing features) | Parity matrix has ❌ | Entry condition: sign-off file all ✅ | Restore legacy-source from archive; fix parity; re-run. |
| Delete before E2E green | Phase 3 before Phase Playwright | Med | High | App-wide (undetected regressions) | Playwright failing | Reorder: Playwright green before Remove | Restore from archive; fix tests/features; re-run. |
| CI expects legacy-source | CI config, scripts | Med | Med | Feature (CI red) | CI fails on missing path | Phase 1: grep and remove all references | Fix CI to drop legacy-source; re-run. |
| Archive missing | Skip archive | Low | High | Data-loss (no rollback) | No archive artifact | Archive mandatory; gate before Remove | Cannot rollback; avoid by enforcing gate. |
| Playwright flaky | E2E suite | Med | Med | Feature (gate blocks or false green) | Intermittent failures | Bounded waits; stable selectors; document exclusions with tickets | Fix tests or exclude with ticket; do not delete until stable. |
| Docs still say “legacy-source remains” | Audit doc, README | Med | Low | Local (confusion) | Grep “legacy-source remains” | Phase “Doc update” in same PR as removal | Edit docs in follow-up. |

---

## F) Pre-Mortem

- This fails when we delete `legacy-source` before every parity row is ✅ and a sign-off file exists.
- This fails when we delete before Playwright suite passes, so we have no regression net at delete time.
- This fails when we do not archive and later need to compare or roll back.
- This fails when CI still references `legacy-source` and breaks on the next run after removal.
- This fails when the “parity matrix” is only in a PR description and is never checked in, so we cannot prove later that we had sign-off.
- This fails when Playwright is not run in CI, so “suite passes” is only a manual claim.
- This fails when there is no rollback plan and something breaks after removal.

---

## G) Plan Fixes (Concrete Additions)

| Goal | Why | How | Output artifact | Stop condition |
|------|-----|-----|------------------|----------------|
| Test Infra Gate | Plan includes testing; infra must exist first. | Add Gate 0: ensure Playwright is installed, config exists, `npm run e2e` (or equivalent) runs; document baseURL/test user; add at least one smoke (e.g. login). | Playwright config; passing smoke test; doc with env. | Do not rely on “Playwright suite passes” until Gate 0 passed. |
| Parity sign-off file | Repo-verifiable proof that matrix is all ✅. | Step 0.1: create `.TODO/PAGE_17_PARITY_MATRIX_SIGNOFF.md` with columns: Legacy surface, Vite route path, API route path, Shared schema path, Status. Fill from audit matrix rows; all Status ✅. | `.TODO/PAGE_17_PARITY_MATRIX_SIGNOFF.md` | Do not run Phase “Remove legacy-source” if file has any ❌. |
| Playwright before Remove | Regression net must exist before delete. | Reorder: phase “Playwright suite — define and pass” runs while `legacy-source` still exists; CI runs suite and must pass before Phase “Remove legacy-source.” | Green Playwright run in CI | Do not delete until CI Playwright job passes. |
| Archive mandatory | Rollback and evidence require archive. | Step “Create archive” is required; entry condition for “Remove” is “Archive path documented and artifact exists.” | Tarball or branch + doc path | Do not run Remove until archive exists and is documented. |
| Rollback plan | If removal breaks something, we need a procedure. | Add step and doc: “If build or CI breaks after removal: restore `legacy-source` from archive; re-add to repo; document rollback in MIGRATIONS.” | MIGRATIONS or runbook section “Page 17 rollback” | N/A (reactive). |

---

## H) Corrected Plan (Execution-Ready, Gate-Based)

**Strict dependency order:** 1) Data/Contracts (parity = contracts in place from prior pages) → 2) Security (forbidden imports, RBAC) → 3) Backend/API (parity endpoints) → 4) UI (parity routes) → 5) QA/Release (Playwright, archive, remove, docs).

---

### Phase 0: Test Infrastructure Gate (Required First)

- **Goal:** Playwright is runnable and at least one smoke test passes so “Playwright suite passes” is a real gate.
- **Why:** Without this, we cannot use E2E as a removal gate.
- **How:** Ensure Playwright is in repo (or add it); add config (e.g. `playwright.config.ts`); add npm script (e.g. `e2e` or `playwright test`); document baseURL and test user/secrets; implement at least login smoke test; run locally and in CI.
- **Result:** CI job runs Playwright; login smoke passes.
- **Gate check:** Playwright config present; `npm run e2e` (or equivalent) succeeds; CI runs it. ✅/❌

**Steps:**
- [ ] **0.1 (@QA + @DevOps):** Add or confirm Playwright; config; npm script; env doc; login smoke. Run in CI.
- **Verification (@QA):** Test Infra Gate passed (measurable: script runs, one test green).

---

### Phase 1: Data/Contracts + Parity Matrix Sign-Off

- **Goal:** Prove that every legacy parity row has Vite route + Fastify API + shared schema where required; no row left ❌.
- **Why:** Removal is only safe when parity is complete and repo-verifiable.
- **How:** Walk audit Legacy parity matrix (Support, Logs, Team, Notifications, System health, Finance audit, Finance user lookup). For each row, confirm in repo: Vite route file, API route file, shared schema if required. Create sign-off artifact with status ✅/❌. Fix any ❌ by completing the work (or block Page 17 until prior pages deliver).
- **Result:** `.TODO/PAGE_17_PARITY_MATRIX_SIGNOFF.md` exists; every row ✅.
- **Gate check:** File exists; grep "❌" in that file returns no match. ✅/❌

**Steps:**
- [ ] **1.1 (@QA):** Create `.TODO/PAGE_17_PARITY_MATRIX_SIGNOFF.md`. Columns: Legacy surface, Vite route path, API route path, Shared schema path, Status (✅/❌). Fill from audit lines 696–703 and repo inspection.
- [ ] **1.2 (@QA):** Resolve any ❌ (coordinate with owners of Pages 07–14); re-run until all ✅.
- **Verification (@QA):** Parity matrix sign-off file has no ❌; Data/Contracts Gate passed.

---

### Phase 2: Security + Build Gates

- **Goal:** No forbidden imports in admin-ui; build and typecheck pass; RBAC on parity routes confirmed.
- **Why:** Removal must not ship with broken or insecure SPA.
- **How:** Run `npm run -w apps/admin-ui build` and `typecheck`; run forbidden-import scan (no `@/lib/supabase/admin`, `@/lib/supabase/server`, `createAdminClient`, `auth.admin`, `next/*` in apps/admin-ui). Confirm RBAC on all parity API routes.
- **Result:** Build and typecheck pass; scan clean; RBAC confirmed.
- **Gate check:** Build Gate ✅; Security Gate ✅.

**Steps:**
- [ ] **2.1 (@DevOps):** Fix any build/typecheck/forbidden-import failures (Page 01 scope if needed).
- [ ] **2.2 (@SecGuard):** Confirm RBAC on parity endpoints (or sign-off that existing middleware covers them).
- **Verification (@SecGuard):** Security Gate passed.

---

### Phase 3: Playwright Suite Green (Before Any Removal)

- **Goal:** Full Playwright suite passes while `legacy-source` is still present, so removal is protected by a regression net.
- **Why:** If we remove first and then “fix Playwright,” we have no proof that removal did not break anything.
- **How:** Define suite: login; one navigation path per parity area (Users, Tasks, Disputes, Finance, Support, Logs, Team, Notifications, System health, Finance audit, Finance user lookup); at least one critical flow (e.g. approve/reject withdrawal) if applicable. Use bounded waits and stable selectors; document exclusions with tickets. Run in CI; fix until green.
- **Result:** Playwright suite passes in CI; `legacy-source` still in repo.
- **Gate check:** CI Playwright job green. ✅/❌

**Steps:**
- [ ] **3.1 (@QA):** Implement or extend Playwright tests per coverage above; run in CI.
- [ ] **3.2 (@QA):** Fix failures until suite passes; document any excluded flows with tickets.
- **Verification (@QA):** Release/QA Gate (Playwright) passed; regression net in place.

---

### Phase 4: References and CI — No Dependency on legacy-source

- **Goal:** No code or CI builds/tests `legacy-source`; removal will not break CI.
- **Why:** After removal, CI must not reference missing path.
- **How:** Grep repo (excl. `legacy-source` and docs that only describe migration) for `legacy-source`, `legacy_source`, paths containing `legacy-source`. Check package.json workspaces, CI config, deploy/scripts. Remove or redirect every reference.
- **Result:** No active dependency on `legacy-source`; CI runs without it.
- **Gate check:** Grep in code and CI config for `legacy-source` returns no hits (except docs/archive). ✅/❌

**Steps:**
- [ ] **4.1 (@DevOps):** Grep and document all references; remove or redirect.
- **Verification (@CodeWarden):** No code/CI depends on `legacy-source`.

---

### Phase 5: Archive (Mandatory)

- **Goal:** Recoverable copy of `legacy-source` exists and path is documented so we can roll back or compare.
- **Why:** Rollback and audit require archive; no delete without archive.
- **How:** Create tarball or git branch/tag (e.g. `archive/legacy-next-dashboard-YYYYMMDD`) with full `legacy-source` tree. Document in MIGRATIONS or README where archive lives.
- **Result:** Archive artifact exists; path/tag documented.
- **Gate check:** Documented path; artifact exists. ✅/❌

**Steps:**
- [ ] **5.1 (@DevOps):** Create archive (tarball or branch); document path.
- [ ] **5.2 (@Doc Keeper):** Add “Page 17 archive” note to MIGRATIONS or README with path/tag.
- **Verification (@Doc Keeper):** Archive mandatory gate passed.

---

### Phase 6: Remove legacy-source

- **Goal:** Directory `legacy-source` is removed from repo; canonical dashboard is Vite + Fastify only.
- **Why:** Page 17 outcome: “Delete Next completely.”
- **How:** Entry conditions: Phase 1 sign-off file all ✅; Phase 3 Playwright green; Phase 4 no references; Phase 5 archive exists and documented. Then: `git rm -r legacy-source` (or equivalent); commit.
- **Result:** Repo root has no `legacy-source`; build and typecheck still pass.
- **Gate check:** No `legacy-source` directory; full build and typecheck pass. ✅/❌

**Steps:**
- [ ] **6.1 (@DevOps):** Confirm entry conditions; remove `legacy-source/` via git rm; commit.
- **Verification (@QA):** Removal gate passed.

---

### Phase 7: Doc Update + Rollback Plan

- **Goal:** Docs state legacy Next removed and canonical UI/API; rollback procedure is documented.
- **Why:** Single source of truth; safe recovery if something breaks.
- **How:** Update MIGRATIONS/SLINE_APP_DASHBOARD_UNIFIED_AUDIT.md (or add “Migration complete” note): as of Page 17, legacy Next removed; canonical admin UI = `apps/admin-ui`, API = `apps/api`. Remove or update bullets that say “legacy-source remains.” Add rollback: “If build or CI breaks after removal: restore `legacy-source` from archive (path in …); re-add to repo; document in MIGRATIONS.”
- **Result:** Docs updated; rollback path documented.
- **Gate check:** Grep “legacy-source remains” in current-state sections returns no match; rollback section exists. ✅/❌

**Steps:**
- [ ] **7.1 (@Doc Keeper):** Update audit/project docs; add Page 17 rollback instructions.
- **Verification (@Doc Keeper):** Doc update gate passed.

---

### Phase 8: Final Gate Run

- **Goal:** All gates pass after removal; no regressions.
- **How:** Run: Build, Contracts, Security, API, UI, QA (Playwright). Sign-off.
- **Result:** All six gates ✅; legacy-source removed safely.
- **Gate check:** Full checklist passed; Code Warden / SecGuard sign-off.

**Steps:**
- [ ] **8.1 (@QA):** Run full gate checklist; capture result.
- [ ] **8.2 (@Code Warden / @SecGuard):** Sign-off that removal did not introduce regressions.
- **Verification:** Definition of Done satisfied.

---

## I) Change Report (Diff-Style)

**1) Original issues summary**
- Playwright phase ran after removal (no regression net at delete time).
- Test Infrastructure Gate missing despite plan including testing.
- Parity sign-off was “one-page checklist” with no repo-verifiable artifact path.
- Archive was optional; no mandatory rollback plan.
- Gate list did not match Plan Critic’s 0–5 (Test Infra, Data/Contracts, Security, Backend/API, UI/Integration, Release/QA).
- No explicit stop conditions or output artifacts for key steps.
- No Assumptions/Decision Needed, Risk Register, Pre-Mortem, or Invariants in critic format.

**2) Added steps**
- Phase 0: Test Infrastructure Gate (Playwright runnable, config, smoke test, CI).
- Step 1.1–1.2: Create `.TODO/PAGE_17_PARITY_MATRIX_SIGNOFF.md` and resolve ❌.
- Phase 5: Archive mandatory (with doc step).
- Phase 7: Rollback plan documented in MIGRATIONS/runbook.
- Entry conditions for Phase 6 (Remove): sign-off file all ✅, Playwright green, no references, archive exists.

**3) Removed steps**
- None removed; optional “Archive” made mandatory and folded into Phase 5.

**4) Reordered steps**
- Playwright “define and pass” moved before “Remove legacy-source” (now Phase 3 before Phase 6).
- Test Infra Gate placed first (Phase 0).
- Archive made a dedicated phase (5) before Remove (6); Doc update and rollback after Remove (7).

**5) Expanded steps**
- Step 0.1: explicit Playwright config, npm script, env doc, login smoke, CI.
- Step 1.1: exact output path and columns for parity sign-off file.
- Phase 6: explicit entry conditions (sign-off, Playwright green, no refs, archive).
- Phase 7: rollback procedure and doc update.

**6) Why**
- To satisfy Plan Critic: execution-safe, repo-verifiable, gate-passable; no fake progress; explicit decisions and stop conditions; Test Infra Gate when testing is in scope; regression net before removal; mandatory archive and rollback.

**7) Residual risks**
- Playwright can still be flaky; mitigate with bounded waits and documented exclusions.
- Someone could re-add legacy-source later; mitigate by doc and CI not referencing it.
- Archive could be lost if stored only locally; recommend committed branch or CI-accessible tarball.

---

## Definition of Done (DoD) — Unchanged Intent, Stricter Criteria

- [ ] Test Infra Gate passed (Playwright runnable, config, smoke in CI).
- [ ] `.TODO/PAGE_17_PARITY_MATRIX_SIGNOFF.md` exists and has no ❌.
- [ ] Build Gate, Security Gate passed (admin-ui + api build/typecheck; forbidden-import scan; RBAC).
- [ ] Playwright suite passes in CI while `legacy-source` still exists.
- [ ] No code or CI references `legacy-source` (grep clean).
- [ ] Archive exists and path/tag documented (mandatory).
- [ ] `legacy-source` directory removed from repo.
- [ ] Docs updated (canonical UI/API); rollback plan in MIGRATIONS/runbook.
- [ ] Final gate run: all six gates pass; Code Warden / SecGuard sign-off.
- [ ] Commit/PR: e.g. `feat(admin): Page 17 — route parity complete, remove legacy-source` with reference to this plan and parity sign-off.

---

*Assume it will fail. Prove it won’t.*
