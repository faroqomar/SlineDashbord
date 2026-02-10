'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { TicketDTO, TicketMessageDTO } from "@/types/support";

export async function getTickets(statusFilter?: string): Promise<TicketDTO[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from('support_tickets')
    .select(`
      *,
      user:profiles!user_id(id, full_name, email, avatar_url),
      assignee:admin_users!assignee_id(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    if (statusFilter === 'open') {
        query = query.eq('status', 'open');
    } else if (statusFilter === 'resolved') {
        query = query.in('status', ['resolved', 'closed']);
    } else if (statusFilter === 'mine') {
        // filter by current user not supported directly here without auth context passed or handled
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }

  return data.map((ticket: any) => ({
    id: ticket.id,
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    category: ticket.category,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    user: {
      id: ticket.user?.id,
      full_name: ticket.user?.full_name || 'Unknown User',
      email: ticket.user?.email,
      avatar_url: ticket.user?.avatar_url,
    },
    assignee: ticket.assignee ? {
      id: ticket.assignee.id,
      full_name: ticket.assignee.full_name,
      avatar_url: ticket.assignee.avatar_url,
    } : undefined,
  }));
}

export async function getTicketMessages(ticketId: string): Promise<TicketMessageDTO[]> {
  const supabase = createAdminClient();

  const { data: messages, error } = await supabase
    .from('ticket_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error || !messages) return [];

  // Enrich with sender details
  const enrichedMessages = await Promise.all(messages.map(async (msg: any) => {
    let senderDetails = { full_name: 'Unknown', avatar_url: null };
    
    if (msg.is_internal) {
        const { data: admin } = await supabase.from('admin_users').select('full_name, avatar_url').eq('id', msg.sender_id).single();
        if (admin) senderDetails = admin;
        else senderDetails = { full_name: 'Support Agent', avatar_url: null };
    } else {
        const { data: user } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', msg.sender_id).single();
        if (user) senderDetails = user;
        else senderDetails = { full_name: 'User', avatar_url: null };
    }

    return {
        id: msg.id,
        ticket_id: msg.ticket_id,
        sender_id: msg.sender_id,
        is_internal: msg.is_internal,
        content: msg.message,
        created_at: msg.created_at,
        sender: senderDetails
    };
  }));

  return enrichedMessages;
}

export async function replyToTicket(ticketId: string, content: string, adminId: string) {
    const supabase = createAdminClient();
    
    // 1. Insert message
    const { error: msgError } = await supabase.from('ticket_messages').insert({
        ticket_id: ticketId,
        sender_id: adminId,
        is_internal: true,
        message: content
    });

    if (msgError) throw new Error('Failed to send reply: ' + msgError.message);

    // 2. Update status and updated_at
    await supabase.from('support_tickets').update({
        status: 'in_progress', 
        updated_at: new Date().toISOString()
    }).eq('id', ticketId);

    revalidatePath('/dashboard/complaints');
}

export async function updateTicketStatus(ticketId: string, status: string) {
    const supabase = createAdminClient();
    await supabase.from('support_tickets').update({ status }).eq('id', ticketId);
    revalidatePath('/dashboard/complaints');
}
