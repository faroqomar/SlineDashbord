'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskDTO, TaskStatus } from "../../models/task.schema";
import { format } from "date-fns";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskTableProps {
  tasks: TaskDTO[];
  onViewDetails: (task: TaskDTO) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

const statusMap: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  assigned: { label: "Assigned", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  in_progress: { label: "In Progress", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  canceled: { label: "Cancelled", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  review: { label: "Review", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  disputed: { label: "Disputed", color: "bg-red-600/10 text-red-600 border-red-600/20" },
  under_review: { label: "Under Review", color: "bg-gray-100 text-gray-800" },
};

export function TaskTable({ tasks, onViewDetails, onUpdateStatus }: TaskTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="line-clamp-1">{task.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {task.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusMap[task.status]?.color || ""}>
                    {statusMap[task.status]?.label || task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                    <span className="font-mono text-xs">IQD {task.budget.toLocaleString()}</span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(task.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewDetails(task)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onUpdateStatus(task.id, 'canceled')}>
                        Cancel Task
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(task.id, 'completed')}>
                        Mark Completed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
