"use client";

import { TicketDTO } from "@/types/support";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketHeaderProps {
  ticket: TicketDTO;
  onStatusChange: (status: string) => void;
  // onToggleNotes: () => void;
  // showNotes: boolean;
}

const adminUsers = [
  { id: "1", name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
  { id: "2", name: "Mike Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike" },
  { id: "3", name: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" },
];

export function TicketHeader({ ticket, onStatusChange }: TicketHeaderProps) {
  return (
    <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{ticket.id.slice(0, 8)}</span>
            <StatusBadge status={ticket.status} size="sm" />
            <Badge variant="outline" className="text-[10px] font-normal">{ticket.category}</Badge>
          </div>
          <h2 className="text-lg font-semibold truncate pr-4">{ticket.subject}</h2>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <Select
            value={ticket.status}
            onValueChange={(value) => onStatusChange(value)}
          >
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Merge tickets</DropdownMenuItem>
              <DropdownMenuItem>Export conversation</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">Delete ticket</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
         <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <span>Assignee:</span>
                <div className="flex items-center gap-2">
                    {ticket.assignee ? (
                        <>
                            <Avatar className="w-4 h-4">
                                <AvatarImage src={ticket.assignee.avatar_url || undefined} />
                                <AvatarFallback>{ticket.assignee.full_name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{ticket.assignee.full_name}</span>
                        </>
                    ) : (
                        <span className="text-xs italic">Unassigned</span>
                    )}
                </div>
            </div>
         </div>
         
         {/* Internal Notes hidden for MVP */}
         {/* <Button
            variant={showNotes ? "secondary" : "ghost"}
            size="sm"
            onClick={onToggleNotes}
            className="h-7 text-xs gap-2"
         >
            <StickyNote className="w-3.5 h-3.5" />
            Internal Notes
         </Button> */}
      </div>
    </div>
  );
}
