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
    status: "completed" | "open" | "in_progress" | "assigned" | "canceled" | "review" | "disputed" | "under_review";
    id: string;
    reason: string;
}, {
    status: "completed" | "open" | "in_progress" | "assigned" | "canceled" | "review" | "disputed" | "under_review";
    id: string;
    reason: string;
}>;
export declare const TASKS_READ_ROLES: string[];
export declare const TASKS_WRITE_ROLES: string[];
