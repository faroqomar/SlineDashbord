import { z } from 'zod';
import { UserDetailMaskedSchema } from './users.js';
const uuid = z.string().uuid();
/** Stub for reports in investigation (PAGE 15: reports out of scope; link to /reports). */
export const ReportsStubSchema = z.object({
    count: z.number().default(0),
    linkToReports: z.literal('/reports').optional(),
});
/** Minimal task reference in investigation graph. */
export const InvestigationTaskRefSchema = z.object({
    id: uuid,
    title: z.string().nullable().optional(),
    status: z.string().optional(),
    task_type: z.enum(['tender', 'booking']).optional(),
    owner_id: uuid.optional(),
    assigned_freelancer_id: uuid.nullable().optional(),
    created_at: z.string().optional(),
});
/** Minimal booking reference in investigation graph. */
export const InvestigationBookingRefSchema = z.object({
    id: uuid,
    task_id: uuid.nullable().optional(),
    client_id: uuid.optional(),
    provider_id: uuid.optional(),
    status: z.string().optional(),
    created_at: z.string().optional(),
});
/** Minimal dispute reference in investigation graph. */
export const InvestigationDisputeRefSchema = z.object({
    id: uuid,
    status: z.string().optional(),
    created_at: z.string().optional(),
});
/** Minimal ledger/journal entry for investigation. */
export const InvestigationLedgerEntrySchema = z.object({
    id: uuid,
    amount_cents: z.number().optional(),
    related_entity_type: z.string().optional(),
    related_entity_id: uuid.optional().nullable(),
    created_at: z.string().optional(),
});
/** Conversation summary in investigation (masked; case references). */
export const InvestigationConversationSummarySchema = z.object({
    threadId: uuid,
    participantIds: z.array(uuid).optional(),
    lastMessageAt: z.string().nullable().optional(),
    messageCount: z.number().optional(),
    caseId: uuid.nullable().optional(),
});
/** Full investigation graph (GET /api/v1/users/:userId/investigation). */
export const UserInvestigationResponseSchema = z.object({
    profile: UserDetailMaskedSchema,
    tasks: z.array(InvestigationTaskRefSchema).default([]),
    offers: z
        .array(z.object({
        id: uuid,
        status: z.string().optional(),
        created_at: z.string().optional(),
    }))
        .default([]),
    bookings: z.array(InvestigationBookingRefSchema).default([]),
    disputes: z.array(InvestigationDisputeRefSchema).default([]),
    ledgerActivity: z.array(InvestigationLedgerEntrySchema).default([]),
    reportsStub: ReportsStubSchema.default({ count: 0 }),
    conversationsSummary: z.array(InvestigationConversationSummarySchema).default([]),
});
/** GET /api/v1/users/:userId/conversations response (masked thread list + case refs). */
export const UserConversationsResponseSchema = z.object({
    conversations: z.array(InvestigationConversationSummarySchema),
    nextCursor: z.string().nullable().optional(),
});
/** Query params for GET /api/v1/users/:userId/evidence-pack. */
export const EvidencePackExportQuerySchema = z.object({
    format: z.enum(['csv', 'json']).default('json'),
    limit: z.coerce.number().int().min(1).max(10_000).default(5000),
    cursor: z.string().optional(),
});
/** Evidence-pack export response metadata (streamed body is csv/json). */
export const EvidencePackExportReceiptSchema = z.object({
    userId: uuid,
    format: z.enum(['csv', 'json']),
    rowCount: z.number(),
    exportedAt: z.string(),
});
