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
"[project]/src/app/actions/users.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40456c05c1c29d9ef075d8747116143aff23443bf8":"getUserDetails","7001851ea1382587ca80b714a29ca216a484c86c37":"suspendUser","70e66ef0a95fcec3a6337c904c54fc50e64e408b33":"getUsers"},"",""] */ __turbopack_context__.s([
    "getUserDetails",
    ()=>getUserDetails,
    "getUsers",
    ()=>getUsers,
    "suspendUser",
    ()=>suspendUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getUsers(page = 1, query = '', roleStr = 'all') {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const PAGE_SIZE = 10;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    try {
        // 1. Fetch from auth.users (List users)
        // Note: listUsers() does not support complex filtering/sorting efficiently on the server side 
        // without using the experimental listUsers() params or fetching all and filtering. 
        // For scale, we should index profiles, but for now we'll fetch from profiles which is joined to auth in refined arch.
        // HOWEVER, the plan said "Source: auth.users (joined with public.profiles)". 
        // Direct Access to auth.users implies using admin API.
        // Better Approach for Admin Dashboard: Query the `public.profiles` table which should duplicate key auth info 
        // OR use listUsers for Auth info and map profiles.
        // Let's use `public.profiles` as the primary source for the LIST view if it exists and has email,
        // otherwise we accept the limitation of listUsers or we join manually.
        // Based on previous files, `profiles` has `id, name, email` usually.
        // Let's check profiles columns first? No, let's assume standard Supabase pattern:
        // Profiles table is usually the source of truth for app data.
        let queryBuilder = supabase.from('profiles').select('*', {
            count: 'exact'
        });
        if (query) {
            queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
        }
        // Role filtering (assuming role column exists on profile or we need to check metadata)
        if (roleStr && roleStr !== 'all') {
            // Assuming 'role' column on profiles or metadata check.
            // Let's assume a 'role' column for now based on standard schemas, or ignore if specific to claims.
            queryBuilder = queryBuilder.eq('role', roleStr);
        }
        queryBuilder = queryBuilder.range(from, to).order('created_at', {
            ascending: false
        });
        const { data: profiles, error, count } = await queryBuilder;
        if (error) {
            console.error('Error fetching profiles:', error);
            throw new Error('Failed to fetch users');
        }
        // If profiles don't contain email/status, we might need to fetch auth users too. 
        // But typically `profiles` copies email via trigger.
        // Let's assume profiles has what we need for the list.
        const users = profiles.map((p)=>({
                id: p.id,
                email: p.email || '',
                full_name: p.full_name || 'Unknown',
                avatar_url: p.avatar_url || '',
                role: p.active_role || p.roles && p.roles[0] || 'user',
                roles: p.roles || [
                    'user'
                ],
                active_role: p.active_role || 'user',
                status: p.status || 'active',
                created_at: p.created_at,
                last_sign_in_at: p.updated_at
            }));
        return {
            users,
            totalPages: Math.ceil((count || 0) / PAGE_SIZE),
            totalUsers: count || 0
        };
    } catch (error) {
        console.error('getUsers error:', error);
        return {
            users: [],
            totalPages: 0,
            totalUsers: 0
        };
    }
}
async function getUserDetails(id) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    try {
        // Parallel fetch: Auth User (for sensitive metadata) + Profile (public info)
        const [authRes, profileRes] = await Promise.all([
            supabase.auth.admin.getUserById(id),
            supabase.from('profiles').select('*').eq('id', id).single()
        ]);
        if (authRes.error || !authRes.data.user) throw new Error('User not found in Auth');
        const authUser = authRes.data.user;
        const profile = profileRes.data || {};
        // Get aggregated stats (mocked logic or real tables later)
        // const { count: taskCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('owner_id', id);
        const user = {
            id: authUser.id,
            email: authUser.email,
            full_name: profile.full_name || authUser.user_metadata?.full_name || 'Unknown',
            avatar_url: profile.avatar_url || authUser.user_metadata?.avatar_url || '',
            role: profile.active_role || profile.roles && profile.roles[0] || authUser.app_metadata?.role || 'user',
            roles: profile.roles || [
                'user'
            ],
            active_role: profile.active_role || 'user',
            status: authUser.banned_until ? 'banned' : profile.status || 'active',
            created_at: authUser.created_at,
            last_sign_in_at: authUser.last_sign_in_at || '',
            phone: authUser.phone || '',
            bio: profile.bio || '',
            rating: profile.rating || 0,
            // These would come from a 'wallets' or 'transactions' table
            spent: 0,
            earned: 0,
            job_count: 0,
            metadata: authUser.user_metadata
        };
        return user;
    } catch (error) {
        console.error('getUserDetails error:', error);
        return null;
    }
}
async function suspendUser(id, reason, duration) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    try {
        const banDuration = duration === 'permanent' ? '9999-12-31' : duration === '30d' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h default
        // 1. Update Auth User (Ban)
        const { error: banError } = await supabase.auth.admin.updateUserById(id, {
            ban_duration: duration === 'permanent' ? '876000h' : '720h' // 100 years or 30 days
        });
        if (banError) throw banError;
        // 2. Update Public Profile Status
        await supabase.from('profiles').update({
            status: 'suspended'
        }).eq('id', id);
        // 3. Log Action
        await supabase.from('admin_logs').insert({
            action: 'BAN_USER',
            target_resource: 'user',
            target_id: id,
            metadata: {
                reason,
                duration
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/users');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/users/${id}`);
        return {
            success: true
        };
    } catch (error) {
        console.error('suspendUser error:', error);
        return {
            success: false,
            error: 'Failed to suspend user'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getUsers,
    getUserDetails,
    suspendUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUsers, "70e66ef0a95fcec3a6337c904c54fc50e64e408b33", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserDetails, "40456c05c1c29d9ef075d8747116143aff23443bf8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(suspendUser, "7001851ea1382587ca80b714a29ca216a484c86c37", null);
}),
"[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"607d3d7e7a8170bbeb45daa7f78a12ecddfb44076b":"getLogsByTarget","7832b09be0f38b863225787ca07855bcbe774df52b":"getSystemLogs"},"",""] */ __turbopack_context__.s([
    "getLogsByTarget",
    ()=>getLogsByTarget,
    "getSystemLogs",
    ()=>getSystemLogs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getSystemLogs(page = 1, actionFilter = 'all', limit = 20, query = '') {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const PAGE_SIZE = limit;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let queryBuilder = supabase.from('admin_logs').select(`
      *,
      actor:profiles!admin_logs_actor_id_fkey(id, full_name, email, avatar_url)
    `, {
        count: 'exact'
    }).range(from, to).order('created_at', {
        ascending: false
    });
    if (actionFilter !== 'all') {
        queryBuilder = queryBuilder.eq('action', actionFilter);
    }
    if (query) {
        queryBuilder = queryBuilder.ilike('target_resource', `%${query}%`);
    }
    const { data, error, count } = await queryBuilder;
    if (error) {
        console.error('Error fetching logs:', error);
        throw new Error('Failed to fetch logs');
    }
    const logs = (data || []).map((log)=>({
            id: log.id,
            event_type: log.action,
            entity_type: log.target_resource || 'system',
            entity_id: log.target_id,
            metadata: log.details || log.metadata || {},
            created_at: log.created_at,
            actor: log.actor ? {
                id: log.actor.id,
                full_name: log.actor.full_name,
                email: log.actor.email,
                avatar_url: log.actor.avatar_url
            } : undefined
        }));
    return {
        logs,
        count: count || 0,
        totalPages: count ? Math.ceil(count / PAGE_SIZE) : 0
    };
}
async function getLogsByTarget(targetId, limit = 20) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const { data, error } = await supabase.from('admin_logs').select(`
      *,
      actor:profiles!admin_logs_actor_id_fkey(id, full_name, email, avatar_url)
    `).or(`target_id.eq.${targetId},actor_id.eq.${targetId}`) // User could be target (e.g. updated) or actor (e.g. logged in, but actor_id is usually admin_user? No, if we log user actions, actor_id is user. Checking schema/usage...)
    .order('created_at', {
        ascending: false
    }).limit(limit);
    if (error) {
        console.error('Error fetching target logs:', error);
        return [];
    }
    return (data || []).map((log)=>({
            id: log.id,
            event_type: log.action,
            entity_type: log.target_resource || 'system',
            entity_id: log.target_id,
            metadata: log.details || log.metadata || {},
            created_at: log.created_at,
            actor: log.actor ? {
                id: log.actor.id,
                full_name: log.actor.full_name,
                email: log.actor.email,
                avatar_url: log.actor.avatar_url
            } : undefined
        }));
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getSystemLogs,
    getLogsByTarget
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSystemLogs, "7832b09be0f38b863225787ca07855bcbe774df52b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLogsByTarget, "607d3d7e7a8170bbeb45daa7f78a12ecddfb44076b", null);
}),
"[project]/.next-internal/server/app/dashboard/users/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/users.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/users.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$logs$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/users/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/users.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40456c05c1c29d9ef075d8747116143aff23443bf8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserDetails"],
    "607d3d7e7a8170bbeb45daa7f78a12ecddfb44076b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$logs$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLogsByTarget"],
    "7001851ea1382587ca80b714a29ca216a484c86c37",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suspendUser"],
    "70e66ef0a95fcec3a6337c904c54fc50e64e408b33",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUsers"],
    "7832b09be0f38b863225787ca07855bcbe774df52b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$logs$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSystemLogs"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$users$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$logs$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/users/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/users.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/users.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$logs$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_561928f9._.js.map