module.exports = [
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
"[project]/src/features/core/security/data_masking.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "maskMetaForRole",
    ()=>maskMetaForRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
;
function maskMetaForRole(role, meta_full) {
    if (!meta_full) return null;
    if (role === 'admin' || role === 'super_admin') {
        return meta_full;
    }
    // Define what fields should remain in the masked version
    // This is a basic masking logic, extracting non-sensitive parts
    const masked = {};
    if (typeof meta_full === 'object') {
        // Keep identifiers and safe enum flags
        if (meta_full.payment_method) masked.payment_method = meta_full.payment_method;
        if (meta_full.gateway_transaction_id) masked.gateway_transaction_id = '***' + String(meta_full.gateway_transaction_id).slice(-4);
        if (meta_full.booking_id) masked.booking_id = meta_full.booking_id;
        if (meta_full.task_request_id) masked.task_request_id = meta_full.task_request_id;
    // Do NOT include things like raw response payloads, full names, emails if present in meta
    }
    return masked;
}
}),
"[project]/src/features/finance/models/result.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Standard service result type for all @SysOp server actions.
 * Functions NEVER throw — they return this shape.
 */ __turbopack_context__.s([
    "fail",
    ()=>fail,
    "ok",
    ()=>ok
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
}),
"[project]/src/features/finance/models/finance.model.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FINANCE_READ_ROLES",
    ()=>FINANCE_READ_ROLES,
    "FINANCE_SUPERADMIN_ROLES",
    ()=>FINANCE_SUPERADMIN_ROLES,
    "FINANCE_WRITE_ROLES",
    ()=>FINANCE_WRITE_ROLES,
    "JournalLedgerEntrySchema",
    ()=>JournalLedgerEntrySchema,
    "PlatformMetricsSchema",
    ()=>PlatformMetricsSchema,
    "WithdrawalRequestSchema",
    ()=>WithdrawalRequestSchema,
    "getStatusBadgeClass",
    ()=>getStatusBadgeClass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const JournalLedgerEntrySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    journal_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    event_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    entity_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().optional(),
    entity_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable().optional(),
    payer_user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable().optional(),
    payee_user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable().optional(),
    gross_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    fee_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    net_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    initiator_user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable().optional(),
    meta_masked: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional(),
    meta_full: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional()
});
const PlatformMetricsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    platform_cash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    escrow_held: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    lifetime_revenue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    pending_withdrawals: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
});
const WithdrawalRequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'requested',
        'processing',
        'completed',
        'failed'
    ]),
    amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    currency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const FINANCE_READ_ROLES = [
    'support',
    'moderator',
    'admin',
    'super_admin'
];
const FINANCE_WRITE_ROLES = [
    'admin',
    'super_admin'
];
const FINANCE_SUPERADMIN_ROLES = [
    'super_admin'
];
function getStatusBadgeClass(status) {
    switch(status){
        case 'posted':
        case 'completed':
            return 'bg-green-500/10 text-green-500';
        case 'failed':
            return 'bg-red-500/10 text-red-500';
        default:
            return 'bg-orange-500/10 text-orange-500';
    }
}
}),
"[project]/src/features/finance/models/finance.schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApproveWithdrawalSchema",
    ()=>ApproveWithdrawalSchema,
    "CursorSchema",
    ()=>CursorSchema,
    "EntityTraceSchema",
    ()=>EntityTraceSchema,
    "ExportCSVSchema",
    ()=>ExportCSVSchema,
    "FreezeWalletSchema",
    ()=>FreezeWalletSchema,
    "RejectWithdrawalSchema",
    ()=>RejectWithdrawalSchema,
    "SoftDeleteUserSchema",
    ()=>SoftDeleteUserSchema,
    "TransactionDetailsSchema",
    ()=>TransactionDetailsSchema,
    "TransactionFiltersSchema",
    ()=>TransactionFiltersSchema,
    "UnfreezeWalletSchema",
    ()=>UnfreezeWalletSchema,
    "UserLookupSchema",
    ()=>UserLookupSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
