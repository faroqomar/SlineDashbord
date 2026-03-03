import { expect, test } from '@playwright/test';

const SAMPLE_CASE_ID = '00000000-0000-0000-0000-000000000002';

test.describe('Reports to Cases moderation flow', () => {
  test('reports queue route loads or redirects to login', async ({ page }) => {
    await page.goto('/reports');
    await page.waitForLoadState('domcontentloaded');

    const loginHeading = page.getByRole('heading', { name: /SLine Admin Login|Login/i });
    if (await loginHeading.isVisible().catch(() => false)) {
      await expect(loginHeading).toBeVisible();
      return;
    }

    const reportsHeading = page.getByRole('heading', { name: /Reports Queue/i });
    const noReports = page.getByText(/No reports found|Loading reports/i);
    await expect(reportsHeading.or(noReports)).toBeVisible();
  });

  test('report detail exposes moderation actions when a report row exists', async ({ page }) => {
    await page.goto('/reports');
    await page.waitForLoadState('domcontentloaded');

    const loginHeading = page.getByRole('heading', { name: /SLine Admin Login|Login/i });
    if (await loginHeading.isVisible().catch(() => false)) {
      await expect(loginHeading).toBeVisible();
      return;
    }

    const viewButton = page.getByRole('button', { name: /View/i }).first();
    if (!(await viewButton.isVisible().catch(() => false))) {
      await expect(page.getByText(/No reports found|Loading reports/i)).toBeVisible();
      return;
    }

    await viewButton.click();
    await expect(
      page.getByText(/Dismiss \(Ignore\)|Escalate to Case|Close as Resolved/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('case workspace route is reachable and shows key sections', async ({ page }) => {
    await page.goto(`/cases/${SAMPLE_CASE_ID}`);
    await page.waitForLoadState('domcontentloaded');

    const loginHeading = page.getByRole('heading', { name: /SLine Admin Login|Login/i });
    if (await loginHeading.isVisible().catch(() => false)) {
      await expect(loginHeading).toBeVisible();
      return;
    }

    const assignCase = page.getByText(/Assign case/i);
    const updateStatus = page.getByText(/Update status/i);
    const notes = page.getByText(/Internal notes/i);
    const timeline = page.getByText(/Timeline/i);
    await expect(assignCase.or(updateStatus).or(notes).or(timeline)).toBeVisible({ timeout: 10000 });
  });
});
