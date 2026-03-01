import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { History, Shield, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskActivityProps {
    activities: any[];
}

export function TaskActivity({ activities }: TaskActivityProps) {
    return (
        <Card className="h-full overflow-hidden flex flex-col">
            <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Admin Activity Log
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
                {activities.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground italic">
                        No administrative activity recorded yet.
                    </div>
                ) : (
                    <div className="divide-y relative">
                        {/* Vertical line connector */}
                        <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-muted -z-0" />
                        
                        {activities.map((log) => (
                            <div key={log.id} className="p-4 relative z-10 bg-background/50 hover:bg-muted/30 transition-colors">
                                <div className="flex gap-4">
                                    <Avatar className="h-7 w-7 border-2 border-background shadow-sm shrink-0">
                                        <AvatarImage src={log.actor?.avatar_url} />
                                        <AvatarFallback className="text-[10px]">
                                            {log.actor?.full_name?.charAt(0) || <Shield className="h-3 w-3" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-semibold truncate max-w-[120px]">
                                                {log.actor?.full_name || "System"}
                                            </p>
                                            <time className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                            </time>
                                        </div>
                                        
                                        <div className="flex items-start gap-1.5">
                                            <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono leading-none">
                                                {log.action.split('.').pop()}
                                            </code>
                                            <p className="text-xs text-muted-foreground leading-snug break-words">
                                                {getDescription(log)}
                                            </p>
                                        </div>

                                        {log.meta?.reason && (
                                            <div className="mt-2 p-2 rounded bg-muted text-[11px] italic border-l-2 border-primary/30">
                                                "{log.meta.reason}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function getDescription(log: any) {
    const action = log.action;
    const meta = log.meta || {};

    if (action.includes('update_status')) {
        return `Changed status to ${meta.status || 'unknown'}`;
    }
    if (action.includes('force_cancel')) {
        return `Admin Force Canceled with ${meta.reversed_funds ? 'automatic refund' : 'no escrow detected'}`;
    }
    
    return log.action;
}
