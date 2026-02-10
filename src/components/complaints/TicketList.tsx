"use client";

import { TicketDTO } from "@/types/support";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TicketListProps {
  tickets: TicketDTO[];
  selectedTicket: TicketDTO | null;
  onSelect: (ticket: TicketDTO) => void;
}

export function TicketList({ tickets, selectedTicket, onSelect }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
        <p>No tickets found matching your filters.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="flex flex-col gap-2 p-2">
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => onSelect(ticket)}
            className={cn(
              "flex flex-col items-start gap-2 p-4 rounded-lg border text-left transition-all hover:bg-muted/50",
              selectedTicket?.id === ticket.id
                ? "bg-muted border-primary/50 shadow-sm"
                : "bg-card"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={ticket.user.avatar_url || undefined} />
                  <AvatarFallback>{ticket.user.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-muted-foreground">
                  {ticket.user.full_name}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {ticket.created_at && formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
              </span>
            </div>
            
            <h4 className="font-semibold text-sm line-clamp-1 break-all">
              {ticket.subject}
            </h4>
            
            <div className="flex items-center justify-between w-full mt-1">
               <div className="flex items-center gap-2">
                 <StatusBadge status={ticket.status} size="sm" />
                 <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border">
                   {ticket.category}
                 </span>
               </div>
               {ticket.priority === 'high' && (
                 <span className="text-[10px] font-medium text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-md">
                   High
                 </span>
               )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
