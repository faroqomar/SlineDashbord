import { z } from 'zod';
export declare const SupportTicketSchema: z.ZodObject<{
    id: z.ZodString;
    user_id: z.ZodString;
    subject: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["open", "in_progress", "resolved", "closed"]>;
    priority: z.ZodEnum<["low", "normal", "high", "urgent"]>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    user: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        full_name: z.ZodString;
        email: z.ZodString;
        avatar_url: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        full_name: string;
        avatar_url: string | null;
        email: string;
    }, {
        id: string;
        full_name: string;
        avatar_url: string | null;
        email: string;
    }>>;
    assignee: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        full_name: z.ZodString;
        avatar_url: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        full_name: string;
        avatar_url: string | null;
    }, {
        id: string;
        full_name: string;
        avatar_url: string | null;
    }>>;
    last_message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "resolved" | "in_progress" | "closed";
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    subject: string;
    priority: "low" | "high" | "normal" | "urgent";
    category?: string | undefined;
    user?: {
        id: string;
        full_name: string;
        avatar_url: string | null;
        email: string;
    } | undefined;
    assignee?: {
        id: string;
        full_name: string;
        avatar_url: string | null;
    } | undefined;
    last_message?: string | undefined;
}, {
    status: "open" | "resolved" | "in_progress" | "closed";
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    subject: string;
    priority: "low" | "high" | "normal" | "urgent";
    category?: string | undefined;
    user?: {
        id: string;
        full_name: string;
        avatar_url: string | null;
        email: string;
    } | undefined;
    assignee?: {
        id: string;
        full_name: string;
        avatar_url: string | null;
    } | undefined;
    last_message?: string | undefined;
}>;
export type SupportTicketDTO = z.infer<typeof SupportTicketSchema>;
export declare const GetTicketsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    status: string;
    limit: number;
}, {
    page?: number | undefined;
    status?: string | undefined;
    limit?: number | undefined;
}>;
export declare const UpdateTicketStatusSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["open", "in_progress", "resolved", "closed"]>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "resolved" | "in_progress" | "closed";
    id: string;
}, {
    status: "open" | "resolved" | "in_progress" | "closed";
    id: string;
}>;
export declare const SUPPORT_READ_ROLES: string[];
export declare const SUPPORT_WRITE_ROLES: string[];
