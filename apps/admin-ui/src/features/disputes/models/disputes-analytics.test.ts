import { describe, expect, it } from 'vitest';
import type { DisputeDTO } from './dispute.schema';
import { buildDisputesAnalytics } from './disputes-analytics';

const now = new Date('2026-03-10T12:00:00.000Z');
let idSeed = 0;

function nextId(): string {
  idSeed += 1;
  return `00000000-0000-0000-0000-${String(idSeed).padStart(12, '0')}`;
}

function makeDispute(partial: Partial<DisputeDTO>): DisputeDTO {
  return {
    id: partial.id ?? nextId(),
    task_id: partial.task_id ?? nextId(),
    complainant: partial.complainant ?? {
      id: nextId(),
      full_name: 'Complainant',
      avatar_url: '',
    },
    defendant: partial.defendant ?? {
      id: nextId(),
      full_name: 'Defendant',
      avatar_url: '',
    },
    reason: partial.reason ?? 'Reason',
    status: partial.status ?? 'open',
    created_at: partial.created_at ?? now.toISOString(),
    updated_at: partial.updated_at ?? now.toISOString(),
    amount: partial.amount ?? 0,
    resolved_at: partial.resolved_at,
    category: partial.category,
    severity: partial.severity,
    comments_count: partial.comments_count,
    task: partial.task ?? { id: nextId(), title: 'Task', budget: 0 },
  };
}

describe('buildDisputesAnalytics', () => {
  it('builds trend arrays and KPI deltas from real dispute rows', () => {
    const disputes: DisputeDTO[] = [
      makeDispute({ created_at: '2026-03-09T08:00:00.000Z', status: 'open', amount: 100 }),
      makeDispute({ created_at: '2026-03-08T08:00:00.000Z', resolved_at: '2026-03-10T09:00:00.000Z', status: 'resolved', amount: 200 }),
      makeDispute({ created_at: '2026-03-07T08:00:00.000Z', status: 'active', amount: 300 }),
      makeDispute({ created_at: '2026-03-01T08:00:00.000Z', status: 'open', amount: 150 }),
      makeDispute({ created_at: '2026-02-28T08:00:00.000Z', resolved_at: '2026-03-02T09:00:00.000Z', status: 'resolved', amount: 250 }),
    ];

    const result = buildDisputesAnalytics(disputes, now);

    expect(result.trend.opened).toHaveLength(7);
    expect(result.trend.resolved).toHaveLength(7);
    expect(result.deltas.totalDisputes.label).toBe('+50%');
    expect(result.deltas.totalDisputes.direction).toBe('up');
    expect(result.deltas.openActive.label).toBe('+1');
    expect(result.deltas.resolved.label).toBe('0');
    expect(result.deltas.totalAmount.label).toBe('+50%');
  });

  it('returns stable zeroed analytics for empty data', () => {
    const result = buildDisputesAnalytics([], now);

    expect(result.trend.opened).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(result.trend.resolved).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(result.deltas.totalDisputes.label).toBe('0%');
    expect(result.deltas.openActive.label).toBe('0');
    expect(result.deltas.resolved.label).toBe('0');
    expect(result.deltas.totalAmount.label).toBe('0%');
  });
});
