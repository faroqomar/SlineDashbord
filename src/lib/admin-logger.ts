'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function logAdminAction(
  actorId: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata: Record<string, any> = {}
) {
  const supabase = createAdminClient();

  try {
    await supabase.from('activity_log').insert({
      actor_id: actorId,
      event_type: action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      user_id: entityId, // Assuming the entity is often the user being acted upon, or we might need a separate field.
                         // But activity_log usually has actor_id and target (user_id/entity_id).
                         // The table has user_id and actor_id. Let's assume user_id is the target user if applicable.
                         // If entity_type is 'user', then user_id = entity_id.
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
    // Don't fail the main action just because logging failed, but ideally it should be robust.
  }
}
