import { useEffect, useState } from 'react';
import { useSearchParams, useSetSearchParams } from '@/lib/navigation-shim';
import { getUsers, type UserDTO } from '../services/users_api';
import type { UsersKpiCounts, UsersTabCounts } from '@sline/shared';

export type UsersTabKey = 'all' | 'active' | 'inactive';

const DEFAULT_TAB_COUNTS: UsersTabCounts = {
  all: 0,
  active: 0,
  inactive: 0,
};

function parsePage(rawPage: string | null): number {
  const value = Number(normalizeSearchParam(rawPage) || '1');
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.trunc(value));
}

function parseTab(rawTab: string | null): UsersTabKey {
  const value = normalizeSearchParam(rawTab);
  if (value === 'active' || value === 'inactive') {
    return value;
  }
  return 'all';
}

function normalizeSearchParam(rawValue: string | null): string {
  if (!rawValue) return '';
  const trimmed = rawValue.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function useUsersViewModel() {
  const searchParams = useSearchParams();
  const setSearchParams = useSetSearchParams();

  const page = parsePage(searchParams.get('page'));
  const query = normalizeSearchParam(searchParams.get('query'));
  const tab = parseTab(searchParams.get('tab'));

  const [users, setUsers] = useState<UserDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [kpiCounts, setKpiCounts] = useState<UsersKpiCounts | undefined>(undefined);
  const [tabCounts, setTabCounts] = useState<UsersTabCounts>(DEFAULT_TAB_COUNTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    getUsers(page, query, 'all', tab).then((res) => {
      if (!active) return;
      if (res.success) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setTotalUsers(res.data.totalUsers);
        setKpiCounts(res.data.kpiCounts);
        setTabCounts(
          res.data.tabCounts ?? {
            all: res.data.totalUsers,
            active: 0,
            inactive: 0,
          },
        );
      } else {
        setError(res.error);
        setUsers([]);
        setTotalPages(0);
        setTotalUsers(0);
        setKpiCounts(undefined);
        setTabCounts(DEFAULT_TAB_COUNTS);
      }
      setIsLoading(false);
    });

    return () => { active = false; };
  }, [page, query, tab]);

  const updateSearchParams = (updater: (params: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    updater(next);
    setSearchParams(next);
  };

  const setQuery = (nextQuery: string) => {
    updateSearchParams((next) => {
      next.set('query', nextQuery);
      next.set('page', '1');
    });
  };

  const setTab = (nextTab: UsersTabKey) => {
    updateSearchParams((next) => {
      next.set('tab', nextTab);
      next.set('page', '1');
    });
  };

  const setPage = (nextPage: number) => {
    const maxPage = Math.max(1, totalPages || 1);
    const clamped = Math.max(1, Math.min(nextPage, maxPage));

    updateSearchParams((next) => {
      next.set('page', String(clamped));
    });
  };

  return {
    page,
    query,
    tab,
    users,
    allUsers: users,
    totalPages,
    totalUsers,
    kpiCounts,
    tabCounts,
    isLoading,
    error,
    setQuery,
    setTab,
    setPage,
  };
}
