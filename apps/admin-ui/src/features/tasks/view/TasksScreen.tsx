import { useTasksViewModel } from "../viewmodels/use_tasks_viewmodel";
import { TaskTable } from "./components/TaskTable";
import { TaskFiltersComp } from "./components/TaskFilters";
import { Card, CardContent } from "../../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  Layers,
  PlayCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../../../components/ui/dialog";
import { useMemo, useState, useEffect } from "react";
import { TaskStatus } from "../models/task.schema";
import { Textarea } from "../../../components/ui/textarea";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { Skeleton } from "../../../components/ui/skeleton";
import { cn } from "../../../lib/utils";
import { TASK_QUEUE_HERO_SERIES, TASK_QUEUE_KPI_VISUAL } from "../models/task-queue-ui.mock";
import { useSetSearchParams } from "../../../lib/navigation-shim";
import { createScopedLogger } from "../../../lib/appLogger";
import { TaskAppPreview } from "./components/TaskAppPreview";

const log = createScopedLogger("Tasks:Screen");

function toPolylinePoints(values: readonly number[], width: number, height: number) {
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

function TaskQueueSkeletonView() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#2e3948] bg-[#07101d] p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-48 bg-[#1b2738]" />
            <Skeleton className="h-4 w-72 bg-[#1b2738]" />
          </div>
          <Skeleton className="h-10 w-24 bg-[#1b2738]" />
        </div>
        <Skeleton className="mt-6 h-16 w-full bg-[#1b2738]" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={`kpi-skeleton-${index}`} className="h-28 rounded-xl bg-[#141f30]" />
        ))}
      </div>

      <div className="rounded-xl border border-[#2e3948] bg-[#050a14] p-4">
        <Skeleton className="h-10 w-full bg-[#141f30]" />
        <div className="mt-3 space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={`row-skeleton-${index}`} className="h-12 w-full bg-[#101a29]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TasksScreen() {
  const vm = useTasksViewModel();
  const navigate = useNavigate();
  const location = useLocation();
  const setSearchParams = useSetSearchParams();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<{ id: string; status: TaskStatus } | null>(null);
  const [updateReason, setUpdateReason] = useState("");
  // Derive view from URL when on /tasks to avoid useSearch({ from }) route-id mismatch
  const viewMode = ((): "table" | "app" => {
    if (location.pathname !== "/tasks") return "table";
    const params = new URLSearchParams(location.search);
    return params.get("view") === "app" ? "app" : "table";
  })();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const setViewMode = (mode: "table" | "app") => {
    log.info("view mode change", { mode });
    const next = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    next.set("view", mode);
    setSearchParams(next);
  };

  useEffect(() => {
    setCarouselIndex(0);
    log.debug("carousel index reset", { page: vm.filters.page, tasksLength: vm.tasks.length });
  }, [vm.filters.page, vm.tasks.length]);

  const handleAppPreviewPrev = () => {
    setCarouselIndex((i) => Math.max(0, i - 1));
  };
  const handleAppPreviewNext = () => {
    setCarouselIndex((i) => Math.min(vm.tasks.length - 1, i + 1));
  };

  const handleStatusClick = (taskId: string, status: TaskStatus) => {
    setPendingStatus({ id: taskId, status });
    setUpdateReason("");
    setIsUpdateDialogOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!pendingStatus) return;
    const success = await vm.handleUpdateStatus(pendingStatus.id, pendingStatus.status, updateReason);
    if (success) {
      setIsUpdateDialogOpen(false);
      setPendingStatus(null);
    }
  };

  const showPageSkeleton = vm.isLoading && vm.tasks.length === 0;
  const heroSeries = useMemo(() => {
    if (vm.heroAnalytics?.days?.length === 7) {
      return {
        posted: vm.heroAnalytics.days.map((day) => day.posted_count),
        completed: vm.heroAnalytics.days.map((day) => day.completed_count),
      };
    }
    return TASK_QUEUE_HERO_SERIES;
  }, [vm.heroAnalytics]);
  const chartPostedPoints = toPolylinePoints(heroSeries.posted, 220, 58);
  const chartCompletedPoints = toPolylinePoints(heroSeries.completed, 220, 58);

  const statusCounts = useMemo(() => {
    return vm.tasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
  }, [vm.tasks]);

  const totalBudget = useMemo(
    () => vm.tasks.reduce((sum, task) => sum + task.budget, 0),
    [vm.tasks]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (vm.filters.search?.trim()) count += 1;
    if (vm.filters.status) count += 1;
    return count;
  }, [vm.filters.search, vm.filters.status]);

  const inProgressCount = (statusCounts.in_progress || 0) + (statusCounts.assigned || 0);
  const budgetLabel = totalBudget >= 1000 ? `${Math.round(totalBudget / 1000)}K` : totalBudget.toLocaleString();

  const kpiCards = [
    {
      id: "total",
      label: "Total Tasks",
      value: String(vm.totalTasks),
      visual: TASK_QUEUE_KPI_VISUAL.total,
      icon: Layers,
      tone: "text-[#57ddb6]",
      chartStroke: "#37d4ad",
    },
    {
      id: "open",
      label: "Open",
      value: String(statusCounts.open || 0),
      visual: TASK_QUEUE_KPI_VISUAL.open,
      icon: Clock3,
      tone: "text-[#57b9ff]",
      chartStroke: "#53a6ef",
    },
    {
      id: "inProgress",
      label: "In Progress",
      value: String(inProgressCount),
      visual: TASK_QUEUE_KPI_VISUAL.inProgress,
      icon: PlayCircle,
      tone: "text-[#ffcb69]",
      chartStroke: "#f4c35d",
    },
    {
      id: "budget",
      label: "Total Budget",
      value: budgetLabel,
      visual: TASK_QUEUE_KPI_VISUAL.budget,
      icon: CircleDollarSign,
      tone: "text-[#b693ff]",
      chartStroke: "#9f82ed",
    },
  ] as const;

  if (showPageSkeleton) {
    return <TaskQueueSkeletonView />;
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl border border-[#2f3b4b] bg-[linear-gradient(138deg,#061120_0%,#08162d_48%,#051118_100%)] p-6">
        <div className="pointer-events-none absolute -left-8 top-16 h-24 w-24 rounded-full bg-[#0ecdb33d] blur-2xl" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#3859ff2e] blur-2xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0d2038] text-[#66d4bf]">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#dbe3ef]">Tasks Queue</h2>
                <p className="text-sm text-[#8b98af]">
                  Monitor and moderate marketplace tasks, contracts & delivery
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={vm.refreshTasks}
            disabled={vm.isLoading || vm.isAnalyticsLoading}
            className="border-[#304257] bg-[#081323] text-[#c8d3e3] hover:bg-[#0f2036]"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", (vm.isLoading || vm.isAnalyticsLoading) && "animate-spin")} />
            Refresh
          </Button>
        </div>

        <div className="relative mt-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-5 text-xs text-[#93a0b6]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3cd8b3]" />
              Posted
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#4a83ff]" />
              Completed
            </span>
            <span>Last 7 days</span>
          </div>
          <svg width="220" height="62" viewBox="0 0 220 62" className="shrink-0">
            <polyline points={chartPostedPoints} fill="none" stroke="#36d3b0" strokeWidth="2" />
            <polyline points={chartCompletedPoints} fill="none" stroke="#4f86ff" strokeWidth="2" />
          </svg>
        </div>
      </section>

      {vm.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{vm.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const SparkIcon = card.icon;
          const points = toPolylinePoints(card.visual.sparkline, 62, 24);
          return (
            <Card key={card.id} className="border-[#2b3747] bg-[#050c18]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f1828] ${card.tone}`}>
                    <SparkIcon className="h-4 w-4" />
                  </div>
                  <svg width="62" height="24" viewBox="0 0 62 24">
                    <polyline points={points} fill="none" stroke={card.chartStroke} strokeWidth="2" />
                  </svg>
                </div>
                <p className="mt-3 text-[11px] uppercase tracking-[0.08em] text-[#8592a9]">{card.label}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-2xl font-semibold text-[#dbe3ef]">{card.value}</span>
                  <span
                    className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs ${
                      card.visual.trend === "up"
                        ? "bg-[#0c3227] text-[#53d39d]"
                        : "bg-[#2a1f14] text-[#f2bb58]"
                    }`}
                  >
                    {card.visual.trend === "up" ? (
                      <ArrowUpRight className="mr-0.5 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-0.5 h-3 w-3" />
                    )}
                    {card.visual.delta}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-[#2b3747] bg-[#040a14]">
        <CardContent className="p-4">
          <TaskFiltersComp
            filters={vm.filters}
            onChange={vm.changeFilters}
            activeFilterCount={activeFilterCount}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {viewMode === "table" ? (
            <TaskTable
              tasks={vm.tasks}
              onViewDetails={(task) => navigate({ to: `/tasks/${task.id}` as any })}
              onUpdateStatus={handleStatusClick}
            />
          ) : (
            <TaskAppPreview
              tasks={vm.tasks}
              currentIndex={carouselIndex}
              onPrev={handleAppPreviewPrev}
              onNext={handleAppPreviewNext}
              isLoading={vm.isLoading}
              totalTasks={vm.totalTasks}
            />
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-[#7f8aa0]">
              Showing {vm.tasks.length} of {vm.totalTasks} tasks
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#334155] bg-[#09101d] text-[#c4d0e0] hover:bg-[#111a2b]"
                disabled={vm.filters.page === 1 || vm.isLoading}
                onClick={() => vm.changeFilters({ page: (vm.filters.page || 1) - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#334155] bg-[#09101d] text-[#c4d0e0] hover:bg-[#111a2b]"
                disabled={vm.tasks.length < (vm.filters.pageSize || 10) || vm.isLoading}
                onClick={() => vm.changeFilters({ page: (vm.filters.page || 1) + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="border-[#2e4157] bg-[#07111f] text-[#dbe3ef]">
          <DialogHeader>
            <DialogTitle>Update Task Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of this task to <span className="font-bold">{pendingStatus?.status}</span>?
              {pendingStatus?.status === 'canceled' && " This will impact ongoing escrow and payments."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <label className="text-sm font-medium">Internal Reason / Note for Audit</label>
            <Textarea
              placeholder="Provide a reason for this administrative action..."
              value={updateReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUpdateReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
            <Button
                onClick={confirmStatusUpdate}
                className={pendingStatus?.status === 'canceled' ? 'bg-red-600 hover:bg-red-700' : ''}
                disabled={vm.isUpdating || updateReason.length < 5}
            >
              {vm.isUpdating ? "Updating..." : "Confirm Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
