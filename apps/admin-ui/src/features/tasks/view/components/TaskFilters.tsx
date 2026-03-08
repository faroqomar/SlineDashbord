import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Search, Filter, Smartphone } from "lucide-react";
import { TaskFilters } from "../../viewmodels/use_tasks_viewmodel";
import React from "react";

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (newFilters: Partial<TaskFilters>) => void;
  activeFilterCount: number;
  viewMode: 'table' | 'app';
  onViewModeChange: (viewMode: 'table' | 'app') => void;
}

const statusTabs: Array<{ label: string; value: string }> = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "canceled" },
];

export function TaskFiltersComp({
  filters,
  onChange,
  activeFilterCount,
  viewMode,
  onViewModeChange,
}: TaskFiltersProps) {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 rounded-xl border border-[#3b4352] bg-[#070d18]">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#7f8aa0]" />
          <Input
            placeholder="Search by title, category, poster, or UUID..."
            value={filters.search || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ search: e.target.value })}
            className="h-11 border-0 bg-transparent pl-9 text-sm text-[#d9e1ef] placeholder:text-[#748099] focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#3b4352] bg-[#0a101b] px-2 text-xs text-[#9ca8bf]">
            <Filter className="h-3.5 w-3.5" />
            <span>{activeFilterCount}</span>
          </div>
          <div className="inline-flex rounded-lg border border-[#3b4352] bg-[#0a101b] p-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('table')}
              className={`h-7 px-3 text-xs ${viewMode === 'table' ? 'bg-[#1f293b] text-[#d9e1ef]' : 'text-[#8e9ab1]'}`}
            >
              Table
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('app')}
              className={`h-7 px-3 text-xs ${viewMode === 'app' ? 'bg-[#1f293b] text-[#d9e1ef]' : 'text-[#8e9ab1]'}`}
            >
              <Smartphone className="mr-1 h-3.5 w-3.5" />
              App View
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[#7f8aa0]">Status</span>
        {statusTabs.map((tab) => {
          const isActive = (filters.status || "all") === tab.value;
          return (
            <Button
              key={tab.value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange({ status: tab.value === "all" ? undefined : tab.value })}
              className={`h-7 rounded-full border px-3 text-xs ${
                isActive
                  ? 'border-[#35d0b6] bg-[#0f2f2c] text-[#7ce9d5]'
                  : 'border-[#303a49] bg-[#0a101b] text-[#8e9ab1]'
              }`}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
