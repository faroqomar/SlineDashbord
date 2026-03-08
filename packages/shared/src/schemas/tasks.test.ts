import { describe, expect, it } from 'vitest';
import { TaskQueueAnalyticsDataSchema } from './tasks.js';

describe('TaskQueueAnalyticsDataSchema', () => {
  it('accepts valid 7-day analytics payload', () => {
    const payload = {
      range: '7d',
      days: Array.from({ length: 7 }).map((_, index) => ({
        date: `2026-03-0${index + 1}`,
        posted_count: index,
        completed_count: index + 1,
      })),
      totals: {
        posted: 21,
        completed: 28,
      },
      generated_at: '2026-03-05T10:00:00.000Z',
    };

    const parsed = TaskQueueAnalyticsDataSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
  });

  it('rejects payloads that do not have exactly 7 days', () => {
    const payload = {
      range: '7d',
      days: [
        { date: '2026-03-01', posted_count: 1, completed_count: 1 },
      ],
      totals: {
        posted: 1,
        completed: 1,
      },
      generated_at: '2026-03-05T10:00:00.000Z',
    };

    const parsed = TaskQueueAnalyticsDataSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });
});
