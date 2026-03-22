import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Server,
  Activity,
  Gauge,
  Flame,
  Zap,
  Globe,
  Database,
  Lock,
  Calendar,
  HardDrive,
  Clock,
  CreditCard,
  Bell,
  Search,
  Cpu,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useSystemHealth } from '../viewmodels/useSystemHealth';
import { createScopedLogger } from '../../../lib/appLogger';
import { cn } from '../../../lib/utils';

const log = createScopedLogger('SystemHealth:View');

function MiniSparkline({ points, color }: { points: number[]; color: string }) {
  if (!points?.length) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = Math.max(1, max - min);
  const width = 72;
  const height = 20;
  const path = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point - min) / span) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  return (
    <svg aria-hidden className="h-5 w-[72px]" viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" points={path} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'API Gateway': <Globe className="h-5 w-5 text-muted-foreground" />,
  'Auth Service': <Lock className="h-5 w-5 text-muted-foreground" />,
  'Booking Service': <Calendar className="h-5 w-5 text-muted-foreground" />,
  'File Storage (S3)': <HardDrive className="h-5 w-5 text-muted-foreground" />,
  'Cron Scheduler': <Clock className="h-5 w-5 text-muted-foreground" />,
  'CDN Edge Network': <Globe className="h-5 w-5 text-muted-foreground" />,
  'Database (Postgres)': <Database className="h-5 w-5 text-muted-foreground" />,
  'Payment Engine': <CreditCard className="h-5 w-5 text-muted-foreground" />,
  'Notification Service': <Bell className="h-5 w-5 text-muted-foreground" />,
  'Search Index (ES)': <Search className="h-5 w-5 text-muted-foreground" />,
  'Rate Limiter (Redis)': <Cpu className="h-5 w-5 text-muted-foreground" />,
  'Admin Panel': <Settings className="h-5 w-5 text-muted-foreground" />,
};

function statusColor(status: string) {
  switch (status) {
    case 'operational':
      return 'text-emerald-500';
    case 'degraded':
      return 'text-amber-500';
    case 'maintenance':
      return 'text-violet-500';
    default:
      return 'text-red-500';
  }
}

function statusBg(status: string) {
  switch (status) {
    case 'operational':
      return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
    case 'degraded':
      return 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400';
    case 'maintenance':
      return 'bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400';
    default:
      return 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400';
  }
}

