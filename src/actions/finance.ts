'use server';

import { createAdminClient } from '@/lib/supabase/admin';

// Legacy types for the frozen wallet_transactions table (pre-ledger system)
interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  user?: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}

interface TransactionListResult {
  transactions: Transaction[];
  total: number;
  totalPages: number;
}

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
