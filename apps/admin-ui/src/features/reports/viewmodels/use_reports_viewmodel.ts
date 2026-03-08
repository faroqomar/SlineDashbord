import { useState, useCallback, useEffect } from 'react';
import { reportsApi, type ListReportsParams } from '../services/reports_api';
import type {
  CreateReportInput,
  ReportEntityType,
  ReportListItem,
  ReportDetail,
  ReportSeverity,
  ReportsKpiCardAnalytics,
} from '@sline/shared';
import { toast } from 'sonner';
import {
  REPORTS_HERO_TREND_MOCK,
  REPORTS_KPI_VISUAL_MOCK,
  type ReportsKpiKey,
  type ReportsKpiVisualMock,
} from '../models/reports-ui.mock';

export interface ReportsFilters {
  status: string;
  entity_type: string;
  severity: string;
  assigned_to_me: boolean;
  page: number;
  limit: number;
}

export interface ReportsKpis {
  total: number;
  open: number;
  escalated: number;
  closed: number;
}

export interface ReportsHeroTrend {
  windowLabel: string;
  incoming: number[];
  resolved: number[];
}

export interface ReportsKpiVisuals {
  total: ReportsKpiVisualMock;
  open: ReportsKpiVisualMock;
  escalated: ReportsKpiVisualMock;
  closed: ReportsKpiVisualMock;
}

export interface CreateReportDraft {
  entity_type: ReportEntityType;
  entity_id: string;
  reason: string;
  category: string;
  severity: ReportSeverity | '';
}

const DEFAULT_FILTERS: ReportsFilters = {
  status: 'all',
  entity_type: 'all',
  severity: 'all',
  assigned_to_me: false,
  page: 1,
  limit: 20,
};

const DEFAULT_KPIS: ReportsKpis = {
  total: 0,
  open: 0,
  escalated: 0,
  closed: 0,
};

const DEFAULT_HERO_TREND: ReportsHeroTrend = {
  windowLabel: REPORTS_HERO_TREND_MOCK.windowLabel,
  incoming: REPORTS_HERO_TREND_MOCK.incoming,
  resolved: REPORTS_HERO_TREND_MOCK.resolved,
};

const DEFAULT_KPI_VISUALS: ReportsKpiVisuals = {
  total: REPORTS_KPI_VISUAL_MOCK.total,
  open: REPORTS_KPI_VISUAL_MOCK.open,
  escalated: REPORTS_KPI_VISUAL_MOCK.escalated,
  closed: REPORTS_KPI_VISUAL_MOCK.closed,
};

export const DEFAULT_CREATE_REPORT_DRAFT: CreateReportDraft = {
  entity_type: 'task',
  entity_id: '',
  reason: '',
  category: '',
  severity: 'medium',
};

export function buildCreateReportInput(draft: CreateReportDraft): CreateReportInput {
  const entityId = draft.entity_id.trim();
  const reason = draft.reason.trim();
  if (!entityId) {
    throw new Error('Entity ID is required');
  }
  if (!reason) {
    throw new Error('Reason is required');
  }

  return {
    entity_type: draft.entity_type,
    entity_id: entityId,
    reason,
    category: draft.category.trim() || undefined,
    severity: draft.severity || undefined,
    meta: {},
  };
}

function formatDeltaLabel(card: ReportsKpiCardAnalytics): string {
  if (card.delta_percent != null) {
    const rounded = Math.round(card.delta_percent);
    return `${rounded >= 0 ? '+' : ''}${rounded}%`;
  }
  return `${card.delta_absolute >= 0 ? '+' : ''}${card.delta_absolute}`;
}

function getDeltaDirection(card: ReportsKpiCardAnalytics): 'up' | 'down' {
  const isRiskMetric = card.key === 'open' || card.key === 'escalated';
  const isGood = isRiskMetric ? card.delta_absolute <= 0 : card.delta_absolute >= 0;
  return isGood ? 'up' : 'down';
}

function toKpiVisual(card: ReportsKpiCardAnalytics): ReportsKpiVisualMock {
  return {
    deltaLabel: formatDeltaLabel(card),
    deltaDirection: getDeltaDirection(card),
    sparkline: card.trend,
  };
}

