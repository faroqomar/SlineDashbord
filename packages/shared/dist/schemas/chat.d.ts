import { z } from 'zod';
/** Request body for POST /api/v1/chat/threads/:threadId/access (case_id required). */
export declare const GrantChatAccessInputSchema: z.ZodObject<{
    caseId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    caseId: string;
    reason?: string | undefined;
}, {
    caseId: string;
    reason?: string | undefined;
}>;
export type GrantChatAccessInput = z.infer<typeof GrantChatAccessInputSchema>;
/** Response for successful access grant. */
export declare const ChatThreadAccessReceiptSchema: z.ZodObject<{
    threadId: z.ZodString;
    caseId: z.ZodString;
    grantedAt: z.ZodString;
    expiresAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    caseId: string;
    threadId: string;
    grantedAt: string;
    expiresAt?: string | null | undefined;
}, {
    caseId: string;
    threadId: string;
    grantedAt: string;
    expiresAt?: string | null | undefined;
}>;
export type ChatThreadAccessReceipt = z.infer<typeof ChatThreadAccessReceiptSchema>;
/** Masked message (no body or PII). */
export declare const ChatMessageMaskedSchema: z.ZodObject<{
    id: z.ZodString;
    created_at: z.ZodString;
    redacted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    redacted: boolean;
}, {
    id: string;
    created_at: string;
    redacted?: boolean | undefined;
}>;
export type ChatMessageMasked = z.infer<typeof ChatMessageMaskedSchema>;
/** Full message (for case-gated view). */
export declare const ChatMessageFullSchema: z.ZodObject<{
    id: z.ZodString;
    body: z.ZodNullable<z.ZodString>;
    sender_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    redacted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    redacted: boolean;
    body: string | null;
    sender_id?: string | null | undefined;
    attachments?: unknown[] | undefined;
}, {
    id: string;
    created_at: string;
    body: string | null;
    redacted?: boolean | undefined;
    sender_id?: string | null | undefined;
    attachments?: unknown[] | undefined;
}>;
export type ChatMessageFull = z.infer<typeof ChatMessageFullSchema>;
/** Thread summary (participants, last activity). */
export declare const ChatThreadSummarySchema: z.ZodObject<{
    threadId: z.ZodString;
    participantIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    lastMessageAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    messageCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    threadId: string;
    participantIds?: string[] | undefined;
    lastMessageAt?: string | null | undefined;
    messageCount?: number | undefined;
}, {
    threadId: string;
    participantIds?: string[] | undefined;
    lastMessageAt?: string | null | undefined;
    messageCount?: number | undefined;
}>;
export type ChatThreadSummary = z.infer<typeof ChatThreadSummarySchema>;
/** Response shape for GET /api/v1/chat/threads/:threadId (case_id in query). */
export declare const ChatThreadResponseSchema: z.ZodObject<{
    threadId: z.ZodString;
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        body: z.ZodNullable<z.ZodString>;
        sender_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        created_at: z.ZodString;
        attachments: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
        redacted: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        redacted: boolean;
        body: string | null;
        sender_id?: string | null | undefined;
        attachments?: unknown[] | undefined;
    }, {
        id: string;
        created_at: string;
        body: string | null;
        redacted?: boolean | undefined;
        sender_id?: string | null | undefined;
        attachments?: unknown[] | undefined;
    }>, "many">;
    summary: z.ZodOptional<z.ZodObject<{
        threadId: z.ZodString;
        participantIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        lastMessageAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        messageCount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        threadId: string;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    }, {
        threadId: string;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    threadId: string;
    messages: {
        id: string;
        created_at: string;
        redacted: boolean;
        body: string | null;
        sender_id?: string | null | undefined;
        attachments?: unknown[] | undefined;
    }[];
    summary?: {
        threadId: string;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    } | undefined;
}, {
    threadId: string;
    messages: {
        id: string;
        created_at: string;
        body: string | null;
        redacted?: boolean | undefined;
        sender_id?: string | null | undefined;
        attachments?: unknown[] | undefined;
    }[];
    summary?: {
        threadId: string;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    } | undefined;
}>;
export type ChatThreadResponse = z.infer<typeof ChatThreadResponseSchema>;
