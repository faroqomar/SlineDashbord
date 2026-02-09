import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTransactions } from "@/actions/finance";

export default async function FinancePage() {
  const { transactions } = await getTransactions(1, 'all', 20);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finance Treasury</h2>
          <p className="text-muted-foreground">Monitor all system transactions and payouts.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,592.00</div>
            <p className="text-xs text-muted-foreground">Available for payout</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234.00</div>
            <p className="text-xs text-muted-foreground">Processing (24-48h)</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,392.12</div>
            <p className="text-xs text-success flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn: any) => (
              <TableRow key={txn.id}>
                <TableCell className="font-mono text-xs">{txn.id.slice(0, 8)}...</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{txn.user?.full_name || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">{txn.user?.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className="font-normal">
                    {txn.type}
                   </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                    {new Date(txn.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      txn.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      txn.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      'bg-orange-500/10 text-orange-500 border-orange-500/20'
                    }
                  >
                    {txn.status}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-medium ${
                    txn.type === 'deposit' || txn.type === 'platform_fee' ? 'text-green-500' : ''
                }`}>
                  ${txn.amount}
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No transactions found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
