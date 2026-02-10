module.exports = [
"[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
;
function createAdminClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://isddrknbjsgaantjojhm.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
}),
"[project]/src/app/actions/analytics.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0009b81a701281ebfdb4875399a4808089208f94f8":"getRevenueHistory","001c25b53615bd586f5f08bb0f78b497da2b7a5e9e":"getRecentActivity","0053638247d697c0f031822d6af8aa2d4723107fd7":"getUserGrowthHistory","0091530a4afd1bff67a51b2cf057a19164dc19ddb0":"getOverviewStats","00ed1c166e62425c61b02ddea5b38303a43215225b":"getPendingItems"},"",""] */ __turbopack_context__.s([
    "getOverviewStats",
    ()=>getOverviewStats,
    "getPendingItems",
    ()=>getPendingItems,
    "getRecentActivity",
    ()=>getRecentActivity,
    "getRevenueHistory",
    ()=>getRevenueHistory,
    "getUserGrowthHistory",
    ()=>getUserGrowthHistory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getOverviewStats() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // 1. Total Users (where status is active or maybe all users?)
    // Let's count all profiles for now.
    const { count: userCount, error: userError } = await supabase.from('profiles').select('*', {
        count: 'exact',
        head: true
    });
    if (userError) {
        console.error('Error fetching user count:', userError);
    }
    // 2. Platform Revenue
    // Summing up 'amount' from 'wallet_transactions' where type might be 'fee' or 'commission'?
    // For MVP, if we don't have fee specific transactions, let's sum up completed tasks budget as a proxy for "Volume", or actual revenue if we had a field.
    // Let's assume 'wallet_transactions' with type='payment' or similar represents money moving.
    // Actually, let's look at `wallet_transactions` types.
    // Valid types might be 'deposit', 'withdrawal', 'transfer', 'payment', 'refund'.
    // Without knowing the exact business logic for "Revenue" (is it 10% cut?), let's just sum up all completed task budgets for "Gross Volume".
    // Alternative: Sum 'budget' of tasks with status 'completed'.
    const { data: revenueData, error: revenueError } = await supabase.from('tasks').select('budget').eq('status', 'completed');
    let revenue = 0;
    if (!revenueError && revenueData) {
        revenue = revenueData.reduce((acc, curr)=>acc + (Number(curr.budget) || 0), 0);
    } else if (revenueError) {
        console.error('Error fetching revenue:', revenueError);
    }
    // 3. Active Disputes
    const { count: disputeCount, error: disputeError } = await supabase.from('disputes').select('*', {
        count: 'exact',
        head: true
    }).in('status', [
        'open',
        'investigating',
        'mediation'
    ]);
    if (disputeError) {
        console.error('Error fetching dispute count:', disputeError);
    }
    // 4. Active Subscriptions
    // We don't have a subscriptions table yet, returning 0.
    return {
        activeUsers: userCount || 0,
        platformRevenue: revenue,
        openDisputes: disputeCount || 0,
        activeSubscriptions: 0
    };
}
async function getRecentActivity() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const { data, error } = await supabase.from('admin_logs').select(`
      id,
      action,
      created_at,
      metadata,
      actor:profiles!admin_logs_actor_id_fkey(full_name, email, avatar_url)
    `).order('created_at', {
        ascending: false
    }).limit(5);
    if (error) {
        console.error('Error fetching activity:', error);
        return [];
    }
    // Helper to format relative time (simple version)
    const timeAgo = (dateStr)=>{
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };
    return (data || []).map((log)=>({
            id: log.id,
            user: {
                name: log.actor?.full_name || 'System',
                email: log.actor?.email || '',
                avatar: log.actor?.avatar_url
            },
            action: formatActionName(log.action),
            status: 'success',
            time: timeAgo(log.created_at)
        }));
}
function formatActionName(action) {
    return action.split('_').map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
async function getPendingItems() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // 1. Open Disputes
    const { count: disputesCount } = await supabase.from('disputes').select('*', {
        count: 'exact',
        head: true
    }).in('status', [
        'open',
        'investigating'
    ]);
    // 2. Open Support Tickets
    const { count: ticketsCount } = await supabase.from('support_tickets').select('*', {
        count: 'exact',
        head: true
    }).in('status', [
        'open',
        'in_progress'
    ]);
    return [
        {
            id: '1',
            type: 'Disputes',
            count: disputesCount || 0,
            status: 'open'
        },
        {
            id: '2',
            type: 'Support Tickets',
            count: ticketsCount || 0,
            status: 'pending'
        }
    ];
}
async function getRevenueHistory() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // For MVP, using completed tasks budget as revenue proxy
    const { data, error } = await supabase.from('tasks').select('budget, created_at').eq('status', 'completed').gte('created_at', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString());
    if (error) {
        console.error('Error fetching revenue history:', error);
        return [];
    }
    const monthlyData = {};
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const today = new Date();
    for(let i = 11; i >= 0; i--){
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = `${months[d.getMonth()]}`;
        monthlyData[key] = 0;
    }
    data?.forEach((task)=>{
        const d = new Date(task.created_at);
        const key = months[d.getMonth()];
        if (monthlyData[key] !== undefined) {
            monthlyData[key] += Number(task.budget) || 0;
        }
    });
    return Object.entries(monthlyData).map(([name, revenue])=>({
            name,
            revenue
        }));
}
async function getUserGrowthHistory() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const { data, error } = await supabase.from('profiles').select('created_at').gte('created_at', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString());
    if (error) {
        console.error('Error fetching user history:', error);
        return [];
    }
    const monthlyData = {};
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const today = new Date();
    for(let i = 11; i >= 0; i--){
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = `${months[d.getMonth()]}`;
        monthlyData[key] = 0;
    }
    data?.forEach((user)=>{
        const d = new Date(user.created_at);
        const key = months[d.getMonth()];
        if (monthlyData[key] !== undefined) {
            monthlyData[key]++;
        }
    });
    return Object.entries(monthlyData).map(([name, newUsers])=>({
            name,
            newUsers
        }));
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getOverviewStats,
    getRecentActivity,
    getPendingItems,
    getRevenueHistory,
    getUserGrowthHistory
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getOverviewStats, "0091530a4afd1bff67a51b2cf057a19164dc19ddb0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRecentActivity, "001c25b53615bd586f5f08bb0f78b497da2b7a5e9e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPendingItems, "00ed1c166e62425c61b02ddea5b38303a43215225b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRevenueHistory, "0009b81a701281ebfdb4875399a4808089208f94f8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserGrowthHistory, "0053638247d697c0f031822d6af8aa2d4723107fd7", null);
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/analytics.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$analytics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/analytics.ts [app-rsc] (ecmascript)");
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/analytics.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0009b81a701281ebfdb4875399a4808089208f94f8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$analytics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRevenueHistory"],
    "001c25b53615bd586f5f08bb0f78b497da2b7a5e9e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$analytics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRecentActivity"],
    "0053638247d697c0f031822d6af8aa2d4723107fd7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$analytics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserGrowthHistory"],
    "0091530a4afd1bff67a51b2cf057a19164dc19ddb0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$analytics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOverviewStats"],
    "00ed1c166e62425c61b02ddea5b38303a43215225b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$analytics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPendingItems"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$analytics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/analytics.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$analytics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/analytics.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_1d1ac4c6._.js.map