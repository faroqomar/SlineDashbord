import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { requireAdminRole } from '../middleware/rbac.js';
import { withAudit, writeAuditLog } from '../audit.js';
import {
  failure as fail,
  success,
  CASES_ROLES,
  AdminCaseCreateInputSchema,
  AdminCaseAttachEntityInputSchema,
  type AdminCase,
  type AdminCaseDetail,
} from '@sline/shared';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    const list = (cases ?? []).map((row) => ({
      id: row.id,
      subject: row.subject,
      source: row.source,
      status: row.status,
      priority: row.priority,
      assignee_id: row.assignee_id ?? null,
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

  const uuidSchema = { uuid: (x: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x) };
  fastify.get('/:caseId', { preHandler: [requireAdminRole(roles)] }, async (request, reply) => {
    const { caseId } = request.params as { caseId: string };
    if (!uuidSchema.uuid(caseId))
      return reply.status(400).send(fail('VALIDATION_ERROR', 'Invalid case ID format'));

    const { data: caseRow, error: caseError } = await supabase
      .from('admin_cases')
      .select('id, subject, source, status, priority, assignee_id, created_at, updated_at')
      .eq('id', caseId)
      .single();

    if (caseError || !caseRow)
      return reply.status(404).send(fail('NOT_FOUND', 'Case not found'));

    const { data: entities, error: entitiesError } = await supabase
      .from('admin_case_entities')
      .select('id, case_id, entity_type, entity_id, created_at')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (entitiesError) return reply.status(500).send(fail('DATABASE_ERROR', entitiesError.message));

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
      })),
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
    { preHandler: [requireAdminRole(roles)] },
    async (request, reply) => {
      const { caseId } = request.params as { caseId: string };
      if (!uuidSchema.uuid(caseId))
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
}
