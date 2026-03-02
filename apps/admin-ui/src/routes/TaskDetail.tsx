import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, DollarSign, Tag, User, Briefcase, FileImage, ShieldCheck, Activity } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { cn } from "../lib/utils";
import { tasksApi } from '../features/tasks/services/tasks_api';
import { TaskActivity } from '../features/tasks/view/components/TaskActivity';
import { TaskStatus } from '../features/tasks/models/task.schema';

export function TaskDetailPage() {
  const { taskId } = useParams({ from: '/auth/tasks/$taskId' } as any);

  const { data: task, isLoading: isTaskLoading } = useQuery({
    queryKey: ['tasks', 'detail', taskId],
    queryFn: () => tasksApi.getTaskDetails(taskId),
  });

  const { data: activity = [], isLoading: isActivityLoading } = useQuery({
    queryKey: ['tasks', 'activity', taskId],
    queryFn: () => tasksApi.getTaskActivity(taskId),
  });

  if (isTaskLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Task not found</h2>
        <Link to="/tasks" className="text-primary hover:underline mt-4 inline-block">
          Back to tasks
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: TaskStatus) => {
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Link to="/tasks">
              <Button variant="ghost" size="sm" className="h-8">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight">{task.title}</h1>
                <p className="text-xs text-muted-foreground font-mono">TASK-{task.id.slice(0, 8).toUpperCase()}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("px-3 py-1", getStatusColor(task.status as TaskStatus))}>
                {task.status.replace('_', ' ').toUpperCase()}
            </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="glass-card !border-none !shadow-2xl">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Task Description
                    </CardTitle>
                  </div>
                   <div className="text-right">
                      <div className="text-2xl font-black font-mono text-primary flex items-center justify-end">
                        <DollarSign className="h-5 w-5 mr-0.5 opacity-50" />
                        {task.budget?.toLocaleString() || '0'}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">IQD Budget</div>
                   </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap bg-background/50 p-6 rounded-xl border border-primary/5 italic shadow-inner">
                    {task.description}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                         <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            Timeline
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center bg-background/40 p-2 rounded-lg">
                                <span className="text-muted-foreground text-xs italic">Posted</span>
                                <span className="font-medium text-xs">{new Date(task.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-background/40 p-2 rounded-lg">
                                <span className="text-muted-foreground text-xs italic">Deadline</span>
                                <span className={cn("font-medium text-xs", !task.deadline && "text-muted-foreground")}>
                                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}
                                </span>
                            </div>
                        </div>
                    </div>
                     <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                         <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                            <Tag className="h-3 w-3" />
                            Skills & Taxonomy
                        </h3>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {task.category && (
                                <Badge className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/20">{task.category}</Badge>
                            )}
                            {task.skills?.map((skill: string) => (
                                <Badge key={skill} variant="secondary" className="text-[10px] font-medium opacity-80">{skill}</Badge>
                            ))}
                             {!task.category && (!task.skills || task.skills.length === 0) && (
                                <span className="text-xs text-muted-foreground italic opacity-50">Empty taxonomy</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* Activity Section Mobile */}
          <div className="lg:hidden">
              <TaskActivity activities={activity} />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
            {/* Participants Card */}
            <Card className="border-primary/10 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        Ownership & Assignment
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-6">
                    {/* Client */}
                    <div className="relative">
                        <div className="text-[10px] font-black text-muted-foreground/40 absolute -top-1 left-9 uppercase">Client / Owner</div>
                        <div className="flex items-center gap-3 bg-muted/10 p-2 rounded-xl border border-transparent hover:border-border transition-colors">
                            <Avatar className="h-10 w-10 ring-2 ring-background">
                                <AvatarImage src={task.client?.avatar_url} />
                                <AvatarFallback className="bg-primary/5 text-primary">{task.client?.full_name?.charAt(0) || "C"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm truncate">{task.client?.full_name}</div>
                                <Link to={`/users/${task.client?.id}` as any} className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1">
                                    Profile Link
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Freelancer */}
                    <div className="relative">
                        <div className="text-[10px] font-black text-muted-foreground/40 absolute -top-1 left-9 uppercase">Freelancer / Assignee</div>
                        {task.freelancer ? (
                             <div className="flex items-center gap-3 bg-muted/10 p-2 rounded-xl border border-transparent hover:border-border transition-colors">
                                <Avatar className="h-10 w-10 ring-2 ring-background">
                                    <AvatarImage src={task.freelancer.avatar_url} />
                                    <AvatarFallback className="bg-primary/5 text-primary">{task.freelancer.full_name?.charAt(0) || "F"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-sm truncate">{task.freelancer.full_name}</div>
                                    <Link to={`/users/${task.freelancer.id}` as any} className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1">
                                        Profile Link
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-muted text-center italic text-xs text-muted-foreground justify-center">
                                No assigned freelancer
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Admin Activity Sidebar (Lg Only) */}
            <div className="hidden lg:block">
                <TaskActivity activities={activity} />
            </div>

            {/* Security Notice */}
            <Card className="bg-primary/5 border-primary/20 shadow-none">
                <CardContent className="p-4 flex gap-3 text-xs leading-normal">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-primary/80">
                        <strong>Admin Override Active</strong>: Status changes here bypass standard escrow triggers.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
