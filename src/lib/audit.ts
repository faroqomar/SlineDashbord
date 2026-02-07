import { createAdminClient } from '@/lib/supabase/admin';

export type AuditActionType =
  | 'user_banned'
  | 'user_unbanned'
  | 'user_verified'
  | 'dispute_resolved'
  | 'refund_processed'
  | 'system_update';

export type AuditEntityType = 'user' | 'dispute' | 'transaction' | 'system';

/**
 * Logs an administrative action to the database.
 * This checks for the Supabase Service Role Key and will throw if not present.
 *
 * @param adminId - The ID of the admin performing the action (usually the current user).
 * @param action - The type of action being performed.
 * @param entityId - The ID of the object being acted upon (user ID, dispute ID, etc.).
 * @param entityType - The type of object (user, dispute, etc.).
 * @param metadata - Any additional details about the action (reason, amount, etc.).
 */
export async function logAdminAction(
  adminId: string,
  action: AuditActionType,
  entityId: string,
  entityType: AuditEntityType,
  metadata: Record<string, any> = {}
) {
  const supabase = await createAdminClient();

  // "activity_log" columns based on src/types/supabase.ts:
  // actor_id: string
  // user_id: string (who is this about? usually the target entity if it's a user, or the admin if not)
  // entity_id: string
  // entity_type: string
  // event_type: string
  // metadata: Json
  
  // For admin logs:
  // actor_id = adminId
  // user_id = entityId (if entity is user) OR adminId (if entity is system/dispute) - this depends on how we want to query "user history". 
  // Let's assume user_id is the "Target User" if applicable, otherwise fallback to adminId or a system ID.
  
  const targetUserId = entityType === 'user' ? entityId : adminId;

  const { error } = await supabase.from('activity_log').insert({
    actor_id: adminId,
    user_id: targetUserId,
    entity_id: entityId,
    entity_type: entityType,
    event_type: action,
    metadata: metadata,
    is_read: false, 
  });

  if (error) {
    console.error('CRITICAL: Failed to log admin action:', error);
    // In a strict financial system, we might want to throw here to prevent the action from succeeding without a log.
    throw new Error(`Audit Logging Failed: ${error.message}`);
  }

  return true;
}
