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
  AdminCasesListQuerySchema,
  AdminCasesAnalyticsQuerySchema,
  AdminCasesHeroSeriesSchema,
  type AdminCase,
  type AdminCaseDetail,
} from '@sline/shared';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DAY_MS = 24 * 60 * 60 * 1000;
const CASES_ANALYTICS_BUCKETS = 7;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

function toUtcDayStart(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), 0, 0, 0, 0));
}

function buildDailyBucketStarts(start: Date, days: number): string[] {
  return Array.from({ length: days }, (_, index) => new Date(start.getTime() + index * DAY_MS).toISOString());
}

function toBucketStartIso(value: unknown): string | null {
  if (typeof value !== 'string' && !(value instanceof Date)) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return toUtcDayStart(date).toISOString();
}

function countByBucket(bucketStarts: string[], values: unknown[]): Map<string, number> {
  const counts = new Map<string, number>(bucketStarts.map((bucketStart) => [bucketStart, 0]));
  const knownBuckets = new Set(bucketStarts);

  for (const value of values) {
    const bucketStart = toBucketStartIso(value);
    if (!bucketStart || !knownBuckets.has(bucketStart)) continue;
    counts.set(bucketStart, (counts.get(bucketStart) ?? 0) + 1);
  }

  return counts;
}

function toCaseCode(caseId: string): string {
  return `CAS-${caseId.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

function trendFromDelta(delta: number): 'up' | 'down' | 'neutral' {
  if (delta > 0) return 'up';
  if (delta < 0) return 'down';
  return 'neutral';
}

function deltaLabel(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

function classifyCaseStatus(raw: unknown): 'open' | 'in_progress' | 'escalated' {
  const status = String(raw ?? '').toLowerCase();
  if (status === 'in_progress') return 'in_progress';
  if (status === 'escalated') return 'escalated';
  return 'open';
}

function escapeIlike(input: string): string {
  return input.replace(/%/g, '\\%').replace(/_/g, '\\_').replace(/'/g, "''");
}

function buildStaleHeroSeries(bucketStarts: string[]) {
  const zeroSparkline = Array.from({ length: 7 }, () => 0);
  return {
    window: '7d' as const,
    opened: bucketStarts.map((bucketStart) => ({ bucket_start: bucketStart, value: 0 })),
    closed: bucketStarts.map((bucketStart) => ({ bucket_start: bucketStart, value: 0 })),
    kpis: [
      { id: 'total' as const, value: 0, delta: '0', trend: 'neutral' as const, sparkline: zeroSparkline },
      { id: 'open' as const, value: 0, delta: '0', trend: 'neutral' as const, sparkline: zeroSparkline },
      { id: 'in_progress' as const, value: 0, delta: '0', trend: 'neutral' as const, sparkline: zeroSparkline },
      { id: 'escalated' as const, value: 0, delta: '0', trend: 'neutral' as const, sparkline: zeroSparkline },
    ],
    is_stale: true,
    generated_at: new Date().toISOString(),
  };
}

export default async function casesRoutes(fastify: FastifyInstance) {
  const roles = [...CASES_ROLES];

  fastify.get('/', { preHandler: [requireAdminRole(roles)] }, async (request, reply) => {
    const parsedQuery = AdminCasesListQuerySchema.safeParse(request.query ?? {});
    if (!parsedQuery.success) {
      return reply.status(400).send(fail('VALIDATION_ERROR', parsedQuery.error.message));
    }

    const { page, limit, q, status, priority, source, sort } = parsedQuery.data;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let builder = supabase
      .from('admin_cases')
      .select('id, subject, source, status, priority, assignee_id, created_at, updated_at', {
        count: 'exact',
      });

    if (status !== 'all') {
      builder = builder.eq('status', status);
    }

    if (priority !== 'all') {
      if (priority === 'critical') {
        builder = builder.in('priority', ['critical', 'urgent']);
      } else {
        builder = builder.eq('priority', priority);
      }
    }

    if (source !== 'all') {
      builder = builder.eq('source', source);
    }

    if (q && q.trim().length > 0) {
      const qNormalized = q.trim();
      if (isUuid(qNormalized)) {
        builder = builder.eq('id', qNormalized);
      } else {
        const escaped = escapeIlike(qNormalized);
        builder = builder.or(`subject.ilike.%${escaped}%,source.ilike.%${escaped}%`);
      }
    }

    const ascending = sort === 'created_asc';
    const { data: cases, error, count } = await builder
      .range(from, to)
      .order('created_at', { ascending });

    if (error) return reply.status(500).send(fail('DATABASE_ERROR', error.message));

    const caseIds = (cases ?? []).map((row: any) => row.id).filter(Boolean) as string[];
    const assigneeIds = Array.from(
      new Set((cases ?? []).map((row: any) => row.assignee_id).filter(Boolean) as string[])
    );
    const assigneeMap = new Map<string, string>();
    const linksCountMap = new Map<string, number>();
    const tagsMap = new Map<string, string[]>();

    if (assigneeIds.length > 0) {
      const { data: assignees } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', assigneeIds);
      (assignees ?? []).forEach((a: any) => assigneeMap.set(a.id, a.full_name ?? a.id));
    }

    if (caseIds.length > 0) {
      const { data: entities } = await supabase
        .from('admin_case_entities')
        .select('case_id, entity_type')
        .in('case_id', caseIds);

      for (const entity of entities ?? []) {
        const caseId = entity.case_id as string | undefined;
        if (!caseId) continue;
        linksCountMap.set(caseId, (linksCountMap.get(caseId) ?? 0) + 1);

        const currentTags = tagsMap.get(caseId) ?? [];
        const nextTag = `#${String(entity.entity_type ?? '').toLowerCase()}`;
        if (nextTag !== '#' && !currentTags.includes(nextTag)) currentTags.push(nextTag);
        tagsMap.set(caseId, currentTags.slice(0, 3));
      }
    }

    const list = (cases ?? []).map((row) => ({
      id: row.id,
      subject: row.subject,
      source: row.source,
      status: row.status,
      priority: row.priority,
      case_code: toCaseCode(row.id),
      tags: tagsMap.get(row.id) ?? [],
      links_count: linksCountMap.get(row.id) ?? 0,
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

  fastify.get('/analytics', { preHandler: [requireAdminRole(roles)] }, async (request, reply) => {
    const parsedQuery = AdminCasesAnalyticsQuerySchema.safeParse(request.query ?? {});
    if (!parsedQuery.success) {
      return reply.status(400).send(fail('VALIDATION_ERROR', 'Invalid analytics query'));
    }

    const now = new Date();
    const todayUtcStart = toUtcDayStart(now);
    const startUtc = new Date(todayUtcStart.getTime() - (CASES_ANALYTICS_BUCKETS - 1) * DAY_MS);
    const previousStartUtc = new Date(startUtc.getTime() - CASES_ANALYTICS_BUCKETS * DAY_MS);
    const endUtcExclusive = new Date(todayUtcStart.getTime() + DAY_MS);
    const previousStartIso = previousStartUtc.toISOString();
    const startIso = startUtc.toISOString();
    const endIso = endUtcExclusive.toISOString();
    const bucketStarts = buildDailyBucketStarts(startUtc, CASES_ANALYTICS_BUCKETS);
    const previousBucketStarts = buildDailyBucketStarts(previousStartUtc, CASES_ANALYTICS_BUCKETS);

    const [openedRes, closedUpdatedRes, closedCreatedFallbackRes, trendRowsRes, totalCountRes, openCountRes, inProgressCountRes, escalatedCountRes] = await Promise.all([
      supabase
        .from('admin_cases')
        .select('created_at')
        .gte('created_at', startIso)
        .lt('created_at', endIso),
      supabase
        .from('admin_cases')
        .select('updated_at')
        .eq('status', 'closed')
        .gte('updated_at', startIso)
        .lt('updated_at', endIso),
      supabase
        .from('admin_cases')
        .select('created_at')
        .eq('status', 'closed')
        .is('updated_at', null)
        .gte('created_at', startIso)
        .lt('created_at', endIso),
      supabase
        .from('admin_cases')
        .select('created_at, status')
        .gte('created_at', previousStartIso)
        .lt('created_at', endIso),
      supabase.from('admin_cases').select('id', { count: 'exact', head: true }),
      supabase.from('admin_cases').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('admin_cases').select('id', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('admin_cases').select('id', { count: 'exact', head: true }).eq('status', 'escalated'),
    ]);

    if (
      openedRes.error ||
      closedUpdatedRes.error ||
      closedCreatedFallbackRes.error ||
      trendRowsRes.error ||
      totalCountRes.error ||
      openCountRes.error ||
      inProgressCountRes.error ||
      escalatedCountRes.error
    ) {
      fastify.log.warn(
        {
          route: '/api/v1/cases/analytics',
          openedQueryFailed: Boolean(openedRes.error),
          closedUpdatedQueryFailed: Boolean(closedUpdatedRes.error),
          closedCreatedFallbackQueryFailed: Boolean(closedCreatedFallbackRes.error),
          trendRowsQueryFailed: Boolean(trendRowsRes.error),
          totalCountQueryFailed: Boolean(totalCountRes.error),
          openCountQueryFailed: Boolean(openCountRes.error),
          inProgressCountQueryFailed: Boolean(inProgressCountRes.error),
          escalatedCountQueryFailed: Boolean(escalatedCountRes.error),
        },
        'Cases analytics query failed; returning stale fallback series'
      );
      const stalePayload = buildStaleHeroSeries(bucketStarts);
      return reply.send(success(stalePayload));
    }

    const openedCounts = countByBucket(
      bucketStarts,
      (openedRes.data ?? []).map((row: { created_at?: unknown }) => row.created_at)
    );
    const closedCounts = countByBucket(
      bucketStarts,
      [
        ...(closedUpdatedRes.data ?? []).map((row: { updated_at?: unknown }) => row.updated_at),
        ...(closedCreatedFallbackRes.data ?? []).map((row: { created_at?: unknown }) => row.created_at),
      ]
    );
    const currentIndexByBucket = new Map(bucketStarts.map((bucketStart, index) => [bucketStart, index]));
    const previousIndexByBucket = new Map(previousBucketStarts.map((bucketStart, index) => [bucketStart, index]));
    const currentSparkline = {
      total: Array.from({ length: 7 }, () => 0),
      open: Array.from({ length: 7 }, () => 0),
      in_progress: Array.from({ length: 7 }, () => 0),
      escalated: Array.from({ length: 7 }, () => 0),
    };
    const previousSparkline = {
      total: Array.from({ length: 7 }, () => 0),
      open: Array.from({ length: 7 }, () => 0),
      in_progress: Array.from({ length: 7 }, () => 0),
      escalated: Array.from({ length: 7 }, () => 0),
    };

    for (const row of trendRowsRes.data ?? []) {
      const bucketStart = toBucketStartIso((row as { created_at?: unknown }).created_at);
      if (!bucketStart) continue;
      const status = classifyCaseStatus((row as { status?: unknown }).status);
      const currentIndex = currentIndexByBucket.get(bucketStart);
      if (currentIndex != null) {
        currentSparkline.total[currentIndex] += 1;
        currentSparkline[status][currentIndex] += 1;
        continue;
      }

      const previousIndex = previousIndexByBucket.get(bucketStart);
      if (previousIndex != null) {
        previousSparkline.total[previousIndex] += 1;
        previousSparkline[status][previousIndex] += 1;
      }
    }

    const currentTotals = {
      total: currentSparkline.total.reduce((sum, value) => sum + value, 0),
      open: currentSparkline.open.reduce((sum, value) => sum + value, 0),
      in_progress: currentSparkline.in_progress.reduce((sum, value) => sum + value, 0),
      escalated: currentSparkline.escalated.reduce((sum, value) => sum + value, 0),
    };
    const previousTotals = {
      total: previousSparkline.total.reduce((sum, value) => sum + value, 0),
      open: previousSparkline.open.reduce((sum, value) => sum + value, 0),
      in_progress: previousSparkline.in_progress.reduce((sum, value) => sum + value, 0),
      escalated: previousSparkline.escalated.reduce((sum, value) => sum + value, 0),
    };
    const liveValues = {
      total: totalCountRes.count ?? 0,
      open: openCountRes.count ?? 0,
      in_progress: inProgressCountRes.count ?? 0,
      escalated: escalatedCountRes.count ?? 0,
    };

    const payload = {
      window: parsedQuery.data.window,
      opened: bucketStarts.map((bucketStart) => ({
        bucket_start: bucketStart,
        value: openedCounts.get(bucketStart) ?? 0,
      })),
      closed: bucketStarts.map((bucketStart) => ({
        bucket_start: bucketStart,
        value: closedCounts.get(bucketStart) ?? 0,
      })),
      kpis: [
        {
          id: 'total' as const,
          value: liveValues.total,
          delta: deltaLabel(currentTotals.total - previousTotals.total),
          trend: trendFromDelta(currentTotals.total - previousTotals.total),
          sparkline: currentSparkline.total,
        },
        {
          id: 'open' as const,
          value: liveValues.open,
          delta: deltaLabel(currentTotals.open - previousTotals.open),
          trend: trendFromDelta(currentTotals.open - previousTotals.open),
          sparkline: currentSparkline.open,
        },
        {
          id: 'in_progress' as const,
          value: liveValues.in_progress,
          delta: deltaLabel(currentTotals.in_progress - previousTotals.in_progress),
          trend: trendFromDelta(currentTotals.in_progress - previousTotals.in_progress),
          sparkline: currentSparkline.in_progress,
        },
        {
          id: 'escalated' as const,
          value: liveValues.escalated,
          delta: deltaLabel(currentTotals.escalated - previousTotals.escalated),
          trend: trendFromDelta(currentTotals.escalated - previousTotals.escalated),
          sparkline: currentSparkline.escalated,
        },
      ],
      is_stale: false,
      generated_at: now.toISOString(),
    };

    const validated = AdminCasesHeroSeriesSchema.safeParse(payload);
    if (!validated.success) {
      fastify.log.error({ err: validated.error }, 'Cases analytics response validation failed');
      return reply.status(500).send(fail('INTERNAL_ERROR', 'Failed to build cases analytics response'));
    }

    return reply.send(success(validated.data));
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