// ─── Shared Helpers ───────────────────────────────────────
const uuidField = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Invalid UUID format');
const reasonField = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Reason is required').max(500, 'Reason too long');
const ApproveWithdrawalSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    requestId: uuidField,
    reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).default('Approved by admin')
});
const RejectWithdrawalSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    requestId: uuidField,
    reason: reasonField
});
const FreezeWalletSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    targetUserId: uuidField,
    reason: reasonField
});
const UnfreezeWalletSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    targetUserId: uuidField,
    reason: reasonField
});
const SoftDeleteUserSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    targetUserId: uuidField,
    reason: reasonField
});
const ExportCSVSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    event_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    payer_user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
    payee_user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
    entity_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    entity_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(1000).optional()
});
const TransactionDetailsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    journalId: uuidField
});
const UserLookupSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    userId: uuidField
});
const EntityTraceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    entityType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    entityId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
const TransactionFiltersSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    event_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    payer_user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
    payee_user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
    entity_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    entity_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(200).optional()
});
const CursorSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    journal_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid()
}).optional();
}),
"[project]/src/features/finance/actions/queries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"000d8b513601eb108ae8ed9b8d10db6f469cbf2aa7":"getPlatformMetrics","40274e7a718216983460fa9ec87b1b5b411f7f98b3":"getUserWalletSummary","4097e642c2325d2134ca7b55698ebccf84fb88bea3":"getTransactionDetails","601171014d0a6fc981a22bac0efad5395e966e1988":"getEntityTrace","602539451fcfd4a1a2f034b2d49b50c7061d6de968":"getWithdrawals","606b61ab0978f9bd1d34e01671759e16766ee8b582":"getAuditLogs","60fd2cb35d352101cda1197cae6dea29e4648ece4d":"getTransactionsPaginated","7081ecb760ad2552d4fed2a5d13b7fdfe9bea3d1b4":"getUserFinanceTimeline"},"",""] */ __turbopack_context__.s([
    "getAuditLogs",
    ()=>getAuditLogs,
    "getEntityTrace",
    ()=>getEntityTrace,
    "getPlatformMetrics",
    ()=>getPlatformMetrics,
    "getTransactionDetails",
    ()=>getTransactionDetails,
    "getTransactionsPaginated",
    ()=>getTransactionsPaginated,
    "getUserFinanceTimeline",
    ()=>getUserFinanceTimeline,
    "getUserWalletSummary",
    ()=>getUserWalletSummary,
    "getWithdrawals",
    ()=>getWithdrawals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/core/security/security_guards.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$data_masking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/core/security/data_masking.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/models/result.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/models/finance.model.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/models/finance.schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
