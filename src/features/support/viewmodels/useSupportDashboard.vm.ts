
import { useState, useEffect, useTransition } from "react";
import { TicketDTO, TicketMessageDTO } from "@/types/support";
import { getTicketMessages, replyToTicket, updateTicketStatus } from "@/app/actions/support";
import { toast } from "sonner";

export interface UseSupportDashboardVM {
    tickets: TicketDTO[];
    selectedTicket: TicketDTO | null;
    searchQuery: string;
    statusFilter: string;
    showNotes: boolean;
    messages: TicketMessageDTO[];
    isLoadingMessages: boolean;
    isSending: boolean;
    filteredTickets: TicketDTO[];
    setSearchQuery: (query: string) => void;
    setStatusFilter: (status: string) => void;
    setShowNotes: (show: boolean) => void;
    selectTicket: (ticket: TicketDTO) => void;
    sendMessage: (content: string, adminId: string) => Promise<void>;
    updateStatus: (newStatus: string) => Promise<void>;
}

export function useSupportDashboard(initialTickets: TicketDTO[]): UseSupportDashboardVM {
    const [tickets, setTickets] = useState<TicketDTO[]>(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState<TicketDTO | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showNotes, setShowNotes] = useState(false);
    const [messages, setMessages] = useState<TicketMessageDTO[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, startTransition] = useTransition();

    // Side Effect: Fetch Messages
    useEffect(() => {
        if (selectedTicket) {
            setIsLoadingMessages(true);
            getTicketMessages(selectedTicket.id)
                .then(setMessages)
                .catch(err => {
                    console.error(err);
                    toast.error("Failed to load messages");
                })
                .finally(() => setIsLoadingMessages(false));
        } else {
            setMessages([]);
        }
    }, [selectedTicket]);

    // Computed: Filtered Tickets
    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              ticket.user.full_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Action: Send Message
    const sendMessage = async (content: string, adminId: string) => {
        if (!selectedTicket) return;

        const tempId = Math.random().toString();
        const optimisticMessage: TicketMessageDTO = {
            id: tempId,
            ticket_id: selectedTicket.id,
            sender_id: adminId,
            is_internal: true,
            content: content,
            created_at: new Date().toISOString(),
            sender: { full_name: 'Me', avatar_url: null }
        };
        setMessages(prev => [...prev, optimisticMessage]);

        startTransition(async () => {
            try {
                await replyToTicket(selectedTicket.id, content, adminId);
                const updatedMessages = await getTicketMessages(selectedTicket.id);
                setMessages(updatedMessages);
            } catch (error) {
                toast.error("Failed to send reply");
                setMessages(prev => prev.filter(m => m.id !== tempId));
            }
        });
    };

    // Action: Update Status
    const updateStatus = async (newStatus: string) => {
        if (!selectedTicket) return;
        
        const updatedTickets = tickets.map(t => 
            t.id === selectedTicket.id ? { ...t, status: newStatus as any } : t
        );
        setTickets(updatedTickets);
        setSelectedTicket({ ...selectedTicket, status: newStatus as any });

        try {
            await updateTicketStatus(selectedTicket.id, newStatus);
            toast.success("Ticket status updated");
        } catch (error) {
            toast.error("Failed to update status");
            // Could revert here if needed, but for now we keep optimistic state
        }
    };

    return {
        tickets,
        selectedTicket,
        searchQuery,
        statusFilter,
        showNotes,
        messages,
        isLoadingMessages,
        isSending,
        filteredTickets,
        setSearchQuery,
        setStatusFilter,
        setShowNotes,
        selectTicket: setSelectedTicket,
        sendMessage,
        updateStatus
    };
}
