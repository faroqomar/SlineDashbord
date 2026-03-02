import React from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useDashboardViewModel } from '../features/dashboard/viewmodels/use_dashboard_viewmodel';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Skeleton } from '../components/ui/skeleton';

export function DashboardIndex() {
  const { stats, recentActivity, revenueHistory, userGrowth, isLoading, error } = useDashboardViewModel();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle size={48} className="text-red-500" />
        <h3 className="text-xl font-bold">Failed to load dashboard</h3>
        <p className="text-slate-400">{error.toString()}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold font-inter tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-400 mt-1">Real-time platform metrics and system health.</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Updated</p>
          <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="text-blue-400" size={24} />} 
          label="Total Users" 
          value={stats?.activeUsers.toLocaleString()} 
          trend="+12% this month" 
          isLoading={isLoading}
        />
        <StatCard 
          icon={<DollarSign className="text-emerald-400" size={24} />} 
          label="Total Revenue" 
          value={stats ? `${Number(stats.platformRevenue).toLocaleString()} IQD` : undefined} 
          trend="+5.4% vs last week" 
          isLoading={isLoading}
        />
        <StatCard 
          icon={<TrendingUp className="text-purple-400" size={24} />} 
          label="Active Jobs" 
          value={stats?.activeJobs.toString()} 
          trend="Real-time status" 
          isLoading={isLoading}
        />
        <StatCard 
          icon={<AlertCircle className="text-amber-400" size={24} />} 
          label="Open Disputes" 
          value={stats?.openDisputes.toString()} 
          trend="Requires attention" 
          isLoading={isLoading}
        />
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Revenue Dynamics</h3>
              <p className="text-xs text-slate-400">Monthly platform earnings in IQD</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-tighter">
                <ArrowUpRight size={10} /> Live
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueHistory}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="glass-card p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">User Growth</h3>
              <p className="text-xs text-slate-400">New active profiles per month</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  />
                  <Bar dataKey="newUsers" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Recent System Activity</h3>
          <button onClick={() => window.location.href='/logs'} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">View All Logs</button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
          ) : (
            recentActivity?.map((activity: any) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/[0.08] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                    {activity.user.avatar ? <img src={activity.user.avatar} alt="" className="h-full w-full object-cover" /> : <Users size={18} className="text-slate-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">{activity.user.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{activity.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 uppercase tracking-tighter">
                    <Clock size={12} /> {activity.time}
                  </span>
                </div>
              </div>
            ))
          )}
          {!isLoading && recentActivity?.length === 0 && (
            <div className="text-center py-8 text-slate-500 italic">No recent activity found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, isLoading }: { icon: React.ReactNode; label: string; value?: string; trend: string; isLoading: boolean }) {
  return (
    <div className="glass-card flex flex-col gap-4 group hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {!isLoading && (
          <div className="text-[10px] font-bold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/10">
            {trend}
          </div>
        )}
      </div>
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{label}</span>
        {isLoading ? (
          <Skeleton className="h-8 w-24 mt-2" />
        ) : (
          <p className="text-3xl font-bold mt-1 tracking-tighter">{value || "0"}</p>
        )}
      </div>
    </div>
  );
}
