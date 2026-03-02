import React from 'react';
import { useDisputesViewModel } from '../viewmodels/use_disputes_viewmodel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  GripVertical,
  ArrowUpRight,
  ShieldAlert
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function DisputesScreen() {
    const vm = useDisputesViewModel();
    const navigate = useNavigate();

    const columns = [
        { 
            title: "Open Case", 
            key: "open", 
            data: vm.columns.open, 
            color: "text-red-500", 
            bgColor: "bg-red-500/10", 
            borderColor: "border-red-500/20",
            icon: <AlertCircle className="h-4 w-4" />
        },
        { 
            title: "Under Review", 
            key: "investigating", 
            data: vm.columns.investigating, 
            color: "text-orange-500", 
            bgColor: "bg-orange-500/10", 
            borderColor: "border-orange-500/20",
            icon: <Clock className="h-4 w-4" />
        },
        { 
            title: "Escalated", 
            key: "escalated", 
            data: vm.columns.escalated, 
            color: "text-purple-500", 
            bgColor: "bg-purple-500/10", 
            borderColor: "border-purple-500/20",
            icon: <ShieldAlert className="h-4 w-4" />
        },
        { 
            title: "Resolved", 
            key: "resolved", 
            data: vm.columns.resolved, 
            color: "text-green-500", 
            bgColor: "bg-green-500/10", 
            borderColor: "border-green-500/20",
            icon: <CheckCircle2 className="h-4 w-4" />
        }
    ];

    const getStatusClassName = (status: string) => {
        switch (status) {
            case "open": return "bg-red-500/10 text-red-500 border-red-500/20";
            case "in_progress": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "escalated": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "resolved": return "bg-green-500/10 text-green-500 border-green-500/20";
            default: return "";
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Dispute Center</h2>
                    <p className="text-muted-foreground">Manage and resolve marketplace conflicts with financial oversight.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={vm.refreshAll} disabled={vm.isLoading}>
                        Refresh
                    </Button>
                    <Button size="sm">New Report</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                {columns.map((col) => (
                    <div key={col.key} className="flex flex-col h-full glass-card !bg-muted/5 !border-muted-foreground/10 rounded-2xl overflow-hidden shadow-sm">
                        <div className={cn("flex items-center justify-between p-4 border-b", col.bgColor)}>
                            <div className="flex items-center gap-2">
                                <span className={col.color}>{col.icon}</span>
                                <h3 className="font-bold text-sm uppercase tracking-wider">{col.title}</h3>
                            </div>
                            <Badge variant="secondary" className="bg-background/50 font-mono">
                                {col.data.length}
                            </Badge>
                        </div>
                        
                        <ScrollArea className="flex-1 p-3">
                            <div className="space-y-3">
                                {col.data.map((dispute: any) => (
                                    <Card 
                                        key={dispute.id}
                                        className="glass-card hover:bg-muted/20 transition-all cursor-pointer border-l-4 group shadow-none"
                                        style={{ borderLeftColor: col.key === 'open' ? 'red' : col.key === 'investigating' ? 'orange' : col.key === 'escalated' ? 'purple' : 'green' }}
                                        onClick={() => navigate({ to: `/disputes/${dispute.id}` as any })}
                                    >
                                        <CardHeader className="p-3 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="outline" className={cn("text-[10px] h-5", getStatusClassName(dispute.status))}>
                                                    {dispute.status.replace('_', ' ')}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground font-medium">
                                                    {new Date(dispute.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <CardTitle className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">
                                                {dispute.task?.title || "Dispute Case"}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-0">
                                            <p className="text-[10px] text-muted-foreground line-clamp-2 italic mb-3">
                                                "{dispute.reason}"
                                            </p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex -space-x-2">
                                                    <Avatar className="h-6 w-6 border-2 border-background ring-1 ring-border">
                                                        <AvatarImage src={dispute.complainant?.avatar_url} />
                                                        <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                                                            {dispute.complainant?.full_name?.charAt(0) || "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-black text-primary font-mono">
                                                        IQD {dispute.amount?.toLocaleString() || "0"}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {col.data.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                                        <div className="h-10 w-10 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground/30">
                                            {col.icon}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic">No cases in queue</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                ))}
            </div>
        </div>
    );
}
