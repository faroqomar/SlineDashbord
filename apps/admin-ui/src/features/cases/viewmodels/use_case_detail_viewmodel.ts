import { useState, useCallback, useEffect } from 'react';
import type { AdminCaseDetail, AdminCaseCreateInput, AdminCaseAttachEntityInput } from '@sline/shared';
import { casesApi } from '../services/cases_api';

export function useCaseDetailViewModel(caseId: string | undefined) {
  const [caseDetail, setCaseDetail] = useState<AdminCaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(!!caseId);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAttaching, setIsAttaching] = useState(false);

  const fetchCase = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await casesApi.getCase(id);
      setCaseDetail(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load case');
      setCaseDetail(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (caseId) fetchCase(caseId);
    else {
      setCaseDetail(null);
      setIsLoading(false);
    }
  }, [caseId, fetchCase]);

  const createCase = useCallback(async (input: AdminCaseCreateInput) => {
    setIsCreating(true);
    setError(null);
    try {
      const created = await casesApi.createCase(input);
      setCaseDetail({
        ...created,
        entities: [],
      });
      return created.id;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create case');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const attachEntity = useCallback(
    async (input: AdminCaseAttachEntityInput) => {
      if (!caseId) return false;
      setIsAttaching(true);
      setError(null);
      try {
        await casesApi.attachEntity(caseId, input);
        await fetchCase(caseId);
        return true;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to attach entity');
        return false;
      } finally {
        setIsAttaching(false);
      }
    },
    [caseId, fetchCase]
  );

  return {
    caseDetail,
    isLoading,
    error,
    isCreating,
    isAttaching,
    createCase,
    attachEntity,
    refreshCase: caseId ? () => fetchCase(caseId) : undefined,
  };
}
