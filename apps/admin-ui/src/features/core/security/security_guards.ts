import 'server-only';
import { createClient as createAuthClient } from '@/lib/supabase/server';
import { createAdminClient as supabaseAdmin } from '@/lib/supabase/admin';

export interface AuditLogPayload {
  action: string;
  actor_user_id: string; // The admin performing the action
  event_type?: string;
  journal_entry_id?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  meta?: any;
}

/**
 * Ensures the authenticated user is an admin and possesses one of the allowed roles.
 * Must be called at the start of every privileged Server Action.
 */
export async function requireAdminRole(allowedRoles: string[]) {
  const supabase = await createAuthClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized: No active session');
  }

  // Check the admin_users whitelist table which bypasses RLS using the admin client
  const adminDb = supabaseAdmin();
  const { data: adminUser, error: adminError } = await adminDb
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (adminError || !adminUser) {
    throw new Error('Unauthorized: Not an admin');
  }

  if (!allowedRoles.includes(adminUser.role)) {
    throw new Error(`Forbidden: Insufficient permissions. Required one of: ${allowedRoles.join(', ')}`);
  }

  return { userId: user.id, role: adminUser.role };
}

/**
 * Mutates data requires a rigid audit trail. Write to the `audit_logs` table using the Service Role.
 */
export async function logAuditEvent(payload: AuditLogPayload) {
  const adminClient = supabaseAdmin();
  const { error } = await adminClient.from('audit_logs').insert(payload);
  
  if (error) {
    console.error('Failed to write audit log:', error);
    // Strict adherence: if we can't log it, we shouldn't allow the action to complete silently.
    throw new Error(`Audit Log Failure: ${error.message}`);
  }
}

// Persistent Rate Limiting using database-backed RPC.
/**
 * Enforces rate limiting per user per action using a persistent database-backed bucket.
 * @param action The string identifier of the action (e.g., 'approve_withdrawal').
 * @param userId The UUID of the user.
 * @param limit Max requests allowed in the window.
 * @param windowMs Time window in milliseconds.
 */
export async function enforceRateLimit(action: string, userId: string, limit: number, windowMs: number) {
  const adminClient = supabaseAdmin();
  const key = `${action}:${userId}`;
  const windowSeconds = Math.max(1, Math.floor(windowMs / 1000));

  const { data: isAllowed, error } = await adminClient.rpc('check_rate_limit', {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds
  });

  if (error) {
    console.error('Rate limit check error:', error);
    // Be safe: if rate limiter fails, allow the request but log it.
    // Alternatively, for high-security, throw. Here we allow but log.
    return;
  }

  if (!isAllowed) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
}
