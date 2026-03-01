'use client';

import { useTasksViewModel } from "../viewmodels/use_tasks_viewmodel";
import { TaskTable } from "./components/TaskTable";
import { TaskFiltersComp } from "./components/TaskFilters";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useState } from "react";
import { TaskStatus } from "../models/task.schema";
import { Textarea } from "@/components/ui/textarea";

export function TasksScreen() {
  const vm = useTasksViewModel();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<{ id: string; status: TaskStatus } | null>(null);
  const [updateReason, setUpdateReason] = useState("");

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks Management</h2>
          <p className="text-muted-foreground">
            Monitor and moderate marketplace work, contracts, and delivery status.
          </p>
        </div>
        <Button variant="outline" onClick={vm.refreshTasks} disabled={vm.isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${vm.isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {vm.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{vm.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vm.totalTasks}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <TaskFiltersComp filters={vm.filters} onChange={vm.changeFilters} />
          
          <TaskTable 
            tasks={vm.tasks} 
            onViewDetails={(task) => window.location.href = `/dashboard/tasks/${task.id}`}
            onUpdateStatus={handleStatusClick}
          />
          
          <div className="flex items-center justify-between mt-4">
             <div className="text-xs text-muted-foreground">
                Showing {vm.tasks.length} of {vm.totalTasks} tasks
             </div>
             <div className="flex items-center gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={vm.filters.page === 1 || vm.isLoading}
                    onClick={() => vm.changeFilters({ page: (vm.filters.page || 1) - 1 })}
                >
                    Previous
                </Button>
                <Button 
                    variant="outline" 
                    size="sm"
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
        <DialogContent>
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
              onChange={(e) => setUpdateReason(e.target.value)}
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
