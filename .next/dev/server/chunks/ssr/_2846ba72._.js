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
"[project]/src/app/actions/disputes.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40872f71ab5495ae8aba6fa380167bc91b4534afd8":"getDisputeDetails","70f156fd820b2ba9893c5c2ee7b6e88311c7f7d880":"resolveDispute","78172c65ce93af7a42f8a2ebeecf8a242bf088af7b":"getDisputes"},"",""] */ __turbopack_context__.s([
    "getDisputeDetails",
    ()=>getDisputeDetails,
    "getDisputes",
    ()=>getDisputes,
    "resolveDispute",
    ()=>resolveDispute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getDisputes(page = 1, status = 'all', limit = 10, query = '') {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const PAGE_SIZE = limit;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    try {
        let queryBuilder = supabase.from('disputes').select(`
        *,
        task:tasks (
          id,
          title,
          budget,
          budget_cents
        ),
        complainant:profiles!disputes_initiator_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role,
          roles
        ),
        defendant:profiles!disputes_defendant_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role,
          roles
        )
      `, {
            count: 'exact'
        });
        if (status && status !== 'all') {
            queryBuilder = queryBuilder.eq('status', status);
        }
        if (query) {
            queryBuilder = queryBuilder.or(`reason.ilike.%${query}%,id.eq.${query}`);
        }
        queryBuilder = queryBuilder.range(from, to).order('created_at', {
            ascending: false
        });
        const { data: disputesData, error, count } = await queryBuilder;
        if (error) {
            console.error('Error fetching disputes:', error);
            throw new Error('Failed to fetch disputes');
        }
        const disputes = disputesData.map((d)=>({
                id: d.id,
                task_id: d.task?.id || d.task_id,
                task_title: d.task?.title || 'Unknown Task',
                complainant: {
                    id: d.complainant?.id,
                    full_name: d.complainant?.full_name || 'Unknown',
                    avatar_url: d.complainant?.avatar_url || '',
                    email: d.complainant?.email || '',
                    role: d.complainant?.active_role || 'user'
                },
                defendant: {
                    id: d.defendant?.id,
                    full_name: d.defendant?.full_name || 'Unknown',
                    avatar_url: d.defendant?.avatar_url || '',
                    email: d.defendant?.email || '',
                    role: d.defendant?.active_role || 'user'
                },
                reason: d.reason || 'No reason provided',
                status: d.status || 'open',
                amount: d.task?.budget_cents ? d.task.budget_cents / 100 : d.task?.budget || 0,
                created_at: d.created_at
            }));
        return {
            disputes,
            totalPages: Math.ceil((count || 0) / PAGE_SIZE),
            totalDisputes: count || 0
        };
    } catch (error) {
        console.error('getDisputes error:', error);
        return {
            disputes: [],
            totalPages: 0,
            totalDisputes: 0
        };
    }
}
async function getDisputeDetails(id) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    try {
        const { data: d, error } = await supabase.from('disputes').select(`
        *,
        task:tasks (
          id,
          title,
          description,
          budget,
          budget_cents,
          deadline,
          status
        ),
        complainant:profiles!disputes_initiator_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role
        ),
         defendant:profiles!disputes_defendant_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          active_role
        )
      `).eq('id', id).single();
        if (error || !d) {
            // If not found, return null or throw
            throw new Error('Dispute not found');
        }
        const dispute = {
            id: d.id,
            task_id: d.task?.id || d.task_id,
            task_title: d.task?.title || 'Unknown Task',
            complainant: {
                id: d.complainant?.id,
                full_name: d.complainant?.full_name || 'Unknown',
                avatar_url: d.complainant?.avatar_url || '',
                email: d.complainant?.email || '',
                role: d.complainant?.active_role || 'user'
            },
            defendant: {
                id: d.defendant?.id,
                full_name: d.defendant?.full_name || 'Unknown',
                avatar_url: d.defendant?.avatar_url || '',
                email: d.defendant?.email || '',
                role: d.defendant?.active_role || 'user'
            },
            reason: d.reason || 'No reason provided',
            status: d.status || 'open',
            amount: d.task?.budget_cents ? d.task.budget_cents / 100 : d.task?.budget || 0,
            created_at: d.created_at,
            resolution: d.resolution,
            resolved_at: d.resolved_at,
            task_details: {
                description: d.task?.description || '',
                budget: d.task?.budget_cents ? d.task.budget_cents / 100 : d.task?.budget || 0,
                deadline: d.task?.deadline,
                status: d.task?.status || 'unknown'
            }
        };
        return dispute;
    } catch (error) {
        console.error('getDisputeDetails error:', error);
        return null;
    }
}
async function resolveDispute(id, resolution, status) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    try {
        const { error } = await supabase.from('disputes').update({
            resolution,
            status,
            resolved_at: new Date().toISOString()
        }).eq('id', id);
        if (error) throw error;
        // Log action
        await supabase.from('admin_logs').insert({
            action: 'RESOLVE_DISPUTE',
            target_resource: 'dispute',
            target_id: id,
            metadata: {
                resolution,
                status
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/disputes');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/disputes/${id}`);
        return {
            success: true
        };
    } catch (error) {
        console.error('resolveDispute error:', error);
        return {
            success: false,
            error: 'Failed to resolve dispute'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getDisputes,
    getDisputeDetails,
    resolveDispute
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDisputes, "78172c65ce93af7a42f8a2ebeecf8a242bf088af7b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDisputeDetails, "40872f71ab5495ae8aba6fa380167bc91b4534afd8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resolveDispute, "70f156fd820b2ba9893c5c2ee7b6e88311c7f7d880", null);
}),
"[project]/.next-internal/server/app/dashboard/disputes/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/disputes.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$disputes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/disputes.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/disputes/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/disputes.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40872f71ab5495ae8aba6fa380167bc91b4534afd8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$disputes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDisputeDetails"],
    "70f156fd820b2ba9893c5c2ee7b6e88311c7f7d880",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$disputes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resolveDispute"],
    "78172c65ce93af7a42f8a2ebeecf8a242bf088af7b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$disputes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDisputes"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$disputes$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$disputes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/disputes/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/disputes.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$disputes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/disputes.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_2846ba72._.js.map