import { useCasesViewModel } from '../viewmodels/use_cases_viewmodel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Circle,
  Filter,
  FolderOpen,
  Link2,
  Plus,
  RefreshCw,
  Search,
  Workflow,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { casesApi } from '../services/cases_api';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Prog' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'closed', label: 'Closed' },
] as const;

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
] as const;

function toPolylinePoints(values: number[], width: number, height: number): string {
  if (values.length === 0) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = Math.max(1, max - min);

  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / spread) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

function formatRelativeTime(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getStatusClasses(value: string): string {
  if (value === 'in_progress') return 'border-[#8f7d3f] bg-[rgba(246,168,35,0.15)] text-[#f6a823]';
  if (value === 'escalated') return 'border-[#8d3e5f] bg-[rgba(178,45,92,0.2)] text-[#da4d8d]';
  if (value === 'closed') return 'border-[#4b5f6f] bg-[rgba(47,76,94,0.22)] text-[#9d9588]';
  return 'border-[#4b7398] bg-[rgba(5,67,145,0.2)] text-[#5eb1fa]';
}

function getPriorityClasses(value: string): string {
  if (value === 'critical') return 'border-[#7c2525] bg-[rgba(150,13,13,0.15)] text-[#f04d4d]';
  if (value === 'high') return 'border-[#8b5a18] bg-[rgba(195,126,8,0.16)] text-[#f6a823]';
  if (value === 'medium') return 'border-[#7f6c29] bg-[rgba(128,106,35,0.16)] text-[#d8b95f]';
  return 'border-[#2b6b45] bg-[rgba(27,158,75,0.16)] text-[#4ae081]';
}

function getSourceClasses(value: string): string {
  if (value === 'reports') return 'text-[#f6a823]';
  if (value === 'dispute') return 'text-[#b974ff]';
  if (value === 'system') return 'text-[#4ae081]';
  return 'text-[#7ea8ff]';
}

function getStatusIcon(status: string) {
  if (status === 'in_progress') return <Workflow className="h-[10px] w-[10px]" />;
  if (status === 'escalated') return <AlertTriangle className="h-[10px] w-[10px]" />;
  if (status === 'closed') return <Circle className="h-[10px] w-[10px]" />;
  return <FolderOpen className="h-[10px] w-[10px]" />;
}

export function CasesScreen() {
  const vm = useCasesViewModel();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [createSubject, setCreateSubject] = useState('');
  const [createSource, setCreateSource] = useState('dashboard');
  const [createPriority, setCreatePriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [createError, setCreateError] = useState<string | null>(null);
  const areaOpenedPoints = toPolylinePoints(vm.heroOpenedSeries, 220, 70);
  const areaClosedPoints = toPolylinePoints(vm.heroClosedSeries, 220, 70);
  const sourceOptions = ['all', ...vm.availableSources.filter((value) => value !== 'all')];

  const handleCreateSubmit = async () => {
    if (!createSubject.trim()) return;
    setCreateError(null);
    try {
      const created = await casesApi.createCase({
        subject: createSubject.trim(),
        source: createSource,
        priority: createPriority,
      });
      setCreateOpen(false);
      setCreateSubject('');
      setCreateSource('dashboard');
      setCreatePriority('medium');
      vm.refreshCases();
      navigate({ to: '/cases/$caseId', params: { caseId: created.id } });
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create case');
    }
  };

  return (
    <div className="space-y-4 pb-8">
      <section className="relative overflow-hidden rounded-[16px] border border-[#7f7668] bg-[linear-gradient(166deg,#081220_0%,#0c1222_35%,#0e0618_70%,#081220_100%)] p-6">
        <div className="pointer-events-none absolute -left-10 top-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(34,5,118,0.45)_0%,rgba(0,0,0,0)_70%)] opacity-40" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(5,67,145,0.5)_0%,rgba(0,0,0,0)_70%)] opacity-30" />
        <div className="relative space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-[#3f4e7a] bg-[rgba(5,67,145,0.12)]">
                <Briefcase className="h-6 w-6 text-[#5eb1fa]" />
              </div>
              <div>
                <h2 className="text-[34px] font-bold leading-[1.05] tracking-tight text-[#e8e6e3]">Cases</h2>
                <p className="text-sm text-[#b1aaa0]">
                  Investigation & moderation cases — required for chat access gating
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={vm.refreshCases}
                disabled={vm.isLoading || vm.isHeroLoading}
                className="h-10 rounded-[10px] border-[#4b568f] bg-[#0a0d12] text-[#afa89d] hover:bg-[#151a24] hover:text-[#e8e6e3]"
              >
                <RefreshCw className={cn('mr-2 h-3.5 w-3.5', (vm.isLoading || vm.isHeroLoading) && 'animate-spin')} />
                Refresh
              </Button>
              <Button
                onClick={() => setCreateOpen(true)}
                className="h-10 rounded-[10px] border border-[rgba(5,68,147,0.3)] bg-[rgba(5,67,145,0.22)] text-[#5eb1fa] hover:bg-[rgba(5,67,145,0.34)]"
              >
                <Plus className="mr-2 h-3.5 w-3.5" />
                New Case
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-6 text-[11px] text-[#b1aaa0]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#5e77fa]" />
                Opened
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#4ae081]" />
                Closed
              </div>
              <span>Last 7 days</span>
              {vm.isHeroSeriesMock && (
                <Badge variant="outline" className="h-5 rounded-full border-[#4b568f] bg-[#121722] px-2 text-[10px] text-[#9bb2d0]">
                  Mock fallback
                </Badge>
              )}
            </div>
            <svg viewBox="0 0 220 80" className="h-16 w-56">
              <polyline fill="none" stroke="#5e77fa" strokeWidth="2" points={areaOpenedPoints} />
              <polyline fill="none" stroke="#4ae081" strokeWidth="2" points={areaClosedPoints} />
            </svg>
          </div>
        </div>
      </section>

      {vm.error && (
        <Alert className="border-[#7f7668] bg-[#2a1414] text-[#f3c2c2]">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cases failed</AlertTitle>
          <AlertDescription>{vm.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {vm.kpis.map((item) => {
          const sparklinePoints = toPolylinePoints(item.sparkline, 56, 22);
          return (
            <Card key={item.id} className="rounded-[14px] border-[#7f7668] bg-[#0e0f13]">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-[#374354] bg-[#151a24]">
                    <FolderOpen className="h-4 w-4 text-[#5eb1fa]" />
                  </div>
                  <svg viewBox="0 0 56 24" className="h-8 w-14">
                    <polyline fill="none" stroke="#5eb1fa" strokeWidth="1.7" points={sparklinePoints} />
                  </svg>
                </div>
                <div>
                  <p className="text-[33px] font-semibold leading-none text-[#e8e6e3]">{item.value}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-[#9d9588]">{item.label}</p>
                    <p
                      className={cn(
                        'flex items-center gap-1 text-sm font-semibold',
                        item.trend === 'up'
                          ? 'text-[#4ae081]'
                          : item.trend === 'down'
                            ? 'text-[#f04d4d]'
                            : 'text-[#afa89d]'
                      )}
                    >
                      {item.trend === 'up' ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : item.trend === 'down' ? (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      ) : (
                        <Circle className="h-2.5 w-2.5 fill-current" />
                      )}
                      {item.delta}
                    </p>
                  </div>
                  <p className="mt-1 text-[10px] text-[#7f8695]">{item.isMock ? 'UI mock trend' : 'Live trend'}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-[14px] border-[#7f7668] bg-[#0e0f13]">
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-3.5 w-3.5 text-[#afa89d]" />
              <Input
                value={vm.filters.query ?? ''}
                onChange={(event) => vm.changeFilters({ query: event.target.value, page: 1 })}
                placeholder="Search by case number, subject, assignee, or tag..."
                className="h-10 rounded-[10px] border-[#4b568f] bg-[#0a0d12] pl-9 text-[#cecac4] placeholder:text-[#b2aba1]"
              />
            </div>
            <Badge
              variant="outline"
              className="h-7 rounded-[8px] border-[#4b568f] bg-[#151a24] px-2 text-[11px] font-medium text-[#afa89d]"
            >
              <Filter className="mr-1 h-3 w-3" />
              {vm.resultCount} results
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#b1aaa0]">Status</span>
              {STATUS_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => vm.changeFilters({ status: option.value, page: 1 })}
                  className={cn(
                    'h-7 rounded-[7px] border px-2.5 text-[11px]',
                    (vm.filters.status ?? 'all') === option.value
                      ? 'border-[#5c6fb5] bg-[rgba(5,67,145,0.24)] text-[#e8e6e3]'
                      : 'border-[#3d4654] bg-[#10151e] text-[#afa89d] hover:bg-[#151a24] hover:text-[#e8e6e3]'
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#b1aaa0]">Priority</span>
              {PRIORITY_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => vm.changeFilters({ priority: option.value, page: 1 })}
                  className={cn(
                    'h-7 rounded-[7px] border px-2.5 text-[11px]',
                    (vm.filters.priority ?? 'all') === option.value
                      ? 'border-[#5c6fb5] bg-[rgba(5,67,145,0.24)] text-[#e8e6e3]'
                      : 'border-[#3d4654] bg-[#10151e] text-[#afa89d] hover:bg-[#151a24] hover:text-[#e8e6e3]'
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#b1aaa0]">Source</span>
              {sourceOptions.map((sourceOption) => (
                <Button
                  key={sourceOption}
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => vm.changeFilters({ source: sourceOption, page: 1 })}
                  className={cn(
                    'h-7 rounded-[7px] border px-2.5 text-[11px]',
                    (vm.filters.source ?? 'all') === sourceOption
                      ? 'border-[#5c6fb5] bg-[rgba(5,67,145,0.24)] text-[#e8e6e3]'
                      : 'border-[#3d4654] bg-[#10151e] text-[#afa89d] hover:bg-[#151a24] hover:text-[#e8e6e3]'
                  )}
                >
                  {sourceOption === 'all' ? 'All' : sourceOption}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-[14px] border-[#7f7668] bg-[#0e0f13]">
        <CardHeader className="border-b border-[#7f7668] bg-[#0a0c11]">
          <CardTitle className="text-sm uppercase tracking-[1.2px] text-[#afa89d]">Cases</CardTitle>
          <CardDescription className="text-xs text-[#9d9588]">
            Click a row to open case detail and attach entities.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {vm.isLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-8 w-full bg-[#1a1f2a]" />
              <Skeleton className="h-16 w-full bg-[#151a24]" />
              <Skeleton className="h-16 w-full bg-[#151a24]" />
              <Skeleton className="h-16 w-full bg-[#151a24]" />
            </div>
          ) : vm.filteredCases.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#9d9588]">No matching cases. Adjust search or filters.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#81786a] hover:bg-transparent">
                  <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">Subject</TableHead>
                  <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">Status</TableHead>
                  <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">Priority</TableHead>
                  <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">Source</TableHead>
                  <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">
                    <button
                      type="button"
                      onClick={() =>
                        vm.changeFilters({
                          sort: vm.filters.sort === 'created_asc' ? 'created_desc' : 'created_asc',
                          page: 1,
                        })
                      }
                      className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0] hover:text-[#e8e6e3]"
                    >
                      Created
                      <span>{vm.filters.sort === 'created_asc' ? '▲' : '▼'}</span>
                    </button>
                  </TableHead>
                  <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">Assignee</TableHead>
                  <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">Links</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vm.filteredCases.map((caseItem) => {
                  const caseCode = caseItem.case_code ?? `CAS-${caseItem.id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
                  const rowTags = Array.isArray(caseItem.tags) ? caseItem.tags : [];
                  const linksCount = typeof caseItem.links_count === 'number' ? caseItem.links_count : 0;
                  const status = vm.normalizeStatus(caseItem);
                  const priority = vm.normalizePriority(caseItem);
                  const source = vm.normalizeSource(caseItem);
                  const assignee = caseItem.assignee_name ?? 'Unassigned';
                  const assigneeInitials = caseItem.assignee_name
                    ? caseItem.assignee_name
                        .split(' ')
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('')
                        .toUpperCase()
                    : '?';

                  return (
                    <TableRow
                      key={caseItem.id}
                      className="cursor-pointer border-[#81786a] hover:bg-[rgba(24,26,27,0.2)]"
                      onClick={() => navigate({ to: '/cases/$caseId', params: { caseId: caseItem.id } })}
                    >
                      <TableCell className="py-3">
                        <div className="min-w-0 space-y-1">
                          <p className="text-[10px] font-semibold text-[#8f98ab]">{caseCode}</p>
                          <p className="truncate text-sm text-[#e8e6e3]">{caseItem.subject}</p>
                          {rowTags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {rowTags.map((tag) => (
                                <span
                                  key={`${caseItem.id}-${tag}`}
                                  className="rounded-[4px] border border-[#303742] bg-[#171b25] px-1.5 py-0.5 text-[10px] text-[#9d9588]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-[999px] border px-2 py-1 text-[10px] font-semibold',
                            getStatusClasses(status)
                          )}
                        >
                          {getStatusIcon(status)}
                          {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-[999px] border px-2 py-1 text-[10px] font-semibold',
                            getPriorityClasses(priority)
                          )}
                        >
                          • {priority === 'critical' ? 'Crit' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className={cn('py-3 text-xs font-medium capitalize', getSourceClasses(source))}>
                        {source}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-[#b1aaa0]">
                        <div>{caseItem.created_at ? new Date(caseItem.created_at).toLocaleDateString() : '—'}</div>
                        <div className="text-[#9d9588]">{formatRelativeTime(caseItem.created_at)}</div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#3d4654] bg-[#171b25] text-[9px] text-[#afa89d]">
                            {assigneeInitials}
                          </span>
                          <span className="text-xs text-[#cecac4]">{assignee}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="inline-flex items-center gap-1 rounded-[999px] border border-[#303742] bg-[#171b25] px-2 py-1 text-[10px] text-[#afa89d]">
                          <Link2 className="h-3 w-3" />
                          {linksCount}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {vm.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#7f7668] px-4 py-3">
              <p className="text-xs text-[#9d9588]">
                Showing {vm.filteredCases.length} of {vm.count} cases
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#4b568f] bg-[#0a0d12] text-[#afa89d] hover:bg-[#151a24] hover:text-[#e8e6e3]"
                  disabled={vm.filters.page === 1 || vm.isLoading}
                  onClick={() => vm.changeFilters({ page: (vm.filters.page ?? 1) - 1 })}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#4b568f] bg-[#0a0d12] text-[#afa89d] hover:bg-[#151a24] hover:text-[#e8e6e3]"
                  disabled={(vm.filters.page ?? 1) >= vm.totalPages || vm.isLoading}
                  onClick={() => vm.changeFilters({ page: (vm.filters.page ?? 1) + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Case</DialogTitle>
            <DialogDescription>Add a new investigation or moderation case.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={createSubject}
                onChange={(e) => setCreateSubject(e.target.value)}
                placeholder="e.g. User report #123"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={createSource}
                onChange={(e) => setCreateSource(e.target.value)}
                placeholder="dashboard"
              />
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={createPriority} onValueChange={(v: 'low' | 'medium' | 'high') => setCreatePriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createError && (
              <Alert variant="destructive">
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit} disabled={!createSubject.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
