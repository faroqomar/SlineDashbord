'use client';

import { useState, useEffect, useTransition } from "react";
import { TicketDTO, TicketMessageDTO } from "@/types/support";
import { TicketList } from "./TicketList";
import { TicketChat } from "./TicketChat";
import { TicketHeader } from "./TicketHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, MessageSquare } from "lucide-react";
import { getTicketMessages, replyToTicket, updateTicketStatus } from "@/features/support/services/support_actions";
import { toast } from "sonner";
import { useSupportDashboard } from "@/features/support/viewmodels/useSupportDashboard.vm";

interface SupportDashboardProps {
  initialTickets: TicketDTO[];
  adminId: string; // We pass this to know who replies
}

export function SupportDashboard({ initialTickets, adminId }: SupportDashboardProps) {
  const vm = useSupportDashboard(initialTickets);

  return (
    <div className="flex bg-background h-[calc(100vh-65px)] overflow-hidden">
      {/* Sidebar - Ticket List */}
      <div className="w-[380px] border-r flex flex-col bg-muted/5">
        <div className="p-4 space-y-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Support
            </h1>
            <Button size="sm" className="h-8 gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-9 h-9 bg-background/50 border-muted-foreground/20 focus:bg-background transition-colors"
              value={vm.searchQuery}
              onChange={(e) => vm.setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" value={vm.statusFilter} onValueChange={vm.setStatusFilter} className="w-full">
            <TabsList className="w-full h-9 grid grid-cols-4 p-1 bg-muted/50">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="open" className="text-xs">Open</TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs">Resolved</TabsTrigger>
              <TabsTrigger value="mine" className="text-xs">Mine</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-hidden">
          <TicketList
            tickets={vm.filteredTickets}
            selectedTicket={vm.selectedTicket}
            onSelect={vm.selectTicket}
          />
        </div>
      </div>

      {/* Main Content - Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative z-0">
        {vm.selectedTicket ? (
          <>
            <TicketHeader
              ticket={vm.selectedTicket}
              onStatusChange={vm.updateStatus}
            />
            
            <div className="flex-1 flex min-h-0 relative">
              <div className="flex-1 flex flex-col min-w-0">
                 {vm.isLoadingMessages && vm.messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                 ) : (
                    <TicketChat 
                        ticket={vm.selectedTicket}
                        messages={vm.messages}
                        onSendMessage={(content) => vm.sendMessage(content, adminId)}
                        isSending={vm.isSending}
                    />
                 )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="font-medium">Select a ticket to view details</p>
            <p className="text-sm mt-1 text-muted-foreground/60">Choose a ticket from the list on the left</p>
          </div>
        )}
      </div>
    </div>
  );
}
