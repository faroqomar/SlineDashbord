import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  UserPlus,
  Shield,
  AlertTriangle,
  CheckCircle,
  Bell,
  Settings,
  MessageSquare,
  Scale,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "user" | "security" | "dispute" | "complaint" | "notification" | "system";
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface ActivityFeedProps {
  items: ActivityItem[];
  loading?: boolean;
}

const typeIcons: Record<ActivityItem["type"], React.ElementType> = {
  user: UserPlus,
  security: Shield,
  dispute: Scale,
  complaint: MessageSquare,
  notification: Bell,
  system: Settings,
};

const typeColors: Record<ActivityItem["type"], string> = {
  user: "bg-info/10 text-info",
  security: "bg-warning/10 text-warning",
  dispute: "bg-destructive/10 text-destructive",
  complaint: "bg-primary/10 text-primary",
  notification: "bg-accent text-accent-foreground",
  system: "bg-muted text-muted-foreground",
};

export function ActivityFeed({ items, loading = false }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="skeleton w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton w-3/4 h-4" />
              <div className="skeleton w-1/2 h-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const Icon = typeIcons[item.type];
        return (
          <div
            key={item.id}
            className={cn(
              "flex gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50 group",
              index === 0 && "animate-in"
            )}
          >
            <div className={cn("p-2 rounded-lg shrink-0", typeColors[item.type])}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground truncate">{item.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-2xs text-muted-foreground">{item.timestamp}</span>
              {item.user && (
                <Avatar className="w-5 h-5">
                  <AvatarImage src={item.user.avatar} />
                  <AvatarFallback className="text-2xs">
                    {item.user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
