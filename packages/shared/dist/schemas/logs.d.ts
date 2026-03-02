import { z } from 'zod';
export type LogDTO = {
    id: string;
    event_type: string;
    entity_type: string;
    entity_id: string;
    metadata: any;
    created_at: string;
    actor: {
        id: string;
        full_name: string;
        email: string;
        avatar_url: string;
    } | undefined;
};
export declare const GetSystemLogsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    actionFilter: z.ZodDefault<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    query: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    query: string;
    limit: number;
    actionFilter: string;
}, {
    page?: number | undefined;
    query?: string | undefined;
    limit?: number | undefined;
    actionFilter?: string | undefined;
}>;
export declare const GetLogsByTargetSchema: z.ZodObject<{
    targetId: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    targetId: string;
}, {
    targetId: string;
    limit?: number | undefined;
}>;
export declare const LOGS_READ_ROLES: string[];
