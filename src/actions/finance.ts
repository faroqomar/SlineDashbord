'use server';

import { createAdminClient } from '@/lib/supabase/admin';

import { Transaction, TransactionListResult } from '@/features/finance/models/transaction.model';

export async function getTransactions(
  page: number = 1,
  type: string = 'all',
  pageSize: number = 10
): Promise<TransactionListResult> {
  const supabase = createAdminClient();
  const offset = (page - 1) * pageSize;

  let dbQuery = supabase
    .from('wallet_transactions')
    .select('*, user:profiles!user_id(full_name, email, avatar_url)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (type && type !== 'all') {
    dbQuery = dbQuery.eq('type', type);
  }

  const { data, count, error } = await dbQuery;

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  // Cast existing data to Transaction[] (assuming DB matches model)
  const transactions = (data || []) as unknown as Transaction[];

  return {
    transactions,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
