import { describe, expect, it } from 'vitest';
import { getUsersKpiValues } from './users.view';

describe('getUsersKpiValues', () => {
  it('prefers real API counts when provided', () => {
    const values = getUsersKpiValues(25, {
      activeUsers: 20,
      inactiveUsers: 5,
      joinedThisMonth: 3,
    });

    expect(values.totalUsers).toBe(25);
    expect(values.activeUsers).toBe(20);
    expect(values.inactiveUsers).toBe(5);
    expect(values.joinedThisMonth).toBe(3);
    expect(values.usesFallback).toBe(false);
  });

  it('falls back to mock counts when API counts are missing', () => {
    const values = getUsersKpiValues(4);

    expect(values.totalUsers).toBe(4);
    expect(values.activeUsers).toBe(4);
    expect(values.inactiveUsers).toBe(0);
    expect(values.joinedThisMonth).toBe(0);
    expect(values.usesFallback).toBe(true);
  });
});
