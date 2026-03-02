export const dynamic = 'force-dynamic';
import { getTransactionsPaginated, TransactionFilters } from '@/features/finance/actions/queries';
import { TransactionsTable } from '@/features/finance/components/TransactionsTable';

export default async function FinanceTransactionsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await searchParams;
  const cursor_created_at = resolvedParams.cursor_created_at;
  const cursor_id = resolvedParams.cursor_id;
  
  const filters: TransactionFilters = {
    event_type: resolvedParams.event_type,
    status: resolvedParams.status,
    limit: 50,
  };
  
  const cursor = cursor_created_at && cursor_id ? { created_at: cursor_created_at, journal_id: cursor_id } : undefined;

  const result = await getTransactionsPaginated(filters, cursor);
  if (!result.success) throw new Error(result.error);
  const { data, nextCursor } = result.data;

  // Note: we inject the component here. We will build TransactionsTable next.
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <TransactionsTable initialData={data} nextCursor={nextCursor} filters={filters} />
      </div>
    </div>
  );
}
