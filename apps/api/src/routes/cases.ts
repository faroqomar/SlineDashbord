import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { requireAdminRole } from '../middleware/rbac.js';
import { withAudit, writeAuditLog } from '../audit.js';
import {
  failure as fail,
  success,
  CASES_ROLES,
  CASES_WRITE_ROLES,
  CASES_DESTRUCTIVE_ROLES,
  AdminCaseCreateInputSchema,
  AdminCaseAttachEntityInputSchema,
  AdminCaseAssignInputSchema,
  AdminCaseStatusInputSchema,
  AdminCaseNoteInputSchema,
  type AdminCase,
  type AdminCaseDetail,
} from '@sline/shared';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export default async function casesRoutes(fastify: FastifyInstance) {
  const roles = [...CASES_ROLES];

  fastify.get('/', { preHandler: [requireAdminRole(roles)] }, async (request, reply) => {
    const queryParams = request.query as { page?: string; limit?: string };
    const page = Math.max(1, parseInt(queryParams.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit || '10', 10)));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: cases, error, count } = await supabase
      .from('admin_cases')
      .select('id, subject, source, status, priority, assignee_id, created_at, updated_at', {
        count: 'exact',
      })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) return reply.status(500).send(fail('DATABASE_ERROR', error.message));

    const assigneeIds = Array.from(
      new Set((cases ?? []).map((row: any) => row.assignee_id).filter(Boolean) as string[])
    );
    const assigneeMap = new Map<string, string>();
    if (assigneeIds.length > 0) {
      const { data: assignees } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', assigneeIds);
      (assignees ?? []).forEach((a: any) => assigneeMap.set(a.id, a.full_name ?? a.id));
    }

    const list = (cases ?? []).map((row) => ({
      id: row.id,
      subject: row.subject,
      source: row.source,
      status: row.status,
      priority: row.priority,
      assignee_id: row.assignee_id ?? null,
      assignee_name: row.assignee_id ? assigneeMap.get(row.assignee_id) ?? null : null,
      created_at:
        typeof row.created_at === 'string'
          ? row.created_at
          : (row.created_at as Date)?.toISOString?.() ?? '',
      updated_at:
        row.updated_at != null
          ? typeof row.updated_at === 'string'
            ? row.updated_at
            : (row.updated_at as Date)?.toISOString?.()
          : undefined,
    }));

    const total = count ?? list.length;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
    return success({
      cases: list,
      total,
      page,
      limit,
      totalPages,
    });
  });

  fastify.get('/:caseId', { preHandler: [requireAdminRole(roles)] }, async (request, reply) => {
    const { caseId } = request.params as { caseId: string };
    if (!isUuid(caseId))
      return reply.status(400).send(fail('VALIDATION_ERROR', 'Invalid case ID format'));

    const { data: caseRow, error: caseError } = await supabase
      .from('admin_cases')
      .select('id, subject, source, status, priority, assignee_id, created_at, updated_at')
      .eq('id', caseId)
      .single();

    if (caseError || !caseRow)
      return reply.status(404).send(fail('NOT_FOUND', 'Case not found'));

    let { data: entities, error: entitiesError } = await supabase
      .from('admin_case_entities')
      .select('id, case_id, entity_type, entity_id, created_at, meta')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (entitiesError && entitiesError.message.includes('meta')) {
      const fallback = await supabase
        .from('admin_case_entities')
        .select('id, case_id, entity_type, entity_id, created_at')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });
      entities = fallback.data as any;
      entitiesError = fallback.error;
    }

    if (entitiesError) return reply.status(500).send(fail('DATABASE_ERROR', entitiesError.message));

    const reportEntityIds = (entities ?? [])
      .filter((e: any) => e.entity_type === 'report')
      .map((e: any) => e.entity_id);

    let evidence: AdminCaseDetail['evidence'] = [];
    if (reportEntityIds.length > 0) {
      const { data: reportEvidence } = await supabase
        .from('reports')
        .select('id, entity_type, entity_id, status, severity, reason, created_at')
        .in('id', reportEntityIds);

      evidence = (reportEvidence ?? []).map((r: any) => ({
        id: r.id,
        case_id: caseId,
        evidence_type: 'report',
        entity_type: 'report',
        entity_id: r.id,
        title: r.reason ?? `Report ${String(r.id).slice(0, 8)}`,
        created_at: r.created_at,
        meta: {
          reported_entity_type: r.entity_type,
          reported_entity_id: r.entity_id,
          status: r.status,
          severity: r.severity ?? null,
        },
      })) as AdminCaseDetail['evidence'];
    }

    const { data: notesData, error: notesError } = await supabase
      .from('admin_case_notes')
      .select('id, case_id, admin_user_id, note, visibility, created_at, updated_at')
      .eq('case_id', caseId)
      .order('created_at', { ascending: true });

    const notes = notesError ? [] : (notesData ?? []);

    const { data: timelineData, error: timelineError } = await supabase
      .from('admin_case_timeline')
      .select('id, case_id, event, actor_user_id, reason, meta, created_at')
      .eq('case_id', caseId)
      .order('created_at', { ascending: true });

    const timeline = timelineError ? [] : (timelineData ?? []);

    const detail: AdminCaseDetail = {
      id: caseRow.id,
      subject: caseRow.subject,
      source: caseRow.source,
      status: caseRow.status,
      priority: caseRow.priority,
      assignee_id: caseRow.assignee_id ?? null,
      created_at:
        typeof caseRow.created_at === 'string'
          ? caseRow.created_at
          : (caseRow.created_at as Date)?.toISOString?.() ?? '',
      updated_at:
        caseRow.updated_at != null
          ? typeof caseRow.updated_at === 'string'
            ? caseRow.updated_at
            : (caseRow.updated_at as Date)?.toISOString?.()
          : undefined,
      entities: (entities ?? []).map((e) => ({
        id: e.id,
        case_id: e.case_id,
        entity_type: e.entity_type,
        entity_id: e.entity_id,
        created_at:
          typeof e.created_at === 'string'
            ? e.created_at
            : (e.created_at as Date)?.toISOString?.() ?? '',
        meta: e.meta ?? {},
      })),
      evidence,
      notes,
      timeline,
    };

    return success(detail);
  });

  fastify.post('/', { preHandler: [requireAdminRole(roles)] }, async (request, reply) => {
    const parsed = AdminCaseCreateInputSchema.safeParse(request.body);
    if (!parsed.success)
      return reply.status(400).send(fail('VALIDATION_ERROR', parsed.error.message));

    const { subject, source, priority, assignee_id } = parsed.data;

    const { data: inserted, error } = await supabase
      .from('admin_cases')
      .insert({
        subject,
        source,
        priority,
        assignee_id: assignee_id ?? null,
        status: 'open',
      })
      .select('id, subject, source, status, priority, assignee_id, created_at, updated_at')
      .single();

    if (error) return reply.status(500).send(fail('DATABASE_ERROR', error.message));
    if (!inserted) return reply.status(500).send(fail('DATABASE_ERROR', 'Insert did not return row'));

    await writeAuditLog(request, 'admin.case.create', 'admin_case', inserted.id);

    const payload: AdminCase = {
      id: inserted.id,
      subject: inserted.subject,
      source: inserted.source,
      status: inserted.status,
      priority: inserted.priority,
      assignee_id: inserted.assignee_id ?? null,
      created_at:
        typeof inserted.created_at === 'string'
          ? inserted.created_at
          : (inserted.created_at as Date)?.toISOString?.() ?? '',
      updated_at:
        inserted.updated_at != null
          ? typeof inserted.updated_at === 'string'
            ? inserted.updated_at
            : (inserted.updated_at as Date)?.toISOString?.()
          : undefined,
    };

    return reply.status(201).send(success(payload));
  });

  fastify.post(
    '/:caseId/entities',
    { preHandler: [requireAdminRole(CASES_WRITE_ROLES)] },
    async (request, reply) => {
      const { caseId } = request.params as { caseId: string };
      if (!isUuid(caseId))
        return reply.status(400).send(fail('VALIDATION_ERROR', 'Invalid case ID format'));
      const parsed = AdminCaseAttachEntityInputSchema.safeParse(request.body);
      if (!parsed.success)
        return reply.status(400).send(fail('VALIDATION_ERROR', parsed.error.message));

      const { data: caseRow, error: caseError } = await supabase
        .from('admin_cases')
        .select('id')
        .eq('id', caseId)
        .single();

      if (caseError || !caseRow)
        return reply.status(404).send(fail('NOT_FOUND', 'Case not found'));

      const { entity_type, entity_id } = parsed.data;

      return withAudit(request, 'admin.case.attach_entity', 'admin_case', caseId, async () => {
        const { data: inserted, error } = await supabase
          .from('admin_case_entities')
          .insert({ case_id: caseId, entity_type, entity_id })
          .select('id')
          .single();

        if (error) {
          if (error.code === '23505') return reply.status(409).send(fail('CONFLICT', 'Entity already attached to this case'));
          return reply.status(500).send(fail('DATABASE_ERROR', error.message));
        }
        if (!inserted) return reply.status(500).send(fail('DATABASE_ERROR', 'Insert did not return row'));

        return success({ id: inserted.id });
      });
    }
  );

  fastify.post(
    '/:caseId/assign',
    { preHandler: [requireAdminRole(CASES_WRITE_ROLES)] },
    async (request, reply) => {
      const { caseId } = request.params as { caseId: string };
      if (!isUuid(caseId)) {
        return reply.status(400).send(fail('VALIDATION_ERROR', 'Invalid case ID format'));
      }

      const parsed = AdminCaseAssignInputSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send(fail('VALIDATION_ERROR', parsed.error.message));
      }

      const adminId = (request as any).user?.id as string | undefined;
      if (!adminId) return reply.status(401).send(fail('UNAUTHORIZED', 'Not authenticated'));

      const { error } = await supabase.rpc('admin_case_assign', {
        p_case_id: caseId,
        p_admin_id: adminId,
        p_assignee_id: parsed.data.assignee_id,
        p_reason: parsed.data.reason,
      });

      if (error) {
        if (error.message?.includes('not found')) return reply.status(404).send(fail('NOT_FOUND', error.message));
        if (error.message?.includes('Invalid')) return reply.status(400).send(fail('VALIDATION_ERROR', error.message));
        return reply.status(500).send(fail('DATABASE_ERROR', error.message));
      }

      return reply.send(success({ id: caseId, assignee_id: parsed.data.assignee_id }));
    }
  );

  fastify.post(
    '/:caseId/status',
    { preHandler: [requireAdminRole(CASES_WRITE_ROLES)] },
    async (request, reply) => {
      const { caseId } = request.params as { caseId: string };
      if (!isUuid(caseId)) {
        return reply.status(400).send(fail('VALIDATION_ERROR', 'Invalid case ID format'));
      }

      const parsed = AdminCaseStatusInputSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send(fail('VALIDATION_ERROR', parsed.error.message));
      }

      const adminId = (request as any).user?.id as string | undefined;
      if (!adminId) return reply.status(401).send(fail('UNAUTHORIZED', 'Not authenticated'));

      const { error } = await supabase.rpc('admin_case_update_status', {
        p_case_id: caseId,
        p_admin_id: adminId,
        p_status: parsed.data.status,
        p_reason: parsed.data.reason,
      });

      if (error) {
        if (error.message?.includes('not found')) return reply.status(404).send(fail('NOT_FOUND', error.message));
        if (error.message?.includes('Invalid')) return reply.status(400).send(fail('VALIDATION_ERROR', error.message));
        return reply.status(500).send(fail('DATABASE_ERROR', error.message));
      }

      return reply.send(success({ id: caseId, status: parsed.data.status }));
    }
  );

  fastify.post(
    '/:caseId/note',
    { preHandler: [requireAdminRole(CASES_DESTRUCTIVE_ROLES)] },
    async (request, reply) => {
      const { caseId } = request.params as { caseId: string };
      if (!isUuid(caseId)) {
        return reply.status(400).send(fail('VALIDATION_ERROR', 'Invalid case ID format'));
      }

      const parsed = AdminCaseNoteInputSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send(fail('VALIDATION_ERROR', parsed.error.message));
      }

      const adminId = (request as any).user?.id as string | undefined;
      if (!adminId) return reply.status(401).send(fail('UNAUTHORIZED', 'Not authenticated'));

      const { data: noteId, error } = await supabase.rpc('admin_case_add_note', {
        p_case_id: caseId,
        p_admin_id: adminId,
        p_note: parsed.data.note,
        p_visibility: parsed.data.visibility,
      });

      if (error) {
        if (error.message?.includes('not found')) return reply.status(404).send(fail('NOT_FOUND', error.message));
        if (error.message?.includes('Invalid') || error.message?.includes('required')) return reply.status(400).send(fail('VALIDATION_ERROR', error.message));
        return reply.status(500).send(fail('DATABASE_ERROR', error.message));
      }

      return reply.status(201).send(success({ id: caseId, note_id: noteId }));
    }
  );
}
