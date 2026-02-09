"use client";

import { TimelineEvent } from "@/data/mock/disputes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Gavel, 
  FileBox, 
  Info
} from "lucide-react";

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "creation": return <AlertCircle className="h-4 w-4 text-white" />;
      case "message": return <MessageSquare className="h-4 w-4 text-white" />;
      case "upload": return <Upload className="h-4 w-4 text-white" />;
      case "status_change": return <Clock className="h-4 w-4 text-white" />;
      case "resolution": return <Gavel className="h-4 w-4 text-white" />;
      default: return <Info className="h-4 w-4 text-white" />;
    }
  };

  const getColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "creation": return "bg-blue-500";
      case "message": return "bg-gray-500";
      case "upload": return "bg-orange-500";
      case "status_change": return "bg-purple-500";
      case "resolution": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  // Sort events by timestamp descending (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" /> Case History
      </h3>
      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="space-y-6 pl-2 relative border-l border-border ml-2 my-2 pb-6">
          {sortedEvents.map((event) => (
            <div key={event.id} className="relative pl-6 group">
              {/* Dot */}
              <div className={cn(
                "absolute -left-[9px] top-1 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-background",
                getColor(event.type)
              )}>
                {getIcon(event.type)}
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{event.title}</span>
                    <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </span>
                </div>
                
                {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                )}
                
                <span className="text-xs font-medium text-primary/80 flex items-center gap-1 mt-1">
                    by {event.actor}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
