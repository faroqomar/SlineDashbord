import { z } from 'zod';
import { UserDetailMaskedSchema } from './users.js';

const uuid = z.string().uuid();

/** Stub for reports in investigation (PAGE 15: reports out of scope; link to /reports). */
export const ReportsStubSchema = z.object({
  count: z.number().default(0),
  linkToReports: z.literal('/reports').optional(),
});
export type ReportsStub = z.infer<typeof ReportsStubSchema>;

/** Minimal task reference in investigation graph. */
export const InvestigationTaskRefSchema = z.object({
  id: uuid,
  title: z.string().nullable().optional(),
  status: z.string().optional(),
  created_at: z.string().optional(),
});
export type InvestigationTaskRef = z.infer<typeof InvestigationTaskRefSchema>;

/** Minimal booking reference in investigation graph. */
export const InvestigationBookingRefSchema = z.object({
  id: uuid,
  status: z.string().optional(),
  created_at: z.string().optional(),
});
export type InvestigationBookingRef = z.infer<typeof InvestigationBookingRefSchema>;

/** Minimal dispute reference in investigation graph. */
export const InvestigationDisputeRefSchema = z.object({
  id: uuid,
  status: z.string().optional(),
  created_at: z.string().optional(),
});
export type InvestigationDisputeRef = z.infer<typeof InvestigationDisputeRefSchema>;

/** Minimal ledger/journal entry for investigation. */
export const InvestigationLedgerEntrySchema = z.object({
  id: uuid,
  amount_cents: z.number().optional(),
  related_entity_type: z.string().optional(),
  related_entity_id: uuid.optional().nullable(),
  created_at: z.string().optional(),
});
export type InvestigationLedgerEntry = z.infer<typeof InvestigationLedgerEntrySchema>;

/** Conversation summary in investigation (masked; case references). */
export const InvestigationConversationSummarySchema = z.object({
  threadId: uuid,
  participantIds: z.array(uuid).optional(),
  lastMessageAt: z.string().nullable().optional(),
  messageCount: z.number().optional(),
  caseId: uuid.nullable().optional(),
});
export type InvestigationConversationSummary = z.infer<typeof InvestigationConversationSummarySchema>;

/** Full investigation graph (GET /api/v1/users/:userId/investigation). */
export const UserInvestigationResponseSchema = z.object({
  profile: UserDetailMaskedSchema,
  tasks: z.array(InvestigationTaskRefSchema).default([]),
  offers: z.array(z.object({ id: uuid, created_at: z.string().optional() })).default([]),
  bookings: z.array(InvestigationBookingRefSchema).default([]),
  disputes: z.array(InvestigationDisputeRefSchema).default([]),
  ledgerActivity: z.array(InvestigationLedgerEntrySchema).default([]),
  reportsStub: ReportsStubSchema.default({ count: 0 }),
  conversationsSummary: z.array(InvestigationConversationSummarySchema).default([]),
});
export type UserInvestigationResponse = z.infer<typeof UserInvestigationResponseSchema>;

/** GET /api/v1/users/:userId/conversations response (masked thread list + case refs). */
export const UserConversationsResponseSchema = z.object({
  conversations: z.array(InvestigationConversationSummarySchema),
  nextCursor: z.string().nullable().optional(),
});
export type UserConversationsResponse = z.infer<typeof UserConversationsResponseSchema>;

/** Query params for GET /api/v1/users/:userId/evidence-pack. */
export const EvidencePackExportQuerySchema = z.object({
  format: z.enum(['csv', 'json']).default('json'),
  limit: z.coerce.number().int().min(1).max(10_000).default(5000),
  cursor: z.string().optional(),
});
export type EvidencePackExportQuery = z.infer<typeof EvidencePackExportQuerySchema>;

/** Evidence-pack export response metadata (streamed body is csv/json). */
export const EvidencePackExportReceiptSchema = z.object({
  userId: uuid,
  format: z.enum(['csv', 'json']),
  rowCount: z.number(),
  exportedAt: z.string(),
});
export type EvidencePackExportReceipt = z.infer<typeof EvidencePackExportReceiptSchema>;
