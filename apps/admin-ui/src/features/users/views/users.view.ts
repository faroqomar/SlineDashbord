import type { UsersKpiCounts } from '@sline/shared';
import { USERS_KPI_MOCK } from '../models/users-ui.mock';

export interface UsersKpiValues {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  joinedThisMonth: number;
  usesFallback: boolean;
}

function toNonNegativeInt(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value));
}

export function getUsersKpiValues(
  totalUsers: number,
  kpiCounts?: UsersKpiCounts,
): UsersKpiValues {
  if (!kpiCounts) {
    return {
      totalUsers: toNonNegativeInt(totalUsers),
      activeUsers: USERS_KPI_MOCK.activeUsers.value,
      inactiveUsers: USERS_KPI_MOCK.inactiveUsers.value,
      joinedThisMonth: USERS_KPI_MOCK.joinedThisMonth.value,
      usesFallback: true,
    };
  }

  return {
    totalUsers: toNonNegativeInt(totalUsers),
    activeUsers: toNonNegativeInt(kpiCounts.activeUsers),
    inactiveUsers: toNonNegativeInt(kpiCounts.inactiveUsers),
    joinedThisMonth: toNonNegativeInt(kpiCounts.joinedThisMonth),
    usesFallback: false,
  };
}
