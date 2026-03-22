import { expect, test } from '@playwright/test';

const MOCK_LOGS_RESPONSE = {
  ok: true,
  data: {
    logs: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        action: 'admin.tasks.update_status',
        actorUserId: '00000000-0000-0000-0000-000000000001',
        actorName: 'Admin User',
        entityType: 'task',
        entityId: '22222222-2222-2222-2222-222222222222',
        level: 'info',
        source: 'task-queue',
        message: 'Task status updated',
        eventCode: '200',
        requestId: null,
        href: '/tasks/22222222-2222-2222-2222-222222222222',
        createdAt: new Date().toISOString(),
        meta: {},
      },
    ],
    count: 1,
    totalPages: 1,
    page: 1,
    sourceOptions: ['task-queue'],
    summary: { total: 1, critical: 0, error: 0, warning: 0, info: 1, debug: 0 },
    hourlyBuckets: [
      { label: '12:00', critical: 0, error: 0, warning: 0, info: 1, debug: 0 },
    ],
  },
};

test.describe('System Logs', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          data: {
            user: {
              id: '00000000-0000-0000-0000-000000000001',
              email: 'admin@sline.io',
              role: 'super_admin',
            },
          },
        }),
      });
    });

    await page.route('**/api/v1/logs?**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_LOGS_RESPONSE),
      });
    });

    await page.route('**/api/v1/logs/export?**', async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="sline_system_logs.csv"',
        },
        body: 'Timestamp,Level,Source,Message\n2026-01-01T12:00:00.000Z,info,task-queue,Test',
      });
    });
  });

  test('should open System Logs, show heading and controls', async ({ page }) => {
    await page.goto('/logs');

    await expect(page.getByRole('heading', { name: /System Logs/i })).toBeVisible();
    await expect(page.getByText(/Real-time platform event stream/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Live|Manual/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Refresh/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export/i })).toBeVisible();
  });

  test('should apply level filter and show level tabs', async ({ page }) => {
    await page.goto('/logs');

    await expect(page.getByRole('button', { name: 'All' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'ERROR' }).first().click();
    await expect(page.getByRole('button', { name: 'ERROR' }).first()).toBeVisible();
  });

  test('should show log table with columns', async ({ page }) => {
    await page.goto('/logs');

    await expect(page.getByRole('columnheader', { name: /Timestamp/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Level/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Source/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Message/i })).toBeVisible();
  });

  test('should expand row when chevron clicked', async ({ page }) => {
    await page.goto('/logs');

    const expandButton = page.locator('table tbody [aria-expanded]').first();
    await expandButton.click();
    await expect(page.getByText('Full Timestamp').first()).toBeVisible();
  });

  test('should trigger export and show toast', async ({ page }) => {
    await page.goto('/logs');

    await page.getByRole('button', { name: /Export/i }).click();
    await expect(page.getByText(/System logs export downloaded/i)).toBeVisible({ timeout: 5000 });
  });
});
