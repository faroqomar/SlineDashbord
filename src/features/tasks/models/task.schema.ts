import { z } from 'zod';

// Base DTO from existing implementation
export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  created_at: string;
  client: {
    full_name: string;
    avatar_url: string;
  };
  freelancer?: {
    full_name: string;
    avatar_url: string;
  };
}

// Zod Schemas for Action Validation
export const GetTasksSchema = z.object({
  page: z.number().int().positive().default(1),
  status: z.string().default('all'),
  limit: z.number().int().positive().max(100).default(10),
  query: z.string().default(''),
});

// Role Access Control Definitions
export const TASKS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const TASKS_WRITE_ROLES = ['moderator', 'admin', 'super_admin'];
