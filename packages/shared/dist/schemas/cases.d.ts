import { z } from 'zod';
/** Case id for case-gated operations (e.g. chat access). */
export declare const CaseIdSchema: z.ZodString;
export type CaseId = z.infer<typeof CaseIdSchema>;
/** Entity types that can be attached to a case. */
export declare const CaseEntityTypeSchema: z.ZodEnum<["task", "user", "conversation", "booking", "dispute"]>;
export type CaseEntityType = z.infer<typeof CaseEntityTypeSchema>;
/** Minimal case reference for API responses. */
export declare const AdminCaseRefSchema: z.ZodObject<{
    id: z.ZodString;
    subject: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status?: string | undefined;
    subject?: string | null | undefined;
}, {
    id: string;
    status?: string | undefined;
    subject?: string | null | undefined;
}>;
export type AdminCaseRef = z.infer<typeof AdminCaseRefSchema>;
/** Case as returned by API (PAGE 08). */
export declare const AdminCaseSchema: z.ZodObject<{
    id: z.ZodString;
    subject: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodOptional<z.ZodString>;
    assignee_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    subject: string;
    status?: string | undefined;
    updated_at?: string | undefined;
    priority?: string | undefined;
    source?: string | undefined;
    assignee_id?: string | null | undefined;
}, {
    id: string;
    created_at: string;
    subject: string;
    status?: string | undefined;
    updated_at?: string | undefined;
    priority?: string | undefined;
    source?: string | undefined;
    assignee_id?: string | null | undefined;
}>;
export type AdminCase = z.infer<typeof AdminCaseSchema>;
/** Create case input (PAGE 08). */
export declare const AdminCaseCreateInputSchema: z.ZodObject<{
    subject: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
    source: z.ZodDefault<z.ZodString>;
    assignee_id: z.ZodOptional<z.ZodString>;
    idempotency_key: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    subject: string;
    priority: "low" | "medium" | "high";
    source: string;
    idempotency_key?: string | undefined;
    assignee_id?: string | undefined;
}, {
    subject: string;
    idempotency_key?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
    source?: string | undefined;
    assignee_id?: string | undefined;
}>;
export type AdminCaseCreateInput = z.infer<typeof AdminCaseCreateInputSchema>;
/** Attach entity to case input. */
export declare const AdminCaseAttachEntityInputSchema: z.ZodObject<{
    entity_type: z.ZodEnum<["task", "user", "conversation", "booking", "dispute"]>;
    entity_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    entity_type: "task" | "user" | "booking" | "dispute" | "conversation";
    entity_id: string;
}, {
    entity_type: "task" | "user" | "booking" | "dispute" | "conversation";
    entity_id: string;
}>;
export type AdminCaseAttachEntityInput = z.infer<typeof AdminCaseAttachEntityInputSchema>;
/** List response for GET /cases */
export declare const AdminCaseListResponseSchema: z.ZodObject<{
    cases: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        subject: z.ZodString;
        source: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodString>;
        created_at: z.ZodString;
        updated_at: z.ZodOptional<z.ZodString>;
        assignee_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        subject: string;
        status?: string | undefined;
        updated_at?: string | undefined;
        priority?: string | undefined;
        source?: string | undefined;
        assignee_id?: string | null | undefined;
    }, {
        id: string;
        created_at: string;
        subject: string;
        status?: string | undefined;
        updated_at?: string | undefined;
        priority?: string | undefined;
        source?: string | undefined;
        assignee_id?: string | null | undefined;
    }>, "many">;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    cases: {
        id: string;
        created_at: string;
        subject: string;
        status?: string | undefined;
        updated_at?: string | undefined;
        priority?: string | undefined;
        source?: string | undefined;
        assignee_id?: string | null | undefined;
    }[];
    total: number;
    totalPages?: number | undefined;
}, {
    page: number;
    limit: number;
    cases: {
        id: string;
        created_at: string;
        subject: string;
        status?: string | undefined;
        updated_at?: string | undefined;
        priority?: string | undefined;
        source?: string | undefined;
        assignee_id?: string | null | undefined;
    }[];
    total: number;
    totalPages?: number | undefined;
}>;
export type AdminCaseListResponse = z.infer<typeof AdminCaseListResponseSchema>;
/** Attached entity row in case detail. */
export declare const AdminCaseEntitySchema: z.ZodObject<{
    id: z.ZodString;
    case_id: z.ZodString;
    entity_type: z.ZodEnum<["task", "user", "conversation", "booking", "dispute"]>;
    entity_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    case_id: string;
    entity_type: "task" | "user" | "booking" | "dispute" | "conversation";
    entity_id: string;
    created_at?: string | undefined;
}, {
    id: string;
    case_id: string;
    entity_type: "task" | "user" | "booking" | "dispute" | "conversation";
    entity_id: string;
    created_at?: string | undefined;
}>;
export type AdminCaseEntity = z.infer<typeof AdminCaseEntitySchema>;
/** Case detail (case + entities). */
export type AdminCaseDetail = AdminCase & {
    entities?: AdminCaseEntity[];
};
/** Roles allowed to read/write cases. */
export declare const CASES_ROLES: string[];
