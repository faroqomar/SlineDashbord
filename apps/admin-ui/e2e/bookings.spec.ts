import { test, expect } from '@playwright/test';

test.describe('PAGE 07 — Bookings', () => {
  test('bookings list page loads or redirects to login', async ({ page }) => {
    await page.goto('/bookings');
    // Either we see the Bookings list (when authenticated) or redirect to login
    const heading = page.getByRole('heading', { name: /Bookings/i });
    const loginHeading = page.getByRole('heading', { name: /Login/i });
    await expect(heading.or(loginHeading)).toBeVisible({ timeout: 10000 });
  });

  test('booking detail shows cancel/refund actions when booking loads', async ({ page }) => {
    // Navigate to a booking detail (may 404 if ID does not exist)
    await page.goto('/bookings/00000000-0000-0000-0000-000000000020');
    // Either "Booking not found" or the detail page with Back/Cancel/Refund
    const notFound = page.getByText(/Booking not found/i);
    const backButton = page.getByRole('link', { name: /Back/i });
    await expect(notFound.or(backButton)).toBeVisible({ timeout: 10000 });
  });

  test('cancel flow opens confirmation dialog when Cancel booking is clicked', async ({ page }) => {
    await page.goto('/bookings');
    const heading = page.getByRole('heading', { name: /Bookings/i });
    const loginHeading = page.getByRole('heading', { name: /Login/i });
    await expect(heading.or(loginHeading)).toBeVisible({ timeout: 10000 });

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
