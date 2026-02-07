import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActivityItem } from "@/data/mock/overview";

interface ActivityFeedProps {
  activity: ActivityItem[];
}

export function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <Card className="col-span-3 lg:col-span-3 border-none shadow-medium">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-8">
            {activity.map((item, i) => (
              <div 
                key={item.id} 
                className="flex items-center animate-slide-in-right" 
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={item.user.avatar} alt="Avatar" />
                  <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{item.user.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    {item.user.email}
                    <span>•</span>
                    <span>{item.time}</span>
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-right">
                    <div>{item.action}</div>
                    {item.amount && (
                        <div className={item.status === 'success' ? 'text-success' : 'text-destructive'}>
                            {item.amount}
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
