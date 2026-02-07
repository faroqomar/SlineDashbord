'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { DashboardStats } from '@/types/admin-types';

export async function getOverviewStats(): Promise<DashboardStats> {
  const supabase = await createAdminClient();

  // Parallelize queries for performance
  const [
    { count: totalUsers },
    { count: activeJobs },
    { count: pendingDisputes }, // We might need a Disputes table or status query
    // For revenue, we might need to sum up transactions or use a dedicated stats table. For now, we'll mock or sum if possible.
    // { data: revenueData } 
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
     // Assuming we don't have a disputes table yet based on previous file view, we might check 'issues' or similar if it exists, or just mock/0 for now if table missing.
     // Looking at types/supabase.ts in previous turn, I didn't see 'disputes'. I saw 'activity_log'.
     // I will use 0 for disputes for now until I confirm the table.
     Promise.resolve({ count: 0 }),
  ]);
  
  // Revenue calculation (Mocked or simple sum if table exists)
  // Let's try to get sum from wallet_transactions where type is 'platform_fee' or similar if standard.
  // For MVP/Phase 2.2, simple count is enough. I will return 0 for revenue if complex calc is needed.
  
  return {
    totalUsers: totalUsers || 0,
    activeJobs: activeJobs || 0,
    revenue: 0, // Placeholder until revenue model is clear
    pendingDisputes: pendingDisputes || 0,
  };
}
