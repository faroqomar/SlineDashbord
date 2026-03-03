import { useState, useCallback, useEffect } from 'react';
import type {
  AdminCaseDetail,
  AdminCaseCreateInput,
  AdminCaseAttachEntityInput,
  AdminCaseAssignInput,
  AdminCaseStatusInput,
  AdminCaseNoteInput,
} from '@sline/shared';
import { casesApi } from '../services/cases_api';

export function useCaseDetailViewModel(caseId: string | undefined) {
  const [caseDetail, setCaseDetail] = useState<AdminCaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(!!caseId);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAttaching, setIsAttaching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

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
        evidence: [],
        timeline: [],
        notes: [],
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

  const assignCase = useCallback(
    async (input: AdminCaseAssignInput) => {
      if (!caseId) return false;
      setIsAssigning(true);
      setError(null);
      try {
        await casesApi.assignCase(caseId, input);
        await fetchCase(caseId);
        return true;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to assign case');
        return false;
      } finally {
        setIsAssigning(false);
      }
    },
    [caseId, fetchCase]
  );

  const updateStatus = useCallback(
    async (input: AdminCaseStatusInput) => {
      if (!caseId) return false;
      setIsUpdatingStatus(true);
      setError(null);
      try {
        await casesApi.updateStatus(caseId, input);
        await fetchCase(caseId);
        return true;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to update status');
        return false;
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [caseId, fetchCase]
  );

  const addNote = useCallback(
    async (input: AdminCaseNoteInput) => {
      if (!caseId) return false;
      setIsAddingNote(true);
      setError(null);
      try {
        await casesApi.addNote(caseId, input);
        await fetchCase(caseId);
        return true;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to add note');
        return false;
      } finally {
        setIsAddingNote(false);
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
    isAssigning,
    isUpdatingStatus,
    isAddingNote,
    createCase,
    attachEntity,
    assignCase,
    updateStatus,
    addNote,
    refreshCase: caseId ? () => fetchCase(caseId) : undefined,
  };
}
