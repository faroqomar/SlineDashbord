import { expect, test } from '@playwright/test';

const MOCK_OBSERVABILITY = {
  ok: true,
  data: {
    services: Array.from({ length: 12 }, (_, i) => ({
      name: `Service ${i + 1}`,
      status: i < 10 ? 'operational' : i < 11 ? 'degraded' : 'maintenance',
      latencyMs: 10 + i * 5,
      lastChecked: new Date().toISOString(),
      description: `Description for service ${i + 1}`,
      uptimePct: 99.5,
      sparkline: [99, 99.5, 99, 100, 99.5, 99, 100],
    })),
    rpcStatus: undefined,
    queueStatus: { status: 'not_implemented' as const },
    errorRates: { last1h: 0, last24h: 2 },
    summary: {
      overallUptimePct: 99.93,
      operationalCount: 10,
      degradedCount: 1,
      maintenanceCount: 1,
    },
    kpis: {
      uptime30d: 99.93,
      uptime30dDelta: 0.02,
      avgLatencyMs: 83,
      avgLatencyDeltaMs: 3,
      errorRatePct: 0.62,
      errorRateDeltaPct: 0.17,
      requestsPerMin: 9100,
      requestsPerMinDelta: 14,
      sparklineUptime: [99.9, 99.91, 99.92, 99.93],
      sparklineLatency: [80, 82, 81, 83],
      sparklineError: [0.5, 0.55, 0.6, 0.62],
      sparklineReqMin: [8000, 8500, 9000, 9100],
    },
    uptime90Day: Array.from({ length: 90 }, (_, i) => ({
      date: new Date(Date.now() - (89 - i) * 86400000).toISOString().slice(0, 10),
      status: i % 10 === 0 ? 'degraded' : 'operational',
    })),
  },
};

test.describe('System Health', () => {
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

    await page.route('**/api/v1/observability**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_OBSERVABILITY),
      });
    });
  });

  test('shows System Health page with hero, status, and 12 service cards', async ({ page }) => {
    await page.goto('/system-health');

    await expect(page.getByRole('heading', { name: /System Health/i })).toBeVisible();

    const servicesContainer = page.locator('[data-testid="system-health-services"]');
    await expect(servicesContainer).toBeVisible({ timeout: 10000 });

    const serviceCards = page.locator('[data-testid="system-health-service-card"]');
    await expect(serviceCards).toHaveCount(12, { timeout: 5000 });
  });

  test('has status area and hero with data-testids', async ({ page }) => {
    await page.goto('/system-health');

    await expect(page.locator('[data-testid="system-health-hero"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="system-health-status"]')).toBeVisible({ timeout: 5000 });
  });
});
