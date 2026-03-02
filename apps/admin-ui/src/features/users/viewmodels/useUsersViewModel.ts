import { useState, useEffect } from 'react';
import { useSearchParams } from '@/lib/navigation-shim';
import { getUsers, type UserDTO } from '../services/users_api';

export function useUsersViewModel() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('query') || '';
  const role = searchParams.get('role') || 'all';

  const [users, setUsers] = useState<UserDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    
    getUsers(page, query, role).then((res) => {
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
  }, [page, query, role]);

  return { 
    users, 
    totalPages, 
    totalUsers, 
    isLoading, 
    error 
  };
}
