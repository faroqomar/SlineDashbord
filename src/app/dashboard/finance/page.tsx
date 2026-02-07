"use client";

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
import { MOCK_TRANSACTIONS } from "@/data/mock/finance";
import { ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinancePage() {
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
            {MOCK_TRANSACTIONS.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{txn.user.name}</span>
                    <span className="text-xs text-muted-foreground">{txn.user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className="font-normal">
                    {txn.type}
                   </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{txn.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      txn.status === 'Cleared' ? 'bg-success/10 text-success border-success/20' : 
                      txn.status === 'Failed' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                      'bg-warning/10 text-warning border-warning/20'
                    }
                  >
                    {txn.status}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-medium ${
                    txn.type === 'Deposit' || txn.type === 'Fee' ? 'text-success' : ''
                }`}>
                  {txn.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
