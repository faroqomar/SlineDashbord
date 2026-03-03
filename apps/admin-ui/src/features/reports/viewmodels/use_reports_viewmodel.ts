import { useState, useCallback, useEffect } from 'react';
import { reportsApi } from '../services/reports_api';
import type { ReportListItem, ReportDetail, ReportSeverity } from '@sline/shared';

export interface ReportsFilters {
  status: string;
  entity_type: string;
  severity: string;
  assigned_to_me: boolean;
  page: number;
  limit: number;
}

const DEFAULT_FILTERS: ReportsFilters = {
  status: 'all',
  entity_type: 'all',
  severity: 'all',
  assigned_to_me: false,
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
  const [actionReason, setActionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Parameters<typeof reportsApi.list>[0] = {
        page: filters.page,
        limit: filters.limit,
        assigned_to_me: filters.assigned_to_me || undefined,
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
  }, [filters.page, filters.limit, filters.status, filters.entity_type, filters.severity, filters.assigned_to_me]);

  useEffect(() => {
    loadList();
  }, [loadList]);

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
      loadList();
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Dismiss failed');
    } finally {
      setSubmitting(false);
    }
  }, [selectedReport, actionReason, loadList]);

  const handleEscalate = useCallback(async () => {
    if (!selectedReport || !actionReason.trim()) return null;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await reportsApi.escalate(selectedReport.id, { reason: actionReason.trim() });
      const updated = await reportsApi.getById(selectedReport.id);
      setSelectedReport(updated);
      setActionReason('');
      loadList();
      return result.case_id;
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Escalation failed');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [selectedReport, actionReason, loadList]);

  const handleCloseResolved = useCallback(async () => {
    if (!selectedReport || !actionReason.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await reportsApi.close(selectedReport.id, { reason: actionReason.trim(), resolution: 'resolved' });
      const updated = await reportsApi.getById(selectedReport.id);
      setSelectedReport(updated);
      setActionReason('');
      loadList();
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Close failed');
    } finally {
      setSubmitting(false);
    }
  }, [selectedReport, actionReason, loadList]);

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
    actionReason,
    setActionReason,
    submitting,
    submitError,
    changeFilters,
    refreshList: loadList,
    openDetail,
    handleDismiss,
    handleEscalate,
    handleCloseResolved,
    closeDialog,
    setSelectedReport,
  };
}
