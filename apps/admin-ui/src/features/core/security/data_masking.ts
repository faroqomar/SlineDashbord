import 'server-only';
import { FinanceRole } from '@/features/finance/models/finance.model';

/**
 * Masks sensitive metadata fields based on the user's role.
 * support and moderator roles get masked metadata.
 * admin and super_admin roles get full metadata.
 */
export function maskMetaForRole(role: string, meta_full: any): any {
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
