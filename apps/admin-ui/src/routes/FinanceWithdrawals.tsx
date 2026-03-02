import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { financeApi } from '../features/finance/services/finance_api';
import { WithdrawalsTable } from '../features/finance/components/WithdrawalsTable';

export function FinanceWithdrawalsPage() {
  const search = useSearch({ from: '/finance/withdrawals' as any }) as any;
  const cursor = search.cursor_created_at && search.cursor_id 
    ? { created_at: String(search.cursor_created_at), id: String(search.cursor_id) }
    : undefined;

  const filters = {
    status: search.status,
    limit: 50,
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['finance', 'withdrawals', filters, cursor],
    queryFn: () => financeApi.getWithdrawals(filters, cursor as any),
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading withdrawal requests...</div>;
  if (isError) return <div className="p-8 text-center text-destructive font-bold">Error loading withdrawals: {error?.message}</div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="rounded-md border bg-card">
        <WithdrawalsTable 
          initialData={data?.data || []} 
          nextCursor={data?.nextCursor} 
          statusFilter={filters.status} 
        />
      </div>
    </div>
  );
}