export function SystemHealthView() {
  const { loading, error, data, refetch, liveInterval, setLiveInterval, liveIntervalMs } = useSystemHealth();

  if (loading && !data) {
    log.debug('Rendering loading skeleton');
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">Real-time infrastructure monitoring & service status</p>
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    log.error('Rendering error state', { error });
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">Real-time infrastructure monitoring & service status</p>
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
  const summary = data?.summary;
  const kpis = data?.kpis;
  const uptime90Day = data?.uptime90Day ?? [];
  const operationalCount = summary?.operationalCount ?? services.filter((s) => s.status === 'operational').length;
  const degradedCount = summary?.degradedCount ?? services.filter((s) => s.status === 'degraded').length;
  const maintenanceCount = summary?.maintenanceCount ?? services.filter((s) => s.status === 'maintenance').length;
  const totalCount = services.length;
  const allOperational = totalCount > 0 && operationalCount === totalCount && degradedCount === 0 && maintenanceCount === 0;

  log.debug('Rendering success state', { servicesCount: totalCount, hasSummary: !!summary, hasKpis: !!kpis });

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <Card data-testid="system-health-hero" className="overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
              <p className="text-muted-foreground">Real-time infrastructure monitoring & service status</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={liveInterval ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLiveInterval(liveInterval ? false : liveIntervalMs)}
              >
                Live ({liveIntervalMs / 1000}s)
              </Button>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
                <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
                Refresh
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div
              className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2',
                allOperational ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'
              )}
              data-testid="system-health-status"
            >
              {allOperational ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              <span className="text-sm font-medium">
                {allOperational
                  ? 'All Systems Operational'
                  : `Partial Degradation — ${operationalCount} operational, ${degradedCount} degraded, ${maintenanceCount} maintenance.`}
              </span>
            </div>
            {summary && (
              <div className="text-sm font-medium text-muted-foreground ml-auto">
                {summary.overallUptimePct.toFixed(2)}% Overall uptime
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Four KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="system-health-kpis">
        {kpis ? (
          <>
            <Card data-testid="system-health-kpi-uptime">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  <MiniSparkline points={kpis.sparklineUptime ?? []} color="#10b981" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Uptime (30D)</p>
                <p className="text-2xl font-bold">{kpis.uptime30d.toFixed(2)}%</p>
                {kpis.uptime30dDelta != null && (
                  <p className="text-xs text-emerald-500">+{kpis.uptime30dDelta}%</p>
                )}
              </CardContent>
            </Card>
            <Card data-testid="system-health-kpi-latency">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <Gauge className="h-5 w-5 text-cyan-500" />
                  <MiniSparkline points={kpis.sparklineLatency ?? []} color="#06b6d4" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Avg Latency</p>
                <p className="text-2xl font-bold">{kpis.avgLatencyMs}ms</p>
                {kpis.avgLatencyDeltaMs != null && (
                  <p className="text-xs text-red-500">+{kpis.avgLatencyDeltaMs}ms</p>
                )}
              </CardContent>
            </Card>
            <Card data-testid="system-health-kpi-error">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <Flame className="h-5 w-5 text-red-500" />
                  <MiniSparkline points={kpis.sparklineError ?? []} color="#ef4444" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Error Rate</p>
                <p className="text-2xl font-bold">{kpis.errorRatePct.toFixed(2)}%</p>
                {kpis.errorRateDeltaPct != null && (
                  <p className="text-xs text-red-500">+{kpis.errorRateDeltaPct}%</p>
                )}
              </CardContent>
            </Card>
            <Card data-testid="system-health-kpi-reqmin">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <Zap className="h-5 w-5 text-violet-500" />
                  <MiniSparkline points={kpis.sparklineReqMin ?? []} color="#8b5cf6" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Req/min</p>
                <p className="text-2xl font-bold">{kpis.requestsPerMin.toLocaleString()}</p>
                {kpis.requestsPerMinDelta != null && (
                  <p className="text-xs text-emerald-500">+{kpis.requestsPerMinDelta}%</p>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </>
        )}
      </div>

      {/* 90-Day Uptime */}
      {uptime90Day.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">90-Day Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={uptime90Day.map((d) => ({ ...d, value: 1 }))}
                  margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
                >
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value: string, i: number) =>
                      i === 0 ? '90 days ago' : i === uptime90Day.length - 1 ? 'Today' : ''
                    }
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis hide domain={[0, 1]} />
                  <Bar dataKey="value" radius={2} isAnimationActive={false}>
                    {uptime90Day.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.status === 'operational'
                            ? '#10b981'
                            : entry.status === 'degraded'
                              ? '#f59e0b'
                              : '#ef4444'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Operational
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Degraded
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" /> Outage
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Status (12 services) */}
      <Card data-testid="system-health-services">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="w-4 h-4 text-muted-foreground" />
            Service Status ({services.length} services)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No service checks available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <Card
                  key={service.name}
                  className="flex flex-col"
                  data-testid="system-health-service-card"
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {SERVICE_ICONS[service.name] ?? <Server className="h-5 w-5 text-muted-foreground" />}
                        <div>
                          <p className="font-medium text-sm">{service.name}</p>
                          {service.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                          )}
                        </div>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
                          statusBg(service.status)
                        )}
                      >
                        {service.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span>
                        Latency{' '}
                        <span
                          className={cn(
                            'font-mono',
                            service.latencyMs > 300 ? 'text-amber-500' : service.latencyMs > 500 ? 'text-red-500' : 'text-emerald-500'
                          )}
                        >
                          {service.latencyMs >= 0 ? `${service.latencyMs}ms` : '—'}
                        </span>
                      </span>
                      <span>
                        Uptime{' '}
                        <span className={cn('font-mono', statusColor(service.status))}>
                          {service.uptimePct != null ? `${service.uptimePct}%` : '—'}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Checked {new Date(service.lastChecked).toLocaleTimeString()}
                      </span>
                    </div>
                    {service.sparkline && service.sparkline.length > 0 && (
                      <div className="mt-2 flex justify-end">
                        <MiniSparkline
                          points={service.sparkline}
                          color={service.status === 'operational' ? '#10b981' : service.status === 'degraded' ? '#f59e0b' : '#8b5cf6'}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
