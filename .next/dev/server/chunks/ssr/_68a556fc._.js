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
"[project]/src/actions/test-helpers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00665dccd515fb00667cc0dee8b94c8da67fe404a9":"getDisputes","40dcc46a7347ef1eb9385ae3e499e1147c7f4d3a98":"createTestDispute"},"",""] */ __turbopack_context__.s([
    "createTestDispute",
    ()=>createTestDispute,
    "getDisputes",
    ()=>getDisputes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function createTestDispute(adminId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // 1. Get a random task or create one
    const { data: formattedTasks } = await supabase.from('tasks').select('id, client_id, budget').limit(1);
    if (!formattedTasks || formattedTasks.length === 0) {
        throw new Error("No tasks found to dispute. Create a task first.");
    }
    const task = formattedTasks[0];
    // 2. Insert a dispute
    const { data, error } = await supabase.from('disputes').insert({
        task_id: task.id,
        initiator_id: task.client_id,
        reason: 'Test Dispute created by Admin Verification',
        status: 'open'
    }).select().single();
    if (error) throw error;
    return data;
}
async function getDisputes() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const { data } = await supabase.from('disputes').select('*').order('created_at', {
        ascending: false
    });
    return data || [];
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createTestDispute,
    getDisputes
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createTestDispute, "40dcc46a7347ef1eb9385ae3e499e1147c7f4d3a98", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDisputes, "00665dccd515fb00667cc0dee8b94c8da67fe404a9", null);
}),
"[project]/src/lib/audit.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logAdminAction",
    ()=>logAdminAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
