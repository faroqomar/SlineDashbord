import { describe, it, expect } from 'vitest';
import { LogListQuerySchema, LogListResponseSchema } from './logs.js';

describe('logs schemas', () => {
  it('parses log list query defaults', () => {
    const parsed = LogListQuerySchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.page).toBe(1);
      expect(parsed.data.limit).toBe(10);
    }
  });

  it('parses valid logs response', () => {
    const parsed = LogListResponseSchema.safeParse({
      logs: [
        {
          id: '00000000-0000-0000-0000-000000000001',
          action: 'admin.case.create',
          actorUserId: '00000000-0000-0000-0000-000000000002',
          actorName: 'Admin User',
          entityType: 'case',
          entityId: '00000000-0000-0000-0000-000000000003',
          level: 'info',
          source: 'dashboard',
          message: 'Case created',
          eventCode: null,
          requestId: null,
          href: null,
          createdAt: new Date().toISOString(),
          meta: { source: 'dashboard' },
        },
      ],
      count: 1,
      totalPages: 1,
      page: 1,
      sourceOptions: ['dashboard'],
      summary: { total: 1, critical: 0, error: 0, warning: 0, info: 1, debug: 0 },
      hourlyBuckets: [],
    });

    expect(parsed.success).toBe(true);
  });
});
