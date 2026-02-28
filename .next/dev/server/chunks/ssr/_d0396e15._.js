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
"[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://isddrknbjsgaantjojhm.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGRya25ianNnYWFudGpvamhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzEzNTAsImV4cCI6MjA2ODI0NzM1MH0.nszrlk0ZUmn94ur0mUQPr_ObIRy-wGe8Z-uOCyZuftc"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/src/features/core/security/security_guards.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enforceRateLimit",
    ()=>enforceRateLimit,
    "logAuditEvent",
    ()=>logAuditEvent,
    "requireAdminRole",
    ()=>requireAdminRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
;
;
;
async function requireAdminRole(allowedRoles) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Unauthorized: No active session');
    }
    // Check the admin_users whitelist table which bypasses RLS using the admin client
    const adminDb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const { data: adminUser, error: adminError } = await adminDb.from('admin_users').select('role').eq('id', user.id).single();
    if (adminError || !adminUser) {
        throw new Error('Unauthorized: Not an admin');
    }
    if (!allowedRoles.includes(adminUser.role)) {
        throw new Error(`Forbidden: Insufficient permissions. Required one of: ${allowedRoles.join(', ')}`);
    }
    return {
        userId: user.id,
        role: adminUser.role
    };
}
async function logAuditEvent(payload) {
    const adminClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const { error } = await adminClient.from('audit_logs').insert(payload);
    if (error) {
        console.error('Failed to write audit log:', error);
        // Strict adherence: if we can't log it, we shouldn't allow the action to complete silently.
        throw new Error(`Audit Log Failure: ${error.message}`);
    }
}
// Basic in-memory rate limiter using a sliding window approach. 
// NOTE: Since Server Actions run in a serverless environment (Vercel), memory may reset on cold starts.
// For true production rigidness, Upstash Redis is recommended.
const rateLimitCache = new Map();
function enforceRateLimit(action, userId, limit, windowMs) {
    const now = Date.now();
    const key = `${action}:${userId}`;
    const timestamps = rateLimitCache.get(key) || [];
    // Filter out timestamps outside the sliding window
    const validTimestamps = timestamps.filter((t)=>now - t < windowMs);
    if (validTimestamps.length >= limit) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }
    validTimestamps.push(now);
    rateLimitCache.set(key, validTimestamps);
}
}),
"[project]/src/features/core/models/result.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fail",
    ()=>fail,
    "ok",
    ()=>ok,
    "toErrorMessage",
    ()=>toErrorMessage
]);
function ok(data) {
    return {
        success: true,
        data
    };
}
function fail(error) {
    return {
        success: false,
        error
    };
}
function toErrorMessage(e) {
    if (e instanceof Error) return e.message;
    if (typeof e === 'string') return e;
    return 'An unknown error occurred';
}
}),
"[project]/src/features/analytics/models/analytics.schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ANALYTICS_READ_ROLES",
    ()=>ANALYTICS_READ_ROLES
]);
const ANALYTICS_READ_ROLES = [
    'support',
    'moderator',
    'admin',
    'super_admin'
];
}),
"[project]/src/features/analytics/services/analytics_actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00025f761a9d3e9e8f78d09a0e80e256a8ba600ed2":"getRevenueHistory","003f20c7229bd2d35dbcb0160492ba5a1ce236d877":"getRecentActivity","00914bed8bc5690c0959b0fca66c570ef5ef652a35":"getPendingItems","0093303300d455bddb4aaef75f21bdb6b198db0436":"getOverviewStats","00c0e959861ea519df9daaf3d52f375987da1ad0f9":"getUserGrowthHistory"},"",""] */ __turbopack_context__.s([
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/core/security/security_guards.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/core/models/result.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$models$2f$analytics$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/analytics/models/analytics.schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function getOverviewStats() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$models$2f$analytics$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANALYTICS_READ_ROLES"]);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { count: userCount } = await supabase.from('profiles').select('*', {
            count: 'exact',
            head: true
        });
        // Revenue logic using completed tasks proxy
        const { data: revenueData } = await supabase.from('tasks').select('budget').eq('status', 'completed');
        let revenue = 0;
        if (revenueData) {
            revenue = revenueData.reduce((acc, curr)=>acc + (Number(curr.budget) || 0), 0);
        }
        const { count: disputeCount } = await supabase.from('disputes').select('*', {
            count: 'exact',
            head: true
        }).in('status', [
            'open',
            'investigating',
            'mediation'
        ]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            activeUsers: userCount || 0,
            platformRevenue: revenue,
            openDisputes: disputeCount || 0,
            activeSubscriptions: 0
        });
    } catch (error) {
        console.error('getOverviewStats error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
async function getRecentActivity() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$models$2f$analytics$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANALYTICS_READ_ROLES"]);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { data, error } = await supabase.from('audit_logs') // Changed from admin_logs to newly standardized audit_logs
        .select(`
        id,
        action,
        created_at,
        meta,
        actor:profiles!actor_user_id(full_name, email, avatar_url)
      `).order('created_at', {
            ascending: false
        }).limit(5);
        if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('Error fetching activity');
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
        function formatActionName(action) {
            return action.split(/[_.]/).map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
        const activity = (data || []).map((log)=>({
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])(activity);
    } catch (error) {
        console.error('getRecentActivity error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
async function getPendingItems() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$models$2f$analytics$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANALYTICS_READ_ROLES"]);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { count: disputesCount } = await supabase.from('disputes').select('*', {
            count: 'exact',
            head: true
        }).in('status', [
            'open',
            'investigating'
        ]);
        const { count: ticketsCount } = await supabase.from('support_tickets').select('*', {
            count: 'exact',
            head: true
        }).in('status', [
            'open',
            'in_progress'
        ]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])([
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
        ]);
    } catch (error) {
        console.error('getPendingItems error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
async function getRevenueHistory() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$models$2f$analytics$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANALYTICS_READ_ROLES"]);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { data, error } = await supabase.from('tasks').select('budget, created_at').eq('status', 'completed').gte('created_at', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString());
        if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('Error fetching revenue history');
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])(Object.entries(monthlyData).map(([name, revenue])=>({
                name,
                revenue
            })));
    } catch (error) {
        console.error('getRevenueHistory error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
async function getUserGrowthHistory() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$models$2f$analytics$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANALYTICS_READ_ROLES"]);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { data, error } = await supabase.from('profiles').select('created_at').gte('created_at', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString());
        if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('Error fetching user history');
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])(Object.entries(monthlyData).map(([name, newUsers])=>({
                name,
                newUsers
            })));
    } catch (error) {
        console.error('getUserGrowthHistory error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getOverviewStats,
    getRecentActivity,
    getPendingItems,
    getRevenueHistory,
    getUserGrowthHistory
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getOverviewStats, "0093303300d455bddb4aaef75f21bdb6b198db0436", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRecentActivity, "003f20c7229bd2d35dbcb0160492ba5a1ce236d877", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPendingItems, "00914bed8bc5690c0959b0fca66c570ef5ef652a35", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRevenueHistory, "00025f761a9d3e9e8f78d09a0e80e256a8ba600ed2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserGrowthHistory, "00c0e959861ea519df9daaf3d52f375987da1ad0f9", null);
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/analytics/services/analytics_actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/analytics/services/analytics_actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/analytics/services/analytics_actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00025f761a9d3e9e8f78d09a0e80e256a8ba600ed2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRevenueHistory"],
    "003f20c7229bd2d35dbcb0160492ba5a1ce236d877",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRecentActivity"],
    "00914bed8bc5690c0959b0fca66c570ef5ef652a35",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPendingItems"],
    "0093303300d455bddb4aaef75f21bdb6b198db0436",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOverviewStats"],
    "00c0e959861ea519df9daaf3d52f375987da1ad0f9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserGrowthHistory"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/src/features/analytics/services/analytics_actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/analytics/services/analytics_actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_d0396e15._.js.map