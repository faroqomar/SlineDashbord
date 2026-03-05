import { expect, test } from '@playwright/test';

type UsersStatusTab = 'all' | 'active' | 'inactive';

const PAGE_SIZE = 10;

const USERS_FIXTURE = [
  { id: '00000000-0000-0000-0000-000000000001', full_name: 'Eros Gray', email: 'eros@example.com', status: 'active' },
  { id: '00000000-0000-0000-0000-000000000002', full_name: 'Zahraa Firas', email: 'zahraa@example.com', status: 'active' },
  { id: '00000000-0000-0000-0000-000000000003', full_name: 'Shahad Noor', email: 'shahad@example.com', status: 'active' },
  { id: '00000000-0000-0000-0000-000000000004', full_name: 'Farooq Omar', email: 'farooq@example.com', status: 'active' },
  { id: '00000000-0000-0000-0000-000000000005', full_name: 'Lana Rowe', email: 'lana@example.com', status: 'active' },
  { id: '00000000-0000-0000-0000-000000000006', full_name: 'Nina Wells', email: 'nina@example.com', status: 'active' },
  { id: '00000000-0000-0000-0000-000000000007', full_name: 'Rami Ali', email: 'rami@example.com', status: 'active' },
  { id: '00000000-0000-0000-0000-000000000008', full_name: 'Tara Ames', email: 'tara@example.com', status: 'active' },
  { id: '00000000-0000-0000-0000-000000000009', full_name: 'Mona Bass', email: 'mona@example.com', status: 'active' },
  { id: '00000000-0000-0000-0000-000000000010', full_name: 'Omar Dain', email: 'omar@example.com', status: 'active' },
  { id: '00000000-0000-0000-0000-000000000011', full_name: 'Ivy Cale', email: 'ivy@example.com', status: 'suspended' },
  { id: '00000000-0000-0000-0000-000000000012', full_name: 'Basil Reed', email: 'basil@example.com', status: 'banned' },
].map((user, index) => ({
  ...user,
  avatar_url: '',
  active_role: 'user',
  roles: ['user'],
  created_at: new Date(Date.UTC(2026, 1, Math.max(1, 28 - index))).toISOString(),
  updated_at: new Date(Date.UTC(2026, 1, Math.max(1, 28 - index))).toISOString(),
}));

let forceLogoutPayloads: Array<{ userId: string; reason?: string }> = [];

function isInactive(status: string): boolean {
  return status === 'suspended' || status === 'banned';
}

function buildUsersResponse(url: URL) {
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1);
  const query = (url.searchParams.get('query') ?? '').trim().toLowerCase();
  const statusTab = (url.searchParams.get('statusTab') ?? 'all') as UsersStatusTab;

  const baseFiltered = query
    ? USERS_FIXTURE.filter(
        (user) =>
          user.full_name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      )
    : USERS_FIXTURE;

  const tabCounts = {
    all: baseFiltered.length,
    active: baseFiltered.filter((user) => user.status === 'active').length,
    inactive: baseFiltered.filter((user) => isInactive(user.status)).length,
  };

  const statusFiltered =
    statusTab === 'active'
      ? baseFiltered.filter((user) => user.status === 'active')
      : statusTab === 'inactive'
        ? baseFiltered.filter((user) => isInactive(user.status))
        : baseFiltered;

  const from = (page - 1) * PAGE_SIZE;
  const users = statusFiltered.slice(from, from + PAGE_SIZE);
  const totalUsers = statusFiltered.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));

  return {
    users,
    totalUsers,
    totalPages,
    kpiCounts: {
      activeUsers: USERS_FIXTURE.filter((user) => user.status === 'active').length,
      inactiveUsers: USERS_FIXTURE.filter((user) => isInactive(user.status)).length,
      joinedThisMonth: USERS_FIXTURE.length,
    },
    tabCounts,
  };
}

