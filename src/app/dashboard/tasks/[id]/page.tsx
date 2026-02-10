
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, DollarSign, Tag, User, Briefcase, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTaskDetails } from "@/app/actions/tasks";
import { TaskActions } from "@/components/tasks/TaskActions";
import { Separator } from "@/components/ui/separator";

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await getTaskDetails(id);

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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tasks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
          </Button>
        </Link>
        <div className="flex-1" />
         <TaskActions taskId={task.id} status={task.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(task.status)}>
                            {task.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground font-mono">ID: {task.id.slice(0, 8)}</span>
                    </CardDescription>
                  </div>
                   <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-primary flex items-center justify-end">
                        <DollarSign className="h-5 w-5 text-muted-foreground mr-1" />
                        {task.budget}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Budget</div>
                   </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        Description
                    </h3>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-md">
                        {task.description}
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Dates
                        </h3>
                        <div className="grid gap-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Posted:</span>
                                <span>{new Date(task.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Deadline:</span>
                                <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
                            </div>
                        </div>
                    </div>
                     <div>
                         <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            Category & Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {task.category && (
                                <Badge variant="secondary">{task.category}</Badge>
                            )}
                            {task.skills?.map(skill => (
                                <Badge key={skill} variant="outline">{skill}</Badge>
                            ))}
                             {!task.category && (!task.skills || task.skills.length === 0) && (
                                <span className="text-sm text-muted-foreground italic">No category or skills listed.</span>
                            )}
                        </div>
                    </div>
                </div>

                {task.image_paths && task.image_paths.length > 0 && (
                     <>
                        <Separator />
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <FileImage className="h-4 w-4 text-muted-foreground" />
                                Attachments
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {task.image_paths.map((path, index) => (
                                    <div key={index} className="aspect-video bg-muted rounded-md flex items-center justify-center border text-xs text-muted-foreground overflow-hidden">
                                        {/* Displaying filename. Full image preview requires storage bucket configuration. */}
                                        <span className="p-2 break-all">{path.split('/').pop()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                     </>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            {/* Client Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Client</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={task.client.avatar_url} />
                            <AvatarFallback>{task.client.full_name?.charAt(0) || "C"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium text-sm">{task.client.full_name}</div>
                            <Link href={`/dashboard/users/${task.client.id}`} className="text-xs text-primary hover:underline">
                                View Profile
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Freelancer Card */}
            <Card className={task.freelancer ? "" : "border-dashed bg-muted/20"}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Freelancer</CardTitle>
                </CardHeader>
                <CardContent>
                    {task.freelancer ? (
                         <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={task.freelancer.avatar_url} />
                                <AvatarFallback>{task.freelancer.full_name?.charAt(0) || "F"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium text-sm">{task.freelancer.full_name}</div>
                                <Link href={`/dashboard/users/${task.freelancer.id}`} className="text-xs text-primary hover:underline">
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground italic text-center py-2">
                            Not assigned yet
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
