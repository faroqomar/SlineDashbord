export const USERS_KPI_MOCK = {
  activeUsers: {
    value: 4,
    isMock: true,
  },
  inactiveUsers: {
    value: 0,
    isMock: true,
  },
  joinedThisMonth: {
    value: 0,
    isMock: true,
  },
} as const;

export const USERS_INVITE_ACTION_MOCK = {
  isMock: true,
  message: 'Invite User flow is not implemented for the Users page yet.',
} as const;
