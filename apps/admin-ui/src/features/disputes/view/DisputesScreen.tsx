import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateDisputeInputSchema, type CreateDisputeInput } from "@sline/shared";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Flame,
  Gavel,
  MessageSquare,
  RefreshCw,
  Search,
  XCircle,
  Zap,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { DisputeDTO } from "../models/dispute.schema";
import type { DisputeTab } from "../viewmodels/use_disputes_viewmodel";
import { useDisputesViewModel } from "../viewmodels/use_disputes_viewmodel";
import { DisputeCard } from "./components/DisputeCard";
import { DisputeMetricCard } from "./components/DisputeMetricCard";
import { DisputeStatusSummaryCard } from "./components/DisputeStatusSummaryCard";

const severityClasses: Record<string, string> = {
  low: "bg-slate-500/20 text-slate-300 border-slate-400/20",
  med: "bg-amber-500/20 text-amber-300 border-amber-400/20",
  high: "bg-orange-500/20 text-orange-300 border-orange-400/20",
  crit: "bg-red-500/20 text-red-300 border-red-400/20",
};

const severityLabels: Record<string, string> = {
  low: "Low",
  med: "Med",
  high: "High",
  crit: "Crit",
};

function formatAmount(amount: number): string {
  return `IQD${Math.round(amount || 0).toLocaleString()}`;
}

const TABS: { key: DisputeTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "active", label: "Active" },
  { key: "resolved", label: "Resolved" },
  { key: "canceled", label: "Canceled" },
];

// Placeholder chart data (Last 7 days) — replace with API when available
const MOCK_CHART_DATA = [
  { day: "Mon", opened: 2, resolved: 1 },
  { day: "Tue", opened: 1, resolved: 2 },
  { day: "Wed", opened: 3, resolved: 0 },
  { day: "Thu", opened: 1, resolved: 2 },
  { day: "Fri", opened: 2, resolved: 1 },
  { day: "Sat", opened: 0, resolved: 1 },
  { day: "Sun", opened: 0, resolved: 0 },
];

