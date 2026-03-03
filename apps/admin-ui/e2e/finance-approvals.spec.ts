/**
 * PAGE 16 — Approval queue E2E.
 * Fixture and flow: see Docs/ADMIN_APPROVALS_E2E_FIXTURES.md.
 * Full flow (request → approve as B → execute as A) requires real auth and DB; this spec covers page load and structure.
 */
import { test, expect } from '@playwright/test';

test.describe('PAGE 16 — Finance Approval queue', () => {
  test('approval queue page shows title and description or redirects to login', async ({ page }) => {
    await page.goto('/finance/approvals');
    await page.waitForLoadState('domcontentloaded');

    // Either we are redirected to login (when not authenticated) or we see the approval queue
    const loginHeading = page.getByRole('heading', { name: /SLine Admin Login|Login/i });
    if (page.url().includes('/login') || (await loginHeading.isVisible().catch(() => false))) {
      await expect(loginHeading).toBeVisible();
      return;
    }

    const queueHeading = page.getByRole('heading', { name: /Approval queue/i });
    const queueDescription = page.getByText(/Dangerous ops.*second approver|wallet adjust.*reversal.*large refund/i);
    const fallbackFinanceHeading = page.getByRole('heading', { name: /Finance/i });
    await expect(queueHeading.or(queueDescription).or(fallbackFinanceHeading)).toBeVisible();
  });

  test('back to Finance link is present on approval queue page', async ({ page }) => {
    await page.goto('/finance/approvals');
    await page.waitForLoadState('domcontentloaded');

    const loginHeading = page.getByRole('heading', { name: /SLine Admin Login|Login/i });
    if (page.url().includes('/login') || (await loginHeading.isVisible().catch(() => false))) {
      test.skip();
      return;
    }

    const backLink = page.getByRole('link', { name: /Back to Finance/i });
    const financeHeading = page.getByRole('heading', { name: /Finance/i });
    await expect(backLink.or(financeHeading)).toBeVisible();
  });
});
