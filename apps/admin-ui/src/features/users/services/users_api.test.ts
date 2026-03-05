import { beforeEach, describe, expect, it, vi } from 'vitest';
import { request } from '@/lib/api';
import {
  getUserDetails,
  getUserInvestigation,
  getUserWalletLookup,
  getUsers,
} from './users_api';

vi.mock('@/lib/api', () => ({
  request: vi.fn(),
}));

describe('users_api.getUsers', () => {
  const requestMock = vi.mocked(request);

  beforeEach(() => {
    requestMock.mockReset();
  });

  it('passes statusTab query and normalizes kpi/tab counts', async () => {
    requestMock.mockResolvedValue({
      ok: true,
      data: {
        users: [
          {
            id: 'u-1',
            email: 'eros@example.com',
            full_name: 'Eros Gray',
            active_role: 'user',
            roles: ['user'],
            account_status: 'active',
            created_at: '2026-02-10T00:00:00.000Z',
            updated_at: '2026-02-10T00:00:00.000Z',
          },
        ],
        totalUsers: 12,
        totalPages: 2,
        kpiCounts: {
          activeUsers: 10,
          inactiveUsers: 2,
          joinedThisMonth: 6,
        },
        tabCounts: {
          all: 12,
          active: 10,
          inactive: 2,
        },
      },
    } as any);

    const result = await getUsers(2, 'eros', 'all', 'inactive');

    expect(requestMock).toHaveBeenCalledWith(
      'GET',
      expect.stringContaining('statusTab=inactive'),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalUsers).toBe(12);
      expect(result.data.kpiCounts).toEqual({
        activeUsers: 10,
        inactiveUsers: 2,
        joinedThisMonth: 6,
      });
      expect(result.data.tabCounts).toEqual({
        all: 12,
        active: 10,
        inactive: 2,
      });
    }
  });

  it('drops malformed tabCounts payloads', async () => {
    requestMock.mockResolvedValue({
      ok: true,
      data: {
        users: [],
        totalUsers: 0,
        totalPages: 0,
        kpiCounts: {
          activeUsers: 0,
          inactiveUsers: 0,
          joinedThisMonth: 0,
        },
        tabCounts: {
          all: 'bad',
          active: 0,
          inactive: 0,
        },
      },
    } as any);

    const result = await getUsers(1, '', 'all', 'all');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tabCounts).toBeUndefined();
    }
  });
});

describe('users_api.getUserDetails', () => {
  const requestMock = vi.mocked(request);

  beforeEach(() => {
    requestMock.mockReset();
  });

  it('maps auth/profile payload to profile DTO', async () => {
    requestMock.mockResolvedValue({
      ok: true,
      data: {
        auth: {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'eros@example.com',
          created_at: '2026-02-10T00:00:00.000Z',
          last_sign_in_at: '2026-02-11T00:00:00.000Z',
          phone: '+9647000000000',
          user_metadata: {
            full_name: 'Eros Gray',
            avatar_url: 'https://cdn.sline.io/a.png',
          },
          app_metadata: {
            provider: 'email',
            role: 'admin',
          },
        },
        profile: {
          full_name: 'Eros Gray',
          active_role: 'admin',
          roles: ['admin', 'support'],
          account_status: 'suspended',
          bio: 'Risk operations admin',
        },
      },
    } as any);

    const result = await getUserDetails('00000000-0000-0000-0000-000000000001');

    expect(requestMock).toHaveBeenCalledWith(
      'GET',
      '/users/00000000-0000-0000-0000-000000000001',
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.full_name).toBe('Eros Gray');
      expect(result.data.roles).toEqual(['admin', 'support']);
      expect(result.data.status).toBe('suspended');
      expect(result.data.auth_provider).toBe('email');
      expect(result.data.phone).toBe('+9647000000000');
      expect(result.data.metadata).toEqual({
        full_name: 'Eros Gray',
        avatar_url: 'https://cdn.sline.io/a.png',
      });
    }
  });

  it('returns API error when detail request fails', async () => {
    requestMock.mockResolvedValue({
      ok: false,
      error: {
        message: 'User not found',
      },
    } as any);

    const result = await getUserDetails('00000000-0000-0000-0000-000000000099');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('User not found');
    }
  });
});

describe('users_api.profile-activity endpoints', () => {
  const requestMock = vi.mocked(request);

  beforeEach(() => {
    requestMock.mockReset();
  });

  it('gets investigation graph', async () => {
    requestMock.mockResolvedValue({
      ok: true,
      data: {
        profile: {
          id: '00000000-0000-0000-0000-000000000001',
          full_name: '[MASKED]',
          email: '[MASKED]',
        },
        tasks: [],
        offers: [],
        bookings: [],
        disputes: [],
        ledgerActivity: [],
        reportsStub: { count: 0, linkToReports: '/reports' },
        conversationsSummary: [],
      },
    } as any);

    const result = await getUserInvestigation('00000000-0000-0000-0000-000000000001');

    expect(requestMock).toHaveBeenCalledWith(
      'GET',
      '/users/00000000-0000-0000-0000-000000000001/investigation',
    );
    expect(result.success).toBe(true);
  });

  it('gets wallet lookup payload', async () => {
    requestMock.mockResolvedValue({
      ok: true,
      data: {
        wallet: {
          available_balance: 1000,
          held_balance: 200,
          pending_withdrawal_balance: 50,
          currency: 'IQD',
          is_wallet_frozen: false,
        },
        timeline: {
          data: [],
        },
      },
    } as any);

    const result = await getUserWalletLookup('00000000-0000-0000-0000-000000000001');
    expect(requestMock).toHaveBeenCalledWith(
      'GET',
      '/finance/users/00000000-0000-0000-0000-000000000001',
    );
    expect(result.success).toBe(true);
  });
});
