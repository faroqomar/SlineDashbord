import { z } from 'zod';
/** Stub for reports in investigation (PAGE 15: reports out of scope; link to /reports). */
export declare const ReportsStubSchema: z.ZodObject<{
    count: z.ZodDefault<z.ZodNumber>;
    linkToReports: z.ZodOptional<z.ZodLiteral<"/reports">>;
}, "strip", z.ZodTypeAny, {
    count: number;
    linkToReports?: "/reports" | undefined;
}, {
    count?: number | undefined;
    linkToReports?: "/reports" | undefined;
}>;
export type ReportsStub = z.infer<typeof ReportsStubSchema>;
/** Minimal task reference in investigation graph. */
export declare const InvestigationTaskRefSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodString>;
    task_type: z.ZodOptional<z.ZodEnum<["tender", "booking"]>>;
    owner_id: z.ZodOptional<z.ZodString>;
    assigned_freelancer_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status?: string | undefined;
    created_at?: string | undefined;
    title?: string | null | undefined;
    task_type?: "booking" | "tender" | undefined;
    owner_id?: string | undefined;
    assigned_freelancer_id?: string | null | undefined;
}, {
    id: string;
    status?: string | undefined;
    created_at?: string | undefined;
    title?: string | null | undefined;
    task_type?: "booking" | "tender" | undefined;
    owner_id?: string | undefined;
    assigned_freelancer_id?: string | null | undefined;
}>;
export type InvestigationTaskRef = z.infer<typeof InvestigationTaskRefSchema>;
/** Minimal booking reference in investigation graph. */
export declare const InvestigationBookingRefSchema: z.ZodObject<{
    id: z.ZodString;
    task_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    client_id: z.ZodOptional<z.ZodString>;
    provider_id: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status?: string | undefined;
    created_at?: string | undefined;
    task_id?: string | null | undefined;
    client_id?: string | undefined;
    provider_id?: string | undefined;
}, {
    id: string;
    status?: string | undefined;
    created_at?: string | undefined;
    task_id?: string | null | undefined;
    client_id?: string | undefined;
    provider_id?: string | undefined;
}>;
export type InvestigationBookingRef = z.infer<typeof InvestigationBookingRefSchema>;
/** Minimal dispute reference in investigation graph. */
export declare const InvestigationDisputeRefSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status?: string | undefined;
    created_at?: string | undefined;
}, {
    id: string;
    status?: string | undefined;
    created_at?: string | undefined;
}>;
export type InvestigationDisputeRef = z.infer<typeof InvestigationDisputeRefSchema>;
/** Minimal ledger/journal entry for investigation. */
export declare const InvestigationLedgerEntrySchema: z.ZodObject<{
    id: z.ZodString;
    amount_cents: z.ZodOptional<z.ZodNumber>;
    related_entity_type: z.ZodOptional<z.ZodString>;
    related_entity_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at?: string | undefined;
    amount_cents?: number | undefined;
    related_entity_type?: string | undefined;
    related_entity_id?: string | null | undefined;
}, {
    id: string;
    created_at?: string | undefined;
    amount_cents?: number | undefined;
    related_entity_type?: string | undefined;
    related_entity_id?: string | null | undefined;
}>;
export type InvestigationLedgerEntry = z.infer<typeof InvestigationLedgerEntrySchema>;
/** Conversation summary in investigation (masked; case references). */
export declare const InvestigationConversationSummarySchema: z.ZodObject<{
    threadId: z.ZodString;
    participantIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    lastMessageAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    messageCount: z.ZodOptional<z.ZodNumber>;
    caseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    threadId: string;
    caseId?: string | null | undefined;
    participantIds?: string[] | undefined;
    lastMessageAt?: string | null | undefined;
    messageCount?: number | undefined;
}, {
    threadId: string;
    caseId?: string | null | undefined;
    participantIds?: string[] | undefined;
    lastMessageAt?: string | null | undefined;
    messageCount?: number | undefined;
}>;
export type InvestigationConversationSummary = z.infer<typeof InvestigationConversationSummarySchema>;
/** Full investigation graph (GET /api/v1/users/:userId/investigation). */
export declare const UserInvestigationResponseSchema: z.ZodObject<{
    profile: z.ZodObject<{
        id: z.ZodString;
        full_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        avatar_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        account_status: z.ZodOptional<z.ZodString>;
        moderation_reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        moderated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        created_at: z.ZodOptional<z.ZodString>;
        updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        email: z.ZodOptional<z.ZodLiteral<"[MASKED]">>;
        phone: z.ZodOptional<z.ZodLiteral<"[MASKED]">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        account_status?: string | undefined;
        created_at?: string | undefined;
        email?: "[MASKED]" | undefined;
        phone?: "[MASKED]" | undefined;
        moderation_reason?: string | null | undefined;
        moderated_at?: string | null | undefined;
        updated_at?: string | null | undefined;
    }, {
        id: string;
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        account_status?: string | undefined;
        created_at?: string | undefined;
        email?: "[MASKED]" | undefined;
        phone?: "[MASKED]" | undefined;
        moderation_reason?: string | null | undefined;
        moderated_at?: string | null | undefined;
        updated_at?: string | null | undefined;
    }>;
    tasks: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        status: z.ZodOptional<z.ZodString>;
        task_type: z.ZodOptional<z.ZodEnum<["tender", "booking"]>>;
        owner_id: z.ZodOptional<z.ZodString>;
        assigned_freelancer_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        created_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
        title?: string | null | undefined;
        task_type?: "booking" | "tender" | undefined;
        owner_id?: string | undefined;
        assigned_freelancer_id?: string | null | undefined;
    }, {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
        title?: string | null | undefined;
        task_type?: "booking" | "tender" | undefined;
        owner_id?: string | undefined;
        assigned_freelancer_id?: string | null | undefined;
    }>, "many">>;
    offers: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        status: z.ZodOptional<z.ZodString>;
        created_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
    }, {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
    }>, "many">>;
    bookings: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        task_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        client_id: z.ZodOptional<z.ZodString>;
        provider_id: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        created_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
        task_id?: string | null | undefined;
        client_id?: string | undefined;
        provider_id?: string | undefined;
    }, {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
        task_id?: string | null | undefined;
        client_id?: string | undefined;
        provider_id?: string | undefined;
    }>, "many">>;
    disputes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        status: z.ZodOptional<z.ZodString>;
        created_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
    }, {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
    }>, "many">>;
    ledgerActivity: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        amount_cents: z.ZodOptional<z.ZodNumber>;
        related_entity_type: z.ZodOptional<z.ZodString>;
        related_entity_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        created_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at?: string | undefined;
        amount_cents?: number | undefined;
        related_entity_type?: string | undefined;
        related_entity_id?: string | null | undefined;
    }, {
        id: string;
        created_at?: string | undefined;
        amount_cents?: number | undefined;
        related_entity_type?: string | undefined;
        related_entity_id?: string | null | undefined;
    }>, "many">>;
    reportsStub: z.ZodDefault<z.ZodObject<{
        count: z.ZodDefault<z.ZodNumber>;
        linkToReports: z.ZodOptional<z.ZodLiteral<"/reports">>;
    }, "strip", z.ZodTypeAny, {
        count: number;
        linkToReports?: "/reports" | undefined;
    }, {
        count?: number | undefined;
        linkToReports?: "/reports" | undefined;
    }>>;
    conversationsSummary: z.ZodDefault<z.ZodArray<z.ZodObject<{
        threadId: z.ZodString;
        participantIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        lastMessageAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        messageCount: z.ZodOptional<z.ZodNumber>;
        caseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        threadId: string;
        caseId?: string | null | undefined;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    }, {
        threadId: string;
        caseId?: string | null | undefined;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    disputes: {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
    }[];
    bookings: {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
        task_id?: string | null | undefined;
        client_id?: string | undefined;
        provider_id?: string | undefined;
    }[];
    profile: {
        id: string;
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        account_status?: string | undefined;
        created_at?: string | undefined;
        email?: "[MASKED]" | undefined;
        phone?: "[MASKED]" | undefined;
        moderation_reason?: string | null | undefined;
        moderated_at?: string | null | undefined;
        updated_at?: string | null | undefined;
    };
    tasks: {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
        title?: string | null | undefined;
        task_type?: "booking" | "tender" | undefined;
        owner_id?: string | undefined;
        assigned_freelancer_id?: string | null | undefined;
    }[];
    offers: {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
    }[];
    ledgerActivity: {
        id: string;
        created_at?: string | undefined;
        amount_cents?: number | undefined;
        related_entity_type?: string | undefined;
        related_entity_id?: string | null | undefined;
    }[];
    reportsStub: {
        count: number;
        linkToReports?: "/reports" | undefined;
    };
    conversationsSummary: {
        threadId: string;
        caseId?: string | null | undefined;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    }[];
}, {
    profile: {
        id: string;
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        account_status?: string | undefined;
        created_at?: string | undefined;
        email?: "[MASKED]" | undefined;
        phone?: "[MASKED]" | undefined;
        moderation_reason?: string | null | undefined;
        moderated_at?: string | null | undefined;
        updated_at?: string | null | undefined;
    };
    disputes?: {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
    }[] | undefined;
    bookings?: {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
        task_id?: string | null | undefined;
        client_id?: string | undefined;
        provider_id?: string | undefined;
    }[] | undefined;
    tasks?: {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
        title?: string | null | undefined;
        task_type?: "booking" | "tender" | undefined;
        owner_id?: string | undefined;
        assigned_freelancer_id?: string | null | undefined;
    }[] | undefined;
    offers?: {
        id: string;
        status?: string | undefined;
        created_at?: string | undefined;
    }[] | undefined;
    ledgerActivity?: {
        id: string;
        created_at?: string | undefined;
        amount_cents?: number | undefined;
        related_entity_type?: string | undefined;
        related_entity_id?: string | null | undefined;
    }[] | undefined;
    reportsStub?: {
        count?: number | undefined;
        linkToReports?: "/reports" | undefined;
    } | undefined;
    conversationsSummary?: {
        threadId: string;
        caseId?: string | null | undefined;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    }[] | undefined;
}>;
export type UserInvestigationResponse = z.infer<typeof UserInvestigationResponseSchema>;
/** GET /api/v1/users/:userId/conversations response (masked thread list + case refs). */
export declare const UserConversationsResponseSchema: z.ZodObject<{
    conversations: z.ZodArray<z.ZodObject<{
        threadId: z.ZodString;
        participantIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        lastMessageAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        messageCount: z.ZodOptional<z.ZodNumber>;
        caseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        threadId: string;
        caseId?: string | null | undefined;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    }, {
        threadId: string;
        caseId?: string | null | undefined;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    }>, "many">;
    nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    conversations: {
        threadId: string;
        caseId?: string | null | undefined;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    }[];
    nextCursor?: string | null | undefined;
}, {
    conversations: {
        threadId: string;
        caseId?: string | null | undefined;
        participantIds?: string[] | undefined;
        lastMessageAt?: string | null | undefined;
        messageCount?: number | undefined;
    }[];
    nextCursor?: string | null | undefined;
}>;
export type UserConversationsResponse = z.infer<typeof UserConversationsResponseSchema>;
/** Query params for GET /api/v1/users/:userId/evidence-pack. */
export declare const EvidencePackExportQuerySchema: z.ZodObject<{
    format: z.ZodDefault<z.ZodEnum<["csv", "json"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    format: "csv" | "json";
    cursor?: string | undefined;
}, {
    limit?: number | undefined;
    cursor?: string | undefined;
    format?: "csv" | "json" | undefined;
}>;
export type EvidencePackExportQuery = z.infer<typeof EvidencePackExportQuerySchema>;
/** Evidence-pack export response metadata (streamed body is csv/json). */
export declare const EvidencePackExportReceiptSchema: z.ZodObject<{
    userId: z.ZodString;
    format: z.ZodEnum<["csv", "json"]>;
    rowCount: z.ZodNumber;
    exportedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    format: "csv" | "json";
    rowCount: number;
    exportedAt: string;
}, {
    userId: string;
    format: "csv" | "json";
    rowCount: number;
    exportedAt: string;
}>;
export type EvidencePackExportReceipt = z.infer<typeof EvidencePackExportReceiptSchema>;
