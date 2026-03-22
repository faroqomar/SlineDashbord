import { Fragment } from 'react';
import { Link } from '@tanstack/react-router';
import type { LogLevel, LogListItem } from '@sline/shared';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Bug,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Globe,
  Info,
  Layers3,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  ShieldAlert,
  Terminal,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useLogsViewModel } from '../viewmodels/use_logs_viewmodel';

const LEVEL_META: Record<
  LogLevel,
  {
    label: string;
    icon: typeof ShieldAlert;
    badgeClassName: string;
    textClassName: string;
    chipClassName: string;
    lineColor: string;
    fillColor: string;
  }
> = {
  critical: {
    label: 'CRITICAL',
    icon: ShieldAlert,
    badgeClassName: 'border border-rose-500/20 bg-rose-500/8 text-rose-300',
    textClassName: 'text-rose-300',
    chipClassName: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
    lineColor: '#fb7185',
    fillColor: '#7f1d1d',
  },
  error: {
    label: 'ERROR',
    icon: AlertCircle,
    badgeClassName: 'border border-rose-500/20 bg-rose-500/8 text-rose-300',
    textClassName: 'text-rose-300',
    chipClassName: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
    lineColor: '#f87171',
    fillColor: '#991b1b',
  },
  warning: {
    label: 'WARN',
    icon: AlertTriangle,
    badgeClassName: 'border border-amber-500/20 bg-amber-500/8 text-amber-300',
    textClassName: 'text-amber-300',
    chipClassName: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    lineColor: '#f59e0b',
    fillColor: '#92400e',
  },
  info: {
    label: 'INFO',
    icon: Info,
    badgeClassName: 'border border-sky-500/20 bg-sky-500/8 text-sky-300',
    textClassName: 'text-sky-300',
    chipClassName: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
    lineColor: '#38bdf8',
    fillColor: '#0c4a6e',
  },
  debug: {
    label: 'DEBUG',
    icon: Bug,
    badgeClassName: 'border border-violet-500/20 bg-violet-500/8 text-violet-300',
    textClassName: 'text-violet-300',
    chipClassName: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
    lineColor: '#8b5cf6',
    fillColor: '#4c1d95',
  },
};

const SOURCE_DOT_CLASS_NAMES: Record<string, string> = {
  'finance-ledger': 'bg-emerald-400',
  'wallet-ops': 'bg-lime-400',
  'task-queue': 'bg-sky-400',
  'booking-service': 'bg-blue-400',
  'case-manager': 'bg-fuchsia-400',
  'reports-hub': 'bg-amber-400',
  'admin-access': 'bg-orange-400',
  'user-admin': 'bg-cyan-400',
  'security-guard': 'bg-rose-400',
  'chat-gateway': 'bg-indigo-400',
  'export-worker': 'bg-violet-400',
  'control-room': 'bg-neutral-400',
  'payment-engine': 'bg-emerald-400',
  'auth-service': 'bg-orange-400',
  'rate-limiter': 'bg-violet-400',
  'notification-service': 'bg-sky-400',
  'file-storage': 'bg-amber-400',
  'search-index': 'bg-cyan-400',
  'api-gateway': 'bg-indigo-400',
  'cron-scheduler': 'bg-rose-400',
};

const SOURCE_ICONS: Record<string, typeof Zap> = {
  'payment-engine': Zap,
  'auth-service': Lock,
  'rate-limiter': Zap,
  'booking-service': BookOpen,
  'notification-service': Globe,
  'file-storage': Layers3,
  'search-index': Search,
  'api-gateway': Globe,
  'cron-scheduler': Terminal,
};

function getSourceIcon(source: string) {
  return SOURCE_ICONS[source] ?? Zap;
}

