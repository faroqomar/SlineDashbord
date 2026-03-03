# E2E (Playwright) — Page 17 Test Infrastructure Gate

- **Config:** `playwright.config.ts` (baseURL: http://localhost:5173)
- **Run:** `npm run test:e2e` from `apps/admin-ui` (or `npm run test:e2e -w @sline/admin-ui` from root)
- **CI:** Run Playwright before any legacy-source removal; gate fails if suite fails.

## Test user / secrets

- Use env or `.env.test` for credentials (e.g. `E2E_USER_EMAIL`, `E2E_USER_PASSWORD`); **do not commit** these.
- **In CI:** Provide `E2E_USER_EMAIL` and `E2E_USER_PASSWORD` as **secret** environment variables. Do **not** log or echo them (no `echo $E2E_USER_*` in scripts).
- Login smoke uses placeholder credentials; for full flows use injected test user or staging credentials per environment.

## Artifact capture (failures)

- **HTML report:** `apps/admin-ui/playwright-report/` (after `npm run test:e2e`; open `index.html`).
- **Traces:** `apps/admin-ui/test-results/` (on first retry; see `playwright.config.ts` `trace: 'on-first-retry'`).
- **Screenshots:** `apps/admin-ui/test-results/` (on failure; `screenshot: 'only-on-failure'` in config).
- In CI, upload `playwright-report` and/or `test-results` as job artifacts so failures can be inspected.
