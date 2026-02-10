'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type TaskDTO = {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'canceled' | 'review';
  created_at: string;
  deadline?: string;
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
  category?: string;
};

export type TaskDetailsDTO = TaskDTO & {
  // Add specific details if any
  skills: string[];
  image_paths: string[];
};

export async function getTasks(page = 1, status = 'all', limit = 10, query = '') {
  const supabase = createAdminClient();
  const PAGE_SIZE = limit;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let queryBuilder = supabase
    .from('tasks')
    .select(`
      id,
      title,
      description,
      budget,
      status,
      created_at,
      deadline,
      category,
      client:owner_id(id, full_name, avatar_url),
      freelancer:assigned_freelancer_id(id, full_name, avatar_url)
    `, { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (status !== 'all') {
    queryBuilder = queryBuilder.eq('status', status);
  }

  if (query) {
    queryBuilder = queryBuilder.ilike('title', `%${query}%`);
  }

  const { data, error, count } = await queryBuilder;

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }

  // Map data to DTO
  const tasks: TaskDTO[] = (data || []).map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    budget: task.budget,
    status: task.status,
    created_at: task.created_at,
    deadline: task.deadline,
    category: task.category,
    client: {
      id: task.client?.id || 'unknown',
      full_name: task.client?.full_name || 'Unknown Client',
      avatar_url: task.client?.avatar_url || '',
    },
    freelancer: task.freelancer ? {
      id: task.freelancer.id,
      full_name: task.freelancer.full_name,
      avatar_url: task.freelancer.avatar_url,
    } : null,
  }));

  return {
    tasks,
    count: count || 0,
    totalPages: count ? Math.ceil(count / PAGE_SIZE) : 0,
  };
}

export async function getTaskDetails(id: string): Promise<TaskDetailsDTO | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      client:owner_id(id, full_name, avatar_url),
      freelancer:assigned_freelancer_id(id, full_name, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching task details:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    budget: data.budget,
    status: data.status,
    created_at: data.created_at,
    deadline: data.deadline,
    category: data.category,
    skills: data.skills || [],
    image_paths: data.image_paths || [],
    client: {
      id: data.client?.id || 'unknown',
      full_name: data.client?.full_name || 'Unknown Client',
      avatar_url: data.client?.avatar_url || '',
    },
    freelancer: data.freelancer ? {
      id: data.freelancer.id,
      full_name: data.freelancer.full_name,
      avatar_url: data.freelancer.avatar_url,
    } : null,
  };
}

export async function cancelTask(id: string, reason: string) {
  const supabase = createAdminClient();

  // 1. Update task status
  const { error: updateError } = await supabase
    .from('tasks')
    .update({ status: 'canceled' })
    .eq('id', id);

  if (updateError) {
    console.error('Error canceling task:', updateError);
    throw new Error('Failed to cancel task');
  }

  // 2. Log action
  const { error: logError } = await supabase
    .from('admin_logs')
    .insert({
      action: 'cancel_task',
      entity_type: 'task',
      entity_id: id,
      details: { reason },
    });

  if (logError) {
    console.error('Error logging cancel task action:', logError);
    // Don't throw here, action succeeded
  }

  revalidatePath('/dashboard/tasks');
  revalidatePath(`/dashboard/tasks/${id}`);
}
