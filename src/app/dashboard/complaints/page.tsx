"use client";

import { useState } from "react";
import { MOCK_TICKETS, Ticket } from "@/data/mock/complaints";
import { TicketList } from "@/components/complaints/TicketList";
import { TicketChat } from "@/components/complaints/TicketChat";
import { TicketNotes } from "@/components/complaints/TicketNotes";
import { TicketHeader } from "@/components/complaints/TicketHeader";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const filterOptions = [
  {
    key: "priority",
    label: "Priority",
    type: "select" as const,
    options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
  {
    key: "category",
    label: "Category",
    type: "select" as const,
    options: [
      { value: "payment", label: "Payment" },
      { value: "account", label: "Account" },
      { value: "feature", label: "Feature Request" },
      { value: "bug", label: "Bug Report" },
    ],
  },
];

export default function ComplaintsPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(MOCK_TICKETS[0]);
  const [showNotes, setShowNotes] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Ticket["status"] | null>(null);

  const handleStatusChange = (status: Ticket["status"]) => {
    if (status === "closed" || status === "resolved") {
      setPendingStatus(status);
      setShowStatusDialog(true);
    } else {
      // In a real app, call API
      console.log("Status changed to:", status);
      if (selectedTicket) {
        setSelectedTicket({ ...selectedTicket, status });
      }
    }
  };

  const confirmStatusChange = () => {
    if (selectedTicket && pendingStatus) {
      setSelectedTicket({ ...selectedTicket, status: pendingStatus });
      setShowStatusDialog(false);
      setPendingStatus(null);
    }
  };

  const activeTabClass = "data-[state=active]:bg-primary/10 data-[state=active]:text-primary";

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-background">
      {/* Sidebar: Ticket List */}
      <div className="w-full md:w-80 lg:w-96 border-r flex flex-col bg-card/50">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Support Tickets</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {MOCK_TICKETS.filter(t => t.status === "open").length} Open
            </Badge>
          </div>
          <FilterPanel
            filters={filterOptions}
            onFilterChange={(filters) => console.log(filters)}
            onSearch={(query) => console.log(query)}
            searchPlaceholder="Search tickets..."
          />
        </div>

        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2 grid grid-cols-4 h-9">
            <TabsTrigger value="all" className={activeTabClass}>All</TabsTrigger>
            <TabsTrigger value="open" className={activeTabClass}>Open</TabsTrigger>
            <TabsTrigger value="my_tickets" className={activeTabClass}>Mine</TabsTrigger>
            <TabsTrigger value="resolved" className={activeTabClass}>Done</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 m-0 mt-2">
            <TicketList 
                tickets={MOCK_TICKETS} 
                selectedTicket={selectedTicket} 
                onSelect={setSelectedTicket} 
            />
          </TabsContent>
          
          <TabsContent value="open" className="flex-1 m-0 mt-2">
            <TicketList 
                tickets={MOCK_TICKETS.filter(t => t.status === 'open')} 
                selectedTicket={selectedTicket} 
                onSelect={setSelectedTicket} 
            />
          </TabsContent>

           <TabsContent value="my_tickets" className="flex-1 m-0 mt-2">
            <TicketList 
                tickets={MOCK_TICKETS.filter(t => t.assignee?.name === 'Mike Wilson')} // Mock current user
                selectedTicket={selectedTicket} 
                onSelect={setSelectedTicket} 
            />
          </TabsContent>

           <TabsContent value="resolved" className="flex-1 m-0 mt-2">
            <TicketList 
                tickets={MOCK_TICKETS.filter(t => ['resolved', 'closed'].includes(t.status))} 
                selectedTicket={selectedTicket} 
                onSelect={setSelectedTicket} 
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Content: Ticket Detail */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50 backdrop-blur-sm">
        {selectedTicket ? (
          <>
            <TicketHeader 
                ticket={selectedTicket} 
                onStatusChange={handleStatusChange}
                onToggleNotes={() => setShowNotes(!showNotes)}
                showNotes={showNotes}
            />
            
            <div className="flex-1 flex overflow-hidden relative">
                <TicketChat 
                    ticket={selectedTicket} 
                    onSendMessage={(msg) => console.log("Send:", msg)} 
                />
                
                {showNotes && (
                    <div className="absolute right-0 top-0 bottom-0 z-20 h-full shadow-xl">
                        <TicketNotes 
                            ticket={selectedTicket} 
                            onAddNote={(note) => console.log("Note:", note)}
                            onClose={() => setShowNotes(false)}
                        />
                    </div>
                )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <img 
                src="https://illustrations.popsy.co/gray/surr-message.svg" 
                alt="Select a ticket" 
                className="w-64 h-64 opacity-50 mb-4 mix-blend-multiply dark:mix-blend-screen"
            />
            <p className="text-lg font-medium">Select a ticket to view details</p>
            <p className="text-sm">Choose a ticket from the list to start resolving.</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        type={pendingStatus === "closed" ? "warning" : "success"}
        title={`Mark as ${pendingStatus}`}
        description={`Are you sure you want to mark this ticket as ${pendingStatus}? ${
          pendingStatus === "closed" ? "This will close the ticket permanently." : "The user will be notified."
        }`}
        confirmLabel={`Mark as ${pendingStatus}`}
        onConfirm={confirmStatusChange}
      />
    </div>
  );
}