export function useReportsViewModel(initialFilters: Partial<ReportsFilters> = {}) {
  const [filters, setFilters] = useState<ReportsFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [kpis, setKpis] = useState<ReportsKpis>(DEFAULT_KPIS);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [heroTrend, setHeroTrend] = useState<ReportsHeroTrend>(DEFAULT_HERO_TREND);
  const [kpiVisuals, setKpiVisuals] = useState<ReportsKpiVisuals>(DEFAULT_KPI_VISUALS);

  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState<CreateReportDraft>(DEFAULT_CREATE_REPORT_DRAFT);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setKpiLoading(true);
    try {
      const [kpisResponse, trendsResponse] = await Promise.all([reportsApi.getKpis('7d'), reportsApi.getTrends('7d')]);

      const cardMap = Object.fromEntries(
        kpisResponse.cards.map((card) => [card.key, card])
      ) as Record<ReportsKpiKey, ReportsKpiCardAnalytics>;

      setKpis({
        total: cardMap.total.count,
        open: cardMap.open.count,
        escalated: cardMap.escalated.count,
        closed: cardMap.closed.count,
      });

      setKpiVisuals({
        total: toKpiVisual(cardMap.total),
        open: toKpiVisual(cardMap.open),
        escalated: toKpiVisual(cardMap.escalated),
        closed: toKpiVisual(cardMap.closed),
      });

      setHeroTrend({
        windowLabel: 'Last 7 days',
        incoming: trendsResponse.points.map((point) => point.incoming),
        resolved: trendsResponse.points.map((point) => point.resolved),
      });
    } catch {
      setKpis({
        total,
        open: reports.filter((report) => report.status === 'open').length,
        escalated: reports.filter((report) => report.status === 'escalated').length,
        closed: reports.filter((report) => report.status === 'closed').length,
      });
      setKpiVisuals(DEFAULT_KPI_VISUALS);
      setHeroTrend(DEFAULT_HERO_TREND);
    } finally {
      setKpiLoading(false);
    }
  }, [reports, total]);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ListReportsParams = {
        page: filters.page,
        limit: filters.limit,
        assigned_to_me: filters.assigned_to_me || undefined,
        q: debouncedSearchQuery || undefined,
      };
      if (filters.status !== 'all') params.status = filters.status as 'open' | 'triaged' | 'escalated' | 'closed';
      if (filters.entity_type !== 'all') params.entity_type = filters.entity_type as 'task' | 'user' | 'chat' | 'booking';
      if (filters.severity !== 'all') params.severity = filters.severity as ReportSeverity;
      const res = await reportsApi.list(params);
      setReports(res.reports);
      setTotal(res.total);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [
    filters.page,
    filters.limit,
    filters.status,
    filters.entity_type,
    filters.severity,
    filters.assigned_to_me,
    debouncedSearchQuery,
  ]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const changeFilters = useCallback((updates: Partial<ReportsFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      const listAffecting =
        'status' in updates ||
        'entity_type' in updates ||
        'severity' in updates ||
        'assigned_to_me' in updates;
      if (listAffecting) next.page = 1;
      return next;
    });
  }, []);

  const updateSearchQuery = useCallback((value: string) => {
    setSearchQuery(value);
    setFilters((prev) => {
      if (prev.page === 1) return prev;
      return { ...prev, page: 1 };
    });
  }, []);

  const openDetail = useCallback(async (reportId: string) => {
    setDetailLoading(true);
    setSelectedReport(null);
    setActionReason('');
    setSubmitError(null);
    try {
      const detail = await reportsApi.getById(reportId);
      setSelectedReport(detail);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Failed to load report');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleDismiss = useCallback(async () => {
    if (!selectedReport || !actionReason.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await reportsApi.dismiss(selectedReport.id, { reason: actionReason.trim() });
      const updated = await reportsApi.getById(selectedReport.id);
      setSelectedReport(updated);
      setActionReason('');
      await Promise.all([loadList(), loadAnalytics()]);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Dismiss failed');
    } finally {
      setSubmitting(false);
    }
  }, [selectedReport, actionReason, loadList, loadAnalytics]);

  const handleEscalate = useCallback(async () => {
    if (!selectedReport || !actionReason.trim()) return null;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await reportsApi.escalate(selectedReport.id, { reason: actionReason.trim() });
      const updated = await reportsApi.getById(selectedReport.id);
      setSelectedReport(updated);
      setActionReason('');
      await Promise.all([loadList(), loadAnalytics()]);
      return result.case_id;
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Escalation failed');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [selectedReport, actionReason, loadList, loadAnalytics]);

  const handleCloseResolved = useCallback(async () => {
    if (!selectedReport || !actionReason.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await reportsApi.close(selectedReport.id, { reason: actionReason.trim(), resolution: 'resolved' });
      const updated = await reportsApi.getById(selectedReport.id);
      setSelectedReport(updated);
      setActionReason('');
      await Promise.all([loadList(), loadAnalytics()]);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Close failed');
    } finally {
      setSubmitting(false);
    }
  }, [selectedReport, actionReason, loadList, loadAnalytics]);

  const closeDialog = useCallback(() => {
    setSelectedReport(null);
    setSubmitError(null);
  }, []);

  const refreshList = useCallback(async () => {
    await Promise.all([loadList(), loadAnalytics()]);
  }, [loadList, loadAnalytics]);

  const openCreateDialog = useCallback(() => {
    setCreateError(null);
    setCreateOpen(true);
  }, []);

  const closeCreateDialog = useCallback(() => {
    setCreateOpen(false);
    setCreateError(null);
    setCreateDraft(DEFAULT_CREATE_REPORT_DRAFT);
  }, []);

  const updateCreateDraft = useCallback((updates: Partial<CreateReportDraft>) => {
    setCreateDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  const submitCreateReport = useCallback(async () => {
    setCreateSubmitting(true);
    setCreateError(null);
    try {
      const payload = buildCreateReportInput(createDraft);
      await reportsApi.create(payload);
      toast.success('Report created');
      closeCreateDialog();
      await Promise.all([loadList(), loadAnalytics()]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Create report failed';
      setCreateError(message);
      toast.error(message);
    } finally {
      setCreateSubmitting(false);
    }
  }, [createDraft, closeCreateDialog, loadList, loadAnalytics]);

  return {
    reports,
    total,
    kpis,
    kpiLoading,
    heroTrend,
    kpiVisuals,
    filters,
    loading,
    error,
    searchQuery,
    setSearchQuery: updateSearchQuery,
    selectedReport,
    detailLoading,
    actionReason,
    setActionReason,
    submitting,
    submitError,
    createOpen,
    createDraft,
    createSubmitting,
    createError,
    changeFilters,
    refreshList,
    openCreateDialog,
    closeCreateDialog,
    updateCreateDraft,
    submitCreateReport,
    openDetail,
    handleDismiss,
    handleEscalate,
    handleCloseResolved,
    closeDialog,
    setSelectedReport,
  };
}
