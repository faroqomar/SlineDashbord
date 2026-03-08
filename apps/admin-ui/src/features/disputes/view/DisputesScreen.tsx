import React from 'react';
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateDisputeInputSchema, type CreateDisputeInput } from "@sline/shared";
import {
  ArrowRight,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Eye,
  Gavel,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { DisputeDTO } from "../models/dispute.schema";
import { useDisputesViewModel } from '../viewmodels/use_disputes_viewmodel';

type LaneKey = 'open' | 'investigating' | 'escalated' | 'resolved';
type FilterTab = 'all' | 'open' | 'under_review' | 'escalated' | 'resolved';

const lanes: Array<{
  key: LaneKey;
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  headerClass: string;
  borderClass: string;
}> = [
  {
    key: 'open',
    title: 'OPEN',
    icon: <AlertCircle className="h-4 w-4" />,
    colorClass: 'text-red-400',
    headerClass: 'bg-gradient-to-r from-red-500/15 to-transparent',
    borderClass: 'border-red-500/25',
  },
  {
    key: 'investigating',
    title: 'UNDER REVIEW',
    icon: <Clock className="h-4 w-4" />,
    colorClass: 'text-amber-400',
    headerClass: 'bg-gradient-to-r from-amber-500/15 to-transparent',
    borderClass: 'border-amber-500/25',
  },
  {
    key: 'escalated',
    title: 'ESCALATED',
    icon: <ShieldAlert className="h-4 w-4" />,
    colorClass: 'text-violet-400',
    headerClass: 'bg-gradient-to-r from-violet-500/15 to-transparent',
    borderClass: 'border-violet-500/25',
  },
  {
    key: 'resolved',
    title: 'RESOLVED',
    icon: <CheckCircle2 className="h-4 w-4" />,
    colorClass: 'text-emerald-400',
    headerClass: 'bg-gradient-to-r from-emerald-500/15 to-transparent',
    borderClass: 'border-emerald-500/25',
  },
];

const filterTabs: Array<{ key: FilterTab; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'OPEN' },
  { key: 'under_review', label: 'UNDER' },
  { key: 'escalated', label: 'ESCALATED' },
  { key: 'resolved', label: 'RESOLVED' },
];

const severityClasses: Record<string, string> = {
  low: 'bg-slate-500/20 text-slate-300 border-slate-400/20',
  med: 'bg-amber-500/20 text-amber-300 border-amber-400/20',
  high: 'bg-orange-500/20 text-orange-300 border-orange-400/20',
  crit: 'bg-red-500/20 text-red-300 border-red-400/20',
};

const severityLabels: Record<string, string> = {
  low: 'Low',
  med: 'Med',
  high: 'High',
  crit: 'Crit',
};

function formatAmount(amount: number): string {
  return `IQD${Math.round(amount || 0).toLocaleString()}`;
}

function deltaBadgeClass(direction: 'up' | 'down' | 'flat'): string {
  if (direction === 'up') return 'bg-emerald-500/15 text-emerald-300';
  if (direction === 'down') return 'bg-red-500/15 text-red-300';
  return 'bg-zinc-500/15 text-zinc-300';
}

function DeltaIcon({ direction }: { direction: 'up' | 'down' | 'flat' }) {
  if (direction === 'down') return <ArrowDownRight className="mr-1 h-3 w-3" />;
  if (direction === 'flat') return <ArrowRight className="mr-1 h-3 w-3" />;
  return <ArrowUpRight className="mr-1 h-3 w-3" />;
}

function buildTrendPoints(values: number[], width: number, height: number): string {
  const max = Math.max(...values, 1);
  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value / max) * (height - 8) + 4);
      return `${x},${y}`;
    })
    .join(" ");
}

function LaneSkeleton() {
  return (
    <div className="space-y-3 p-3">
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
    </div>
  );
}

