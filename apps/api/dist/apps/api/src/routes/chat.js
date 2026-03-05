import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { GrantChatAccessInputSchema, ChatThreadAccessReceiptSchema, ChatThreadResponseSchema, failure, success, } from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';
const CHAT_ADMIN_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
const UuidSchema = z.string().uuid();
function validateThreadId(threadId) {
    const result = UuidSchema.safeParse(threadId);
    return result.success ? { ok: true, threadId: result.data } : { ok: false, status: 400 };
}
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
/** Case is "linked" to thread if there is at least one access log row or case has this thread as attached entity. */
async function isCaseLinkedToThread(caseId, threadId) {
    const { data: logRow } = await supabase
        .from('admin_chat_access_logs')
        .select('id')
        .eq('case_id', caseId)
        .eq('thread_id', threadId)
        .limit(1)
        .maybeSingle();
    if (logRow)
        return true;
    const { data: entityRow } = await supabase
        .from('admin_case_entities')
        .select('id')
        .eq('case_id', caseId)
        .eq('entity_type', 'conversation')
        .eq('entity_id', threadId)
        .limit(1)
        .maybeSingle();
    return !!entityRow;
}
/** Ensure case exists in admin_cases. */
async function caseExists(caseId) {
    const { data } = await supabase
        .from('admin_cases')
        .select('id')
        .eq('id', caseId)
        .maybeSingle();
    return !!data;
}
export default async function chatRoutes(fastify) {
    /**
     * POST /api/v1/chat/threads/:threadId/access
     * Grant access to a thread for a case. Requires case_id in body. Logs to admin_chat_access_logs (view_scope = 'grant').
     */
    fastify.post('/threads/:threadId/access', { preHandler: [requireAdminRole(CHAT_ADMIN_ROLES)] }, async (request, reply) => {
        const { threadId: rawThreadId } = request.params;
        const threadIdValidation = validateThreadId(rawThreadId);
        if (!threadIdValidation.ok) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid threadId', { threadId: rawThreadId }));
        }
        const { threadId } = threadIdValidation;
        const body = request.body;
        const validation = GrantChatAccessInputSchema.safeParse({
            caseId: body.caseId ?? body.case_id,
            reason: body.reason,
        });
        if (!validation.success) {
            return reply
                .status(400)
                .send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
        }
        const { caseId, reason } = validation.data;
        const adminId = request.user?.id;
        if (!adminId) {
            return reply.status(401).send(failure('UNAUTHORIZED', 'Authentication required'));
        }
        const exists = await caseExists(caseId);
        if (!exists) {
            return reply.status(403).send(failure('FORBIDDEN', 'Case not found'));
        }
        const { error: insertError } = await supabase.from('admin_chat_access_logs').insert({
            thread_id: threadId,
            case_id: caseId,
            viewer_admin_id: adminId,
            reason: reason ?? null,
            view_scope: 'grant',
        });
        if (insertError) {
            return reply.status(500).send(failure('DATABASE_ERROR', insertError.message));
        }
        const receipt = {
            threadId,
            caseId,
            grantedAt: new Date().toISOString(),
            expiresAt: null,
        };
        const parsed = ChatThreadAccessReceiptSchema.safeParse(receipt);
        return reply.send(success(parsed.success ? parsed.data : receipt));
    });
    /**
     * GET /api/v1/chat/threads/:threadId?case_id=...&limit=...
     * Return thread messages only when case_id is present and case is linked to thread. Logs every view to admin_chat_access_logs.
     * Optional query: limit (1–500, default 500) to cap message count for large threads.
     */
    fastify.get('/threads/:threadId', { preHandler: [requireAdminRole(CHAT_ADMIN_ROLES)] }, async (request, reply) => {
        const { threadId: rawThreadId } = request.params;
        const threadIdValidation = validateThreadId(rawThreadId);
        if (!threadIdValidation.ok) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid threadId', { threadId: rawThreadId }));
        }
        const { threadId } = threadIdValidation;
        const caseId = request.query.case_id;
        const limitParam = request.query.limit;
        const limit = limitParam != null ? Math.min(500, Math.max(1, parseInt(limitParam, 10) || 500)) : 500;
        if (!caseId) {
            return reply
                .status(403)
                .send(failure('FORBIDDEN', 'case_id is required to view thread content'));
        }
        const adminId = request.user?.id;
        if (!adminId) {
            return reply.status(401).send(failure('UNAUTHORIZED', 'Authentication required'));
        }
        const exists = await caseExists(caseId);
        if (!exists) {
            return reply.status(403).send(failure('FORBIDDEN', 'Case not found'));
        }
        const linked = await isCaseLinkedToThread(caseId, threadId);
        if (!linked) {
            return reply
                .status(403)
                .send(failure('FORBIDDEN', 'Case is not linked to this thread. Grant access or attach conversation first.'));
        }
        // Log this view
        const { error: logError } = await supabase.from('admin_chat_access_logs').insert({
            thread_id: threadId,
            case_id: caseId,
            viewer_admin_id: adminId,
            reason: null,
            view_scope: 'view',
        });
        if (logError) {
            return reply.status(500).send(failure('DATABASE_ERROR', 'Failed to log access: ' + logError.message));
        }
        // Fetch conversation and messages (thread_id = conversation id)
        const { data: conv, error: convError } = await supabase
            .from('conversations')
            .select('id')
            .eq('id', threadId)
            .maybeSingle();
        if (convError) {
            return reply.status(500).send(failure('DATABASE_ERROR', convError.message));
        }
        if (!conv) {
            return reply.status(404).send(failure('NOT_FOUND', 'Thread not found'));
        }
        const { data: messages, error: msgError } = await supabase
            .from('messages')
            .select('id, body, sender_id, created_at, attachments, meta')
            .eq('conversation_id', threadId)
            .order('created_at', { ascending: true })
            .limit(limit);
        if (msgError) {
            return reply.status(500).send(failure('DATABASE_ERROR', msgError.message));
        }
        const normalized = (messages ?? []).map((m) => ({
            id: m.id,
            body: m.body ?? null,
            sender_id: m.sender_id ?? null,
            created_at: typeof m.created_at === 'string' ? m.created_at : m.created_at?.toISOString?.() ?? '',
            attachments: Array.isArray(m.attachments) ? m.attachments : undefined,
            redacted: !!(m.meta && m.meta.redacted),
        }));
        const response = {
            threadId,
            messages: normalized,
            summary: {
                threadId,
                messageCount: normalized.length,
                lastMessageAt: normalized.length > 0 ? normalized[normalized.length - 1].created_at : null,
            },
        };
        const parsed = ChatThreadResponseSchema.safeParse(response);
        return reply.send(success(parsed.success ? parsed.data : response));
    });
}
