'use client';

import { useState, useCallback } from 'react';
import { financeApi, type AuditLogFilters, type AuditLogCursor } from '../services/finance_api';
import type { AuditLogEntry } from '../models/finance.model';

export interface UseAuditLogsVM {
  data: AuditLogEntry[];
  nextCursor: AuditLogCursor | undefined;
  filters: AuditLogFilters;
  loading: boolean;
  exportLoading: boolean;
  error: string | null;
  setFilters: (f: AuditLogFilters) => void;
  load: (append?: boolean) => Promise<void>;
  exportCsv: () => Promise<void>;
}

const defaultFilters: AuditLogFilters = { limit: 50 };

export function useAuditLogsVM(): UseAuditLogsVM {
  const [data, setData] = useState<AuditLogEntry[]>([]);
  const [nextCursor, setNextCursor] = useState<AuditLogCursor | undefined>(undefined);
  const [filters, setFiltersState] = useState<AuditLogFilters>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFilters = useCallback((f: AuditLogFilters) => {
    setFiltersState(f);
    setNextCursor(undefined);
    setData([]);
  }, []);

  const load = useCallback(
    async (append = false) => {
      setLoading(true);
      setError(null);
      try {
        const cursor = append ? nextCursor : undefined;
        const result = await financeApi.getAuditLogs(filters, cursor);
        setData((prev) => (append ? prev.concat(result.data) : result.data));
        setNextCursor(result.nextCursor);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load audit logs');
        if (!append) setData([]);
      } finally {
        setLoading(false);
      }
    },
    [filters, nextCursor]
  );

  const exportCsv = useCallback(async () => {
    setExportLoading(true);
    setError(null);
    try {
      await financeApi.getAuditExport(filters);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setExportLoading(false);
    }
  }, [filters]);

  return {
    data,
    nextCursor,
    filters,
    loading,
    exportLoading,
    error,
    setFilters,
    load,
    exportCsv,
  };
}