function formatSourceLabel(source: string) {
  return source
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function formatTimeStamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return '—';
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return `${time}.${String(date.getMilliseconds()).padStart(3, '0')}`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return '—';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function Sparkline({
  values,
  stroke,
}: {
  values: number[];
  stroke: string;
}) {
  const safeValues = values.length > 0 ? values : [0, 0, 0, 0];
  const maxValue = Math.max(...safeValues, 1);
  const points = safeValues
    .map((value, index) => {
      const x = safeValues.length === 1 ? 50 : (index / (safeValues.length - 1)) * 100;
      const y = 30 - (value / maxValue) * 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      aria-hidden
      className="h-10 w-20"
      viewBox="0 0 100 32"
      fill="none"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetricCard({
  title,
  value,
  caption,
  accentClassName,
  strokeColor,
  trend,
  icon: Icon,
}: {
  title: string;
  value: number;
  caption: string;
  accentClassName: string;
  strokeColor: string;
  trend: number[];
  icon: typeof Layers3;
}) {
  return (
    <div
      className={cn(
        'rounded-[22px] border bg-[#11131a] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]',
        accentClassName
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-white/4 text-white/80">
          <Icon className="h-5 w-5" />
        </div>
        <Sparkline stroke={strokeColor} values={trend} />
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a9387]">{title}</p>
        <div className="flex items-center gap-2">
          <span className="text-4xl font-semibold tracking-tight text-[#ede7de]">{value}</span>
          <Badge
            className={cn(
              'rounded-full border px-2 py-0.5 text-[11px] font-medium shadow-none',
              accentClassName
            )}
            variant="outline"
          >
            {caption}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function HourlyBars({
  buckets,
}: {
  buckets: Array<{
    label: string;
    critical: number;
    error: number;
    warning: number;
    info: number;
    debug: number;
  }>;
}) {
  const maxTotal = Math.max(
    ...buckets.map(
      (bucket) => bucket.critical + bucket.error + bucket.warning + bucket.info + bucket.debug
    ),
    1
  );

  return (
    <div className="flex h-28 items-end gap-3">
      {buckets.map((bucket) => {
        const total =
          bucket.critical + bucket.error + bucket.warning + bucket.info + bucket.debug;
        const heightPercentage = total > 0 ? Math.max((total / maxTotal) * 100, 12) : 6;

        return (
          <div key={bucket.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div
              className="flex w-full flex-col justify-end overflow-hidden rounded-md bg-white/[0.05]"
              style={{ height: `${heightPercentage}%` }}
            >
              {(['critical', 'error', 'warning', 'info', 'debug'] as LogLevel[]).map((level) => {
                if (bucket[level] === 0 || total === 0) return null;
                return (
                  <div
                    key={level}
                    className={cn(
                      'w-full',
                      level === 'critical' && 'bg-rose-500',
                      level === 'error' && 'bg-rose-400',
                      level === 'warning' && 'bg-amber-400',
                      level === 'info' && 'bg-sky-500',
                      level === 'debug' && 'bg-violet-500'
                    )}
                    style={{
                      height: `${Math.max((bucket[level] / total) * 100, 10)}%`,
                    }}
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-[#847e74]">{bucket.label.slice(0, 5)}</span>
          </div>
        );
      })}
    </div>
  );
}

function LevelButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        'h-9 rounded-full px-4 text-xs tracking-wide text-[#9b9387] hover:bg-white/6 hover:text-[#ece7df]',
        active && 'bg-white/10 text-[#f0ebe2]'
      )}
    >
      {label}
    </Button>
  );
}

function LogRowDetails({ log }: { log: LogListItem }) {
  return (
    <div className="grid gap-5 rounded-[18px] border border-white/6 bg-white/[0.02] p-5 md:grid-cols-2">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#847d72]">Full Timestamp</p>
        <p className="text-sm text-[#ece7df]">{formatDateTime(log.createdAt)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#847d72]">Actor</p>
        <p className="text-sm text-[#ece7df]">{log.actorName || log.actorUserId || 'System'}</p>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#847d72]">Action</p>
        <p className="text-sm text-[#ece7df]">{log.action}</p>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#847d72]">Entity</p>
        <p className="text-sm text-[#ece7df]">
          {log.entityType && log.entityId ? `${log.entityType} · ${log.entityId}` : 'No related entity'}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#847d72]">Request ID</p>
        <p className="text-sm text-[#ece7df]">{log.requestId || 'Unavailable'}</p>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#847d72]">Event Code</p>
        <p className="text-sm text-[#ece7df]">{log.eventCode || 'Unavailable'}</p>
      </div>
      <div className="md:col-span-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#847d72]">Metadata</p>
        <pre className="mt-2 overflow-x-auto rounded-2xl border border-white/6 bg-black/20 p-4 text-xs leading-6 text-[#b8aea1]">
          {JSON.stringify(log.meta ?? {}, null, 2)}
        </pre>
      </div>
      {log.href && (
        <div className="md:col-span-2">
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-full border-white/10 bg-white/[0.02] px-4 text-[#ece7df] hover:bg-white/8"
          >
            <Link to={log.href as any}>
              Open related record
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export function LogsScreen() {
  const vm = useLogsViewModel();

  const totalTrend = vm.hourlyBuckets.map(
    (bucket) => bucket.critical + bucket.error + bucket.warning + bucket.info + bucket.debug
  );
  const criticalTrend = vm.hourlyBuckets.map((bucket) => bucket.critical + bucket.error);
  const warningTrend = vm.hourlyBuckets.map((bucket) => bucket.warning);
  const infoTrend = vm.hourlyBuckets.map((bucket) => bucket.info + bucket.debug);

  return (
    <div className="space-y-6 text-[#ece7de] animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-[28px] border border-[#7b7265] bg-[#111319] p-6 shadow-[0_32px_90px_rgba(4,6,9,0.45)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(89,55,187,0.25),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(133,18,56,0.22),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(12,17,36,0.96),rgba(22,17,35,0.88))]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,rgba(98,35,214,0.22),rgba(143,16,60,0.18))] shadow-[0_0_30px_rgba(82,35,201,0.16)]">
              <Terminal className="h-6 w-6 text-[#b786ff]" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#ede8df]">System Logs</h2>
              <p className="mt-1 text-sm text-[#b5ad9f]">
                Real-time platform event stream, errors & diagnostic data
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={vm.toggleLive}
              className={cn(
                'h-11 rounded-[14px] border px-4 text-sm shadow-none',
                vm.isLive
                  ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15'
                  : 'border-white/10 bg-white/[0.03] text-[#d6d0c6] hover:bg-white/10'
              )}
            >
              <span
                className={cn(
                  'inline-flex size-2.5 rounded-full bg-current',
                  vm.isLive && 'animate-pulse'
                )}
              />
              {vm.isLive ? 'Live' : 'Manual'}
            </Button>
            <Button
              variant="outline"
              onClick={vm.refresh}
              className="h-11 rounded-[14px] border-white/10 bg-white/[0.03] px-4 text-sm text-[#d6d0c6] hover:bg-white/10"
            >
              <RefreshCw className={cn('h-4 w-4', vm.isFetching && 'animate-spin')} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={vm.exportLogs}
              className="h-11 rounded-[14px] border-white/10 bg-white/[0.03] px-4 text-sm text-[#d6d0c6] hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="relative mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[#9b9488]">
            <span className="size-2 rounded-full bg-rose-500" aria-hidden />
            <span>Errors</span>
            <span className="size-2 rounded-full bg-amber-500" aria-hidden />
            <span>Warnings</span>
            <span className="size-2 rounded-full bg-sky-500" aria-hidden />
            <span>Info</span>
            <span className="size-2 rounded-full bg-violet-500" aria-hidden />
            <span>Debug</span>
            <span className="text-[#b8afa2]">Visible page by time</span>
          </div>

          <HourlyBars buckets={vm.hourlyBuckets} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="VISIBLE LOGS"
          value={vm.summary.total}
          caption={`${vm.summary.total} on page`}
          accentClassName="border-violet-500/30 text-violet-300"
          strokeColor="#8b5cf6"
          trend={totalTrend}
          icon={Layers3}
        />
        <MetricCard
          title="VISIBLE ERRORS"
          value={vm.summary.error + vm.summary.critical}
          caption={`${vm.summary.critical + vm.summary.error} on page`}
          accentClassName="border-rose-500/30 text-rose-300"
          strokeColor="#fb7185"
          trend={criticalTrend}
          icon={ShieldAlert}
        />
        <MetricCard
          title="VISIBLE WARNINGS"
          value={vm.summary.warning}
          caption={`${vm.summary.warning} on page`}
          accentClassName="border-amber-500/30 text-amber-300"
          strokeColor="#f59e0b"
          trend={warningTrend}
          icon={AlertTriangle}
        />
        <MetricCard
          title="VISIBLE INFO"
          value={vm.summary.info + vm.summary.debug}
          caption={`${vm.summary.info + vm.summary.debug} on page`}
          accentClassName="border-sky-500/30 text-sky-300"
          strokeColor="#38bdf8"
          trend={infoTrend}
          icon={Info}
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7f786e]" />
            <Input
              value={vm.searchInput}
              onChange={(event) => vm.setSearchInput(event.target.value)}
              placeholder="Search logs by message, source, ID, or request ID..."
              className="h-12 rounded-[18px] border-[#7a7267] bg-[#11131a] pl-11 text-[#ece7de] placeholder:text-[#7f786e] focus-visible:ring-[#8e7af0]/40"
            />
          </div>

          <Select value={vm.filters.source || 'all'} onValueChange={vm.setSource}>
            <SelectTrigger className="h-12 min-w-[210px] rounded-[18px] border-[#7a7267] bg-[#11131a] px-4 text-[#ece7de]">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#141820] text-[#ece7de]">
              <SelectItem value="all">All Sources</SelectItem>
              {vm.sourceOptions.map((source) => (
                <SelectItem key={source} value={source}>
                  {formatSourceLabel(source)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex h-12 items-center gap-2 rounded-full border border-[#7a7267] bg-[#11131a] px-4 text-sm text-[#d5cfc4]">
            <Filter className="h-4 w-4 text-[#8d857a]" />
            {vm.count}
          </div>

          <Select value={vm.filters.sort} onValueChange={vm.setSort}>
            <SelectTrigger className="h-12 min-w-[190px] rounded-[18px] border-[#7a7267] bg-[#11131a] px-4 text-[#ece7de]">
              <SelectValue placeholder="Newest first" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#141820] text-[#ece7de]">
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-[#847d72]">Level</span>
          <LevelButton
            active={vm.filters.level === 'all'}
            label="All"
            onClick={() => vm.setLevel('all')}
          />
          {(['critical', 'error', 'warning', 'info', 'debug'] as LogLevel[]).map((level) => (
            <LevelButton
              key={level}
              active={vm.filters.level === level}
              label={LEVEL_META[level].label}
              onClick={() => vm.setLevel(level)}
            />
          ))}
        </div>

        {vm.error && (
          <div className="rounded-[18px] border border-rose-500/20 bg-rose-500/8 px-4 py-3 text-sm text-rose-300">
            {vm.error}
          </div>
        )}

        <div className="overflow-hidden rounded-[24px] border border-[#7a7267] bg-[#0f1117] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <div className="overflow-x-auto">
            <Table className="min-w-[940px]">
              <TableHeader>
                <TableRow className="border-[#62594f]/60 hover:bg-transparent">
                  <TableHead className="h-11 px-6 text-[12px] uppercase tracking-[0.18em] text-[#958d82]">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-[12px] uppercase tracking-[0.18em] text-[#958d82]">
                    Level
                  </TableHead>
                  <TableHead className="text-[12px] uppercase tracking-[0.18em] text-[#958d82]">
                    Source
                  </TableHead>
                  <TableHead className="text-[12px] uppercase tracking-[0.18em] text-[#958d82]">
                    Message
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {vm.isLoading && vm.logs.length === 0 ? (
                  <TableRow className="border-[#62594f]/50">
                    <TableCell colSpan={4} className="px-6 py-16 text-center text-[#9c9488]">
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading system logs...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : vm.logs.length === 0 ? (
                  <TableRow className="border-[#62594f]/50">
                    <TableCell colSpan={4} className="px-6 py-16 text-center text-[#9c9488]">
                      No logs matched the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  vm.logs.map((log) => {
                    const levelMeta = LEVEL_META[log.level];
                    const isExpanded = vm.expandedRowId === log.id;
                    const LevelIcon = levelMeta.icon;

                    return (
                      <Fragment key={log.id}>
                        <TableRow
                          className="border-[#62594f]/50 hover:bg-white/[0.02]"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  'flex size-8 items-center justify-center rounded-full border border-white/6 bg-white/[0.03]',
                                  levelMeta.textClassName
                                )}
                              >
                                <LevelIcon className="h-4 w-4" />
                              </div>
                              <span className="font-mono text-sm text-[#d9d2c8]">
                                {formatTimeStamp(log.createdAt)}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            <Badge className={cn('rounded-md px-2 py-1 text-[10px] tracking-[0.16em]', levelMeta.badgeClassName)}>
                              {levelMeta.label}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-4">
                            <div className="flex items-center gap-2 text-sm text-[#c2b9ac]">
                              {(() => {
                                const SourceIcon = getSourceIcon(log.source);
                                return (
                                  <span
                                    className={cn(
                                      'flex size-8 items-center justify-center rounded-lg border border-white/6 bg-white/[0.03]',
                                      SOURCE_DOT_CLASS_NAMES[log.source]
                                        ? 'text-inherit'
                                        : 'text-neutral-400'
                                    )}
                                  >
                                    <SourceIcon className="h-4 w-4" />
                                  </span>
                                );
                              })()}
                              {log.href ? (
                                <Link
                                  to={log.href as any}
                                  className="transition-colors hover:text-[#f2ede5]"
                                >
                                  {log.source}
                                </Link>
                              ) : (
                                <span>{log.source}</span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0 flex-1 space-y-1">
                                <p className="text-sm text-[#ece7de]">{log.message}</p>
                                <p className="text-xs text-[#8f877c]">
                                  {log.actorName || log.actorUserId || 'System'}
                                  {log.requestId ? ` · ${log.requestId}` : ''}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                {log.eventCode && (
                                  <span className={cn('text-xs font-semibold', levelMeta.textClassName)}>
                                    {log.eventCode}
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => vm.toggleExpandedRow(log.id)}
                                  className="rounded-full text-[#9b9387] hover:bg-white/8 hover:text-[#ece7de]"
                                  aria-expanded={isExpanded}
                                >
                                  <ChevronDown
                                    className={cn(
                                      'h-4 w-4 transition-transform',
                                      isExpanded && 'rotate-180'
                                    )}
                                  />
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>

                        {isExpanded && (
                          <TableRow className="border-[#62594f]/50 bg-white/[0.015] hover:bg-white/[0.015]">
                            <TableCell colSpan={4} className="px-6 py-5">
                              <LogRowDetails log={log} />
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#62594f]/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#9c9488]">
              Showing {vm.showingFrom}-{vm.showingTo} of {vm.count} logs
              {vm.isFetching && !vm.isLoading ? ' · updating…' : ''}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={vm.goPrev}
                disabled={!vm.canPrev || vm.isFetching}
                className="rounded-full border border-white/10 bg-white/[0.02] text-[#d4cdc1] hover:bg-white/8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {vm.paginationPages.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => vm.goToPage(pageNumber)}
                  className={cn(
                    'rounded-full text-[#a69d90] hover:bg-white/8 hover:text-[#f2ede5]',
                    vm.page === pageNumber &&
                      'bg-violet-500/15 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200'
                  )}
                >
                  {pageNumber}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={vm.goNext}
                disabled={!vm.canNext || vm.isFetching}
                className="rounded-full border border-white/10 bg-white/[0.02] text-[#d4cdc1] hover:bg-white/8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[20px] border border-white/6 bg-white/[0.02] px-4 py-3 text-xs text-[#8d867b]">
          <span>Loaded from the canonical audit stream and linked to related admin records.</span>
          <span className="flex items-center gap-2">
            <RefreshCw className={cn('h-3.5 w-3.5', vm.isFetching && 'animate-spin')} />
            {vm.isLive ? 'Auto refresh every 15s' : 'Manual refresh'}
          </span>
        </div>
      </section>
    </div>
  );
}
