'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserWalletCardProps {
  userId: string;
  wallet: any; // Using any for brevity, should use proper WalletSummary type
}

export function UserWalletCard({ userId, wallet }: UserWalletCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Wallet Summary</CardTitle>
          <div className="text-xs text-muted-foreground font-mono">{userId}</div>
        </div>
        <Badge variant={wallet.is_wallet_frozen ? 'destructive' : 'outline'}>
          {wallet.is_wallet_frozen ? 'FROZEN' : 'ACTIVE'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Available</p>
            <p className="text-2xl font-bold">{wallet.available_balance} {wallet.currency || 'IQD'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Held (Escrow)</p>
            <p className="text-2xl font-bold">{wallet.held_balance} {wallet.currency || 'IQD'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Pending Payout</p>
            <p className="text-xl font-bold text-orange-500">{wallet.pending_withdrawal_balance} {wallet.currency || 'IQD'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
