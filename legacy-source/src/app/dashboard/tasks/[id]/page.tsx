
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, DollarSign, Tag, User, Briefcase, FileImage, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTaskDetails, getTaskActivity } from "@/features/tasks/services/task_actions";
import { TaskActions } from "@/components/tasks/TaskActions";
import { Separator } from "@/components/ui/separator";
import { TaskActivity } from "@/features/tasks/view/components/TaskActivity";
import { cn } from "@/lib/utils";

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Parallel fetch for details and activity
  const [detailsRes, activityRes] = await Promise.all([
    getTaskDetails(id),
    getTaskActivity(id)
  ]);

  const task = detailsRes.success ? detailsRes.data : null;
  const activity = activityRes.success ? activityRes.data : [];

  if (!task) {
    notFound();
  }

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Link href="/dashboard/tasks">
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
            <Badge variant="outline" className={cn("px-3 py-1", getStatusColor(task.status))}>
                {task.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <TaskActions taskId={task.id} status={task.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-md bg-gradient-to-br from-background to-muted/20">
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
                        {task.budget.toLocaleString()}
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
                            {task.skills?.map(skill => (
                                <Badge key={skill} variant="secondary" className="text-[10px] font-medium opacity-80">{skill}</Badge>
                            ))}
                             {!task.category && (!task.skills || task.skills.length === 0) && (
                                <span className="text-xs text-muted-foreground italic opacity-50">Empty taxonomy</span>
                            )}
                        </div>
                    </div>
                </div>

                {task.image_paths && task.image_paths.length > 0 && (
                     <div className="pt-2">
                        <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                            <FileImage className="h-3 w-3" />
                            Attachments ({task.image_paths.length})
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {task.image_paths.map((path, index) => (
                                <div key={index} className="aspect-square bg-muted/50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-all cursor-pointer group">
                                    <FileImage className="h-6 w-6 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                                    <span className="px-2 text-[9px] text-muted-foreground font-mono truncate w-full text-center">
                                        {path.split('/').pop()}
                                    </span>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
            </CardContent>
          </Card>

          {/* Activity Section Mobile Only (Hidden on LG) */}
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
                                <AvatarImage src={task.client.avatar_url} />
                                <AvatarFallback className="bg-primary/5 text-primary">{task.client.full_name?.charAt(0) || "C"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm truncate">{task.client.full_name}</div>
                                <Link href={`/dashboard/users/${task.client.id}`} className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1">
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
                                    <Link href={`/dashboard/users/${task.freelancer.id}`} className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1">
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
                        <strong>Admin Override Active</strong>: Any status changes here bypass standard escrow triggers unless using <em>Force Cancel</em>.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
