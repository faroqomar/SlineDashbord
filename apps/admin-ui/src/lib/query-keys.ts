/**
 * Standardized Query Key Factories to ensure cache consistency.
 * Follows the pattern: [domain, type, filters/id]
 */
export const QUERY_KEYS = {
  users: {
    all: ['users'] as const,
    list: (filters: any) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
    investigation: (id: string) => ['users', 'investigation', id] as const,
  },
  finance: {
    all: ['finance'] as const,
    transactions: (filters: any) => ['finance', 'transactions', filters] as const,
    withdrawals: (status: string) => ['finance', 'withdrawals', status] as const,
  },
  team: {
    all: ['team'] as const,
    members: ['team', 'members'] as const,
  },
  disputes: {
    all: ['disputes'] as const,
    list: (status: string) => ['disputes', 'list', status] as const,
    detail: (id: string) => ['disputes', 'detail', id] as const,
  },
};
