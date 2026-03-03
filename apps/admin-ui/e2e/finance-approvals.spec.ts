/**
 * PAGE 16 — Approval queue E2E.
 * Fixture and flow: see Docs/ADMIN_APPROVALS_E2E_FIXTURES.md.
 * Full flow (request → approve as B → execute as A) requires real auth and DB; this spec covers page load and structure.
 */
import { test, expect } from '@playwright/test';

test.describe('PAGE 16 — Finance Approval queue', () => {
  test('approval queue page shows title and description or redirects to login', async ({ page }) => {
    await page.goto('/finance/approvals');

    // Either we are redirected to login (when not authenticated) or we see the approval queue
    const url = page.url();
    if (url.includes('/login')) {
      await expect(page.getByRole('heading', { name: /SLine Admin Login|Login/i })).toBeVisible();
      return;
    }

    await expect(page.getByRole('heading', { name: 'Approval queue' })).toBeVisible();
    await expect(
      page.getByText(/Dangerous ops.*second approver|wallet adjust.*reversal.*large refund/i)
    ).toBeVisible();
  });

  test('back to Finance link is present on approval queue page', async ({ page }) => {
    await page.goto('/finance/approvals');

    const url = page.url();
    if (url.includes('/login')) {
      test.skip();
      return;
    }

    await expect(page.getByRole('link', { name: /Back to Finance/i })).toBeVisible();
  });
});
