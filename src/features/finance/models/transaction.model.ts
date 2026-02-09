export interface Transaction {
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

export interface TransactionListResult {
  transactions: Transaction[];
  total: number;
  totalPages: number;
}
