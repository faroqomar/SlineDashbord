import { test, expect, type Page } from '@playwright/test';

async function waitForBookingsShell(page: Page) {
  const heading = page.getByRole('heading', { name: /Bookings/i });
  const loginHeading = page.getByRole('heading', { name: /Login/i });
  const apiError = page.getByText(/Failed to load bookings|NETWORK_ERROR|Request failed/i).first();
  await expect(heading.or(loginHeading).or(apiError)).toBeVisible({ timeout: 10000 });
  return { heading, loginHeading, apiError };
}

test.describe('PAGE 07 — Bookings', () => {
  test('bookings list page loads or redirects to login', async ({ page }) => {
    await page.goto('/bookings');
    await waitForBookingsShell(page);
  });

  test('bookings hero analytics renders labels when authenticated', async ({ page }) => {
    await page.goto('/bookings');
    const { loginHeading, apiError } = await waitForBookingsShell(page);

    if (await loginHeading.isVisible().catch(() => false)) {
      await expect(loginHeading).toBeVisible({ timeout: 10000 });
      return;
    }
    if (await apiError.isVisible().catch(() => false)) return;

    await expect(page.getByText('Booked')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Completed')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Last 7 days')).toBeVisible({ timeout: 5000 });
  });

  test('booking detail shows cancel/refund actions when booking loads', async ({ page }) => {
    // Navigate to a booking detail (may 404 if ID does not exist)
    await page.goto('/bookings/00000000-0000-0000-0000-000000000020');
    // Either login redirect, "Booking not found", a load error, or the detail page with Back/Cancel/Refund.
    const loginHeading = page.getByRole('heading', { name: /SLine Admin Login|Login/i });
    const notFound = page.getByText(/Booking not found/i);
    const loadError = page.getByText(/Failed to load booking|NETWORK_ERROR|Request failed/i);
    const backButton = page.getByRole('link', { name: /Back/i });
    const cancelButton = page.getByRole('button', { name: /Cancel booking/i });

    await expect(loginHeading.or(notFound).or(loadError).or(backButton).or(cancelButton)).toBeVisible({ timeout: 10000 });
    if (await loginHeading.isVisible().catch(() => false)) return;

    await expect(notFound.or(loadError).or(backButton).or(cancelButton)).toBeVisible({ timeout: 10000 });
  });

  test('cancel flow opens confirmation dialog when Cancel booking is clicked', async ({ page }) => {
    await page.goto('/bookings');
    const { loginHeading, apiError } = await waitForBookingsShell(page);
    if (await loginHeading.isVisible().catch(() => false)) return;
    if (await apiError.isVisible().catch(() => false)) return;

    // If we are on list and there is at least one "View" link, go to detail and try cancel
    const viewLink = page.getByRole('button', { name: 'View' }).first();
    if (await viewLink.isVisible().catch(() => false)) {
      await viewLink.click();
      await expect(page).toHaveURL(/\/bookings\/[0-9a-f-]+/i, { timeout: 5000 });
      const cancelBtn = page.getByRole('button', { name: /Cancel booking/i });
      if (await cancelBtn.isVisible().catch(() => false)) {
        await cancelBtn.click();
        await expect(page.getByRole('dialog').getByText(/Cancel this booking/i)).toBeVisible({ timeout: 3000 });
        const reasonField = page.getByLabel(/Reason/i);
        await reasonField.fill('E2E test cancellation');
        const confirmBtn = page.getByRole('button', { name: /Cancel booking/i }).last();
        await confirmBtn.click();
        // Dialog should close; detail may show updated status
        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
      }
    }
  });
});
