import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import {
  ListReportsQuerySchema,
  TriageReportInputSchema,
  CloseReportInputSchema,
  REPORTS_READ_ROLES,
  REPORTS_WRITE_ROLES,
  failure,
  success,
  type ReportListItem,
  type ReportDetail,
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function reportsRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/v1/reports — list reports (filter by status, entity_type)
   */
  fastify.get('/', { preHandler: [requireAdminRole(REPORTS_READ_ROLES)] }, async (request, reply) => {
    const query = request.query as Record<string, unknown>;
    const validation = ListReportsQuerySchema.safeParse(query);
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid query', validation.error.format()));
    }
    const { status, entity_type, page, limit } = validation.data;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let builder = supabase
      .from('reports')
      .select('id, reporter_user_id, entity_type, entity_id, reason, category, status, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (status) builder = builder.eq('status', status);
    if (entity_type) builder = builder.eq('entity_type', entity_type);

    const { data: rows, error, count } = await builder;
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));

    const list: ReportListItem[] = (rows || []).map((r: any) => ({
      id: r.id,
      reporter_user_id: r.reporter_user_id,
      entity_type: r.entity_type,
      entity_id: r.entity_id,
      reason: r.reason ?? null,
      category: r.category ?? null,
      status: r.status,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));

    return reply.send(success({ reports: list, total: count ?? 0, page, limit }));
  });

  /**
   * GET /api/v1/reports/:reportId — single report detail + report_actions
   */
  fastify.get('/:reportId', { preHandler: [requireAdminRole(REPORTS_READ_ROLES)] }, async (request, reply) => {
    const { reportId } = request.params as { reportId: string };
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reportId)) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid report ID'));
    }

    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
      return reply.status(404).send(failure('NOT_FOUND', 'Report not found'));
    }

    const { data: actions, error: actionsError } = await supabase
      .from('report_actions')
      .select('id, report_id, admin_user_id, action, reason, created_at')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });

    if (actionsError) return reply.status(500).send(failure('DATABASE_ERROR', actionsError.message));

    const detail: ReportDetail = {
      id: report.id,
      reporter_user_id: report.reporter_user_id,
      entity_type: report.entity_type,
      entity_id: report.entity_id,
      reason: report.reason ?? null,
      category: report.category ?? null,
      status: report.status,
      created_at: report.created_at,
      updated_at: report.updated_at,
      meta: report.meta ?? null,
      actions: (actions || []).map((a: any) => ({
        id: a.id,
        report_id: a.report_id,
        admin_user_id: a.admin_user_id,
        action: a.action,
        reason: a.reason ?? null,
        created_at: a.created_at,
      })),
    };

    return reply.send(success(detail));
  });

  /**
   * POST /api/v1/reports/:reportId/triage — triage (RPC writes audit atomically)
   */
  fastify.post('/:reportId/triage', { preHandler: [requireAdminRole(REPORTS_WRITE_ROLES)] }, async (request, reply) => {
    const { reportId } = request.params as { reportId: string };
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reportId)) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid report ID'));
    }

    const body = request.body as unknown;
    const validation = TriageReportInputSchema.safeParse(body);
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
    }

    const adminId = (request as any).user?.id;
    if (!adminId) return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));

    const { error } = await supabase.rpc('admin_triage_report', {
      p_report_id: reportId,
      p_action: validation.data.action,
      p_admin_id: adminId,
      p_reason: validation.data.reason,
    });

    if (error) {
      if (error.message?.includes('not found')) return reply.status(404).send(failure('NOT_FOUND', error.message));
      if (error.message?.includes('already closed')) return reply.status(409).send(failure('CONFLICT', error.message));
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }

    return reply.send(success({ id: reportId }));
  });

  /**
   * POST /api/v1/reports/:reportId/close — close report (RPC writes audit atomically)
   */
  fastify.post('/:reportId/close', { preHandler: [requireAdminRole(REPORTS_WRITE_ROLES)] }, async (request, reply) => {
    const { reportId } = request.params as { reportId: string };
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reportId)) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid report ID'));
    }

    const body = request.body as unknown;
    const validation = CloseReportInputSchema.safeParse(body);
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
    }

    const adminId = (request as any).user?.id;
    if (!adminId) return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));

    const { error } = await supabase.rpc('admin_close_report', {
      p_report_id: reportId,
      p_admin_id: adminId,
      p_reason: validation.data.reason,
    });

    if (error) {
      if (error.message?.includes('not found')) return reply.status(404).send(failure('NOT_FOUND', error.message));
      if (error.message?.includes('already closed')) return reply.status(409).send(failure('CONFLICT', error.message));
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }

    return reply.send(success({ id: reportId }));
  });
}
