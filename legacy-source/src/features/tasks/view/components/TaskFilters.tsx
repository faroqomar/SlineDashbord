'use client';

import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TaskStatus } from "../../models/task.schema";
import { TaskFilters } from "../../viewmodels/use_tasks_viewmodel";

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (newFilters: Partial<TaskFilters>) => void;
}

export function TaskFiltersComp({ filters, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search by title..."
          value={filters.search || ""}
          onChange={(e) => onChange({ search: e.target.value })}
          className="max-w-sm"
        />
      </div>
      <div className="w-[180px]">
        <Select
          value={filters.status || "all"}
          onValueChange={(val) => onChange({ status: val === "all" ? undefined : (val as TaskStatus) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="canceled">Cancelled</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
            <SelectItem value="review">Review</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
