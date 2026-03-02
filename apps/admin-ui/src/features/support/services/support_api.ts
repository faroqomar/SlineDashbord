import type { SupportTicketDTO } from '../models/support.schema';

export interface TicketMessageDTO {
  id: string;
  ticket_id: string;
  sender_id: string;
  is_internal: boolean;
  content: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string | null;
  };
}

type TicketsResult = { tickets: SupportTicketDTO[]; count: number; totalPages: number };

/** No support API in scope; stub returns empty list. */
export async function getTickets(
  _page = 1,
  _statusFilter = 'all',
  _limit = 10
): Promise<{ success: true; data: TicketsResult } | { success: false; error: string }> {
  return {
    success: true,
    data: { tickets: [], count: 0, totalPages: 0 },
  };
}

/** No support API in scope; stub returns empty messages. */
export async function getTicketMessages(_ticketId: string): Promise<{ success: true; data: TicketMessageDTO[] } | { success: false; error: string }> {
  return { success: true, data: [] };
}

/** No support API in scope; stub returns failure. */
export async function replyToTicket(_ticketId: string, _content: string): Promise<{ success: true; data: { id: string } } | { success: false; error: string }> {
  return { success: false, error: 'Support API not implemented yet' };
}

/** No support API in scope; stub returns failure. */
export async function updateTicketStatus(_ticketId: string, _status: string): Promise<{ success: true; data: { id: string } } | { success: false; error: string }> {
  return { success: false, error: 'Support API not implemented yet' };
}

/** No support API in scope; stub returns failure. */
export async function assignTicketToAdmin(_ticketId: string, _adminId: string): Promise<{ success: true; data: { id: string } } | { success: false; error: string }> {
  return { success: false, error: 'Support API not implemented yet' };
}
