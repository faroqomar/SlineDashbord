module.exports = [
"[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
;
async function createAdminClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://isddrknbjsgaantjojhm.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY, {
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
"[project]/src/actions/dashboard.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00b0037ad22d9f40e1c42f7bcaf4ab77c719fadbd3":"getOverviewStats"},"",""] */ __turbopack_context__.s([
    "getOverviewStats",
    ()=>getOverviewStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getOverviewStats() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // Parallelize queries for performance
    const [{ count: totalUsers }, { count: activeJobs }, { count: pendingDisputes }] = await Promise.all([
        supabase.from('profiles').select('*', {
            count: 'exact',
            head: true
        }),
        supabase.from('tasks').select('*', {
            count: 'exact',
            head: true
        }).eq('status', 'in_progress'),
        // Assuming we don't have a disputes table yet based on previous file view, we might check 'issues' or similar if it exists, or just mock/0 for now if table missing.
        // Looking at types/supabase.ts in previous turn, I didn't see 'disputes'. I saw 'activity_log'.
        // I will use 0 for disputes for now until I confirm the table.
        Promise.resolve({
            count: 0
        })
    ]);
    // Revenue calculation (Mocked or simple sum if table exists)
    // Let's try to get sum from wallet_transactions where type is 'platform_fee' or similar if standard.
    // For MVP/Phase 2.2, simple count is enough. I will return 0 for revenue if complex calc is needed.
    return {
        totalUsers: totalUsers || 0,
        activeJobs: activeJobs || 0,
        revenue: 0,
        pendingDisputes: pendingDisputes || 0
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getOverviewStats
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getOverviewStats, "00b0037ad22d9f40e1c42f7bcaf4ab77c719fadbd3", null);
}),
"[project]/src/actions/users.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40ae758a227b1ff5ed29a37414091d89aa1da7639a":"getUserFullProfile","706730fd0e009fa2ef4075dad81a98f174537b8d30":"getUsers"},"",""] */ __turbopack_context__.s([
    "getUserFullProfile",
    ()=>getUserFullProfile,
    "getUsers",
    ()=>getUsers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getUsers(page = 1, pageSize = 10, filters) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabase.from('profiles').select('*', {
        count: 'exact'
    });
    if (filters?.query) {
        query = query.or(`full_name.ilike.%${filters.query}%,email.ilike.%${filters.query}%`);
    }
    if (filters?.role && filters.role !== 'all') {
        // Assuming 'active_role' or 'roles' column is used. 
        // Checking typescript definition: profiles has 'active_role' (string) and 'roles' (string[]).
        // Let's filter by active_role for simple view, or contains in roles.
        query = query.eq('active_role', filters.role);
    }
    query = query.range(from, to).order('created_at', {
        ascending: false
    });
    const { data, error, count } = await query;
    if (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
    // Map to DTO
    const userDTOs = data.map((profile)=>({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            role: profile.active_role,
            status: 'active',
            created_at: profile.created_at
        }));
    return {
        data: userDTOs,
        count: count || 0
    };
}
async function getUserFullProfile(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const [profileResult, walletResult, tasksAsClient, tasksAsFreelancer] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('wallet_balances').select('*').eq('user_id', id).single(),
        supabase.from('tasks').select('*').eq('client_id', id).order('created_at', {
            ascending: false
        }).limit(5),
        supabase.from('tasks').select('*').eq('freelancer_id', id).order('created_at', {
            ascending: false
        }).limit(5)
    ]);
    if (profileResult.error) {
        throw new Error(`Profile not found: ${profileResult.error.message}`);
    }
    // We can also try to fetch auth user data using supabase.auth.admin.getUserById(id) 
    // but that requires specific admin permission scope often.
    // Let's stick to public schema relations for now unless explicitly needed.
    return {
        profile: profileResult.data,
        wallet: walletResult.data || {
            available_balance: 0,
            held_balance: 0
        },
        recentClientTasks: tasksAsClient.data || [],
        recentFreelancerTasks: tasksAsFreelancer.data || []
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getUsers,
    getUserFullProfile
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUsers, "706730fd0e009fa2ef4075dad81a98f174537b8d30", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserFullProfile, "40ae758a227b1ff5ed29a37414091d89aa1da7639a", null);
}),
"[project]/.next-internal/server/app/test-actions/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/dashboard.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/users.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/dashboard.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/users.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/.next-internal/server/app/test-actions/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/dashboard.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/users.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00b0037ad22d9f40e1c42f7bcaf4ab77c719fadbd3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOverviewStats"],
    "40ae758a227b1ff5ed29a37414091d89aa1da7639a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserFullProfile"],
    "706730fd0e009fa2ef4075dad81a98f174537b8d30",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUsers"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$test$2d$actions$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/test-actions/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/dashboard.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/users.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/dashboard.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/users.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_bc964ce9._.js.map