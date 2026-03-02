'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { requireAdminRole, logAuditEvent, enforceRateLimit } from '@/features/core/security/security_guards';
import { ok, fail, ServiceResult, toErrorMessage } from '@/features/core/models/result';
import { GetTicketsSchema, UpdateTicketStatusSchema, SUPPORT_READ_ROLES, SUPPORT_WRITE_ROLES, SupportTicketDTO } from '../models/support.schema';
import { z } from 'zod';

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

export async function getTickets(
  page = 1, 
  statusFilter = 'all', 
  limit = 10
): Promise<ServiceResult<{ tickets: SupportTicketDTO[]; count: number; totalPages: number }>> {
  try {
    const parsed = GetTicketsSchema.safeParse({ page, status: statusFilter, limit });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(SUPPORT_READ_ROLES);

    const supabase = createAdminClient();
    const PAGE_SIZE = parsed.data.limit;
    const from = (parsed.data.page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let queryBuilder = supabase
      .from('support_tickets')
      .select(`
        *,
        user:profiles!user_id(id, full_name, email, avatar_url),
        assignee:admin_users!assignee_id(id, full_name, avatar_url)
      `, { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (parsed.data.status && parsed.data.status !== 'all') {
      if (parsed.data.status === 'open') {
          queryBuilder = queryBuilder.eq('status', 'open');
      } else if (parsed.data.status === 'resolved') {
          queryBuilder = queryBuilder.in('status', ['resolved', 'closed']);
      }
    }

    const { data, error, count } = await queryBuilder;

    if (error) return fail('Failed to fetch tickets');

    const tickets: SupportTicketDTO[] = (data || []).map((ticket: any) => ({
      id: ticket.id,
      user_id: ticket.user_id,
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

    return ok({
        tickets,
        count: count || 0,
        totalPages: count ? Math.ceil(count / PAGE_SIZE) : 0
    });
  } catch (error) {
    console.error('getTickets error:', error);
    return fail(toErrorMessage(error));
  }
}

const GetTicketMessagesSchema = z.object({ id: z.string().uuid("Invalid Ticket ID") });

export async function getTicketMessages(ticketId: string): Promise<ServiceResult<TicketMessageDTO[]>> {
  try {
    const parsed = GetTicketMessagesSchema.safeParse({ id: ticketId });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(SUPPORT_READ_ROLES);

    const supabase = createAdminClient();

    const { data: messages, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', parsed.data.id)
      .order('created_at', { ascending: true });

    if (error || !messages) return ok([]);

    // Enrich with sender details
    const enrichedMessages = await Promise.all(messages.map(async (msg: any) => {
      let senderDetails = { full_name: 'Unknown', avatar_url: null };
      
      if (msg.is_internal) {
          const { data: admin } = await supabase.from('admin_users').select('full_name, avatar_url').eq('id', msg.sender_id).single();
          if (admin) senderDetails = admin as any;
          else senderDetails = { full_name: 'Support Agent', avatar_url: null };
      } else {
          const { data: user } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', msg.sender_id).single();
          if (user) senderDetails = user as any;
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

    return ok(enrichedMessages);
  } catch (error) {
    console.error('getTicketMessages error:', error);
    return fail(toErrorMessage(error));
  }
}

const ReplyToTicketSchema = z.object({
  ticketId: z.string().uuid(),
  content: z.string().min(1)
});

export async function replyToTicket(ticketId: string, content: string): Promise<ServiceResult<{id: string}>> {
    try {
        const parsed = ReplyToTicketSchema.safeParse({ ticketId, content });
        if (!parsed.success) return fail(parsed.error.issues[0].message);

        const { userId } = await requireAdminRole(SUPPORT_WRITE_ROLES);
        await enforceRateLimit('reply_to_ticket', userId, 20, 60000);
        const supabase = createAdminClient();
        
        // 1. Insert message
        const { error: msgError } = await supabase.from('ticket_messages').insert({
            ticket_id: parsed.data.ticketId,
            sender_id: userId,
            is_internal: true,
            message: parsed.data.content
        });

        if (msgError) return fail('Failed to send reply: ' + msgError.message);

        // 2. Update status and updated_at
        await supabase.from('support_tickets').update({
            status: 'in_progress', 
            updated_at: new Date().toISOString()
        }).eq('id', parsed.data.ticketId);

        await logAuditEvent({
            action: 'admin.support.reply',
            actor_user_id: userId,
            related_entity_type: 'support_ticket',
            related_entity_id: parsed.data.ticketId,
        });

        revalidatePath('/dashboard/complaints');
        return ok({id: parsed.data.ticketId});
    } catch (error) {
        console.error('replyToTicket error:', error);
        return fail(toErrorMessage(error));
    }
}

export async function updateTicketStatus(ticketId: string, status: string): Promise<ServiceResult<{id: string}>> {
    try {
        const parsed = UpdateTicketStatusSchema.safeParse({ id: ticketId, status });
        if (!parsed.success) return fail(parsed.error.issues[0].message);

        const { userId } = await requireAdminRole(SUPPORT_WRITE_ROLES);
        await enforceRateLimit('update_ticket_status', userId, 20, 60000);

        const supabase = createAdminClient();
        await supabase.from('support_tickets').update({ status: parsed.data.status }).eq('id', parsed.data.id);
        
        await logAuditEvent({
            action: 'admin.support.update_status',
            actor_user_id: userId,
            related_entity_type: 'support_ticket',
            related_entity_id: parsed.data.id,
            meta: { status: parsed.data.status }
        });

        revalidatePath('/dashboard/complaints');
        return ok({id: parsed.data.id});
    } catch (error) {
        console.error('updateTicketStatus error:', error);
        return fail(toErrorMessage(error));
    }
}

export async function assignTicketToAdmin(ticketId: string, adminId: string): Promise<ServiceResult<{id: string}>> {
    try {
        const { userId } = await requireAdminRole(SUPPORT_WRITE_ROLES);
        await enforceRateLimit('assign_ticket', userId, 20, 60000);
        const supabase = createAdminClient();

        const { error } = await supabase
            .from('support_tickets')
            .update({ 
                assignee_id: adminId,
                status: 'in_progress',
                updated_at: new Date().toISOString()
            })
            .eq('id', ticketId);

        if (error) return fail('Failed to assign ticket');

        await logAuditEvent({
            action: 'admin.support.assign',
            actor_user_id: userId,
            related_entity_type: 'support_ticket',
            related_entity_id: ticketId,
            meta: { assignee_id: adminId }
        });

        revalidatePath('/dashboard/complaints');
        return ok({id: ticketId});
    } catch (error) {
        console.error('assignTicketToAdmin error:', error);
        return fail(toErrorMessage(error));
    }
}
