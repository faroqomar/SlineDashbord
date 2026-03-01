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
async function enforceRateLimit(action, userId, limit, windowMs) {
    const adminClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const key = `${action}:${userId}`;
    const windowSeconds = Math.max(1, Math.floor(windowMs / 1000));
    const { data: isAllowed, error } = await adminClient.rpc('check_rate_limit', {
        p_key: key,
        p_limit: limit,
        p_window_seconds: windowSeconds
    });
    if (error) {
        console.error('Rate limit check error:', error);
        // Be safe: if rate limiter fails, allow the request but log it.
        // Alternatively, for high-security, throw. Here we allow but log.
        return;
    }
    if (!isAllowed) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }
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

/* __next_internal_action_entry_do_not_use__ [{"000423c6fdc30d08b5e09e4b862e839e562a858fb6":"getRevenueHistory","000778df05bbde2e5625ac71dbe5d4f6dca426bc16":"getRecentActivity","006591678d2c3844cce9b2476847eb1f004ff8f697":"getOverviewStats","006e8ee6727fbc38dd1540ffb1b25729c3b671dd84":"getDashboardOverview","00db6e5fad35a1e71e38aae7c7338dfdbaf0035f38":"getUserGrowthHistory","00f43bd253ee4f8734444106f0808606785f313645":"getPendingItems"},"",""] */ __turbopack_context__.s([
    "getDashboardOverview",
    ()=>getDashboardOverview,
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
async function getDashboardOverview() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$models$2f$analytics$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANALYTICS_READ_ROLES"]);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // Fetch all in parallel using the SAME admin client and AFTER a single auth check
        const [statsRes, activityRes, pendingRes, revenueRes, growthRes] = await Promise.all([
            getOverviewDataInternal(supabase),
            getRecentActivityInternal(supabase),
            getPendingItemsInternal(supabase),
            getRevenueHistoryInternal(supabase),
            getUserGrowthHistoryInternal(supabase)
        ]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            stats: statsRes,
            recentActivity: activityRes,
            pendingItems: pendingRes,
            revenueHistory: revenueRes,
            userGrowth: growthRes
        });
    } catch (error) {
        console.error('getDashboardOverview error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
// Internal helpers that don't perform re-authentication
async function getOverviewDataInternal(supabase) {
    const [profilesResult, revenueResult, disputesResult] = await Promise.all([
        supabase.from('profiles').select('*', {
            count: 'exact',
            head: true
        }).eq('status', 'active'),
        supabase.from('vw_financial_metrics_realtime').select('revenue_iqd').single(),
        supabase.from('disputes').select('*', {
            count: 'exact',
            head: true
        }).in('status', [
            'open',
            'investigating',
            'mediation'
        ])
    ]);
    return {
        activeUsers: profilesResult.count || 0,
        platformRevenue: revenueResult.data?.revenue_iqd || 0,
        openDisputes: disputesResult.count || 0,
        activeSubscriptions: 0
    };
}
async function getRecentActivityInternal(supabase) {
    const { data } = await supabase.from('audit_logs').select(`id, action, created_at, meta, actor:profiles!actor_user_id(full_name, email, avatar_url)`).order('created_at', {
        ascending: false
    }).limit(5);
    const timeAgo = (dateStr)=>{
        const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return seconds + "s ago";
        if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
        if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
        return Math.floor(seconds / 86400) + "d ago";
    };
    return (data || []).map((log)=>({
            id: log.id,
            user: {
                name: log.actor?.full_name || 'System',
                email: log.actor?.email || '',
                avatar: log.actor?.avatar_url
            },
            action: log.action.split(/[._]/).map((w)=>w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            status: 'success',
            time: timeAgo(log.created_at)
        }));
}
async function getPendingItemsInternal(supabase) {
    const [{ count: disputesCount }, { count: ticketsCount }] = await Promise.all([
        supabase.from('disputes').select('*', {
            count: 'exact',
            head: true
        }).in('status', [
            'open',
            'investigating'
        ]),
        supabase.from('support_tickets').select('*', {
            count: 'exact',
            head: true
        }).in('status', [
            'open',
            'in_progress'
        ])
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
async function getRevenueHistoryInternal(supabase) {
    const { data, error } = await supabase.from('vw_analytics_monthly_revenue').select('name, revenue');
    if (error) {
        console.error('getRevenueHistoryInternal error:', error);
        return [];
    }
    return (data || []).map((row)=>({
            name: row.name,
            revenue: Number(row.revenue) || 0
        }));
}
async function getUserGrowthHistoryInternal(supabase) {
    const { data, error } = await supabase.from('vw_analytics_monthly_user_growth').select('name, new_users');
    if (error) {
        console.error('getUserGrowthHistoryInternal error:', error);
        return [];
    }
    return (data || []).map((row)=>({
            name: row.name,
            newUsers: Number(row.new_users) || 0
        }));
}
async function getOverviewStats() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$models$2f$analytics$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANALYTICS_READ_ROLES"]);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const [profilesResult, revenueResult, disputesResult] = await Promise.all([
            // 1. Count active profiles
            supabase.from('profiles').select('*', {
                count: 'exact',
                head: true
            }).eq('status', 'active'),
            // 2. Platform Revenue from Ledger
            supabase.from('vw_financial_metrics_realtime').select('revenue_iqd').single(),
            // 3. Count open disputes
            supabase.from('disputes').select('*', {
                count: 'exact',
                head: true
            }).in('status', [
                'open',
                'investigating',
                'mediation'
            ])
        ]);
        const activeUsers = profilesResult.count || 0;
        const openDisputes = disputesResult.count || 0;
        const platformRevenue = revenueResult.data?.revenue_iqd || 0;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            activeUsers,
            platformRevenue,
            openDisputes,
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
        const { data, error } = await supabase.from('vw_analytics_monthly_revenue').select('name, revenue');
        if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('Error fetching revenue history');
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])((data || []).map((row)=>({
                name: row.name,
                revenue: Number(row.revenue) || 0
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
        const { data, error } = await supabase.from('vw_analytics_monthly_user_growth').select('name, new_users');
        if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('Error fetching user history');
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])((data || []).map((row)=>({
                name: row.name,
                newUsers: Number(row.new_users) || 0
            })));
    } catch (error) {
        console.error('getUserGrowthHistory error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getDashboardOverview,
    getOverviewStats,
    getRecentActivity,
    getPendingItems,
    getRevenueHistory,
    getUserGrowthHistory
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDashboardOverview, "006e8ee6727fbc38dd1540ffb1b25729c3b671dd84", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getOverviewStats, "006591678d2c3844cce9b2476847eb1f004ff8f697", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRecentActivity, "000778df05bbde2e5625ac71dbe5d4f6dca426bc16", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPendingItems, "00f43bd253ee4f8734444106f0808606785f313645", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRevenueHistory, "000423c6fdc30d08b5e09e4b862e839e562a858fb6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserGrowthHistory, "00db6e5fad35a1e71e38aae7c7338dfdbaf0035f38", null);
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
;
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/analytics/services/analytics_actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "000423c6fdc30d08b5e09e4b862e839e562a858fb6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRevenueHistory"],
    "000778df05bbde2e5625ac71dbe5d4f6dca426bc16",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRecentActivity"],
    "006591678d2c3844cce9b2476847eb1f004ff8f697",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOverviewStats"],
    "006e8ee6727fbc38dd1540ffb1b25729c3b671dd84",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDashboardOverview"],
    "00db6e5fad35a1e71e38aae7c7338dfdbaf0035f38",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserGrowthHistory"],
    "00f43bd253ee4f8734444106f0808606785f313645",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPendingItems"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/src/features/analytics/services/analytics_actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analytics$2f$services$2f$analytics_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/analytics/services/analytics_actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_d0396e15._.js.map