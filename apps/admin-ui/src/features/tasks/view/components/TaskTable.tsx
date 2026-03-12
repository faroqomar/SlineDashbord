import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { TaskDTO, TaskStatus } from "../../models/task.schema";
import { format } from "date-fns";
import { MoreHorizontal, Eye, MapPin, Send, Circle, Ban, CheckCircle2, PlayCircle, Clock3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { getTaskQueueRowMockMeta } from "../../models/task-queue-ui.mock";

interface TaskTableProps {
  tasks: TaskDTO[];
  onViewDetails: (task: TaskDTO) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

const statusMap: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-[#04243f] text-[#67b4ff] border-[#0c5ea4]/40" },
  assigned: { label: "Assigned", color: "bg-[#2f2612] text-[#f2bb58] border-[#946812]/40" },
  in_progress: { label: "In Progress", color: "bg-[#2f2612] text-[#f2bb58] border-[#946812]/40" },
  completed: { label: "Completed", color: "bg-[#0c3227] text-[#53d39d] border-[#1f815f]/40" },
  canceled: { label: "Cancelled", color: "bg-[#32131b] text-[#f46a7f] border-[#7f2237]/40" },
  review: { label: "Review", color: "bg-[#252a3a] text-[#a4b7de] border-[#455678]/40" },
  disputed: { label: "Disputed", color: "bg-[#32131b] text-[#f46a7f] border-[#7f2237]/40" },
  under_review: { label: "Under Review", color: "bg-[#252a3a] text-[#a4b7de] border-[#455678]/40" },
};

const statusIconMap: Record<string, JSX.Element> = {
  open: <Circle className="h-3.5 w-3.5 text-[#50a8ff]" />,
  assigned: <Clock3 className="h-3.5 w-3.5 text-[#f4c35d]" />,
  in_progress: <PlayCircle className="h-3.5 w-3.5 text-[#f4c35d]" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5 text-[#53d39d]" />,
  canceled: <Ban className="h-3.5 w-3.5 text-[#f46a7f]" />,
  review: <Clock3 className="h-3.5 w-3.5 text-[#9badcf]" />,
  disputed: <Ban className="h-3.5 w-3.5 text-[#f46a7f]" />,
  under_review: <Clock3 className="h-3.5 w-3.5 text-[#9badcf]" />,
};

export function TaskTable({ tasks, onViewDetails, onUpdateStatus }: TaskTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#2f3947] bg-[#050a14]">
      <Table>
        <TableHeader>
          <TableRow className="border-[#1e2837] hover:bg-transparent">
            <TableHead className="h-11 px-4 text-[10px] uppercase tracking-[0.08em] text-[#6f7e95]">Task</TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.08em] text-[#6f7e95]">Status</TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.08em] text-[#6f7e95]">Budget</TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.08em] text-[#6f7e95]">Offers</TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.08em] text-[#6f7e95]">Created</TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.08em] text-[#6f7e95]">Poster</TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.08em] text-[#6f7e95]">Views (mock)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-40 text-center">
                <div className="mx-auto max-w-sm space-y-1">
                  <p className="text-sm font-medium text-[#d6deec]">No tasks found</p>
                  <p className="text-xs text-[#7f8aa0]">Try clearing filters or searching with another keyword.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const mockMeta = getTaskQueueRowMockMeta(task.id);
              const categoryLabel = task.category || mockMeta.fallbackCategory;
              const posterName = task.client?.full_name || "Unknown";
              const initials = posterName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join("");

              return (
                <TableRow
                  key={task.id}
                  className="cursor-pointer border-[#1e2837] hover:bg-[#0b1220]"
                  onClick={() => onViewDetails(task)}
                >
                  <TableCell className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#263548] bg-[#0a1424]">
                          {statusIconMap[task.status] || <Circle className="h-3.5 w-3.5 text-[#8ca0bd]" />}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-sm font-medium text-[#d6deec]">{task.title}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#8190a8]">
                            <span className="rounded-sm bg-[#121b2c] px-1.5 py-0.5">{categoryLabel}</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {mockMeta.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-[#8190a8] hover:bg-[#162035] hover:text-[#d6deec]">
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
                    </div>
                  </TableCell>
                  <TableCell className="py-3" onClick={(event) => event.stopPropagation()}>
                    <Badge variant="outline" className={statusMap[task.status]?.color || ""}>
                      {statusMap[task.status]?.label || task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-[#d6deec]">
                    IQD{task.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-[#65ddb6]">
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#1f815f]/40 bg-[#0c3227] px-2 py-0.5">
                      <Send className="h-3 w-3" />
                      {typeof task.offers_count === 'number' ? task.offers_count : mockMeta.offers}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-[#9aa7bf]">
                    {format(new Date(task.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2a3142] text-[9px] text-[#d3d9e6]">
                        {initials || "AD"}
                      </div>
                      <span className="text-xs text-[#d3d9e6]">{posterName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-[#9aa7bf]">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {mockMeta.views}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
