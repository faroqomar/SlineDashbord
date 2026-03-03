import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGlobalSearchViewModel } from '../viewmodels/useGlobalSearch.vm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search as SearchIcon, AlertCircle, Loader2 } from 'lucide-react';
import type { AdminSearchEntityType } from '@sline/shared';

const ENTITY_LABELS: Record<AdminSearchEntityType, string> = {
  user: 'User',
  task: 'Task',
  booking: 'Booking',
  dispute: 'Dispute',
  transaction: 'Transaction',
};

export function SearchScreen() {
  const vm = useGlobalSearchViewModel();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SearchIcon className="h-8 w-8 text-primary" />
          Global Search
        </h2>
        <p className="text-muted-foreground">
          Search users, tasks, bookings, disputes, and transactions. Type at least 2 characters.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search by name, email, title, or ID..."
            value={vm.query}
            onChange={(e) => vm.setQuery(e.target.value)}
            className="max-w-xl"
            autoFocus
          />
          {vm.query.length > 0 && vm.query.length < 2 && (
            <p className="text-sm text-muted-foreground">Enter at least 2 characters to search.</p>
          )}
        </CardContent>
      </Card>

      {vm.timedOut && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Search timed out</AlertTitle>
          <AlertDescription>
            The search took too long. You can try again with a more specific query.
            <Button variant="outline" size="sm" className="ml-2" onClick={vm.retry}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {vm.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {vm.error}
            <Button variant="outline" size="sm" className="ml-2" onClick={vm.retry}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {vm.loading && (
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Searching...</span>
        </div>
      )}

      {!vm.loading && vm.query.length >= 2 && vm.results.length === 0 && !vm.error && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No results found for &quot;{vm.query}&quot;
          </CardContent>
        </Card>
      )}

      {!vm.loading && vm.results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results ({vm.results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {vm.results.map((item) => (
                <li key={`${item.entityType}-${item.id}`}>
                  <button
                    type="button"
                    onClick={() => navigate({ to: item.link })}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                  >
                    <Badge variant="secondary">{ENTITY_LABELS[item.entityType]}</Badge>
                    <span className="font-medium truncate flex-1">{item.title}</span>
                    {item.subtitle && (
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {item.subtitle}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
