
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getTasks } from "@/features/tasks/services/task_actions";
import { TaskSearch } from "@/components/tasks/TaskSearch";
import { PaginationControls } from "@/components/users/PaginationControls"; // Reusing pagination
import { Clock, DollarSign, User } from "lucide-react";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.query || "";
  const status = params.status || "all";

  const res = await getTasks(page, status, 10, query);
  const { tasks, totalPages } = res.success ? res.data : { tasks: [], totalPages: 0 };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'assigned': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'in_progress': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'canceled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'review': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Task Management</h2>
        {/* <Button>Create Task</Button> */} 
      </div>

      <TaskSearch />

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Task</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Freelancer</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Link href={`/dashboard/tasks/${task.id}`} className="block group">
                        <div className="font-medium group-hover:underline group-hover:text-primary transition-colors line-clamp-1">
                            {task.title}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                            {task.description}
                        </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={task.client.avatar_url} />
                            <AvatarFallback>{task.client.full_name?.charAt(0) || "C"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.client.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.freelancer ? (
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={task.freelancer.avatar_url} />
                                <AvatarFallback>{task.freelancer.full_name?.charAt(0) || "F"}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.freelancer.full_name}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-mono text-sm">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        {task.budget}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    <div className="flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(task.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No tasks found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls totalPages={totalPages} />
    </div>
  );
}
