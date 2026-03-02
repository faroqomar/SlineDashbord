"use client";

import { SupportTicketDTO } from "@/features/support/models/support.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  CheckCircle, 
  Clock, 
  MoreVertical, 
  UserPlus, 
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getTeamMembers } from "@/features/team/services/team_api";
import { AdminUserDTO } from "@/features/team/models/team.schema";
import { assignTicketToAdmin } from "@/features/support/services/support_api";
import { toast } from "sonner";

interface TicketHeaderProps {
  ticket: SupportTicketDTO;
  onStatusChange: (status: SupportTicketDTO['status']) => void;
}

export function TicketHeader({ ticket, onStatusChange }: TicketHeaderProps) {
  const [admins, setAdmins] = useState<AdminUserDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTeamMembers().then(res => {
      if (res.success) setAdmins(res.data);
    });
  }, []);

  const handleAssign = async (adminId: string) => {
    setLoading(true);
    try {
      const res = await assignTicketToAdmin(ticket.id, adminId);
      if (res.success) {
        toast.success("Ticket assigned successfully");
        // Local refresh or parent update would be better, 
        // but for now we rely on revalidatePath in the action.
      } else {
        toast.error(res.error || "Failed to assign ticket");
      }
    } catch (error) {
      toast.error("Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white border-red-600';
      case 'high': return 'bg-orange-500 text-white border-orange-600';
      case 'normal': return 'bg-blue-500 text-white border-blue-600';
      default: return 'bg-slate-500 text-white border-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'in_progress': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'closed': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between gap-4 shrink-0 shadow-sm relative z-10">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold truncate">{ticket.subject}</h2>
            <Badge variant="outline" className={cn("text-[10px] uppercase font-black px-1.5 h-4", getPriorityColor(ticket.priority))}>
              {ticket.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">#{ticket.id.slice(0, 8).toUpperCase()}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Started by <span className="text-foreground font-semibold">{ticket.user?.full_name}</span>
            </span>
            <span>•</span>
            <span>{new Date(ticket.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Assignee Selection */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2 border-primary/20 hover:bg-primary/5 transition-colors" disabled={loading}>
              {ticket.assignee ? (
                  <>
                    <Avatar className="h-4 w-4">
                        <AvatarImage src={ticket.assignee.avatar_url || ''} />
                        <AvatarFallback className="text-[8px]">{ticket.assignee.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="max-w-[80px] truncate text-xs font-medium">{ticket.assignee.full_name}</span>
                  </>
              ) : (
                <>
                    <UserPlus className="h-3.5 w-3.5" />
                    <span className="text-xs">Unassigned</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assign to Staff</div>
            {admins.map((admin) => (
                <DropdownMenuItem key={admin.id} onClick={() => handleAssign(admin.id)} className="gap-2 py-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={admin.avatar_url} />
                        <AvatarFallback>{admin.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold">{admin.full_name}</span>
                        <span className="text-[10px] text-muted-foreground opacity-70 uppercase font-mono">{admin.role}</span>
                    </div>
                </DropdownMenuItem>
            ))}
            {admins.length === 0 && (
                 <div className="p-4 text-center text-xs text-muted-foreground italic">No staff found</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-4 w-[1px] bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-8 gap-2", getStatusColor(ticket.status))}>
              {ticket.status === 'open' && <Clock className="h-3.5 w-3.5" />}
              {ticket.status === 'in_progress' && <AlertCircle className="h-3.5 w-3.5" />}
              {ticket.status === 'resolved' && <CheckCircle className="h-3.5 w-3.5" />}
              {ticket.status === 'closed' && <ShieldCheck className="h-3.5 w-3.5" />}
              <span className="text-xs font-bold uppercase">{ticket.status}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
             <div className="px-2 py-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Set Status</div>
            <DropdownMenuItem onClick={() => onStatusChange('open')} className="text-blue-600">
               <Clock className="mr-2 h-4 w-4" /> Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('in_progress')} className="text-yellow-600">
               <AlertCircle className="mr-2 h-4 w-4" /> In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('resolved')} className="text-green-600">
               <CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('closed')} className="text-slate-600">
               <ShieldCheck className="mr-2 h-4 w-4" /> Close Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
