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

// Basic in-memory rate limiter using a sliding window approach. 
// NOTE: Since Server Actions run in a serverless environment (Vercel), memory may reset on cold starts.
// For true production rigidness, Upstash Redis is recommended.
const rateLimitCache = new Map<string, number[]>();

/**
 * Enforces rate limiting per user per action.
 * @param action The string identifier of the action (e.g., 'approve_withdrawal').
 * @param userId The UUID of the user.
 * @param limit Max requests allowed.
 * @param windowMs Time window in milliseconds.
 */
export function enforceRateLimit(action: string, userId: string, limit: number, windowMs: number) {
  const now = Date.now();
  const key = `${action}:${userId}`;
  
  const timestamps = rateLimitCache.get(key) || [];
  
  // Filter out timestamps outside the sliding window
  const validTimestamps = timestamps.filter(t => now - t < windowMs);
  
  if (validTimestamps.length >= limit) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  validTimestamps.push(now);
  rateLimitCache.set(key, validTimestamps);
}
