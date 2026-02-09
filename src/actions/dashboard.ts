'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export interface DashboardStats {
  activeUsers: number;
  platformRevenue: number;
  openDisputes: number;
  activeDisputes: number;
}

export async function getOverviewStats(): Promise<DashboardStats> {
  const supabase = createAdminClient();

  // Parallelize queries for performance
  const [profilesResult, revenueResult, disputesResult] = await Promise.all([
    // 1. Count active profiles
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),

    // 2. Sum platform revenue (platform_fee)
    // Note: Supabase doesn't support sum() directly in JS client easily without .rpc or fetching all.
    // We'll fetch the records for now, assuming volume isn't massive yet, or use a simplified approach.
    // Ideally, we should use an RPC function for aggregation.
    supabase
      .from('wallet_transactions')
      .select('amount')
      .eq('type', 'platform_fee'),

    // 3. Count open disputes
    supabase
      .from('disputes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open'),
  ]);

  const activeUsers = profilesResult.count || 0;
  const openDisputes = disputesResult.count || 0;
  
  // Calculate revenue from fetched records
  const platformRevenue = (revenueResult.data || []).reduce(
    (sum, txn) => sum + (Number(txn.amount) || 0),
    0
  );

  return {
    activeUsers,
    platformRevenue,
    openDisputes,
    activeDisputes: openDisputes, // mapping open to active for now
  };
}