test.beforeEach(async ({ page }) => {
  forceLogoutPayloads = [];

  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        data: {
          user: {
            id: '00000000-0000-0000-0000-000000000001',
            email: 'superadmin@sline.io',
            role: 'super_admin',
          },
        },
      }),
    });
  });

  await page.route('**/api/v1/users**', async (route) => {
    const requestUrl = new URL(route.request().url());
    const method = route.request().method();
    const pathParts = requestUrl.pathname.split('/').filter(Boolean);

    if (pathParts.length >= 4 && pathParts[0] === 'api' && pathParts[1] === 'v1' && pathParts[2] === 'users') {
      const userId = pathParts[3];
      const user = USERS_FIXTURE.find((entry) => entry.id === userId);

      if (pathParts.length === 4 && method === 'GET') {
        if (!user) {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({
              ok: false,
              error: {
                code: 'NOT_FOUND',
                message: 'User not found',
              },
            }),
          });
          return;
        }

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ok: true,
            data: {
              auth: {
                id: user.id,
                email: user.email,
                created_at: user.created_at,
                last_sign_in_at: user.updated_at,
                phone: '+9647000000000',
                user_metadata: {
                  full_name: user.full_name,
                  avatar_url: user.avatar_url,
                },
                app_metadata: {
                  provider: 'email',
                  role: user.active_role,
                },
                banned_until: user.status === 'banned' ? '2099-01-01T00:00:00.000Z' : null,
              },
              profile: {
                id: user.id,
                full_name: user.full_name,
                avatar_url: user.avatar_url,
                active_role: user.active_role,
                roles: user.roles,
                account_status: user.status,
                bio: 'Profile loaded from mocked users endpoint.',
              },
            },
          }),
        });
        return;
      }

      if (pathParts.length === 5 && pathParts[4] === 'investigation' && method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ok: true,
            data: {
              profile: {
                id: userId,
                full_name: '[MASKED]',
                email: '[MASKED]',
                account_status: user?.status ?? 'active',
                created_at: user?.created_at ?? new Date().toISOString(),
              },
              tasks: [
                {
                  id: '10000000-0000-0000-0000-000000000001',
                  title: 'Tender posted by user',
                  status: 'open',
                  task_type: 'tender',
                  owner_id: userId,
                  assigned_freelancer_id: null,
                  created_at: new Date().toISOString(),
                },
                {
                  id: '10000000-0000-0000-0000-000000000002',
                  title: 'Tender assigned to user',
                  status: 'assigned',
                  task_type: 'tender',
                  owner_id: '00000000-0000-0000-0000-000000009999',
                  assigned_freelancer_id: userId,
                  created_at: new Date().toISOString(),
                },
              ],
              offers: [
                {
                  id: '20000000-0000-0000-0000-000000000001',
                  status: 'rejected',
                  created_at: new Date().toISOString(),
                },
              ],
              bookings: [
                {
                  id: '30000000-0000-0000-0000-000000000001',
                  task_id: '10000000-0000-0000-0000-000000000001',
                  client_id: userId,
                  provider_id: '00000000-0000-0000-0000-000000009999',
                  status: 'pending',
                  created_at: new Date().toISOString(),
                },
                {
                  id: '30000000-0000-0000-0000-000000000002',
                  task_id: '10000000-0000-0000-0000-000000000002',
                  client_id: '00000000-0000-0000-0000-000000009998',
                  provider_id: userId,
                  status: 'canceled',
                  created_at: new Date().toISOString(),
                },
                {
                  id: '30000000-0000-0000-0000-000000000003',
                  task_id: '10000000-0000-0000-0000-000000000002',
                  client_id: '00000000-0000-0000-0000-000000009998',
                  provider_id: userId,
                  status: 'expired_unanswered',
                  created_at: new Date().toISOString(),
                },
              ],
              disputes: [],
              ledgerActivity: [],
              reportsStub: { count: 0, linkToReports: '/reports' },
              conversationsSummary: [],
            },
          }),
        });
        return;
      }

      if (pathParts.length === 5 && method === 'POST') {
        const action = pathParts[4];
        const payload = (route.request().postDataJSON?.() ?? {}) as Record<string, unknown>;

        if (action === 'force-logout') {
          forceLogoutPayloads.push({
            userId,
            reason: typeof payload.reason === 'string' ? payload.reason : undefined,
          });
        }

        if (action === 'suspend' || action === 'ban' || action === 'unban' || action === 'force-logout') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              ok: true,
              data: {
                userId,
              },
            }),
          });
          return;
        }
      }
    }

    const query = requestUrl.searchParams.get('query') ?? '';

    if (query === 'error') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'mock users failure',
          },
        }),
      });
      return;
    }

    if (query === 'slow') {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const delayedUrl = new URL(requestUrl.toString());
      delayedUrl.searchParams.set('query', '');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          data: buildUsersResponse(delayedUrl),
        }),
      });
      return;
    }

    if (query === 'empty') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          data: {
            users: [],
            totalUsers: 0,
            totalPages: 1,
            kpiCounts: {
              activeUsers: 0,
              inactiveUsers: 0,
              joinedThisMonth: 0,
            },
            tabCounts: {
              all: 0,
              active: 0,
              inactive: 0,
            },
          },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        data: buildUsersResponse(requestUrl),
      }),
    });
  });

  await page.route('**/api/v1/finance/users/**', async (route) => {
    const requestUrl = new URL(route.request().url());
    const pathParts = requestUrl.pathname.split('/').filter(Boolean);
    const userId = pathParts[pathParts.length - 1];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        data: {
          wallet: {
            available_balance: 120000,
            held_balance: 25000,
            pending_withdrawal_balance: 10000,
            currency: 'IQD',
            is_wallet_frozen: false,
          },
          timeline: {
            data: [
              {
                journal_id: '40000000-0000-0000-0000-000000000001',
                created_at: new Date().toISOString(),
                event_type: 'booking_paid',
                status: 'completed',
                entity_type: 'booking',
                entity_id: '30000000-0000-0000-0000-000000000001',
                payer_user_id: userId,
                payee_user_id: '00000000-0000-0000-0000-000000009999',
                gross_amount: 50000,
                fee_amount: 5000,
                net_amount: 45000,
              },
            ],
          },
        },
      }),
    });
  });

  await page.route('**/api/v1/team/invite', async (route) => {
    const payload = route.request().postDataJSON() as
      | { email?: string; role?: string; fullName?: string }
      | undefined;
    if (!payload?.email || !payload?.fullName || !payload?.role) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid invite payload',
          },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        data: {
          id: '00000000-0000-0000-0000-00000000inv1',
        },
      }),
    });
  });
});

