# Checklist — Verify Page 17 Work on the Actual App

Use this list to confirm everything done for Page 17 execution and Master Report fixes is present and working in the repo.

---

## 1) Repo structure & files

| # | Check | How to verify |
|---|--------|----------------|
| 1.1 | Playwright is a devDependency in admin-ui | Open `apps/admin-ui/package.json` → `devDependencies` contains `"@playwright/test": "^1.49.0"` (or similar). |
| 1.2 | E2E script exists in admin-ui | In `apps/admin-ui/package.json` → `scripts` has `"test:e2e": "playwright test"`. |
| 1.3 | Root has `e2e` script | In repo root `package.json` → `scripts` has `"e2e": "npm run test:e2e -w @sline/admin-ui"`. |
| 1.4 | E2E README exists | File exists: `apps/admin-ui/e2e/README.md`. |
| 1.5 | E2E README has secrets policy | In `e2e/README.md`: text about "do not log or echo" and "CI: secret environment variables". |
| 1.6 | E2E README has artifact paths | In `e2e/README.md`: mentions `playwright-report/`, `test-results/`, and CI artifact upload. |
| 1.7 | Playwright config has artifact options | In `apps/admin-ui/playwright.config.ts`: `outputDir: 'test-results'` and `screenshot: 'only-on-failure'` in `use`. |
| 1.8 | Parity sign-off file exists | File exists: `.TODO/PAGE_17_PARITY_MATRIX_SIGNOFF.md` with table (Support, Logs, Team, etc.). |
| 1.9 | MIGRATIONS README has PAGE 17 section | In `MIGRATIONS/README.md`: section "PAGE 17 — Route parity complete / Remove legacy-source" with archive branch and rollback steps. |
| 1.10 | CI workflow exists | File exists: `.github/workflows/ci.yml`. |
| 1.11 | CI runs audit | In `.github/workflows/ci.yml`: a step runs `npm audit --audit-level=high`. |
| 1.12 | CI runs build & typecheck | In `.github/workflows/ci.yml`: steps for build admin-ui, typecheck admin-ui, typecheck api. |
| 1.13 | CI runs forbidden-imports | In `.github/workflows/ci.yml`: step runs `npm run forbidden-imports -w @sline/admin-ui`. |
| 1.14 | CI has E2E job | In `.github/workflows/ci.yml`: job `e2e` runs `npm run test:e2e -w @sline/admin-ui` and uses `secrets.E2E_USER_*`. |
| 1.15 | CI uploads artifacts on E2E failure | In `.github/workflows/ci.yml`: upload-artifact steps for `playwright-report` and `test-results` when failure. |
| 1.16 | Gitignore has Playwright dirs | In `.gitignore`: lines for `playwright-report/` and `test-results/`. |
| 1.17 | Archive branch exists (local) | Run: `git branch --list 'archive/legacy-next-dashboard-*'` → at least one branch (e.g. `archive/legacy-next-dashboard-20250303`). |
| 1.18 | Execution report exists | File exists: `.TODO/EXECUTION_REPORT_PAGE_17.md`. |
| 1.19 | Master report has fixes marked done | In `.TODO/MASTER_REPORT_2025-03-03_PAGE_17_Execution.md`: Fix Plan table has Status column with "✅ Done" for steps 1–4. |

---

## 2) Commands (run in repo root)

| # | Check | Command | Expected |
|---|--------|---------|----------|
| 2.1 | Install deps | `npm ci` | Completes without error. |
| 2.2 | Build admin-ui | `npm run build -w @sline/admin-ui` | Build succeeds. |
| 2.3 | Typecheck admin-ui | `npm run typecheck -w @sline/admin-ui` | No type errors. |
| 2.4 | Typecheck api | `npm run typecheck -w @sline/api` | No type errors. |
| 2.5 | Forbidden-imports scan | `npm run forbidden-imports -w @sline/admin-ui` | "Forbidden-import scan passed." |
| 2.6 | Root e2e script runs | `npm run e2e` | Same as 2.7 (may fail if no server; script should start). |
| 2.7 | Playwright runs from admin-ui | `npm run test:e2e -w @sline/admin-ui` | Playwright starts; with dev server running, login (and other) tests can pass. |
| 2.8 | npm audit runs | `npm audit --audit-level=high` | Exit 0 or list of findings (no requirement to be clean). |

---

## 3) Optional — full E2E with dev server

| # | Check | How |
|---|--------|-----|
| 3.1 | Dev server starts | Terminal 1: `npm run dev -w @sline/admin-ui` → app at http://localhost:5173. |
| 3.2 | E2E passes with server | Terminal 2: `npm run e2e` → Playwright runs; login (and any other) specs pass or fail as expected. |
| 3.3 | Artifacts created on failure | If a test fails: `apps/admin-ui/playwright-report/` and/or `apps/admin-ui/test-results/` exist (and are in .gitignore). |

---

## 4) What was not done (by design)

| # | Item | Reason |
|---|------|--------|
| 4.1 | Remove `legacy-source` | Parity matrix has 7 ❌; plan blocks removal until all ✅ and Playwright passes in CI. |
| 4.2 | Update audit doc "legacy-source remains" | Done only after Phase 6 (removal). |

---

## 5) Quick “smoke” sequence

Run in order at repo root:

```bash
npm ci
npm run build -w @sline/admin-ui
npm run typecheck -w @sline/admin-ui
npm run typecheck -w @sline/api
npm run forbidden-imports -w @sline/admin-ui
git branch --list 'archive/legacy-next-dashboard-*'
```

All should succeed and the branch list should show the archive branch. Then open the files in section 1 to confirm content.

---

**Summary:** If every item in **1)** is true and every command in **2)** passes (2.6/2.7 may need the dev server for green tests), the work done for Page 17 and the report fixes is verified on the actual app.