// ─── Error Helper ─────────────────────────────────────────
function toErrorMessage(e) {
    return e instanceof Error ? e.message : 'Unknown error';
}
async function getPlatformMetrics() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FINANCE_READ_ROLES"]);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from('vw_financial_metrics_realtime').select('*').single();
        if (error) {
            console.error('getPlatformMetrics error:', error);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('Failed to fetch platform metrics');
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            platform_cash: data.platform_cash_iqd || 0,
            escrow_held: data.escrow_held_iqd || 0,
            lifetime_revenue: data.revenue_iqd || 0,
            pending_withdrawals: 0
        });
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(toErrorMessage(e));
    }
}
async function getTransactionsPaginated(filters = {}, cursor) {
    try {
        const parsedFilters = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TransactionFiltersSchema"].safeParse(filters);
        if (!parsedFilters.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsedFilters.error.issues[0].message);
        const parsedCursor = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CursorSchema"].safeParse(cursor);
        if (!parsedCursor.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsedCursor.error.issues[0].message);
        const { role } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FINANCE_READ_ROLES"]);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        let query = supabase.from('vw_admin_journal_ledger').select('*').order('created_at', {
            ascending: false
        }).order('journal_id', {
            ascending: false
        });
        if (parsedFilters.data.event_type) query = query.eq('event_type', parsedFilters.data.event_type);
        if (parsedFilters.data.status) query = query.eq('status', parsedFilters.data.status);
        if (parsedFilters.data.payer_user_id) query = query.eq('payer_user_id', parsedFilters.data.payer_user_id);
        if (parsedFilters.data.payee_user_id) query = query.eq('payee_user_id', parsedFilters.data.payee_user_id);
        if (parsedFilters.data.entity_type) query = query.eq('entity_type', parsedFilters.data.entity_type);
        if (parsedFilters.data.entity_id) query = query.eq('entity_id', parsedFilters.data.entity_id);
        if (parsedCursor.data) {
            query = query.or(`created_at.lt.${parsedCursor.data.created_at},and(created_at.eq.${parsedCursor.data.created_at},journal_id.lt.${parsedCursor.data.journal_id})`);
        }
        const limit = parsedFilters.data.limit || 50;
        query = query.limit(limit);
        const { data, error } = await query;
        if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(`Query failed: ${error.message}`);
        const maskedData = data.map((row)=>({
                ...row,
                meta_full: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$data_masking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["maskMetaForRole"])(role, row.meta_full)
            }));
        const nextCursor = data.length === limit ? {
            created_at: data[data.length - 1].created_at,
            journal_id: data[data.length - 1].journal_id
        } : undefined;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            data: maskedData,
            nextCursor
        });
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(toErrorMessage(e));
    }
}
async function getTransactionDetails(journalId) {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TransactionDetailsSchema"].safeParse({
            journalId
        });
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsed.error.issues[0].message);
        const { userId, role } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FINANCE_READ_ROLES"]);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from('vw_admin_journal_ledger').select('*').eq('journal_id', parsed.data.journalId).single();
        if (error || !data) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('Transaction not found');
        if ((role === 'admin' || role === 'super_admin') && data.meta_full) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                action: 'admin.finance.tx_view_sensitive_meta',
                actor_user_id: userId,
                event_type: data.event_type,
                journal_entry_id: parsed.data.journalId,
                meta: {
                    viewed_at: new Date().toISOString()
                }
            });
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            ...data,
            meta_full: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$data_masking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["maskMetaForRole"])(role, data.meta_full)
        });
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(toErrorMessage(e));
    }
}
async function getUserWalletSummary(targetUserId) {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UserLookupSchema"].safeParse({
            userId: targetUserId
        });
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsed.error.issues[0].message);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FINANCE_READ_ROLES"]);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from('vw_wallet_balances_user').select('*').eq('user_id', parsed.data.userId).single();
        if (error) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
                available_balance: 0,
                held_balance: 0,
                pending_withdrawal_balance: 0,
                currency: 'IQD'
            });
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])(data);
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(toErrorMessage(e));
    }
}
async function getUserFinanceTimeline(targetUserId, filters = {}, cursor) {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UserLookupSchema"].safeParse({
            userId: targetUserId
        });
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsed.error.issues[0].message);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FINANCE_READ_ROLES"]);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from('vw_wallet_activity_user').select('*').eq('user_id', parsed.data.userId).order('created_at', {
            ascending: false
        }).limit(filters.limit || 50);
        if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('Query failed');
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            data: data,
            nextCursor: undefined
        });
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(toErrorMessage(e));
    }
}
async function getEntityTrace(entityType, entityId) {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EntityTraceSchema"].safeParse({
            entityType,
            entityId
        });
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(parsed.error.issues[0].message);
        return getTransactionsPaginated({
            entity_type: parsed.data.entityType,
            entity_id: parsed.data.entityId
        });
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(toErrorMessage(e));
    }
}
async function getWithdrawals(filters = {}, cursor) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FINANCE_READ_ROLES"]);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        let query = supabase.from('withdrawal_requests').select('*').order('created_at', {
            ascending: false
        }).order('id', {
            ascending: false
        });
        if (filters.status) query = query.eq('status', filters.status);
        if (cursor) {
            query = query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
        }
        const limit = filters.limit || 50;
        const { data, error } = await query.limit(limit);
        if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])('Query failed');
        const nextCursor = data.length === limit ? {
            created_at: data[data.length - 1].created_at,
            id: data[data.length - 1].id
        } : undefined;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            data: data,
            nextCursor
        });
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(toErrorMessage(e));
    }
}
async function getAuditLogs(filters = {}, cursor) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$core$2f$security$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FINANCE_WRITE_ROLES"]);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        let query = supabase.from('audit_logs').select('*').order('created_at', {
            ascending: false
        }).order('id', {
            ascending: false
        });
        if (filters.action) query = query.eq('action', filters.action);
        if (filters.actor_user_id) query = query.eq('actor_user_id', filters.actor_user_id);
        if (filters.start_date) query = query.gte('created_at', filters.start_date);
        if (filters.end_date) query = query.lte('created_at', filters.end_date);
        if (cursor) {
            query = query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
        }
        const limit = filters.limit || 50;
        const { data, error } = await query.limit(limit);
        if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(`Query failed: ${error.message}`);
        const nextCursor = data.length === limit ? {
            created_at: data[data.length - 1].created_at,
            id: data[data.length - 1].id
        } : undefined;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ok"])({
            data,
            nextCursor
        });
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fail"])(toErrorMessage(e));
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getPlatformMetrics,
    getTransactionsPaginated,
    getTransactionDetails,
    getUserWalletSummary,
    getUserFinanceTimeline,
    getEntityTrace,
    getWithdrawals,
    getAuditLogs
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPlatformMetrics, "000d8b513601eb108ae8ed9b8d10db6f469cbf2aa7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTransactionsPaginated, "60fd2cb35d352101cda1197cae6dea29e4648ece4d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTransactionDetails, "4097e642c2325d2134ca7b55698ebccf84fb88bea3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserWalletSummary, "40274e7a718216983460fa9ec87b1b5b411f7f98b3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserFinanceTimeline, "7081ecb760ad2552d4fed2a5d13b7fdfe9bea3d1b4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEntityTrace, "601171014d0a6fc981a22bac0efad5395e966e1988", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWithdrawals, "602539451fcfd4a1a2f034b2d49b50c7061d6de968", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAuditLogs, "606b61ab0978f9bd1d34e01671759e16766ee8b582", null);
}),
"[project]/.next-internal/server/app/dashboard/finance/overview/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/finance/actions/queries.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/actions/queries.ts [app-rsc] (ecmascript)");
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
"[project]/.next-internal/server/app/dashboard/finance/overview/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/finance/actions/queries.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "000d8b513601eb108ae8ed9b8d10db6f469cbf2aa7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlatformMetrics"],
    "40274e7a718216983460fa9ec87b1b5b411f7f98b3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserWalletSummary"],
    "4097e642c2325d2134ca7b55698ebccf84fb88bea3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTransactionDetails"],
    "601171014d0a6fc981a22bac0efad5395e966e1988",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEntityTrace"],
    "602539451fcfd4a1a2f034b2d49b50c7061d6de968",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWithdrawals"],
    "606b61ab0978f9bd1d34e01671759e16766ee8b582",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAuditLogs"],
    "60fd2cb35d352101cda1197cae6dea29e4648ece4d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTransactionsPaginated"],
    "7081ecb760ad2552d4fed2a5d13b7fdfe9bea3d1b4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserFinanceTimeline"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$finance$2f$overview$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/finance/overview/page/actions.js { ACTIONS_MODULE0 => "[project]/src/features/finance/actions/queries.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/actions/queries.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_a2999ca1._.js.map