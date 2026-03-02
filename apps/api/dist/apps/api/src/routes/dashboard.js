import { createClient } from '@supabase/supabase-js';
import { requireAdminRole } from '../middleware/rbac.js';
import { failure, success } from '@sline/shared';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function dashboardRoutes(fastify) {
    fastify.addHook('preHandler', requireAdminRole(['support', 'moderator', 'admin', 'super_admin']));
    /**
     * Get Dashboard Overview Stats
     */
    fastify.get('/overview', async (request, reply) => {
        try {
            const [profilesRes, revenueRes, disputesRes, jobsRes] = await Promise.all([
                // 1. Total Active Users
                supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
                // 2. Total Revenue (from financial metrics view or ledger)
                supabase.from('vw_financial_metrics_realtime').select('revenue_iqd').single(),
                // 3. Open Disputes
                supabase.from('disputes').select('*', { count: 'exact', head: true }).in('status', ['open', 'investigating', 'mediation']),
                // 4. Active Jobs (Tasks in progress)
                supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'in_progress')
            ]);
            const [activityRes, revenueHistoryRes, userGrowthRes] = await Promise.all([
                // Recent Activity
                supabase
                    .from('audit_logs')
                    .select(`id, action, created_at, meta, actor:profiles!actor_user_id(full_name, email, avatar_url)`)
                    .order('created_at', { ascending: false })
                    .limit(5),
                // Revenue History
                supabase.from('vw_analytics_monthly_revenue').select('name, revenue').order('name', { ascending: true }),
                // User Growth
                supabase.from('vw_analytics_monthly_user_growth').select('name, new_users').order('name', { ascending: true })
            ]);
            const timeAgo = (dateStr) => {
                const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
                if (seconds < 60)
                    return seconds + "s ago";
                if (seconds < 3600)
                    return Math.floor(seconds / 60) + "m ago";
                if (seconds < 86400)
                    return Math.floor(seconds / 3600) + "h ago";
                return Math.floor(seconds / 86400) + "d ago";
            };
            return success({
                stats: {
                    activeUsers: profilesRes.count || 0,
                    platformRevenue: revenueRes.data?.revenue_iqd || 0,
                    openDisputes: disputesRes.count || 0,
                    activeJobs: jobsRes.count || 0
                },
                recentActivity: (activityRes.data || []).map((log) => ({
                    id: log.id,
                    user: {
                        name: log.actor?.full_name || 'System',
                        email: log.actor?.email || '',
                        avatar: log.actor?.avatar_url,
                    },
                    action: log.action.split(/[._]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    status: 'success',
                    time: timeAgo(log.created_at),
                })),
                revenueHistory: (revenueHistoryRes.data || []).map((row) => ({
                    name: row.name,
                    revenue: Number(row.revenue) || 0
                })),
                userGrowth: (userGrowthRes.data || []).map((row) => ({
                    name: row.name,
                    newUsers: Number(row.new_users) || 0
                }))
            });
        }
        catch (err) {
            return failure('INTERNAL_ERROR', err.message);
        }
    });
}
