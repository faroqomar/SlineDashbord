import { z } from 'zod';
export type DisputeDTO = {
    id: string;
    task_id: string;
    reporter_id: string;
    reported_id: string;
    reason: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'escalated';
    resolution?: string;
    created_at: string;
    updated_at: string;
    reporter: {
        id: string;
        full_name: string;
        avatar_url: string;
    };
    reported: {
        id: string;
        full_name: string;
        avatar_url: string;
    };
    task: {
        title: string;
        budget: number;
        status: string;
    };
};
export declare const GetDisputesSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: string;
    limit: number;
    page: number;
}, {
    status?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
}>;
export declare const UpdateDisputeStatusSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["open", "in_progress", "resolved", "escalated"]>;
    resolution: z.ZodOptional<z.ZodString>;
    decision: z.ZodOptional<z.ZodEnum<["refund_client", "release_freelancer"]>>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "in_progress" | "resolved" | "escalated";
    id: string;
    decision?: "refund_client" | "release_freelancer" | undefined;
    resolution?: string | undefined;
}, {
    status: "open" | "in_progress" | "resolved" | "escalated";
    id: string;
    decision?: "refund_client" | "release_freelancer" | undefined;
    resolution?: string | undefined;
}>;
export declare const DISPUTES_READ_ROLES: string[];
export declare const DISPUTES_WRITE_ROLES: string[];
