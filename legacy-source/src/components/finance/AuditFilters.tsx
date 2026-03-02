'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AuditFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [actorUserId, setActorUserId] = useState(searchParams.get('actor_user_id') || '');
  const [actionType, setActionType] = useState(searchParams.get('action') || 'all');
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '');

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (actorUserId) params.set('actor_user_id', actorUserId);
    else params.delete('actor_user_id');

    if (actionType && actionType !== 'all') params.set('action', actionType);
    else params.delete('action');

    if (startDate) params.set('start_date', startDate);
    else params.delete('start_date');

    if (endDate) params.set('end_date', endDate);
    else params.delete('end_date');

    params.delete('cursor_created_at'); // Reset pagination on new filter
    params.delete('cursor_id');

    router.push(`?${params.toString()}`);
  }, [actorUserId, actionType, startDate, endDate, router, searchParams]);

  const handleExport = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('export', 'true');
    // Using simple window.open or navigating to a dedicated export route
    // Since we are adding Export capability, redirecting to the same page with ?export=true 
    // where the server component can intercept and return CSV. 
    // Alternatively, a client-side fetch fetching the CSV blob from a server action.
    window.location.href = `/api/finance/export-audit?${params.toString()}`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 pt-2">
      <Input
        placeholder="Actor UUID"
        value={actorUserId}
        onChange={(e) => setActorUserId(e.target.value)}
        className="max-w-xs"
      />
      
      <Select value={actionType} onValueChange={setActionType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Action Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Actions</SelectItem>
          <SelectItem value="client.payment.escrow_funded">Escrow Funded</SelectItem>
          <SelectItem value="admin.dispute.resolve_split">Dispute Split</SelectItem>
          <SelectItem value="admin.user.banned">User Banned</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="w-auto"
        />
        <span>to</span>
        <Input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="w-auto"
        />
      </div>

      <Button onClick={applyFilters} className="gap-2">
        <Search className="h-4 w-4" />
        Filter
      </Button>

      <Button onClick={handleExport} variant="outline" className="ml-auto gap-2">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}
