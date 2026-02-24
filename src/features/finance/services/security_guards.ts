import 'server-only';

import { createClient as supabaseServer } from '@/lib/supabase/server';
import { createAdminClient as supabaseAdmin } from '@/lib/supabase/admin';
import { FinanceRole } from '../models/finance.model';
import { Json } from '@/types/supabase';

/**
 * Ensures the currently authenticated user has one of the allowed admin roles.
 * Returns the user's ID and verified role.
 * Throws an error if not authenticated or not authorized.
 */
export async function requireAdminRole(allowedRoles: FinanceRole[]): Promise<{ userId: string; role: FinanceRole }> {
  const supabase = await supabaseServer();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized: Authentication required.');
  }

  // Check admin_users table for the user's role
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (adminError || !adminUser) {
    throw new Error('Forbidden: Not an admin user.');
  }

  const role = adminUser.role as FinanceRole;
  
  if (!allowedRoles.includes(role)) {
    throw new Error(`Forbidden: Insufficient permissions. Required one of: ${allowedRoles.join(', ')}`);
  }

  return { userId: user.id, role };
}

/**
 * Masks sensitive metadata fields based on the user's role.
 * support and moderator roles get masked metadata.
 * admin and super_admin roles get full metadata.
 */
export function maskMetaForRole(role: FinanceRole, meta_full: any): any {
  if (!meta_full) return null;

  if (role === 'admin' || role === 'super_admin') {
    return meta_full;
  }

  // Define what fields should remain in the masked version
  // This is a basic masking logic, extracting non-sensitive parts
  const masked: any = {};
  
  if (typeof meta_full === 'object') {
    // Keep identifiers and safe enum flags
    if (meta_full.payment_method) masked.payment_method = meta_full.payment_method;
    if (meta_full.gateway_transaction_id) masked.gateway_transaction_id = '***' + String(meta_full.gateway_transaction_id).slice(-4);
    if (meta_full.booking_id) masked.booking_id = meta_full.booking_id;
    if (meta_full.task_request_id) masked.task_request_id = meta_full.task_request_id;
    // Do NOT include things like raw response payloads, full names, emails if present in meta
  }

  return masked;
}

/**
 * Logs an administrative or financial action to the unified audit_logs table.
 */
export async function logAuditEvent(params: {
  action: string;
  actor_user_id: string;
  event_type?: string;
  journal_entry_id?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  meta: Json;
}) {
  const adminClient = supabaseAdmin();
  
  const { error } = await adminClient.from('audit_logs').insert({
    action: params.action,
    actor_user_id: params.actor_user_id,
    event_type: params.event_type || null,
    journal_entry_id: params.journal_entry_id || null,
    related_entity_type: params.related_entity_type || null,
    related_entity_id: params.related_entity_id || null,
    meta: params.meta,
  });

  if (error) {
    console.error('Failed to insert audit log:', error);
    // Depending on strictness, we might want to throw here so the transaction fails if audit fails.
    // For robust financial systems, throw is usually better.
    throw new Error(`Audit log insertion failed: ${error.message}`);
  }
}

// Simple in-memory rate limiter for MVP (works per Node instance)
const rateLimitCache = new Map<string, { count: number, resetTime: number }>();

export function enforceRateLimit(actionName: string, userId: string, maxRequests: number = 10, windowMs: number = 60000) {
  const key = `${actionName}:${userId}`;
  const now = Date.now();
  
  const record = rateLimitCache.get(key) || { count: 0, resetTime: now + windowMs };
  
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }
  
  record.count++;
  rateLimitCache.set(key, record);
  
  if (record.count > maxRequests) {
    throw new Error(`Rate limit exceeded for ${actionName}. Please try again later.`);
    // In production with multiple instances, use Redis (e.g., Upstash) or Supabase RPC for centralized tracking.
  }
}