export function DisputesScreen() {
  const vm = useDisputesViewModel();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const createDisputeForm = useForm<CreateDisputeInput>({
    resolver: zodResolver(CreateDisputeInputSchema),
    defaultValues: {
      task_id: '',
      complainant_id: '',
      defendant_id: '',
      reason: '',
    },
  });

  const onSubmitCreateDispute = async (values: CreateDisputeInput) => {
    try {
      await vm.createDispute(values);
      createDisputeForm.reset();
      setIsCreateDialogOpen(false);
    } catch {
      // Error toast is handled in the ViewModel mutation onError.
    }
  };

  const openedPoints = buildTrendPoints(vm.analytics.trend.opened, 220, 90);
  const resolvedPoints = buildTrendPoints(vm.analytics.trend.resolved, 220, 90);

  const laneRows = lanes
    .filter((lane) => vm.visibleColumns.includes(lane.key))
    .map((lane) => ({
      ...lane,
      data: vm.columns[lane.key],
    }));

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-violet-500/40 bg-[linear-gradient(165deg,rgba(21,8,37,0.95)_0%,rgba(12,18,34,0.95)_45%,rgba(8,18,32,0.95)_100%)] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-red-500/20 shadow-lg shadow-violet-900/20">
              <Gavel className="h-6 w-6 text-violet-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-4xl font-bold tracking-tight text-zinc-100">Dispute Center</h2>
              <p className="mt-1 text-sm text-zinc-300/85">Manage and resolve marketplace conflicts with financial oversight</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={vm.refreshAll} disabled={vm.isFetching}>
              <RefreshCw className={cn("mr-2 h-4 w-4", vm.isFetching && "animate-spin")} />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="border border-violet-500/35 bg-violet-500/20 text-violet-200 hover:bg-violet-500/30"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Zap className="mr-2 h-4 w-4" />
              New Dispute
            </Button>
          </div>
        </div>
        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex items-center gap-5 text-xs">
            <div className="inline-flex items-center gap-2 text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Opened
            </div>
            <div className="inline-flex items-center gap-2 text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Resolved
            </div>
            <div className="inline-flex items-center gap-2 text-zinc-400">
              Last 7 days
            </div>
          </div>
          <svg width="220" height="90" viewBox="0 0 220 90" className="opacity-95">
            <polyline points={openedPoints} fill="none" stroke="#ff4757" strokeWidth="2" />
            <polyline points={resolvedPoints} fill="none" stroke="#00e08a" strokeWidth="2" />
          </svg>
        </div>
      </section>

      {vm.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Disputes Load Error</AlertTitle>
          <AlertDescription>{String((vm.error as Error)?.message || vm.error)}</AlertDescription>
        </Alert>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="glass-card border-blue-500/25 bg-slate-950/80">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-blue-500/15 p-2 text-blue-300"><ShieldAlert className="h-4 w-4" /></div>
              <Eye className="h-5 w-5 text-blue-300/80" />
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Total Disputes</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-semibold text-zinc-100">{vm.isLoading && !vm.hasAnyData ? <Skeleton className="h-8 w-10" /> : vm.summary.totalDisputes}</span>
              <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-xs", deltaBadgeClass(vm.analytics.deltas.totalDisputes.direction))}>
                <DeltaIcon direction={vm.analytics.deltas.totalDisputes.direction} />
                {vm.analytics.deltas.totalDisputes.label}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-red-500/25 bg-slate-950/80">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-red-500/15 p-2 text-red-300"><AlertCircle className="h-4 w-4" /></div>
              <Clock className="h-5 w-5 text-red-300/80" />
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Open / Active</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-semibold text-zinc-100">{vm.isLoading && !vm.hasAnyData ? <Skeleton className="h-8 w-10" /> : vm.summary.openActive}</span>
              <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-xs", deltaBadgeClass(vm.analytics.deltas.openActive.direction))}>
                <DeltaIcon direction={vm.analytics.deltas.openActive.direction} />
                {vm.analytics.deltas.openActive.label}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-emerald-500/25 bg-slate-950/80">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-300"><CheckCircle2 className="h-4 w-4" /></div>
              <ArrowUpRight className="h-5 w-5 text-emerald-300/80" />
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Resolved</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-semibold text-zinc-100">{vm.isLoading && !vm.hasAnyData ? <Skeleton className="h-8 w-10" /> : vm.summary.resolved}</span>
              <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-xs", deltaBadgeClass(vm.analytics.deltas.resolved.direction))}>
                <DeltaIcon direction={vm.analytics.deltas.resolved.direction} />
                {vm.analytics.deltas.resolved.label}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-amber-500/25 bg-slate-950/80">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-amber-500/15 p-2 text-amber-300"><span className="text-sm font-semibold">$</span></div>
              <ArrowUpRight className="h-5 w-5 text-amber-300/80" />
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Total Amount</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-semibold text-zinc-100">{vm.isLoading && !vm.hasAnyData ? <Skeleton className="h-8 w-20" /> : `${(vm.summary.totalAmount / 1000).toFixed(1)}K`}</span>
              <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-xs", deltaBadgeClass(vm.analytics.deltas.totalAmount.direction))}>
                <DeltaIcon direction={vm.analytics.deltas.totalAmount.direction} />
                {vm.analytics.deltas.totalAmount.label}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={vm.searchTerm}
            onChange={(event) => vm.setSearchTerm(event.target.value)}
            placeholder="Search disputes by ID, title, or reporter..."
            className="h-11 rounded-xl border-zinc-600/50 bg-zinc-950/70 pl-9"
          />
        </div>
        <div className="flex w-full flex-wrap items-center gap-1 rounded-xl border border-zinc-600/50 bg-zinc-950/70 p-1 lg:w-auto">
          {filterTabs.map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={vm.statusFilter === tab.key ? "secondary" : "ghost"}
              onClick={() => vm.setStatusFilter(tab.key)}
              className={cn(
                "h-8 rounded-lg px-3 text-xs",
                vm.statusFilter === tab.key && "bg-zinc-700/70 text-zinc-100"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </section>

      <section className={cn("grid gap-4", laneRows.length <= 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4")}>
        {laneRows.map((lane) => (
          <div key={lane.key} className={cn("rounded-2xl border bg-slate-950/70", lane.borderClass)}>
            <div className={cn("flex items-center justify-between rounded-t-2xl border-b px-4 py-3", lane.headerClass, lane.borderClass)}>
              <div className={cn("flex items-center gap-2 text-sm font-semibold tracking-wide", lane.colorClass)}>
                {lane.icon}
                <span>{lane.title}</span>
              </div>
              <Badge variant="secondary" className="font-mono">{lane.data.length}</Badge>
            </div>

            <ScrollArea className="h-[420px]">
              {vm.isLoading && !vm.hasAnyData ? (
                <LaneSkeleton />
              ) : lane.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
                  <div className={cn("mb-2 rounded-full p-2", lane.colorClass)}>{lane.icon}</div>
                  <p className="text-xs text-muted-foreground italic">No disputes in this lane</p>
                </div>
              ) : (
                <div className="space-y-3 p-3">
                  {lane.data.map((dispute: DisputeDTO) => {
                    const severityToken = String(dispute.severity ?? 'med').toLowerCase();
                    const severityLabel = severityLabels[severityToken] ?? 'Med';
                    const commentsCount = Number(dispute.comments_count ?? 0);
                    const category = String(dispute.category ?? 'General');
                    return (
                      <Card
                        key={dispute.id}
                        className={cn("cursor-pointer border bg-slate-900/90 transition-colors hover:bg-slate-900", lane.borderClass)}
                        onClick={() => navigate({ to: `/disputes/${dispute.id}` as any })}
                      >
                        <CardContent className="space-y-3 p-3">
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="font-mono">{dispute.id.slice(0, 8).toUpperCase()}</span>
                            <span>{new Date(dispute.created_at).toLocaleDateString()}</span>
                          </div>

                          <p className="text-2xs line-clamp-2 text-sm font-semibold text-zinc-100">
                            {dispute.task?.title || dispute.reason || "Dispute Case"}
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px]", severityClasses[severityToken] ?? severityClasses.med)}>
                              {severityLabel}
                            </span>
                            <span className="inline-flex items-center rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-300">
                              {category}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5 border border-zinc-700">
                                <AvatarImage src={dispute.complainant?.avatar_url} />
                                <AvatarFallback className="text-[8px]">
                                  {dispute.complainant?.full_name?.slice(0, 2)?.toUpperCase() || "AD"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                                <MessageSquare className="h-3 w-3" />
                                {commentsCount}
                              </span>
                            </div>
                            <span className="font-mono text-sm font-semibold text-zinc-100">{formatAmount(dispute.amount || 0)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        ))}
      </section>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Dispute</DialogTitle>
            <DialogDescription>
              Create a new dispute record from existing task and user IDs.
            </DialogDescription>
          </DialogHeader>
          <Form {...createDisputeForm}>
            <form className="space-y-4" onSubmit={createDisputeForm.handleSubmit(onSubmitCreateDispute)}>
              <FormField
                control={createDisputeForm.control}
                name="task_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task ID</FormLabel>
                    <FormControl>
                      <Input placeholder="00000000-0000-0000-0000-000000000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createDisputeForm.control}
                name="complainant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complainant User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="00000000-0000-0000-0000-000000000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createDisputeForm.control}
                name="defendant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Defendant User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="00000000-0000-0000-0000-000000000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createDisputeForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Describe why this dispute is being created..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={vm.isCreatingDispute}>
                  {vm.isCreatingDispute ? 'Creating…' : 'Create Dispute'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
