import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import {
  failure,
  LogExportQuerySchema,
  LogListQuerySchema,
  LogListResponseSchema,
  LOGS_READ_ROLES,
  success,
  type LogExportQuery,
  type LogLevel,
  type LogListItem,
  type LogListQuery,
  type LogSummary,
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LOGS_EXPORT_ROLES = ['admin', 'super_admin'] as const;
const KNOWN_SOURCE_OPTIONS = [
  'admin-access',
  'api-gateway',
  'auth-service',
  'booking-service',
  'case-manager',
  'chat-gateway',
  'control-room',
  'cron-scheduler',
  'export-worker',
  'file-storage',
  'finance-ledger',
  'notification-service',
  'payment-engine',
  'rate-limiter',
  'reports-hub',
  'search-index',
  'security-guard',
  'task-queue',
  'user-admin',
  'wallet-ops',
] as const;

type AuditLogRow = {
  id: string;
  action: string | null;
  actor_user_id: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  created_at: string | null;
  meta: unknown;
};

type QueryFilters = Pick<LogListQuery, 'action' | 'actorUserId' | 'from' | 'to'>;
type DerivedFilters = Pick<LogListQuery, 'q' | 'level' | 'source'>;
type StatsItem = { createdAt: string; level: LogLevel; source: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function asMeta(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function firstString(meta: Record<string, unknown> | undefined, keys: string[]): string | null {
  if (!meta) return null;

  for (const key of keys) {
    const value = meta[key];
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  }

  return null;
}

function humanizeToken(token: string): string {
  return token
    .replace(/[._-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeLevel(value: unknown): LogLevel | null {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'warn') return 'warning';
  if (normalized === 'crit') return 'critical';

  if (
    normalized === 'critical' ||
    normalized === 'error' ||
    normalized === 'warning' ||
    normalized === 'info' ||
    normalized === 'debug'
  ) {
    return normalized;
  }

  return null;
}

function deriveLevel(action: string, meta: Record<string, unknown> | undefined): LogLevel {
  const explicit = normalizeLevel(meta?.level ?? meta?.severity ?? meta?.status);
  if (explicit) return explicit;

  const normalized = action.toLowerCase();
  if (
    /admin\.pii\.reveal|admin\.team\.remove_member|admin\.finance\.wallet_freeze|admin\.tasks\.force_cancel|user_ban|user_suspend/.test(
      normalized
    )
  ) {
    return 'critical';
  }
  if (/(fail|error|reject|deny|blocked|forbid)/.test(normalized)) return 'error';
  if (/(warn|pending|retry|approval\.request|degrad)/.test(normalized)) return 'warning';
  if (/(investigation_view|export|view_sensitive_meta)/.test(normalized)) return 'debug';
  return 'info';
}

function deriveSource(
  action: string,
  entityType: string | null,
  meta: Record<string, unknown> | undefined
): string {
  const explicit = firstString(meta, ['source', 'service', 'component', 'module']);
  if (explicit) return explicit;

  const normalized = action.toLowerCase();
  if (normalized.startsWith('admin.team.')) return 'admin-access';
  if (normalized.startsWith('admin.export.')) return 'export-worker';
  if (normalized.startsWith('admin.chat.')) return 'chat-gateway';
  if (normalized.startsWith('admin.case.')) return 'case-manager';
  if (normalized.startsWith('admin.report.')) return 'reports-hub';
  if (normalized.startsWith('admin.tasks.')) return 'task-queue';
  if (normalized.startsWith('admin.finance.wallet')) return 'wallet-ops';
  if (normalized.startsWith('admin.finance.')) return 'finance-ledger';
  if (normalized.startsWith('admin.users.')) return 'user-admin';
  if (normalized.startsWith('admin.pii.')) return 'security-guard';

  switch (entityType) {
    case 'booking':
      return 'booking-service';
    case 'task':
    case 'task_request':
      return 'task-queue';
    case 'profile':
    case 'admin_user':
      return 'user-admin';
    case 'admin_case':
    case 'case':
      return 'case-manager';
    case 'journal_entry':
      return 'finance-ledger';
    case 'report':
      return 'reports-hub';
    default:
      return 'control-room';
  }
}

function buildLogMessage(action: string, entityType: string | null): string {
  if (action === 'admin.team.invite') {
    return 'Sent an admin team invitation';
  }

  if (action === 'admin.export.evidence_pack') {
    return 'Generated an evidence-pack export';
  }

  if (action === 'admin.users.investigation_view') {
    return 'Opened the user investigation workspace';
  }

  if (action === 'admin.pii.reveal') {
    return 'Revealed masked identity fields for a profile';
  }

  if (action === 'admin.finance.wallet_freeze') {
    return 'Applied an administrative wallet freeze';
  }

  if (action === 'admin.finance.wallet_unfreeze') {
    return 'Removed an administrative wallet freeze';
  }

  if (action === 'admin.tasks.force_cancel') {
    return 'Force canceled a task and triggered settlement checks';
  }

  if (action.startsWith('admin.tasks.update_status.')) {
    const status = action.split('.').pop();
    return `Updated task status to ${humanizeToken(status ?? 'unknown')}`;
  }

  const entityLabel = entityType ? ` for ${humanizeToken(entityType)}` : '';
  return `${humanizeToken(action)}${entityLabel}`;
}

function buildEventCode(
  id: string,
  meta: Record<string, unknown> | undefined
): { eventCode: string | null; requestId: string | null } {
  const requestId = firstString(meta, [
    'request_id',
    'requestId',
    'gateway_request_id',
    'psp_request_id',
  ]);
  const explicitCode = firstString(meta, ['status_code', 'http_status', 'code', 'error_code']);

  if (explicitCode) {
    return { eventCode: explicitCode.toUpperCase().slice(0, 12), requestId };
  }

  if (requestId) {
    return {
      eventCode: requestId.replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase(),
      requestId,
    };
  }

  return {
    eventCode: id.replace(/-/g, '').slice(0, 6).toUpperCase(),
    requestId: null,
  };
}

function buildHref(entityType: string | null, entityId: string | null): string | null {
  if (!entityId) return null;

  switch (entityType) {
    case 'task':
      return `/tasks/${entityId}`;
    case 'booking':
      return `/bookings/${entityId}`;
    case 'profile':
    case 'admin_user':
      return `/users/${entityId}`;
    case 'admin_case':
    case 'case':
      return `/cases/${entityId}`;
    case 'journal_entry':
      return `/finance/transactions/${entityId}`;
    case 'dispute':
      return `/disputes/${entityId}`;
    default:
      return null;
  }
}

function sanitizeMeta(meta: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!meta) return undefined;

  const safeKeys = [
    'request_id',
    'requestId',
    'gateway_request_id',
    'psp_request_id',
    'status_code',
    'http_status',
    'code',
    'error_code',
    'source',
    'service',
    'component',
    'module',
    'viewed_at',
    'rowCount',
    'row_count',
  ] as const;

  const sanitizedEntries = safeKeys
    .map((key) => [key, meta[key]] as const)
    .filter((entry) => entry[1] != null);

  if (sanitizedEntries.length === 0) return undefined;
  return Object.fromEntries(sanitizedEntries);
}

function buildSummary(items: StatsItem[]): LogSummary {
  return items.reduce<LogSummary>(
    (summary, item) => {
      summary.total += 1;
      summary[item.level] += 1;
      return summary;
    },
    {
      total: 0,
      critical: 0,
      error: 0,
      warning: 0,
      info: 0,
      debug: 0,
    }
  );
}

function buildHourlyBuckets(items: StatsItem[]) {
  const now = new Date();
  const buckets = Array.from({ length: 8 }, (_, offset) => {
    const bucketDate = new Date(now);
    bucketDate.setMinutes(0, 0, 0);
    bucketDate.setHours(bucketDate.getHours() - (7 - offset));
    const label = bucketDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      hour12: false,
    });

    return {
      key: `${bucketDate.getFullYear()}-${bucketDate.getMonth()}-${bucketDate.getDate()}-${bucketDate.getHours()}`,
      label: `${label}:00`,
      critical: 0,
      error: 0,
      warning: 0,
      info: 0,
      debug: 0,
    };
  });

  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const item of items) {
    const date = new Date(item.createdAt);
    if (Number.isNaN(date.valueOf())) continue;

    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
    const bucket = bucketMap.get(key);
    if (bucket) bucket[item.level] += 1;
  }

  return buckets.map(({ key: _key, ...bucket }) => bucket);
}

function getSourceOptions(items: StatsItem[]): string[] {
  return Array.from(new Set([...KNOWN_SOURCE_OPTIONS, ...items.map((item) => item.source)])).sort(
    (left, right) => left.localeCompare(right)
  );
}

function matchesSearch(item: LogListItem, search: string): boolean {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return true;

  return [
    item.id,
    item.action,
    item.actorName ?? '',
    item.actorUserId ?? '',
    item.entityType ?? '',
    item.entityId ?? '',
    item.source,
    item.message,
    item.eventCode ?? '',
    item.requestId ?? '',
  ].some((value) => value.toLowerCase().includes(normalized));
}

function applyBaseFilters(query: any, filters: QueryFilters) {
  if (filters.action) query = query.ilike('action', `%${filters.action}%`);
  if (filters.actorUserId) query = query.eq('actor_user_id', filters.actorUserId);
  if (filters.from) query = query.gte('created_at', filters.from);
  if (filters.to) query = query.lte('created_at', filters.to);
  return query;
}

function createAuditQuery(
  filters: QueryFilters,
  options: {
    ordered?: boolean;
    sort?: LogListQuery['sort'];
    count?: 'exact';
  } = {}
) {
  const ordered = options.ordered !== false;
  const sort = options.sort ?? 'newest';

  let query: any = options.count
    ? supabase
        .from('audit_logs')
        .select(
          'id, action, actor_user_id, related_entity_type, related_entity_id, created_at, meta',
          { count: options.count }
        )
    : supabase
        .from('audit_logs')
        .select('id, action, actor_user_id, related_entity_type, related_entity_id, created_at, meta');

  if (ordered) {
    query = query
      .order('created_at', { ascending: sort === 'oldest' })
      .order('id', { ascending: sort === 'oldest' });
  }

  return applyBaseFilters(query, filters);
}

async function fetchAuditRows(
  filters: QueryFilters,
  options: {
    ordered?: boolean;
    sort?: LogListQuery['sort'];
    limit?: number;
  } = {}
): Promise<AuditLogRow[]> {
  let query = createAuditQuery(filters, { ordered: options.ordered, sort: options.sort });
  if (options.limit != null) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as AuditLogRow[];
}

async function fetchPagedAuditRows(
  filters: QueryFilters,
  page: number,
  limit: number,
  sort: LogListQuery['sort']
): Promise<{ rows: AuditLogRow[]; count: number }> {
  const fromIndex = (page - 1) * limit;
  const toIndex = fromIndex + limit - 1;
  const query = createAuditQuery(filters, { count: 'exact', sort }).range(fromIndex, toIndex);
  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  return {
    rows: (data ?? []) as AuditLogRow[],
    count: count ?? 0,
  };
}

function extractActorIds(rows: AuditLogRow[]): string[] {
  return Array.from(
    new Set(
      rows
        .map((row) => row.actor_user_id)
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
    )
  );
}

async function getActorNames(actorIds: string[]): Promise<Map<string, string>> {
  const names = new Map<string, string>();
  if (actorIds.length === 0) return names;

  const { data: actors } = await supabase.from('profiles').select('id, full_name').in('id', actorIds);

  for (const actor of actors ?? []) {
    if (actor?.id) names.set(actor.id, actor.full_name || actor.id);
  }

  return names;
}

function toDisplayLogItem(row: AuditLogRow, actorNames: Map<string, string>): LogListItem {
  const meta = asMeta(row.meta);
  const action = String(row.action || 'system.event');
  const entityType = row.related_entity_type || null;
  const entityId = row.related_entity_id || null;
  const level = deriveLevel(action, meta);
  const source = deriveSource(action, entityType, meta);
  const { eventCode, requestId } = buildEventCode(String(row.id), meta);

  return {
    id: String(row.id),
    action,
    actorUserId: row.actor_user_id || null,
    actorName: row.actor_user_id ? actorNames.get(row.actor_user_id) || null : null,
    entityType,
    entityId,
    level,
    source,
    message: buildLogMessage(action, entityType),
    eventCode,
    requestId,
    href: buildHref(entityType, entityId),
    createdAt: String(row.created_at || new Date().toISOString()),
    meta: sanitizeMeta(meta),
  };
}

function filterItems(items: LogListItem[], filters: DerivedFilters): LogListItem[] {
  return items.filter((item) => {
    if (filters.level !== 'all' && item.level !== filters.level) return false;
    if (filters.source && item.source !== filters.source) return false;
    if (filters.q && !matchesSearch(item, filters.q)) return false;
    return true;
  });
}

function requiresFullFeed(filters: DerivedFilters): boolean {
  return filters.level !== 'all' || Boolean(filters.source) || Boolean(filters.q);
}

function escapeCsv(value: string | null | undefined): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

async function buildListPayload(parsedQuery: LogListQuery) {
  const baseFilters: QueryFilters = {
    action: parsedQuery.action,
    actorUserId: parsedQuery.actorUserId,
    from: parsedQuery.from,
    to: parsedQuery.to,
  };

  if (requiresFullFeed(parsedQuery)) {
    const rows = await fetchAuditRows(baseFilters, { sort: parsedQuery.sort });
    const actorNames = await getActorNames(extractActorIds(rows));
    const allItems = rows.map((row) => toDisplayLogItem(row, actorNames));
    const filteredItems = filterItems(allItems, parsedQuery);
    const count = filteredItems.length;
    const totalPages = count > 0 ? Math.ceil(count / parsedQuery.limit) : 0;
    const fromIndex = (parsedQuery.page - 1) * parsedQuery.limit;
    const visibleItems = filteredItems.slice(fromIndex, fromIndex + parsedQuery.limit);
    const statsItems = visibleItems.map((item) => ({
      createdAt: item.createdAt,
      level: item.level,
      source: item.source,
    }));

    return {
      logs: visibleItems,
      count,
      totalPages,
      page: parsedQuery.page,
      sourceOptions: getSourceOptions(statsItems),
      summary: buildSummary(statsItems),
      hourlyBuckets: buildHourlyBuckets(statsItems),
    };
  }

  const { rows, count } = await fetchPagedAuditRows(
    baseFilters,
    parsedQuery.page,
    parsedQuery.limit,
    parsedQuery.sort
  );
  const actorNames = await getActorNames(extractActorIds(rows));
  const visibleLogs = rows.map((row) => toDisplayLogItem(row, actorNames));
  const statsItems = visibleLogs.map((item) => ({
    createdAt: item.createdAt,
    level: item.level,
    source: item.source,
  }));

  return {
    logs: visibleLogs,
    count,
    totalPages: count > 0 ? Math.ceil(count / parsedQuery.limit) : 0,
    page: parsedQuery.page,
    sourceOptions: getSourceOptions(statsItems),
    summary: buildSummary(statsItems),
    hourlyBuckets: buildHourlyBuckets(statsItems),
  };
}

async function buildExportRows(parsedQuery: LogExportQuery): Promise<LogListItem[]> {
  const baseFilters: QueryFilters = {
    action: parsedQuery.action,
    actorUserId: parsedQuery.actorUserId,
    from: parsedQuery.from,
    to: parsedQuery.to,
  };

  if (!requiresFullFeed(parsedQuery)) {
    const rows = await fetchAuditRows(baseFilters, {
      sort: parsedQuery.sort,
      limit: parsedQuery.limit,
    });
    const actorNames = await getActorNames(extractActorIds(rows));
    return rows.map((row) => toDisplayLogItem(row, actorNames));
  }

  const rows = await fetchAuditRows(baseFilters, { sort: parsedQuery.sort });
  const actorNames = await getActorNames(extractActorIds(rows));
  const allItems = rows.map((row) => toDisplayLogItem(row, actorNames));

  return filterItems(allItems, parsedQuery).slice(0, parsedQuery.limit);
}

export default async function logsRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    { preHandler: [requireAdminRole([...LOGS_READ_ROLES])] },
    async (request, reply) => {
      try {
        const parsedQuery = LogListQuerySchema.safeParse(request.query);
        if (!parsedQuery.success) {
          return reply
            .status(400)
            .send(failure('VALIDATION_ERROR', 'Invalid logs query', parsedQuery.error.format()));
        }

        const payload = await buildListPayload(parsedQuery.data);
        const parsedPayload = LogListResponseSchema.safeParse(payload);

        if (!parsedPayload.success) {
          return reply
            .status(500)
            .send(failure('INTERNAL_ERROR', 'Invalid logs payload', parsedPayload.error.format()));
        }

        return reply.status(200).send(success(parsedPayload.data));
      } catch (error: unknown) {
        fastify.log.error({ err: error }, 'logs route failed');
        return reply.status(500).send(failure('INTERNAL_ERROR', 'Failed to load logs'));
      }
    }
  );

  fastify.get(
    '/export',
    { preHandler: [requireAdminRole([...LOGS_EXPORT_ROLES])] },
    async (request, reply) => {
      try {
        const parsedQuery = LogExportQuerySchema.safeParse(request.query);
        if (!parsedQuery.success) {
          return reply
            .status(400)
            .send(failure('VALIDATION_ERROR', 'Invalid logs query', parsedQuery.error.format()));
        }

        const rows = await buildExportRows(parsedQuery.data);
        const header = [
          'Timestamp',
          'Level',
          'Source',
          'Message',
          'Event Code',
          'Actor',
          'Action',
          'Entity Type',
          'Entity ID',
          'Request ID',
        ];
        const lines = rows.map((log) =>
          [
            log.createdAt,
            log.level,
            log.source,
            log.message,
            log.eventCode ?? '',
            log.actorName ?? log.actorUserId ?? 'System',
            log.action,
            log.entityType ?? '',
            log.entityId ?? '',
            log.requestId ?? '',
          ]
            .map(escapeCsv)
            .join(',')
        );
        const filename = `sline_system_logs_${new Date().toISOString().slice(0, 10)}.csv`;

        return reply
          .header('Content-Type', 'text/csv')
          .header('Content-Disposition', `attachment; filename="${filename}"`)
          .send([header.map(escapeCsv).join(','), ...lines].join('\n'));
      } catch (error: unknown) {
        fastify.log.error({ err: error }, 'logs export route failed');
        return reply.status(500).send(failure('INTERNAL_ERROR', 'Failed to export logs'));
      }
    }
  );
}
