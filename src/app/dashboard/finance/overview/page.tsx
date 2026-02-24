import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlatformMetrics, getTransactionsPaginated } from '@/features/finance/actions/queries';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TransactionsTable } from '@/features/finance/components/TransactionsTable';

export const dynamic = 'force-dynamic';

export default async function FinanceOverviewPage() {
  // Parallel fetch for metrics and recent transactions
  const [metricsResult, txnResult] = await Promise.all([
    getPlatformMetrics(),
    getTransactionsPaginated({ limit: 10 }),
  ]);

  // Unwrap ServiceResult — error boundary catches if these throw
  if (!metricsResult.success) throw new Error(metricsResult.error);
  if (!txnResult.success) throw new Error(txnResult.error);

  const metrics = metricsResult.data;
  const { data: recentTransactions, nextCursor } = txnResult.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Cash (IQD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-IQ', { style: 'currency', currency: 'IQD' }).format(metrics.platform_cash)}
            </div>
            <p className="text-xs text-muted-foreground">Available operational balance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Escrow Held (IQD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-IQ', { style: 'currency', currency: 'IQD' }).format(metrics.escrow_held)}
            </div>
            <p className="text-xs text-muted-foreground">Locked in active bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-IQ', { style: 'currency', currency: 'IQD' }).format(metrics.lifetime_revenue)}
            </div>
            <p className="text-xs text-success flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" /> Total platform fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pending_withdrawals || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Recent Transactions</h3>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/transactions">View All</Link>
          </Button>
        </div>
        <TransactionsTable initialData={recentTransactions} nextCursor={nextCursor} filters={{}} />
      </div>
    </div>
  );
}
