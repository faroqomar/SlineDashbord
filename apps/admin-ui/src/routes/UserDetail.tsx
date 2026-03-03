import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../lib/api';
import { forceLogoutUser } from '@/features/users/services/users_api';
import { QUERY_KEYS } from '../lib/query-keys';
import { useParams, Link } from '@tanstack/react-router';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Calendar,
  User as UserIcon,
  LogOut
} from 'lucide-react';

export function UserDetailPage() {
  const { userId } = useParams({ from: '/users/$userId' as any });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.users.detail(userId),
    queryFn: async () => {
      const result = await request<{ auth: any; profile: any }>('GET', `/users/${userId}`);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });

  const banMutation = useMutation({
    mutationFn: async (reason: string) => {
      const result = await request('POST', `/users/${userId}/ban`, { reason });
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.detail(userId) });
    },
  });

  const forceLogoutMutation = useMutation({
    mutationFn: async (reason?: string) => {
      if (!userId) throw new Error('User ID required');
      const result = await forceLogoutUser(userId, reason);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.detail(userId) });
    },
  });

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading user details...</div>;
  if (!data) return <div className="p-12 text-center text-rose-400">User not found.</div>;

  const { auth, profile } = data;
  const accountStatus = profile.account_status ?? profile.status ?? 'active';

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link to="/users" className="p-2 glass rounded-full text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold font-inter tracking-tight">{profile.full_name}</h2>
          <p className="text-slate-400">User ID: <span className="font-mono text-xs">{auth.id}</span></p>
        </div>
        <Link
          to="/users/$userId/investigation"
          params={{ userId }}
          className="ml-auto flex items-center gap-2 px-4 py-2 glass rounded-xl text-slate-300 hover:text-white transition-all font-medium"
        >
          Investigation
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="glass-card flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 p-1 mb-4">
            <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center text-3xl font-bold">
              {profile.full_name[0]}
            </div>
          </div>
          <h3 className="text-xl font-bold">{profile.full_name}</h3>
          <p className="text-slate-400 text-sm mb-4">{auth.email}</p>
          
          <div className="flex gap-2 w-full mt-4">
            <span className={`flex-1 px-3 py-1 rounded-lg text-xs font-bold border ${accountStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              {(accountStatus || 'active').toUpperCase()}
            </span>
            <span className="flex-1 px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400">
              {profile.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="md:col-span-2 space-y-8">
          <div className="glass-card grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem icon={<Mail size={18} />} label="Email" value={auth.email} />
            <InfoItem icon={<Calendar size={18} />} label="Joined" value={new Date(auth.created_at).toLocaleDateString()} />
            <InfoItem icon={<ShieldCheck size={18} />} label="Auth Provider" value={(auth.app_metadata?.provider as string) || 'email'} />
            <InfoItem icon={<UserIcon size={18} />} label="Last Seen" value={new Date(auth.last_sign_in_at).toLocaleString()} />
          </div>

          {/* Actions */}
          <div className="glass-card">
            <h4 className="text-lg font-bold mb-4">Administrative Actions</h4>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  const reason = prompt('Reason for banning:');
                  if (reason) banMutation.mutate(reason);
                }}
                disabled={banMutation.isPending || accountStatus === 'banned'}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all font-semibold disabled:opacity-50"
              >
                <ShieldAlert size={18} />
                {accountStatus === 'banned' ? 'User Banned' : 'Ban User'}
              </button>
              
              <button
                onClick={() => {
                  if (window.confirm('Force logout this user? They will need to sign in again.')) {
                    const reason = prompt('Optional reason (for audit):') ?? undefined;
                    forceLogoutMutation.mutate(reason);
                  }
                }}
                disabled={forceLogoutMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-600/80 hover:bg-amber-500 text-white rounded-xl transition-all font-semibold disabled:opacity-50"
              >
                <LogOut size={18} />
                {forceLogoutMutation.isPending ? 'Logging out…' : 'Force logout'}
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 glass rounded-xl text-slate-300 hover:text-white transition-all font-semibold">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 glass rounded-lg text-blue-400">{icon}</div>
      <div>
        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</span>
        <p className="text-slate-200 font-medium">{value}</p>
      </div>
    </div>
  );
}
