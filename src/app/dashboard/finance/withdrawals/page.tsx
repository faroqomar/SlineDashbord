export const dynamic = 'force-dynamic';
import { getWithdrawals } from '@/features/finance/actions/queries';
import { WithdrawalsTable } from '@/features/finance/components/WithdrawalsTable';

export default async function FinanceWithdrawalsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await searchParams;
  const cursor_created_at = resolvedParams.cursor_created_at;
  const cursor_id = resolvedParams.cursor_id;
  const statusFilter = resolvedParams.status;
  
  const filters: { status?: string; limit?: number } = {
    status: statusFilter,
    limit: 50,
  };
  
  const cursor = cursor_created_at && cursor_id ? { created_at: cursor_created_at, id: cursor_id } : undefined;

  const result = await getWithdrawals(filters, cursor);
  if (!result.success) throw new Error(result.error);
  const { data, nextCursor } = result.data;

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <WithdrawalsTable initialData={data} nextCursor={nextCursor} statusFilter={statusFilter} />
      </div>
    </div>
  );
}
