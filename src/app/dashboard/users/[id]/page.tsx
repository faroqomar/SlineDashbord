import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Flag, Ban, KeyRound, Mail, Calendar, DollarSign, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { MOCK_RECENT_ACTIVITY } from "@/data/mock/overview"; // We'll migrate this later or use logs
import { getUserDetails } from "@/features/users/services/user_actions";
import { getLogsByTarget } from "@/features/logs/services/log_actions";
import { SuspendUserButton } from "@/components/users/SuspendUserButton";

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [userRes, logsRes] = await Promise.all([
      getUserDetails(id),
      getLogsByTarget(id)
  ]);

  if (!userRes.success) {
    notFound();
  }

  const user = userRes.data;
  const logs = logsRes.success ? logsRes.data : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
      </div>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                <AvatarImage src={user.avatar_url} alt={user.full_name} />
                <AvatarFallback className="text-2xl">{(user.full_name || "U").charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="text-2xl font-bold">{user.full_name}</h3>
                  <Badge variant="outline">{user.active_role}</Badge>
                   <Badge 
                      variant={user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary'}
                      className={user.status === 'active' ? 'bg-success hover:bg-success/80' : ''}
                    >
                      {user.status}
                    </Badge>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {user.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Joined {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
               <Button variant="outline" className="flex-1 md:flex-none gap-2">
                <KeyRound className="h-4 w-4" /> Reset Password
               </Button>
               <SuspendUserButton userId={user.id} currentStatus={user.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${user.spent.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.rating.toFixed(1)}</div>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jobs</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.job_count}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent transactions and job activity.</CardDescription>
            </CardHeader>
            <CardContent>
                 {/* Reusing ActivityFeed logic for now, but really this should be transaction history */}
                 <ActivityFeed activity={MOCK_RECENT_ACTIVITY} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
           <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>Recent system events related to this user.</CardDescription>
            </CardHeader>
            <CardContent>
               <ScrollArea className="h-[300px] pr-4">
                 <div className="space-y-4">
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <div key={log.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{formatActionName(log.event_type)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        by <span className="font-semibold">{log.actor?.full_name || 'System'}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground py-8 text-center">No logs found for this user.</p>
                    )}
                 </div>
               </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function formatActionName(action: string): string {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
