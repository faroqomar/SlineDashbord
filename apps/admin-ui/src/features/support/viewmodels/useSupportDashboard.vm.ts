import { useState, useEffect, useTransition } from "react";
import { getTicketMessages, replyToTicket, updateTicketStatus, type TicketMessageDTO } from "@/features/support/services/support_api";
import { SupportTicketDTO } from "@/features/support/models/support.schema";
import { toast } from "sonner";

export interface UseSupportDashboardVM {
    tickets: SupportTicketDTO[];
    selectedTicket: SupportTicketDTO | null;
    searchQuery: string;
    statusFilter: string;
    showNotes: boolean;
    messages: TicketMessageDTO[];
    isLoadingMessages: boolean;
    isSending: boolean;
    filteredTickets: SupportTicketDTO[];
    setSearchQuery: (query: string) => void;
    setStatusFilter: (status: string) => void;
    setShowNotes: (show: boolean) => void;
    selectTicket: (ticket: SupportTicketDTO) => void;
    sendMessage: (content: string, adminId: string) => Promise<void>;
    updateStatus: (newStatus: SupportTicketDTO['status']) => Promise<void>;
}

export function useSupportDashboard(initialTickets: SupportTicketDTO[]): UseSupportDashboardVM {
    const [tickets, setTickets] = useState<SupportTicketDTO[]>(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicketDTO | null>(null);
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
                .then(res => {
                    if (res.success) {
                        setMessages(res.data);
                    } else {
                        throw new Error(res.error);
                    }
                })
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
                              ticket.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || 
                             (statusFilter === "mine" ? true : ticket.status === statusFilter); 
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

        startTransition(() => {
            void (async () => {
            try {
                const res = await replyToTicket(selectedTicket.id, content);
                if (!res.success) throw new Error(res.error);
                
                const messagesRes = await getTicketMessages(selectedTicket.id);
                if (messagesRes.success) {
                    setMessages(messagesRes.data);
                }
            } catch (error) {
                toast.error("Failed to send reply");
                setMessages(prev => prev.filter(m => m.id !== tempId));
            }
            })();
        });
    };

    // Action: Update Status
    const updateStatus = async (newStatus: SupportTicketDTO['status']) => {
        if (!selectedTicket) return;
        
        const updatedTickets = tickets.map(t => 
            t.id === selectedTicket.id ? { ...t, status: newStatus } : t
        );
        setTickets(updatedTickets);
        setSelectedTicket({ ...selectedTicket, status: newStatus });

        try {
            const res = await updateTicketStatus(selectedTicket.id, newStatus);
            if (res.success) {
                toast.success("Ticket status updated");
            } else {
                throw new Error(res.error);
            }
        } catch (error) {
            toast.error("Failed to update status");
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
