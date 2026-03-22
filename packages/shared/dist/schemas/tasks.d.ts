import { z } from 'zod';
export declare const TaskStatusSchema: z.ZodEnum<["open", "assigned", "in_progress", "completed", "canceled", "review", "disputed", "under_review"]>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export interface TaskDTO {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    budget: number;
    created_at: string;
    updated_at?: string;
    deadline?: string;
    category?: string;
    task_type?: 'tender' | 'booking';
    /** Admin list: count of task_requests (bids) for this task. Optional until backend rollout. */
    offers_count?: number;
    client: {
        id: string;
        full_name: string;
        avatar_url: string;
    };
    freelancer?: {
        id: string;
        full_name: string;
        avatar_url: string;
    } | null;
}
export type TaskDetailsDTO = TaskDTO & {
    skills: string[];
    image_paths: string[];
    owner_id: string;
    assigned_freelancer_id?: string | null;
    delivered_at?: string;
};
export declare const GetTasksSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    query: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    query: string;
    status: string;
    limit: number;
}, {
    page?: number | undefined;
    query?: string | undefined;
    status?: string | undefined;
    limit?: number | undefined;
}>;
export declare const UpdateTaskStatusSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["open", "assigned", "in_progress", "completed", "canceled", "review", "disputed", "under_review"]>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "completed" | "open" | "canceled" | "in_progress" | "assigned" | "review" | "disputed" | "under_review";
    id: string;
    reason: string;
}, {
    status: "completed" | "open" | "canceled" | "in_progress" | "assigned" | "review" | "disputed" | "under_review";
    id: string;
    reason: string;
}>;
export declare const TaskQueueAnalyticsDaySchema: z.ZodObject<{
    date: z.ZodString;
    posted_count: z.ZodNumber;
    completed_count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    date: string;
    posted_count: number;
    completed_count: number;
}, {
    date: string;
    posted_count: number;
    completed_count: number;
}>;
export type TaskQueueAnalyticsDay = z.infer<typeof TaskQueueAnalyticsDaySchema>;
export declare const TaskQueueAnalyticsDataSchema: z.ZodObject<{
    range: z.ZodLiteral<"7d">;
    days: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        posted_count: z.ZodNumber;
        completed_count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        date: string;
        posted_count: number;
        completed_count: number;
    }, {
        date: string;
        posted_count: number;
        completed_count: number;
    }>, "many">;
    totals: z.ZodObject<{
        posted: z.ZodNumber;
        completed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        completed: number;
        posted: number;
    }, {
        completed: number;
        posted: number;
    }>;
    generated_at: z.ZodString;
    is_stale: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    range: "7d";
    days: {
        date: string;
        posted_count: number;
        completed_count: number;
    }[];
    totals: {
        completed: number;
        posted: number;
    };
    generated_at: string;
    is_stale?: boolean | undefined;
}, {
    range: "7d";
    days: {
        date: string;
        posted_count: number;
        completed_count: number;
    }[];
    totals: {
        completed: number;
        posted: number;
    };
    generated_at: string;
    is_stale?: boolean | undefined;
}>;
export type TaskQueueAnalyticsData = z.infer<typeof TaskQueueAnalyticsDataSchema>;
export declare const TaskQueueAnalyticsResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    data: z.ZodObject<{
        range: z.ZodLiteral<"7d">;
        days: z.ZodArray<z.ZodObject<{
            date: z.ZodString;
            posted_count: z.ZodNumber;
            completed_count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            date: string;
            posted_count: number;
            completed_count: number;
        }, {
            date: string;
            posted_count: number;
            completed_count: number;
        }>, "many">;
        totals: z.ZodObject<{
            posted: z.ZodNumber;
            completed: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            completed: number;
            posted: number;
        }, {
            completed: number;
            posted: number;
        }>;
        generated_at: z.ZodString;
        is_stale: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        range: "7d";
        days: {
            date: string;
            posted_count: number;
            completed_count: number;
        }[];
        totals: {
            completed: number;
            posted: number;
        };
        generated_at: string;
        is_stale?: boolean | undefined;
    }, {
        range: "7d";
        days: {
            date: string;
            posted_count: number;
            completed_count: number;
        }[];
        totals: {
            completed: number;
            posted: number;
        };
        generated_at: string;
        is_stale?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    ok: true;
    data: {
        range: "7d";
        days: {
            date: string;
            posted_count: number;
            completed_count: number;
        }[];
        totals: {
            completed: number;
            posted: number;
        };
        generated_at: string;
        is_stale?: boolean | undefined;
    };
}, {
    ok: true;
    data: {
        range: "7d";
        days: {
            date: string;
            posted_count: number;
            completed_count: number;
        }[];
        totals: {
            completed: number;
            posted: number;
        };
        generated_at: string;
        is_stale?: boolean | undefined;
    };
}>;
export type TaskQueueAnalyticsResponse = z.infer<typeof TaskQueueAnalyticsResponseSchema>;
export declare const TASKS_READ_ROLES: string[];
export declare const TASKS_WRITE_ROLES: string[];
