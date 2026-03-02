import { z } from 'zod';

export const TaskStatusSchema = z.enum([
  'open',
  'assigned',
  'in_progress',
  'completed',
  'canceled',
  'review',
  'disputed',
  'under_review'
]);

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

export const GetTasksSchema = z.object({
  page: z.number().int().positive().default(1),
  status: z.string().default('all'),
  limit: z.number().int().positive().max(100).default(10),
  query: z.string().default(''),
});

export const UpdateTaskStatusSchema = z.object({
  id: z.string().uuid("Invalid Task ID"),
  status: TaskStatusSchema,
  reason: z.string().min(5, "Reason required")
});

export const TASKS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const TASKS_WRITE_ROLES = ['moderator', 'admin', 'super_admin'];
