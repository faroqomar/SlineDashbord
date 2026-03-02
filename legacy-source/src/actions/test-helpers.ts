'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/auth-checks';

export async function createTestDispute(placeholderId: string) {
  const adminId = await verifyAdminSession();
  if (!adminId) return { success: false, error: 'Unauthorized' };

  const supabase = await createAdminClient();

  // 1. Get a random task or create one
  const { data: formattedTasks } = await supabase.from('tasks').select('*').limit(1);
  
  if (!formattedTasks || formattedTasks.length === 0) {
      return { success: false, error: 'No tasks found to dispute. Create a task first.' };
  }
  
  const task = formattedTasks[0]; // Just pick the first one for testing

  // 2. Insert Dispute
  const { data, error } = await supabase
    .from('disputes')
    .insert({
      task_id: task.id,
      initiator_id: task.client_id || adminId, // Fallback if task is weird
      reason: 'Test Dispute created by Admin',
      status: 'open'
    })
    .select()
    .single();

  if (error) {
    console.error('Test dispute creation failed:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getDisputes() {
    const supabase = await createAdminClient();
    const { data } = await supabase.from('disputes').select('*').order('created_at', { ascending: false });
    return data || [];
}