;
async function logAdminAction(adminId, action, entityId, entityType, metadata = {}) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // "activity_log" columns based on src/types/supabase.ts:
    // actor_id: string
    // user_id: string (who is this about? usually the target entity if it's a user, or the admin if not)
    // entity_id: string
    // entity_type: string
    // event_type: string
    // metadata: Json
    // For admin logs:
    // actor_id = adminId
    // user_id = entityId (if entity is user) OR adminId (if entity is system/dispute) - this depends on how we want to query "user history". 
    // Let's assume user_id is the "Target User" if applicable, otherwise fallback to adminId or a system ID.
    const targetUserId = entityType === 'user' ? entityId : adminId;
    const { error } = await supabase.from('activity_log').insert({
        actor_id: adminId,
        user_id: targetUserId,
        entity_id: entityId,
        entity_type: entityType,
        event_type: action,
        metadata: metadata,
        is_read: false
    });
    if (error) {
        console.error('CRITICAL: Failed to log admin action:', error);
        // In a strict financial system, we might want to throw here to prevent the action from succeeding without a log.
        throw new Error(`Audit Logging Failed: ${error.message}`);
    }
    return true;
}
}),
"[project]/src/actions/user-mutations.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60a78c8b85a36cd0077c8c08f7daf14ea5cad69d9f":"unbanUser","60c002753d7f3160ffae211509dee4979f29043c3a":"verifyUser","701fb78b77502817307eb56dee303026e4993c19cc":"banUser"},"",""] */ __turbopack_context__.s([
    "banUser",
    ()=>banUser,
    "unbanUser",
    ()=>unbanUser,
    "verifyUser",
    ()=>verifyUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function banUser(adminId, userId, reason) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // 1. Update the user's profile status
    const { error } = await supabase.from('profiles').update({
        status: 'banned',
        metadata: {
            ban_reason: reason,
            banned_by: adminId,
            banned_at: new Date().toISOString()
        }
    }) // Casting as any because types might not be regenerated yet
    .eq('id', userId);
    if (error) {
        console.error('Error banning user:', error);
        throw new Error(`Failed to ban user: ${error.message}`);
    }
    // 2. Log the action
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAdminAction"])(adminId, 'user_banned', userId, 'user', {
            reason
        });
    } catch (logError) {
        // In a strict system, we might want to rollback the ban here.
        console.error('Audit log failed for banUser:', logError);
    }
    // 3. Revalidate paths to refresh UI
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/users');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/users/${userId}`);
    return {
        success: true
    };
}
async function unbanUser(adminId, userId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const { error } = await supabase.from('profiles').update({
        status: 'active',
        metadata: {
            unbanned_by: adminId,
            unbanned_at: new Date().toISOString()
        }
    }).eq('id', userId);
    if (error) {
        throw new Error(`Failed to unban user: ${error.message}`);
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAdminAction"])(adminId, 'user_unbanned', userId, 'user');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/users');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/users/${userId}`);
    return {
        success: true
    };
}
async function verifyUser(adminId, userId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // Assuming we might use a metadata flag for verification if not a column
    // Or if we decide to add is_verified column later. For now, let's just log it and maybe add a metadata tag.
    const { error } = await supabase.from('profiles').update({
        metadata: {
            is_verified: true,
            verified_by: adminId,
            verified_at: new Date().toISOString()
        }
    }).eq('id', userId);
    if (error) {
        throw new Error(`Failed to verify user: ${error.message}`);
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAdminAction"])(adminId, 'user_verified', userId, 'user');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/users');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/users/${userId}`);
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    banUser,
    unbanUser,
    verifyUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(banUser, "701fb78b77502817307eb56dee303026e4993c19cc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(unbanUser, "60a78c8b85a36cd0077c8c08f7daf14ea5cad69d9f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(verifyUser, "60c002753d7f3160ffae211509dee4979f29043c3a", null);
}),
"[project]/src/actions/dispute-mutations.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"70975ed37745046ed8202a837392ed260a08b31049":"resolveDispute"},"",""] */ __turbopack_context__.s([
    "resolveDispute",
    ()=>resolveDispute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function resolveDispute(adminId, disputeId, decision) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // 1. Call the RPC
    const { error } = await supabase.rpc('admin_resolve_dispute', {
        p_dispute_id: disputeId,
        p_decision: decision
    });
    if (error) {
        console.error('Error resolving dispute:', error);
        throw new Error(`Failed to resolve dispute: ${error.message}`);
    }
    // 2. Log the action
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAdminAction"])(adminId, 'dispute_resolved', disputeId, 'dispute', {
            decision
        });
    } catch (logError) {
        console.error('Audit log failed for resolveDispute:', logError);
    }
    // 3. Revalidate paths
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/disputes');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/finance'); // Balances changed
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/disputes/${disputeId}`);
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    resolveDispute
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resolveDispute, "70975ed37745046ed8202a837392ed260a08b31049", null);
}),
"[project]/.next-internal/server/app/test-mutations/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/users.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/test-helpers.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/actions/user-mutations.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/actions/dispute-mutations.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/users.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$test$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/test-helpers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$user$2d$mutations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/user-mutations.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$dispute$2d$mutations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/dispute-mutations.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/test-mutations/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/users.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/test-helpers.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/actions/user-mutations.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/actions/dispute-mutations.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00665dccd515fb00667cc0dee8b94c8da67fe404a9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$test$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDisputes"],
    "40ae758a227b1ff5ed29a37414091d89aa1da7639a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserFullProfile"],
    "40dcc46a7347ef1eb9385ae3e499e1147c7f4d3a98",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$test$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTestDispute"],
    "60a78c8b85a36cd0077c8c08f7daf14ea5cad69d9f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$user$2d$mutations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unbanUser"],
    "60c002753d7f3160ffae211509dee4979f29043c3a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$user$2d$mutations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyUser"],
    "701fb78b77502817307eb56dee303026e4993c19cc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$user$2d$mutations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["banUser"],
    "706730fd0e009fa2ef4075dad81a98f174537b8d30",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUsers"],
    "70975ed37745046ed8202a837392ed260a08b31049",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$dispute$2d$mutations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resolveDispute"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$test$2d$mutations$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$test$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$user$2d$mutations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$dispute$2d$mutations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/test-mutations/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/users.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/test-helpers.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/actions/user-mutations.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/actions/dispute-mutations.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/users.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$test$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/test-helpers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$user$2d$mutations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/user-mutations.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$dispute$2d$mutations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/dispute-mutations.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_68a556fc._.js.map