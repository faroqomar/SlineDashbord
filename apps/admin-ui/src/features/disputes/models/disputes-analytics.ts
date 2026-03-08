import type { DisputeDTO } from './dispute.schema';

export type DeltaDirection = 'up' | 'down' | 'flat';

export interface DisputesDeltaMetric {
  value: number;
  delta: number;
  direction: DeltaDirection;
  label: string;
}

export interface DisputesAnalytics {
  trend: {
    opened: number[];
    resolved: number[];
  };
  deltas: {
    totalDisputes: DisputesDeltaMetric;
    openActive: DisputesDeltaMetric;
    resolved: DisputesDeltaMetric;
    totalAmount: DisputesDeltaMetric;
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVE_STATUSES = new Set(['open', 'in_progress']);

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toDayKey(value: unknown): string | null {
  const parsed = Date.parse(String(value ?? ''));
  if (Number.isNaN(parsed)) return null;
  return dayKey(startOfUtcDay(new Date(parsed)));
}

function sum(values: number[]): number {
  return values.reduce((total, current) => total + current, 0);
}

function toNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function toDirection(delta: number): DeltaDirection {
  if (delta > 0) return 'up';
  if (delta < 0) return 'down';
  return 'flat';
}

function formatDelta(delta: number, mode: 'number' | 'percent'): string {
  const rounded = Math.round(delta);
  const sign = rounded > 0 ? '+' : '';
  if (mode === 'percent') {
    return `${sign}${rounded}%`;
  }
  return `${sign}${rounded}`;
}

function percentDelta(current: number, previous: number): number {
  if (previous === 0) {
    if (current === 0) return 0;
    return 100;
  }
  return ((current - previous) / previous) * 100;
}

function makeMetric(value: number, delta: number, mode: 'number' | 'percent'): DisputesDeltaMetric {
  return {
    value,
    delta,
    direction: toDirection(delta),
    label: formatDelta(delta, mode),
  };
}

export function buildDisputesAnalytics(disputes: DisputeDTO[], nowDate: Date = new Date()): DisputesAnalytics {
  const now = startOfUtcDay(nowDate);
  const keys: string[] = [];
  for (let offset = 13; offset >= 0; offset -= 1) {
    keys.push(dayKey(new Date(now.getTime() - offset * DAY_MS)));
  }

  const indexByKey = new Map(keys.map((key, index) => [key, index]));
  const opened = Array.from({ length: 14 }, () => 0);
  const resolved = Array.from({ length: 14 }, () => 0);
  const amount = Array.from({ length: 14 }, () => 0);
  const openActive = Array.from({ length: 14 }, () => 0);

  for (const dispute of disputes) {
    const createdKey = toDayKey(dispute.created_at);
    if (createdKey) {
      const createdIndex = indexByKey.get(createdKey);
      if (createdIndex !== undefined) {
        opened[createdIndex] += 1;
        amount[createdIndex] += toNumber(dispute.amount);
        if (ACTIVE_STATUSES.has(dispute.status)) {
          openActive[createdIndex] += 1;
        }
      }
    }

    if (dispute.status === 'resolved') {
      const resolvedKey = toDayKey(dispute.resolved_at ?? dispute.created_at);
      if (resolvedKey) {
        const resolvedIndex = indexByKey.get(resolvedKey);
        if (resolvedIndex !== undefined) {
          resolved[resolvedIndex] += 1;
        }
      }
    }
  }

  const previousWindow = {
    opened: opened.slice(0, 7),
    resolved: resolved.slice(0, 7),
    amount: amount.slice(0, 7),
    openActive: openActive.slice(0, 7),
  };

  const currentWindow = {
    opened: opened.slice(7),
    resolved: resolved.slice(7),
    amount: amount.slice(7),
    openActive: openActive.slice(7),
  };

  const currentOpened = sum(currentWindow.opened);
  const previousOpened = sum(previousWindow.opened);
  const currentResolved = sum(currentWindow.resolved);
  const previousResolved = sum(previousWindow.resolved);
  const currentOpenActive = sum(currentWindow.openActive);
  const previousOpenActive = sum(previousWindow.openActive);
  const currentAmount = sum(currentWindow.amount);
  const previousAmount = sum(previousWindow.amount);

  const totalDisputesDelta = percentDelta(currentOpened, previousOpened);
  const totalAmountDelta = percentDelta(currentAmount, previousAmount);

  return {
    trend: {
      opened: currentWindow.opened,
      resolved: currentWindow.resolved,
    },
    deltas: {
      totalDisputes: makeMetric(currentOpened, totalDisputesDelta, 'percent'),
      openActive: makeMetric(currentOpenActive, currentOpenActive - previousOpenActive, 'number'),
      resolved: makeMetric(currentResolved, currentResolved - previousResolved, 'number'),
      totalAmount: makeMetric(currentAmount, totalAmountDelta, 'percent'),
    },
  };
}
