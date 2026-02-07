import { Database } from './supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
// User type is not directly available in public schema tables, using Profile instead or custom type
// export type User = Database['public']['Tables']['users']['Row'];

export interface UserDTO {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null; // Derived from metadata or profiles
  status: 'active' | 'banned' | 'suspended';
  created_at: string | null;
  last_sign_in_at?: string | null;
}

export interface DashboardStats {
  totalUsers: number;
  activeJobs: number;
  revenue: number;
  pendingDisputes: number;
}
