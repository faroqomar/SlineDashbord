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
    page: number;
    limit: number;
}, {
    status?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const UpdateDisputeStatusSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["open", "in_progress", "resolved", "escalated"]>;
    resolution: z.ZodOptional<z.ZodString>;
    decision: z.ZodOptional<z.ZodEnum<["refund_client", "release_freelancer"]>>;
}, "strip", z.ZodTypeAny, {
    status: "in_progress" | "open" | "resolved" | "escalated";
    id: string;
    resolution?: string | undefined;
    decision?: "refund_client" | "release_freelancer" | undefined;
}, {
    status: "in_progress" | "open" | "resolved" | "escalated";
    id: string;
    resolution?: string | undefined;
    decision?: "refund_client" | "release_freelancer" | undefined;
}>;
export declare const CreateDisputeInputSchema: z.ZodEffects<z.ZodObject<{
    task_id: z.ZodString;
    complainant_id: z.ZodString;
    defendant_id: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    task_id: string;
    complainant_id: string;
    defendant_id: string;
}, {
    reason: string;
    task_id: string;
    complainant_id: string;
    defendant_id: string;
}>, {
    reason: string;
    task_id: string;
    complainant_id: string;
    defendant_id: string;
}, {
    reason: string;
    task_id: string;
    complainant_id: string;
    defendant_id: string;
}>;
export type CreateDisputeInput = z.infer<typeof CreateDisputeInputSchema>;
export declare const CreateDisputeAckSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type CreateDisputeAck = z.infer<typeof CreateDisputeAckSchema>;
export declare const DISPUTES_READ_ROLES: string[];
export declare const DISPUTES_WRITE_ROLES: string[];
