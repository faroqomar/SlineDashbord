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
"[project]/.next-internal/server/app/dashboard/logs/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$logs$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/.next-internal/server/app/dashboard/logs/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "607d3d7e7a8170bbeb45daa7f78a12ecddfb44076b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$logs$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLogsByTarget"],
    "7832b09be0f38b863225787ca07855bcbe774df52b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$logs$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSystemLogs"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$logs$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$logs$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/logs/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$logs$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/logs.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_3a8053aa._.js.map