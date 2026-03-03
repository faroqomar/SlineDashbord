import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { AlertCircle, CheckCircle, RefreshCw, Server } from 'lucide-react';
import { useSystemHealth } from '../viewmodels/useSystemHealth';
import { cn } from '../../../lib/utils';

export function SystemHealthView() {
  const { loading, error, data, refetch } = useSystemHealth();

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">Monitor system performance and service status</p>
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">Monitor system performance and service status</p>
        </div>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <h3 className="text-lg font-semibold">Failed to load system health</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">{error}</p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const services = data?.services ?? [];
  const operationalCount = services.filter((s) => s.status === 'operational').length;
  const totalCount = services.length;
  const allOperational = totalCount > 0 && operationalCount === totalCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">Monitor system performance and service status</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
          <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Overall status card — data-testid for E2E */}
      <Card
        className={cn(
          'border-l-4',
          allOperational ? 'border-l-emerald-500' : 'border-l-amber-500'
        )}
        data-testid="system-health-status"
      >
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                allOperational ? 'bg-emerald-500/10' : 'bg-amber-500/10'
              )}
            >
              {allOperational ? (
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-500" />
              )}
            </div>
            <div>
              <p className="font-semibold text-lg">
                {allOperational ? 'All Systems Operational' : 'Some Systems Degraded'}
              </p>
              <p className="text-sm text-muted-foreground">
                {totalCount === 0
                  ? 'No services reported'
                  : `${operationalCount}/${totalCount} services operational`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services list — data-testid for E2E */}
      <Card data-testid="system-health-services">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="w-4 h-4 text-muted-foreground" />
            Services Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No service checks available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 bg-muted/40 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        service.status === 'operational' && 'bg-emerald-500',
                        service.status === 'degraded' && 'bg-amber-500',
                        service.status === 'down' && 'bg-red-500'
                      )}
                    />
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Checked: {new Date(service.lastChecked).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium font-mono',
                      service.latencyMs > 300 && 'text-amber-500',
                      service.latencyMs > 500 && 'text-red-500'
                    )}
                  >
                    {service.latencyMs}ms
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Queue / Error summary (optional) */}
      {(data?.queueStatus || data?.errorRates) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.queueStatus && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {data.queueStatus.status === 'not_implemented'
                    ? 'Not implemented'
                    : data.queueStatus.status}
                </p>
              </CardContent>
            </Card>
          )}
          {data?.errorRates &&
            (data.errorRates.last1h !== undefined || data.errorRates.last24h !== undefined) && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Error counts (fail-like actions)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Last 1h: {data.errorRates.last1h ?? 0} · Last 24h: {data.errorRates.last24h ?? 0}
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      )}
    </div>
  );
}
