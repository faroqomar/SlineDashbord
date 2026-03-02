import { createClient } from '@supabase/supabase-js';
import { failure, success, type ServiceResult } from '@sline/shared';

let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase credentials missing in environment');
    }
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  }
  return supabaseAdmin;
}

export interface AuthUser {
  id: string;
  email?: string;
  role: string;
}

/**
 * Extracts the JWT from either the Authorization header or the session cookie.
 */
export function extractToken(request: any): string | null {
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  if (request.cookies && request.cookies.sb_session) {
    return request.cookies.sb_session;
  }

  return null;
}

/**
 * Verifies a Supabase JWT by calling the Supabase Auth API.
 * This is a fallback since the JWKS endpoint is returning an empty key set.
 */
export async function verifyToken(token: string): Promise<ServiceResult<AuthUser>> {
  try {
    const { data: { user }, error } = await getSupabaseAdmin().auth.getUser(token);

    if (error || !user) {
      console.error('[Auth] Token verification failed:', error?.message);
      return failure('UNAUTHORIZED', 'Invalid or expired token', { detail: error?.message });
    }

    const { data: adminUser } = await getSupabaseAdmin()
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null };

    return success({
      id: user.id,
      email: user.email,
      role: adminUser?.role || (user.app_metadata?.role as string) || (user.role as string) || 'authenticated',
    });
  } catch (err: any) {
    console.error('[Auth] Unexpected verification error:', err.message);
    return failure('UNAUTHORIZED', 'Internal authentication error');
  }
}
