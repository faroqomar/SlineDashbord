import { z } from 'zod';

const uuid = z.string().uuid();

/** Request body for POST /api/v1/chat/threads/:threadId/access (case_id required). */
export const GrantChatAccessInputSchema = z.object({
  caseId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});
export type GrantChatAccessInput = z.infer<typeof GrantChatAccessInputSchema>;

/** Response for successful access grant. */
export const ChatThreadAccessReceiptSchema = z.object({
  threadId: uuid,
  caseId: uuid,
  grantedAt: z.string(),
  expiresAt: z.string().nullable().optional(),
});
export type ChatThreadAccessReceipt = z.infer<typeof ChatThreadAccessReceiptSchema>;

/** Masked message (no body or PII). */
export const ChatMessageMaskedSchema = z.object({
  id: uuid,
  created_at: z.string(),
  redacted: z.boolean().default(false),
});
export type ChatMessageMasked = z.infer<typeof ChatMessageMaskedSchema>;

/** Full message (for case-gated view). */
export const ChatMessageFullSchema = z.object({
  id: uuid,
  body: z.string().nullable(),
  sender_id: uuid.nullable().optional(),
  created_at: z.string(),
  attachments: z.array(z.unknown()).optional(),
  redacted: z.boolean().default(false),
});
export type ChatMessageFull = z.infer<typeof ChatMessageFullSchema>;

/** Thread summary (participants, last activity). */
export const ChatThreadSummarySchema = z.object({
  threadId: uuid,
  participantIds: z.array(uuid).optional(),
  lastMessageAt: z.string().nullable().optional(),
  messageCount: z.number().optional(),
});
export type ChatThreadSummary = z.infer<typeof ChatThreadSummarySchema>;

/** Response shape for GET /api/v1/chat/threads/:threadId (case_id in query). */
export const ChatThreadResponseSchema = z.object({
  threadId: uuid,
  messages: z.array(ChatMessageFullSchema),
  summary: ChatThreadSummarySchema.optional(),
});
export type ChatThreadResponse = z.infer<typeof ChatThreadResponseSchema>;
