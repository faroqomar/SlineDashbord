export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  status: 'active' | 'suspended' | 'banned';
  roles: string[]; // e.g., ['client', 'freelancer']
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface UserListResult {
  users: UserProfile[];
  total: number;
  totalPages: number;
}