export function DisputesScreen() {
  const vm = useDisputesViewModel();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  const openActiveCount = (vm.tabCounts.open ?? 0) + (vm.tabCounts.active ?? 0);
  const totalAmountDisplay = vm.disputes.length > 0
    ? vm.disputes.reduce((sum, d) => sum + (d.amount ?? 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })
    : "—";

  const createDisputeForm = useForm<CreateDisputeInput>({
    resolver: zodResolver(CreateDisputeInputSchema),
    defaultValues: {
      task_id: "",
      complainant_id: "",
      defendant_id: "",
      reason: "",
    },
  });

  const onSubmitCreateDispute = async (values: CreateDisputeInput) => {
    try {
      await vm.createDispute(values);
      createDisputeForm.reset();
      setIsCreateDialogOpen(false);
    } catch {
      // Error toast in ViewModel
    }
  };

  return (
    <div className="space-y-5" data-name="Disputes" data-node-id="2:27480">
      {/* Dispute Center header — Figma: title, description, actions, summary graph */}
      <section className="rounded-2xl border border-[#7f7668]/40 bg-[#080d0b] p-6" data-node-id="2:27631">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 border border-violet-500/30">
              <Gavel className="h-6 w-6 text-violet-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#c7f8e5]">Dispute Center</h2>
              <p className="text-sm text-[#9e9589]">Manage and resolve marketplace conflicts with financial oversight.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={vm.refreshAll} disabled={vm.isFetching} className="border-[#7f7668] text-[#c7f8e5]">
              <RefreshCw className={cn("mr-2 h-4 w-4", vm.isFetching && "animate-spin")} />
              Refresh
            </Button>
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white border-0"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Zap className="mr-2 h-4 w-4" />
              New Dispute
            </Button>
          </div>
        </div>
        {/* Last 7 days summary chart placeholder */}
        <div className="mt-4 rounded-xl border border-[#7f7668]/30 bg-[#0b110f] p-4 h-[80px]">
          <p className="text-xs text-[#9d9588] uppercase tracking-wider mb-2">Last 7 days</p>
          <ResponsiveContainer width="100%" height={44}>
            <AreaChart data={MOCK_CHART_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="opened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f04d4d" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f04d4d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ae081" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4ae081" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="opened" stroke="#f04d4d" fill="url(#opened)" strokeWidth={1} />
              <Area type="monotone" dataKey="resolved" stroke="#4ae081" fill="url(#resolved)" strokeWidth={1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Key metrics row — Figma: Total Disputes, Open/Active, Resolved, Total Amount */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-node-id="2:27632">
        <DisputeMetricCard
          label="Total Disputes"
          value={vm.tabCounts.all ?? 0}
          trendLabel="—"
          icon={<BarChart3 className="h-[18px] w-[18px] text-blue-400" />}
          accent="blue"
        />
        <DisputeMetricCard
          label="Open / Active"
          value={openActiveCount}
          trendLabel="—"
          icon={<Flame className="h-[18px] w-[18px] text-red-400" />}
          accent="red"
        />
        <DisputeMetricCard
          label="Resolved"
          value={vm.tabCounts.resolved ?? 0}
          trendLabel="—"
          icon={<CheckCircle2 className="h-[18px] w-[18px] text-green-400" />}
          accent="green"
        />
        <DisputeMetricCard
          label="Total Amount"
          value={totalAmountDisplay === "—" ? "—" : `IQD ${totalAmountDisplay}`}
          trendLabel="—"
          icon={<span className="text-amber-400 text-lg font-bold">IQD</span>}
          accent="amber"
        />
      </section>

      {vm.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Disputes Load Error</AlertTitle>
          <AlertDescription>{String((vm.error as Error)?.message ?? vm.error)}</AlertDescription>
        </Alert>
      )}

      {/* Search + filter tabs — Figma: search input, status tabs */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b2aba1]" />
          <Input
            value={vm.searchTerm}
            onChange={(e) => vm.setSearchTerm(e.target.value)}
            placeholder="Search disputes by ID, title, or reporter..."
            className="pl-9 border-[#7f7668] bg-[#0e0f13] text-[#e8e6e3] placeholder:text-[#b2aba1]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9d9588]">View:</span>
          <Button
            variant={viewMode === "cards" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className={viewMode === "cards" ? "bg-[#181a26] text-[#e8e6e3]" : ""}
          >
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "bg-[#181a26] text-[#e8e6e3]" : ""}
          >
            Table
          </Button>
        </div>
      </section>

      {/* Status summary cards — Figma: OPEN, UNDER REVIEW, ESCALATED, RESOLVED → we use Open, Active, Resolved, Canceled */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-node-id="2:27741">
        <DisputeStatusSummaryCard
          label="Open"
          count={vm.tabCounts.open ?? 0}
          icon={<Flame className="h-3 w-3" />}
          variant="open"
        />
        <DisputeStatusSummaryCard
          label="Active"
          count={vm.tabCounts.active ?? 0}
          icon={<Zap className="h-3 w-3" />}
          variant="active"
        />
        <DisputeStatusSummaryCard
          label="Resolved"
          count={vm.tabCounts.resolved ?? 0}
          icon={<CheckCircle2 className="h-3 w-3" />}
          variant="resolved"
        />
        <DisputeStatusSummaryCard
          label="Canceled"
          count={vm.tabCounts.canceled ?? 0}
          icon={<XCircle className="h-3 w-3" />}
          variant="canceled"
        />
      </section>

      <Tabs
        value={vm.statusFilter}
        onValueChange={(v) => {
          vm.setStatusFilter(v as DisputeTab);
          vm.setPage(1);
        }}
      >
        <TabsList className="w-full flex-wrap justify-start gap-1 bg-[#0e0f13] border border-[#7f7668]">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="gap-2 data-[state=active]:bg-[#181a26] data-[state=active]:text-[#e8e6e3]">
              {tab.label}
              <Badge variant="secondary" className="font-mono text-[10px] bg-black/20">
                {vm.tabCounts[tab.key] ?? 0}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={vm.statusFilter} className="mt-4">
          <div className="rounded-lg border border-[#7f7668]/30 bg-[#0e0f13] overflow-hidden">
            {vm.isLoading && vm.disputes.length === 0 ? (
              <div className="p-8">
                <Skeleton className="h-64 w-full bg-[#0a0d12]" />
              </div>
            ) : vm.disputes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-[#9d9588]">
                <AlertCircle className="mb-2 h-10 w-10" />
                <p>No disputes in this tab.</p>
              </div>
            ) : viewMode === "cards" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4" data-node-id="2:27742">
                  {vm.disputes.map((dispute: DisputeDTO) => (
                    <DisputeCard key={dispute.id} dispute={dispute} />
                  ))}
                </div>
                {vm.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-[#7f7668]/30 px-4 py-3">
                    <p className="text-sm text-[#9d9588]">
                      Page {vm.page} of {vm.totalPages} ({vm.totalDisputes} total)
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-[#7f7668]" disabled={vm.page <= 1} onClick={() => vm.setPage((p) => Math.max(1, p - 1))}>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="border-[#7f7668]" disabled={vm.page >= vm.totalPages} onClick={() => vm.setPage((p) => p + 1)}>
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Task / Reason</TableHead>
                      <TableHead>Parties</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vm.disputes.map((dispute: DisputeDTO) => {
                      const sev = String(dispute.severity ?? "med").toLowerCase();
                      const sevLabel = severityLabels[sev] ?? "Med";
                      const complainant = dispute.complainant;
                      const defendant = dispute.defendant;
                      return (
                        <TableRow
                          key={dispute.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate({ to: `/disputes/${dispute.id}` as any })}
                        >
                          <TableCell className="font-mono text-xs">{dispute.id.slice(0, 8)}</TableCell>
                          <TableCell>
                            <p className="line-clamp-2 font-medium">{dispute.task?.title || dispute.reason || "—"}</p>
                            <p className="text-xs text-muted-foreground">{new Date(dispute.created_at).toLocaleDateString()}</p>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={complainant?.avatar_url ?? undefined} />
                                <AvatarFallback className="text-[10px]">{complainant?.full_name?.slice(0, 2) ?? "?"}</AvatarFallback>
                              </Avatar>
                              <span>{complainant?.full_name ?? "—"}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              {Number(dispute.comments_count ?? 0)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{dispute.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={cn("inline-flex rounded border px-2 py-0.5 text-[10px]", severityClasses[sev] ?? severityClasses.med)}>
                              {sevLabel}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">{formatAmount(dispute.amount ?? 0)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate({ to: `/disputes/${dispute.id}` as any }); }}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {vm.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-[#7f7668]/30 px-4 py-3">
                    <p className="text-sm text-[#9d9588]">
                      Page {vm.page} of {vm.totalPages} ({vm.totalDisputes} total)
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-[#7f7668]" disabled={vm.page <= 1} onClick={() => vm.setPage((p) => Math.max(1, p - 1))}>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="border-[#7f7668]" disabled={vm.page >= vm.totalPages} onClick={() => vm.setPage((p) => p + 1)}>
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Dispute</DialogTitle>
            <DialogDescription>Create a new dispute from task and user IDs.</DialogDescription>
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
                      <Input placeholder="UUID" {...field} />
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
                    <FormLabel>Complainant ID</FormLabel>
                    <FormControl>
                      <Input placeholder="UUID" {...field} />
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
                    <FormLabel>Defendant ID</FormLabel>
                    <FormControl>
                      <Input placeholder="UUID" {...field} />
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
                      <Textarea rows={4} placeholder="Describe the dispute..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={vm.isCreatingDispute}>{vm.isCreatingDispute ? "Creating…" : "Create"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
