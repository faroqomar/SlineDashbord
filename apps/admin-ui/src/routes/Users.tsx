import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { request } from '../lib/api';
import { QUERY_KEYS } from '../lib/query-keys';
import { UserTable } from '../components/UserTable';
import { Search, Filter, UserPlus } from 'lucide-react';

export function UsersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.users.list({ page: 1 }),
    queryFn: async () => {
      const result = await request<{ users: any[]; totalUsers: number }>('GET', '/users?page=1');
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-inter tracking-tight">Users</h2>
          <p className="text-slate-400 mt-1">Manage and monitor platform participants.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20">
          <UserPlus size={18} />
          <span className="font-semibold">Invite User</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            className="w-full pl-12 pr-4 py-2.5 glass rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-slate-400 hover:text-white transition-colors">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="glass-card !p-0 overflow-hidden ring-1 ring-white/5 shadow-2xl">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            Loading users...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-400 italic">
            Error loading users: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : (
          <UserTable data={data?.users || []} />
        )}
      </div>
    </div>
  );
}
