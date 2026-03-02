export interface TicketNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  internalNotes: TicketNote[];
  [key: string]: unknown;
}

export const mockTickets: Ticket[] = [];
