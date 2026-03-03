import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { registerTransactionRoutes } from './finance/transactions.js';
import { registerAuditRoutes } from './finance/audit.js';
import { registerFinanceUserRoutes } from './finance/users.js';
import { registerWithdrawalRoutes } from './finance/withdrawals.js';
import { registerWalletRoutes } from './finance/wallets.js';
import { registerApprovalRoutes } from './finance/approvals.js';

/**
 * PAGE 12 — Finance RBAC role matrix
 * - GET /finance/transactions (list): admin, super_admin
 * - GET /finance/transactions/:journalId: admin, super_admin; masked by default; reveal (meta_full) only admin/super_admin after audit insert
 * - GET /finance/audit, GET /finance/audit/export: admin, super_admin only
 * - GET /finance/users/:userId: admin, super_admin
 */
export default async function financeRoutes(fastify: FastifyInstance): Promise<void> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await registerTransactionRoutes(fastify, supabase);
  await registerAuditRoutes(fastify, supabase);
  await registerFinanceUserRoutes(fastify, supabase);
  await registerWithdrawalRoutes(fastify, supabase);
  await registerWalletRoutes(fastify, supabase);
  await registerApprovalRoutes(fastify, supabase);
}
