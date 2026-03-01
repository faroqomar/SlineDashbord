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
"[project]/src/features/users/models/user.schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BanUserSchema",
    ()=>BanUserSchema,
    "GetUserDetailsSchema",
    ()=>GetUserDetailsSchema,
    "GetUsersSchema",
    ()=>GetUsersSchema,
    "SuspendUserSchema",
    ()=>SuspendUserSchema,
    "USERS_READ_ROLES",
    ()=>USERS_READ_ROLES,
    "USERS_WRITE_ROLES",
    ()=>USERS_WRITE_ROLES,
    "UnbanUserSchema",
    ()=>UnbanUserSchema,
    "VerifyUserSchema",
    ()=>VerifyUserSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const GetUsersSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    page: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().default(1),
    query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default(''),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('all')
});
const GetUserDetailsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid User ID")
});
const SuspendUserSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid User ID"),
    reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(5, "Reason must be at least 5 characters").max(500, "Reason is too long"),
    duration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        '24h',
        '30d',
        'permanent'
    ]).default('24h')
});
const BanUserSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid User ID"),
    reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(5, "Reason must be at least 5 characters").max(500, "Reason is too long")
});
const UnbanUserSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid User ID")
});
const VerifyUserSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid User ID")
});
const USERS_READ_ROLES = [
    'support',
    'moderator',
    'admin',
    'super_admin'
];
const USERS_WRITE_ROLES = [
    'admin',
    'super_admin'
];
}),
"[project]/src/features/users/services/user_actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"403043e39664001ef442dd3fc808591c2c095a2193":"unbanUser","404ff4eaa9c7159743d1820427794640e7de49699a":"getUserDetails","40eaf36f7231dcfbeabac2794beae6beb3174aa116":"verifyUser","606a53046bbb9135285bbd927004554e71f26c4ae5":"banUser","704823146b11fe2e607674c0df61e6171879aef5ef":"getUsers","70971c68966d52546dc36cefc7e70584a998c9a501":"suspendUser"},"",""] */ __turbopack_context__.s([
    "banUser",
    ()=>banUser,
    "getUserDetails",
    ()=>getUserDetails,
    "getUsers",
    ()=>getUsers,
    "suspendUser",
    ()=>suspendUser,
    "unbanUser",
    ()=>unbanUser,
    "verifyUser",
    ()=>verifyUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/core/security/security_guards.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/core/models/result.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/users/models/user.schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function getUsers(page = 1, query = '', roleStr = 'all') {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GetUsersSchema"].safeParse({
            page,
            query,
            role: roleStr
        });
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsed.error.issues[0].message);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["USERS_READ_ROLES"]);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const PAGE_SIZE = 10;
        const from = (parsed.data.page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        let queryBuilder = supabase.from('profiles').select('*', {
            count: 'exact'
        });
        if (parsed.data.query) {
            queryBuilder = queryBuilder.or(`full_name.ilike.%${parsed.data.query}%,email.ilike.%${parsed.data.query}%`);
        }
        if (parsed.data.role && parsed.data.role !== 'all') {
            queryBuilder = queryBuilder.eq('role', parsed.data.role);
        }
        queryBuilder = queryBuilder.range(from, to).order('created_at', {
            ascending: false
        });
        const { data: profiles, error, count } = await queryBuilder;
        if (error) {
            console.error('Error fetching profiles:', error);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('Failed to fetch users');
        }
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            users,
            totalPages: Math.ceil((count || 0) / PAGE_SIZE),
            totalUsers: count || 0
        });
    } catch (error) {
        console.error('getUsers error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
async function getUserDetails(id) {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GetUserDetailsSchema"].safeParse({
            id
        });
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsed.error.issues[0].message);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["USERS_READ_ROLES"]);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const [authRes, profileRes, tasksRes, walletRes] = await Promise.all([
            supabase.auth.admin.getUserById(parsed.data.id),
            supabase.from('profiles').select('*').eq('id', parsed.data.id).single(),
            supabase.from('tasks').select('*').or(`client_id.eq.${parsed.data.id},freelancer_id.eq.${parsed.data.id}`).order('created_at', {
                ascending: false
            }).limit(10),
            supabase.from('vw_wallet_balances_user').select('available_balance').eq('user_id', parsed.data.id).maybeSingle()
        ]);
        if (authRes.error || !authRes.data.user) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('User not found in Auth system');
        const authUser = authRes.data.user;
        const profile = profileRes.data || {};
        const recent_activity = tasksRes.data || [];
        const wallet_balance = walletRes.data?.available_balance || 0;
        const job_count = recent_activity.length; // Approximate for now
        const user = {
            id: authUser.id,
            email: authUser.email || '',
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
            spent: 0,
            earned: 0,
            job_count,
            wallet_balance,
            recent_activity,
            metadata: authUser.user_metadata
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])(user);
    } catch (error) {
        console.error('getUserDetails error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
async function suspendUser(id, reason, duration) {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SuspendUserSchema"].safeParse({
            id,
            reason,
            duration
        });
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsed.error.issues[0].message);
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["USERS_WRITE_ROLES"]);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enforceRateLimit"])('suspend_user', userId, 5, 60000);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const durationInput = parsed.data.duration;
        const banDurationStr = durationInput === 'permanent' ? '876000h' : durationInput === '30d' ? '720h' : '24h';
        // 1. Update Auth User (Ban)
        const { error: banError } = await supabase.auth.admin.updateUserById(parsed.data.id, {
            ban_duration: banDurationStr
        });
        if (banError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(`Ban failed: ${banError.message}`);
        // 2. Update Public Profile Status
        await supabase.from('profiles').update({
            status: 'suspended'
        }).eq('id', parsed.data.id);
        // 3. Log Action securely to audit_logs
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])({
            action: 'admin.users.suspend',
            actor_user_id: userId,
            related_entity_type: 'profile',
            related_entity_id: parsed.data.id,
            meta: {
                reason: parsed.data.reason,
                duration: durationInput
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/users');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/users/${parsed.data.id}`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            id: parsed.data.id
        });
    } catch (error) {
        console.error('suspendUser error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
async function banUser(userId, reason) {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BanUserSchema"].safeParse({
            userId,
            reason
        });
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsed.error.issues[0].message);
        const { userId: adminId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["USERS_WRITE_ROLES"]);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enforceRateLimit"])('ban_user', adminId, 5, 60000);
        const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // Fetch existing metadata to avoid overwriting
        const { data: profile } = await supabaseAdmin.from('profiles').select('metadata').eq('id', parsed.data.userId).single();
        const currentMetadata = profile?.metadata || {};
        const { error: profileError } = await supabaseAdmin.from('profiles').update({
            status: 'banned',
            metadata: {
                ...currentMetadata,
                ban_reason: parsed.data.reason,
                banned_by: adminId,
                banned_at: new Date().toISOString()
            }
        }).eq('id', parsed.data.userId);
        if (profileError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(`Failed to ban user profile: ${profileError.message}`);
        const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(parsed.data.userId, {
            ban_duration: '876000h' // ~100 years
        });
        if (banError) console.error('Failed to ban user in Auth:', banError);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])({
            action: 'admin.users.ban',
            actor_user_id: adminId,
            related_entity_type: 'profile',
            related_entity_id: parsed.data.userId,
            meta: {
                reason: parsed.data.reason
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/users');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/users/${parsed.data.userId}`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            userId: parsed.data.userId
        });
    } catch (error) {
        console.error('banUser error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
async function unbanUser(userId) {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UnbanUserSchema"].safeParse({
            userId
        });
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsed.error.issues[0].message);
        const { userId: adminId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["USERS_WRITE_ROLES"]);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enforceRateLimit"])('unban_user', adminId, 5, 60000);
        const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // Fetch existing metadata to avoid overwriting
        const { data: profile } = await supabaseAdmin.from('profiles').select('metadata').eq('id', parsed.data.userId).single();
        const currentMetadata = profile?.metadata || {};
        const { error: profileError } = await supabaseAdmin.from('profiles').update({
            status: 'active',
            metadata: {
                ...currentMetadata,
                unbanned_by: adminId,
                unbanned_at: new Date().toISOString()
            }
        }).eq('id', parsed.data.userId);
        if (profileError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(`Failed to unban user profile: ${profileError.message}`);
        const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(parsed.data.userId, {
            ban_duration: 'none'
        });
        if (banError) console.error('Failed to unban user in Auth:', banError);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])({
            action: 'admin.users.unban',
            actor_user_id: adminId,
            related_entity_type: 'profile',
            related_entity_id: parsed.data.userId,
            meta: {}
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/users');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/users/${parsed.data.userId}`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            userId: parsed.data.userId
        });
    } catch (error) {
        console.error('unbanUser error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
async function verifyUser(userId) {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VerifyUserSchema"].safeParse({
            userId
        });
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsed.error.issues[0].message);
        const { userId: adminId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$models$2f$user$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["USERS_WRITE_ROLES"]);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enforceRateLimit"])('verify_user', adminId, 10, 60000);
        const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // Fetch existing metadata to avoid overwriting
        const { data: profile } = await supabaseAdmin.from('profiles').select('metadata').eq('id', parsed.data.userId).single();
        const currentMetadata = profile?.metadata || {};
        const { error: profileError } = await supabaseAdmin.from('profiles').update({
            metadata: {
                ...currentMetadata,
                is_verified: true,
                verified_by: adminId,
                verified_at: new Date().toISOString()
            }
        }).eq('id', parsed.data.userId);
        if (profileError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(`Failed to verify user profile: ${profileError.message}`);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])({
            action: 'admin.users.verify',
            actor_user_id: adminId,
            related_entity_type: 'profile',
            related_entity_id: parsed.data.userId,
            meta: {}
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/users');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/users/${parsed.data.userId}`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            userId: parsed.data.userId
        });
    } catch (error) {
        console.error('verifyUser error:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toErrorMessage"])(error));
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getUsers,
    getUserDetails,
    suspendUser,
    banUser,
    unbanUser,
    verifyUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUsers, "704823146b11fe2e607674c0df61e6171879aef5ef", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserDetails, "404ff4eaa9c7159743d1820427794640e7de49699a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(suspendUser, "70971c68966d52546dc36cefc7e70584a998c9a501", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(banUser, "606a53046bbb9135285bbd927004554e71f26c4ae5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(unbanUser, "403043e39664001ef442dd3fc808591c2c095a2193", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(verifyUser, "40eaf36f7231dcfbeabac2794beae6beb3174aa116", null);
}),
"[project]/.next-internal/server/app/dashboard/users/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/users/services/user_actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$services$2f$user_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/users/services/user_actions.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/.next-internal/server/app/dashboard/users/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/users/services/user_actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "704823146b11fe2e607674c0df61e6171879aef5ef",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$services$2f$user_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUsers"],
    "70971c68966d52546dc36cefc7e70584a998c9a501",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$services$2f$user_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suspendUser"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$users$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$features$2f$users$2f$services$2f$user_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/users/page/actions.js { ACTIONS_MODULE0 => "[project]/src/features/users/services/user_actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$services$2f$user_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/users/services/user_actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_a69245d1._.js.map