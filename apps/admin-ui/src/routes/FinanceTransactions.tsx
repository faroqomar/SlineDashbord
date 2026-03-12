import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { financeApi } from '../features/finance/services/finance_api';
import { TransactionsTable } from '../features/finance/components/TransactionsTable';

export function FinanceTransactionsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = {
    cursor_created_at: params.get('cursor_created_at') ?? undefined,
    cursor_id: params.get('cursor_id') ?? undefined,
    event_type: params.get('event_type') ?? undefined,
    status: params.get('status') ?? undefined,
  };
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
