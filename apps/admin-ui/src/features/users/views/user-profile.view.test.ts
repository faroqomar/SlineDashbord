import { describe, expect, it } from 'vitest';
import {
  buildBookingBuckets,
  buildTenderBuckets,
  formatProfileDate,
  formatProfileDateTime,
  formatProfileValue,
  getStatusTone,
  resolveUserProfileActions,
} from './user-profile.view';

describe('user-profile.view', () => {
  it('formats field values with fallback', () => {
    expect(formatProfileValue(undefined)).toBe('--');
    expect(formatProfileValue('')).toBe('--');
    expect(formatProfileValue('  value  ')).toBe('value');
  });

  it('formats dates and datetimes with safe fallback', () => {
    const raw = '2026-03-05T10:20:30.000Z';
    expect(formatProfileDate(raw)).toBe(new Date(raw).toLocaleDateString());
    expect(formatProfileDateTime(raw)).toBe(new Date(raw).toLocaleString());
    expect(formatProfileDate('invalid')).toBe('--');
    expect(formatProfileDateTime('invalid')).toBe('--');
  });

  it('returns status tone metadata', () => {
    const activeTone = getStatusTone('active');
    expect(activeTone.label).toBe('Active');
    expect(activeTone.badgeClass).toContain('#2cb562');
  });

  it('resolves action matrix by status', () => {
    const activeActions = resolveUserProfileActions('active');
    const bannedActions = resolveUserProfileActions('banned');

    expect(activeActions.find((action) => action.kind === 'suspend')?.isEnabled).toBe(true);
    expect(activeActions.find((action) => action.kind === 'unban')?.isEnabled).toBe(false);

    expect(bannedActions.find((action) => action.kind === 'unban')?.isEnabled).toBe(true);
    expect(bannedActions.find((action) => action.kind === 'ban')?.isEnabled).toBe(false);
    expect(bannedActions.find((action) => action.kind === 'forceLogout')?.isEnabled).toBe(true);
  });

  it('builds tender buckets by user role/status', () => {
    const buckets = buildTenderBuckets(
      {
        profile: {
          id: '00000000-0000-0000-0000-000000000001',
          full_name: 'Masked',
          email: '[MASKED]',
        },
        tasks: [
          {
            id: '00000000-0000-0000-0000-000000000101',
            title: 'Tender 1',
            status: 'open',
            task_type: 'tender',
            owner_id: 'u-1',
            assigned_freelancer_id: null,
            created_at: '2026-03-05T00:00:00.000Z',
          },
          {
            id: '00000000-0000-0000-0000-000000000102',
            title: 'Tender 2',
            status: 'assigned',
            task_type: 'tender',
            owner_id: 'u-2',
            assigned_freelancer_id: 'u-1',
            created_at: '2026-03-04T00:00:00.000Z',
          },
          {
            id: '00000000-0000-0000-0000-000000000103',
            title: 'Tender 3',
            status: 'canceled',
            task_type: 'tender',
            owner_id: 'u-3',
            assigned_freelancer_id: null,
            created_at: '2026-03-03T00:00:00.000Z',
          },
        ],
        offers: [
          {
            id: '00000000-0000-0000-0000-000000000201',
            status: 'rejected',
            created_at: '2026-03-01T00:00:00.000Z',
          },
        ],
        bookings: [],
        disputes: [],
        ledgerActivity: [],
        reportsStub: { count: 0, linkToReports: '/reports' },
        conversationsSummary: [],
      },
      'u-1',
    );

    expect(buckets.find((bucket) => bucket.key === 'all-tenders')?.items).toHaveLength(3);
    expect(buckets.find((bucket) => bucket.key === 'posted-tenders')?.items).toHaveLength(1);
    expect(buckets.find((bucket) => bucket.key === 'assigned-tenders')?.items).toHaveLength(1);
    expect(buckets.find((bucket) => bucket.key === 'taken-tenders')?.items).toHaveLength(1);
    expect(buckets.find((bucket) => bucket.key === 'canceled-tenders')?.items).toHaveLength(1);
    expect(buckets.find((bucket) => bucket.key === 'rejected-offers')?.items).toHaveLength(1);
  });

  it('builds booking buckets including canceled/rejected states', () => {
    const buckets = buildBookingBuckets(
      {
        profile: {
          id: '00000000-0000-0000-0000-000000000001',
          full_name: 'Masked',
          email: '[MASKED]',
        },
        tasks: [],
        offers: [],
        bookings: [
          {
            id: '00000000-0000-0000-0000-000000000301',
            client_id: 'u-1',
            provider_id: 'u-2',
            status: 'pending',
            created_at: '2026-03-05T00:00:00.000Z',
          },
          {
            id: '00000000-0000-0000-0000-000000000302',
            client_id: 'u-3',
            provider_id: 'u-1',
            status: 'active',
            created_at: '2026-03-04T00:00:00.000Z',
          },
          {
            id: '00000000-0000-0000-0000-000000000303',
            client_id: 'u-3',
            provider_id: 'u-1',
            status: 'canceled',
            created_at: '2026-03-03T00:00:00.000Z',
          },
          {
            id: '00000000-0000-0000-0000-000000000304',
            client_id: 'u-3',
            provider_id: 'u-1',
            status: 'expired_unanswered',
            created_at: '2026-03-02T00:00:00.000Z',
          },
        ],
        disputes: [],
        ledgerActivity: [],
        reportsStub: { count: 0, linkToReports: '/reports' },
        conversationsSummary: [],
      },
      'u-1',
    );

    expect(buckets.find((bucket) => bucket.key === 'all-bookings')?.items).toHaveLength(4);
    expect(buckets.find((bucket) => bucket.key === 'posted-bookings')?.items).toHaveLength(3);
    expect(buckets.find((bucket) => bucket.key === 'booked-bookings')?.items).toHaveLength(1);
    expect(buckets.find((bucket) => bucket.key === 'taken-bookings')?.items).toHaveLength(1);
    expect(buckets.find((bucket) => bucket.key === 'canceled-bookings')?.items).toHaveLength(1);
    expect(buckets.find((bucket) => bucket.key === 'rejected-bookings')?.items).toHaveLength(1);
  });
});
