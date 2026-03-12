import { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Tag,
  Eye,
  Bookmark,
  Share2,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Skeleton } from "../../../../components/ui/skeleton";
import { createScopedLogger } from "../../../../lib/appLogger";
import type { TaskDTO } from "../../models/task.schema";
import { cn } from "../../../../lib/utils";
import { format } from "date-fns";
import { useNavigate } from "@tanstack/react-router";

const log = createScopedLogger("Tasks:AppView");

export interface TaskAppPreviewProps {
  tasks: TaskDTO[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  isLoading: boolean;
  totalTasks: number;
}

function TaskDeviceCard({ task, onViewFull }: { task: TaskDTO; onViewFull: () => void }) {
  const initials = task.client?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  const dateLabel = task.created_at
    ? format(new Date(task.created_at), "MMM d, yyyy")
    : "—";

  return (
    <div className="flex flex-col gap-3 overflow-y-auto px-3 pb-4">
      {/* Poster row */}
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#23a481]/20 text-xs font-bold text-[#47d7a3]">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#e8e6e3]">
            {task.client?.full_name ?? "Unknown"}
          </p>
          <p className="text-xs text-[#9d9588]">—</p>
        </div>
        <div className="rounded-full bg-[#054391]/10 px-2 py-1 text-[10px] font-semibold text-[#5eb1fa]">
          {task.status}
        </div>
      </div>
      {/* Title */}
      <h3 className="line-clamp-1 text-base font-bold leading-tight text-[#e8e6e3]">
        {task.title}
      </h3>
      {/* Description */}
      <p className="line-clamp-3 text-xs leading-relaxed text-[#afa89d]">
        {task.description || "—"}
      </p>
      {/* Meta: location, category, date (placeholders where needed) */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-lg bg-[#181a26]/40 px-2 py-1 text-xs text-[#b0a99f]">
          <MapPin className="h-2.5 w-2.5" />
          —
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-[#181a26]/40 px-2 py-1 text-xs text-[#b0a99f]">
          <Tag className="h-2.5 w-2.5" />
          {task.category ?? "—"}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-[#181a26]/40 px-2 py-1 text-xs text-[#b0a99f]">
          <Calendar className="h-2.5 w-2.5" />
          {dateLabel}
        </span>
      </div>
      {/* Budget + engagement placeholders */}
      <div className="flex items-center justify-between border-t border-[#7f7668]/40 pt-2">
        <div className="flex items-center gap-1 text-base font-bold text-[#e8e6e3]">
          {typeof task.budget === "number" ? `IQD ${task.budget.toLocaleString()}` : "—"}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#9d9588]">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />—
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="h-3 w-3" />—
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />—
          </span>
        </div>
      </div>
      {/* Offers (real count when available) */}
      <div className="rounded-xl border border-[#1f9167]/20 bg-[#0a0c11] p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#e8e6e3]">Offers</span>
          <span className="text-xs text-[#9d9588]">
            {typeof task.offers_count === 'number' ? task.offers_count : '—'}
          </span>
        </div>
        {typeof task.offers_count !== 'number' && (
          <p className="mt-1 text-xs text-[#9d9588]">Count when task_requests is available.</p>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full border-[#334155] text-[#c4d0e0] hover:bg-[#111a2b]"
        onClick={onViewFull}
      >
        View full details
      </Button>
    </div>
  );
}

function AppPreviewSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-[#2e3948] bg-[#0e0f13] p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32 bg-[#1b2738]" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-lg bg-[#1b2738]" />
          <Skeleton className="h-9 w-9 rounded-lg bg-[#1b2738]" />
        </div>
      </div>
      <div className="mx-auto w-[340px] overflow-hidden rounded-[40px] border-2 border-[#2e3948] bg-[#080a0e] shadow-lg">
        <div className="flex h-[40px] items-center justify-between border-b border-[#2e3948] px-4">
          <Skeleton className="h-3 w-12 bg-[#1b2738]" />
          <Skeleton className="h-5 w-20 rounded-full bg-[#1b2738]" />
        </div>
        <div className="space-y-3 p-4">
          <Skeleton className="h-10 w-full rounded-lg bg-[#1b2738]" />
          <Skeleton className="h-4 w-3/4 bg-[#1b2738]" />
          <Skeleton className="h-16 w-full bg-[#1b2738]" />
          <Skeleton className="h-8 w-24 bg-[#1b2738]" />
        </div>
      </div>
      <div className="flex justify-center gap-1">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-1.5 w-1.5 rounded-full bg-[#1b2738]" />
        ))}
      </div>
    </div>
  );
}

export function TaskAppPreview({
  tasks,
  currentIndex,
  onPrev,
  onNext,
  isLoading,
  totalTasks,
}: TaskAppPreviewProps) {
  const navigate = useNavigate();
  const clampedIndex = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.max(0, Math.min(currentIndex, tasks.length - 1));
  }, [currentIndex, tasks.length]);

  const currentTask = tasks[clampedIndex] ?? null;

  log.info("render", {
    tasksLength: tasks.length,
    currentIndex: clampedIndex,
    isLoading,
    totalTasks,
  });

  if (isLoading && tasks.length === 0) {
    return <AppPreviewSkeleton />;
  }

  if (!isLoading && tasks.length === 0) {
    return (
      <div className="rounded-[14px] border border-[#2e3948] bg-[#0e0f13] p-6">
        <div className="flex items-center gap-2 text-[#e8e6e3]">
          <Smartphone className="h-4 w-4" />
          <span className="font-semibold">App Preview</span>
          <span className="text-sm text-[#9d9588]">— Browse tasks as users see them</span>
        </div>
        <div className="mx-auto mt-4 flex w-[340px] flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-[#344356] bg-[#09101d] py-16">
          <p className="text-sm font-medium text-[#dbe3ef]">No tasks</p>
          <p className="mt-1 text-xs text-[#8b98af]">Adjust filters or refresh to see tasks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] border border-[#2e3948] bg-[#0e0f13] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#e8e6e3]">
          <Smartphone className="h-4 w-4" />
          <span className="font-semibold">App Preview</span>
          <span className="text-sm text-[#9d9588]">— Browse tasks as users see them</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg border border-[#2e3948] bg-[#0e0f13] text-[#9e9589] hover:bg-[#181a26] disabled:opacity-30"
            disabled={tasks.length === 0 || clampedIndex <= 0}
            onClick={() => {
              log.debug("prev slide");
              onPrev();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[4rem] text-center text-sm font-semibold text-[#afa89d]">
            {clampedIndex + 1} <span className="text-[#b1aaa0]">/ {tasks.length}</span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg border border-[#2e3948] bg-[#181a26]/40 text-[#9e9589] hover:bg-[#181a26] disabled:opacity-30"
            disabled={tasks.length === 0 || clampedIndex >= tasks.length - 1}
            onClick={() => {
              log.debug("next slide");
              onNext();
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mx-auto w-[340px] overflow-hidden rounded-[40px] border-2 border-[#2e3948] bg-[#080a0e] shadow-lg ring-1 ring-[#23a481]/5">
        {/* Status bar */}
        <div className="flex h-10 items-center justify-between border-b border-[#2e3948] px-4">
          <span className="text-[10px] font-semibold text-[#afa89d]">9:41</span>
          <div className="h-5 w-20 rounded-full bg-[#151720]" />
          <div className="flex gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-[#3cd8b3]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#3cd8b3]" />
          </div>
        </div>
        {/* App bar: Task Details + menu */}
        <div className="flex h-[52px] items-center justify-between border-b border-[#2e3948] px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#23a481]/20">
              <Smartphone className="h-3.5 w-3.5 text-[#47d7a3]" />
            </div>
            <span className="text-sm font-bold text-[#e8e6e3]">Task Details</span>
          </div>
          <button type="button" className="p-1 text-[#9e9589] hover:text-[#e8e6e3]">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        {/* Scrollable task card */}
        <div className="max-h-[520px] overflow-y-auto">
          {currentTask && (
            <TaskDeviceCard
              task={currentTask}
              onViewFull={() => {
                log.info("navigate to task detail", { taskId: currentTask.id });
                navigate({ to: `/tasks/${currentTask.id}` as any });
              }}
            />
          )}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="mt-4 flex justify-center gap-1.5">
        {tasks.slice(0, 12).map((_, i) => (
          <button
            key={i}
            type="button"
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              i === clampedIndex ? "bg-[#23a481]" : "bg-[#222433]"
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