test.describe('Users page', () => {
  test('renders shell and supports loading state', async ({ page }) => {
    await page.goto('/users?query=slow');
    await expect(page.getByTestId('users-table-skeleton-row').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite User' })).toBeVisible();
    await expect(page.getByText('Eros Gray')).toBeVisible();
  });

  test('search updates URL and filters rows', async ({ page }) => {
    await page.goto('/users');
    await page.getByPlaceholder('Search by name, email, ID...').fill('zahraa');
    await expect(page).toHaveURL(/query=/i);
    await expect(page.getByText('Zahraa Firas')).toBeVisible();
    await expect(page.getByText('Eros Gray')).not.toBeVisible();
  });

  test('status tabs use server filtering and URL state', async ({ page }) => {
    await page.goto('/users');
    await page.getByRole('button', { name: /^Inactive/ }).click();
    await expect(page).toHaveURL(/tab=/i);
    await expect(page.getByText('Ivy Cale')).toBeVisible();
    await expect(page.getByText('Eros Gray')).not.toBeVisible();
  });

  test('pagination updates URL and table page', async ({ page }) => {
    await page.goto('/users');
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page).toHaveURL(/page=/i);
    await expect(page.getByTestId('users-current-page')).toHaveText('2');
    await expect(page.getByText('Ivy Cale')).toBeVisible();
  });

  test('row action menu exposes detail link', async ({ page }) => {
    await page.goto('/users');
    await page.getByRole('button', { name: 'User actions' }).first().click();
    await expect(page.getByRole('button', { name: 'View Profile' })).toBeVisible();
  });

  test('view profile is wired and force logout action hits endpoint', async ({ page }) => {
    await page.goto('/users');

    await page.getByRole('button', { name: 'User actions' }).first().click();
    await page.getByRole('button', { name: 'View Profile' }).click();

    await expect(page).toHaveURL(/\/users\/00000000-0000-0000-0000-000000000001$/);
    await expect(page.getByRole('heading', { name: 'Eros Gray', level: 1 })).toBeVisible();
    await expect(page.getByText('Profile Facts')).toBeVisible();
    await expect(page.getByText('Tenders & Assignments')).toBeVisible();
    await expect(page.getByText('Bookings Overview')).toBeVisible();
    await expect(page.getByText('Wallet Situation')).toBeVisible();
    await expect(page.getByText('Cancelled / Deleted')).toBeVisible();
    await expect(page.getByText('Rejected').first()).toBeVisible();

    await page.getByRole('button', { name: 'Force Logout' }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Logout reason').fill('Security audit verification');
    await dialog.getByRole('button', { name: 'Force Logout' }).click();

    await expect.poll(() => forceLogoutPayloads.length).toBe(1);
    await expect(forceLogoutPayloads[0]?.userId).toBe('00000000-0000-0000-0000-000000000001');
    await expect(forceLogoutPayloads[0]?.reason).toBe('Security audit verification');

    await page.getByLabel('Back to users').click();
    await expect(page).toHaveURL(/\/users$/);
    await expect(page.getByText('Zahraa Firas')).toBeVisible();
  });

  test('invite user flow is wired to real team invite endpoint', async ({ page }) => {
    await page.goto('/users');
    await page.getByRole('button', { name: 'Invite User' }).click();

    await page.getByLabel('Full Name').fill('QA Invite');
    await page.getByLabel('Email address').fill('qa-invite@sline.io');
    await page.getByRole('button', { name: 'Send Invite' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('renders empty and error states', async ({ page }) => {
    await page.goto('/users');
    await page.getByPlaceholder('Search by name, email, ID...').fill('empty');
    await expect(page.getByText('No users found for this filter.')).toBeVisible();

    await page.getByPlaceholder('Search by name, email, ID...').fill('error');
    await expect(page.getByText('Error loading users: mock users failure')).toBeVisible();
  });
});
