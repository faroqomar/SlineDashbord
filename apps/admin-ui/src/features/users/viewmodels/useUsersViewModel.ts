import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useSetSearchParams } from '@/lib/navigation-shim';
import { getUsers, type UserDTO } from '../services/users_api';

export type UsersTabKey = 'all' | 'active' | 'inactive';

const INACTIVE_STATUSES: UserDTO['status'][] = ['suspended', 'banned'];

function parsePage(rawPage: string | null): number {
  const value = Number(rawPage ?? '1');
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.trunc(value));
}

function parseTab(rawTab: string | null): UsersTabKey {
  if (rawTab === 'active' || rawTab === 'inactive') {
    return rawTab;
  }
  return 'all';
}

export function useUsersViewModel() {
  const searchParams = useSearchParams();
  const setSearchParams = useSetSearchParams();

  const page = parsePage(searchParams.get('page'));
  const query = searchParams.get('query') || '';
  const tab = parseTab(searchParams.get('tab'));

  const [users, setUsers] = useState<UserDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    getUsers(page, query, 'all').then((res) => {
      if (!active) return;
      if (res.success) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setTotalUsers(res.data.totalUsers);
      } else {
        setError(res.error);
        setUsers([]);
      }
      setIsLoading(false);
    });

    return () => { active = false; };
  }, [page, query]);

  const activeUsersOnPage = useMemo(
    () => users.filter((user) => user.status === 'active').length,
    [users],
  );

  const inactiveUsersOnPage = useMemo(
    () => users.filter((user) => INACTIVE_STATUSES.includes(user.status)).length,
    [users],
  );

  const filteredUsers = useMemo(() => {
    if (tab === 'all') return users;
    if (tab === 'active') return users.filter((user) => user.status === 'active');
    return users.filter((user) => INACTIVE_STATUSES.includes(user.status));
  }, [users, tab]);

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
    users: filteredUsers,
    allUsers: users,
    totalPages,
    totalUsers,
    isLoading,
    error,
    activeUsersOnPage,
    inactiveUsersOnPage,
    setQuery,
    setTab,
    setPage,
  };
}
