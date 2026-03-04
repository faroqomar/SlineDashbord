// apps/admin-ui/src/mocks/story-data.ts

export const mockUsers = [
  {
    id: 'usr_1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Active',
    joinedAt: '2023-01-15',
  },
  {
    id: 'usr_2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Moderator',
    status: 'Inactive',
    joinedAt: '2023-04-20',
  },
  {
    id: 'usr_3',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    role: 'User',
    status: 'Active',
    joinedAt: '2023-08-05',
  },
  {
    id: 'usr_4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'Admin',
    status: 'Suspended',
    joinedAt: '2022-11-30',
  },
];

export const mockTransactions = [
  {
    id: 'txn_1001',
    amount: 250.0,
    currency: 'USD',
    status: 'Completed',
    date: '2023-10-01T10:00:00Z',
  },
  {
    id: 'txn_1002',
    amount: -50.0,
    currency: 'USD',
    status: 'Pending',
    date: '2023-10-02T14:30:00Z',
  },
  {
    id: 'txn_1003',
    amount: 1200.0,
    currency: 'USD',
    status: 'Failed',
    date: '2023-10-03T09:15:00Z',
  },
];
