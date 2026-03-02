import { useState, useCallback, useEffect } from 'react';
import { reportsApi } from '../services/reports_api';
import type { ReportListItem, ReportDetail, TriageAction } from '@sline/shared';

export interface ReportsFilters {
  status: string;
  entity_type: string;
  page: number;
  limit: number;
}

const DEFAULT_FILTERS: ReportsFilters = {
  status: 'all',
  entity_type: 'all',
  page: 1,
  limit: 20,
};

export function useReportsViewModel(initialFilters: Partial<ReportsFilters> = {}) {
  const [filters, setFilters] = useState<ReportsFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [triageAction, setTriageAction] = useState<TriageAction>('dismiss');
  const [triageReason, setTriageReason] = useState('');
  const [closeReason, setCloseReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Parameters<typeof reportsApi.list>[0] = {
        page: filters.page,
        limit: filters.limit,
      };
      if (filters.status !== 'all') params.status = filters.status as 'open' | 'triaged' | 'closed';
      if (filters.entity_type !== 'all') params.entity_type = filters.entity_type as 'task' | 'user' | 'chat';
      const res = await reportsApi.list(params);
      setReports(res.reports);
      setTotal(res.total);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, filters.status, filters.entity_type]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const changeFilters = useCallback((updates: Partial<ReportsFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      if ('status' in updates || 'entity_type' in updates) next.page = 1;
      return next;
    });
  }, []);

  const openDetail = useCallback(async (reportId: string) => {
    setDetailLoading(true);
    setSelectedReport(null);
    setTriageReason('');
    setCloseReason('');
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

  const handleTriage = useCallback(async () => {
    if (!selectedReport || !triageReason.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await reportsApi.triage(selectedReport.id, { action: triageAction, reason: triageReason.trim() });
      const updated = await reportsApi.getById(selectedReport.id);
      setSelectedReport(updated);
      setTriageReason('');
      loadList();
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Triage failed');
    } finally {
      setSubmitting(false);
    }
  }, [selectedReport, triageAction, triageReason, loadList]);

  const handleClose = useCallback(async () => {
    if (!selectedReport || !closeReason.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await reportsApi.close(selectedReport.id, { reason: closeReason.trim() });
      setSelectedReport(null);
      setCloseReason('');
      loadList();
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Close failed');
    } finally {
      setSubmitting(false);
    }
  }, [selectedReport, closeReason, loadList]);

  const closeDialog = useCallback(() => {
    setSelectedReport(null);
    setSubmitError(null);
  }, []);

  return {
    reports,
    total,
    filters,
    loading,
    error,
    selectedReport,
    detailLoading,
    triageAction,
    triageReason,
    closeReason,
    submitting,
    submitError,
    changeFilters,
    refreshList: loadList,
    openDetail,
    handleTriage,
    handleClose,
    closeDialog,
    setTriageAction,
    setTriageReason,
    setCloseReason,
    setSelectedReport,
  };
}
