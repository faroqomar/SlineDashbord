import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { financeApi } from '../features/finance/services/finance_api';
import { TransactionsTable } from '../features/finance/components/TransactionsTable';

export function FinanceTransactionsPage() {
  const search = useSearch({ from: '/finance/transactions' as any }) as any;
  const cursor = search.cursor_created_at && search.cursor_id 
    ? { created_at: String(search.cursor_created_at), journal_id: String(search.cursor_id) }
    : undefined;

  const filters = {
    event_type: search.event_type,
    status: search.status,
    limit: 50,
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['finance', 'transactions', filters, cursor],
    queryFn: () => financeApi.getTransactions(filters, cursor as any),
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading transactions ledger...</div>;
  if (isError) return <div className="p-8 text-center text-destructive font-bold">Error loading ledger: {error?.message}</div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="rounded-md border bg-card">
        <TransactionsTable 
          initialData={data?.data || []} 
          nextCursor={data?.nextCursor} 
          filters={filters} 
        />
      </div>
    </div>
  );
}
