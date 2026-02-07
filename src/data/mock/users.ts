export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User" | "Moderator";
  status: "Active" | "Suspended" | "Pending";
  joinDate: string;
  avatar: string;
  spent: string;
  rating: number;
}

const ROLES = ["Admin", "User", "Moderator"] as const;
const STATUSES = ["Active", "Suspended", "Pending"] as const;

export const MOCK_USERS: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `usr_${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ROLES[Math.floor(Math.random() * ROLES.length)],
  status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
  joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
  avatar: `https://i.pravatar.cc/150?u=${i + 1}`,
  spent: `$${(Math.random() * 1000).toFixed(2)}`,
  rating: Number((Math.random() * 5).toFixed(1)),
}));
