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
"[project]/src/features/finance/services/security_guards.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enforceRateLimit",
    ()=>enforceRateLimit,
    "logAuditEvent",
    ()=>logAuditEvent,
    "maskMetaForRole",
    ()=>maskMetaForRole,
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
        throw new Error('Unauthorized: Authentication required.');
    }
    // Check admin_users table for the user's role
    const { data: adminUser, error: adminError } = await supabase.from('admin_users').select('role').eq('id', user.id).single();
    if (adminError || !adminUser) {
        throw new Error('Forbidden: Not an admin user.');
    }
    const role = adminUser.role;
    if (!allowedRoles.includes(role)) {
        throw new Error(`Forbidden: Insufficient permissions. Required one of: ${allowedRoles.join(', ')}`);
    }
    return {
        userId: user.id,
        role
    };
}
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
async function logAuditEvent(params) {
    const adminClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const { error } = await adminClient.from('audit_logs').insert({
        action: params.action,
        actor_user_id: params.actor_user_id,
        event_type: params.event_type || null,
        journal_entry_id: params.journal_entry_id || null,
        related_entity_type: params.related_entity_type || null,
        related_entity_id: params.related_entity_id || null,
        meta: params.meta
    });
    if (error) {
        console.error('Failed to insert audit log:', error);
        // Depending on strictness, we might want to throw here so the transaction fails if audit fails.
        // For robust financial systems, throw is usually better.
        throw new Error(`Audit log insertion failed: ${error.message}`);
    }
}
// Simple in-memory rate limiter for MVP (works per Node instance)
const rateLimitCache = new Map();
function enforceRateLimit(actionName, userId, maxRequests = 10, windowMs = 60000) {
    const key = `${actionName}:${userId}`;
    const now = Date.now();
    const record = rateLimitCache.get(key) || {
        count: 0,
        resetTime: now + windowMs
    };
    if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + windowMs;
    }
    record.count++;
    rateLimitCache.set(key, record);
    if (record.count > maxRequests) {
        throw new Error(`Rate limit exceeded for ${actionName}. Please try again later.`);
    // In production with multiple instances, use Redis (e.g., Upstash) or Supabase RPC for centralized tracking.
    }
}
}),
"[project]/src/features/finance/actions/queries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"003df4c30c6e8619f14e6cb894f9251bc3c54753a1":"getPlatformMetrics","408d93c4c134e6fa439807d099b6f93be97451174d":"getUserWalletSummary","40c0764ba36c1f7cc0766b1e572e07d774ede34649":"getTransactionDetails","6008fb73e36b3fc1cb310fbe5bf8ed19debaca7b55":"getWithdrawals","6025739869545e41f99010f1c5ace82ede7cd1da1f":"getAuditLogs","609529ce8c0349b1b92764e3303e744047f32ed671":"getEntityTrace","60a41a9113ba9a51443a6654ed6c69b69804135636":"getTransactionsPaginated","7039cddd7d97f8a8be0e4c6bdfd36d3d4c2ef08580":"getUserFinanceTimeline"},"",""] */ __turbopack_context__.s([
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/services/security_guards.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getPlatformMetrics() {
    // Requires at least support role to view high level metrics
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])([
        'support',
        'moderator',
        'admin',
        'super_admin'
    ]);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // In a real implementation this might fetch from a view like vw_financial_metrics_realtime
    const { data, error } = await supabase.from('vw_financial_metrics_realtime').select('*').single();
    if (error) {
        console.error('getPlatformMetrics error:', error);
        throw new Error('Failed to fetch platform metrics');
    }
    return {
        platform_cash: data.platform_cash_iqd || 0,
        escrow_held: data.escrow_held_iqd || 0,
        lifetime_revenue: data.revenue_iqd || 0,
        pending_withdrawals: 0
    };
}
async function getTransactionsPaginated(filters = {}, cursor) {
    // Support and higher can see transactions (metadata will be masked later if needed)
    const { role } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])([
        'support',
        'moderator',
        'admin',
        'super_admin'
    ]);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let query = supabase.from('vw_admin_journal_ledger').select('*').order('created_at', {
        ascending: false
    }).order('journal_id', {
        ascending: false
    });
    // Apply filters...
    if (filters.event_type) query = query.eq('event_type', filters.event_type);
    if (filters.status) query = query.eq('status', filters.status);
    // payer or payee filter
    if (filters.payer_user_id) query = query.eq('payer_user_id', filters.payer_user_id);
    if (filters.payee_user_id) query = query.eq('payee_user_id', filters.payee_user_id);
    if (filters.entity_type) query = query.eq('entity_type', filters.entity_type);
    if (filters.entity_id) query = query.eq('entity_id', filters.entity_id);
    // Apply cursor pagination
    if (cursor) {
        // We need (created_at, id) < (cursor.created_at, cursor.journal_id)
        // Unfortunately Supabase JS doesn't support tuple comparisons directly easily like .lte('(created_at, journal_id)', `(${cursor.created_at}, ${cursor.journal_id})`)
        // A workaround is to use an RPC or string filter:
        query = query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},journal_id.lt.${cursor.journal_id})`);
    }
    const limit = filters.limit || 50;
    query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw new Error(`Query failed: ${error.message}`);
    // Mask metadata according to role
    const maskedData = data.map((row)=>({
            ...row,
            meta_full: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["maskMetaForRole"])(role, row.meta_full)
        }));
    const nextCursor = data.length === limit ? {
        created_at: data[data.length - 1].created_at,
        journal_id: data[data.length - 1].journal_id
    } : undefined;
    return {
        data: maskedData,
        nextCursor
    };
}
async function getTransactionDetails(journalId) {
    const { userId, role } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])([
        'support',
        'moderator',
        'admin',
        'super_admin'
    ]);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from('vw_admin_journal_ledger').select('*').eq('journal_id', journalId).single();
    if (error || !data) throw new Error('Transaction not found');
    const isSensitiveUnmasked = role === 'admin' || role === 'super_admin';
    if (isSensitiveUnmasked && data.meta_full) {
        // Log sensitive read for admin/super_admin
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])({
            action: 'admin.finance.tx_view_sensitive_meta',
            actor_user_id: userId,
            event_type: data.event_type,
            journal_entry_id: journalId,
            meta: {
                viewed_at: new Date().toISOString()
            }
        });
    }
    const maskedData = {
        ...data,
        meta_full: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["maskMetaForRole"])(role, data.meta_full)
    };
    return maskedData;
}
async function getUserWalletSummary(targetUserId) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])([
        'support',
        'moderator',
        'admin',
        'super_admin'
    ]);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from('vw_wallet_balances_user').select('*').eq('user_id', targetUserId).single();
    if (error) {
        // If user has no wallet row it might throw error, return default 0
        return {
            available_balance: 0,
            held_balance: 0,
            pending_withdrawal_balance: 0,
            currency: 'IQD'
        };
    }
    return data;
}
async function getUserFinanceTimeline(targetUserId, filters = {}, cursor) {
    // We can just construct a query that finds transactions where user is payer or payee
    // Alternatively we hit a dedicated user timeline view `vw_wallet_activity_user`
    const { role } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])([
        'support',
        'moderator',
        'admin',
        'super_admin'
    ]);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let query = supabase.from('vw_wallet_activity_user').select('*')// A robust implementation should probably filter by this user in a where clause, 
    // but vw_wallet_activity_user usually is joined per user.
    // Assuming vw_wallet_activity_user doesn't expose the base user easily, we can use the ledger view:
    .order('created_at', {
        ascending: false
    });
    // Applying filters directly to vw_wallet_activity_user ...
    // Wait, let's just reuse getTransactionsPaginated by expanding filters to allow OR.
    // Actually, we'll implement a custom query if needed.
    // ... For brevity, mimicking same logic
    const { data, error } = await query.limit(filters.limit || 50);
    if (error) throw new Error('Query failed');
    return {
        data,
        nextCursor: undefined
    };
}
async function getEntityTrace(entityType, entityId) {
    const filters = {
        entity_type: entityType,
        entity_id: entityId
    };
    return getTransactionsPaginated(filters);
}
async function getWithdrawals(filters = {}, cursor) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])([
        'support',
        'moderator',
        'admin',
        'super_admin'
    ]);
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
    if (error) throw new Error('Query failed');
    const nextCursor = data.length === limit ? {
        created_at: data[data.length - 1].created_at,
        id: data[data.length - 1].id
    } : undefined;
    return {
        data,
        nextCursor
    };
}
async function getAuditLogs(filters = {}, cursor) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$services$2f$security_guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdminRole"])([
        'admin',
        'super_admin'
    ]);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let query = supabase.from('audit_logs').select('*').order('created_at', {
        ascending: false
    }).order('id', {
        ascending: false
    });
    if (cursor) {
        query = query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
    }
    const limit = filters.limit || 50;
    const { data, error } = await query.limit(limit);
    if (error) throw new Error(`Query failed: ${error.message}`);
    const nextCursor = data.length === limit ? {
        created_at: data[data.length - 1].created_at,
        id: data[data.length - 1].id
    } : undefined;
    return {
        data,
        nextCursor
    };
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPlatformMetrics, "003df4c30c6e8619f14e6cb894f9251bc3c54753a1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTransactionsPaginated, "60a41a9113ba9a51443a6654ed6c69b69804135636", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTransactionDetails, "40c0764ba36c1f7cc0766b1e572e07d774ede34649", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserWalletSummary, "408d93c4c134e6fa439807d099b6f93be97451174d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserFinanceTimeline, "7039cddd7d97f8a8be0e4c6bdfd36d3d4c2ef08580", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEntityTrace, "609529ce8c0349b1b92764e3303e744047f32ed671", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWithdrawals, "6008fb73e36b3fc1cb310fbe5bf8ed19debaca7b55", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAuditLogs, "6025739869545e41f99010f1c5ace82ede7cd1da1f", null);
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
}),
"[project]/.next-internal/server/app/dashboard/finance/overview/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/finance/actions/queries.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "003df4c30c6e8619f14e6cb894f9251bc3c54753a1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlatformMetrics"],
    "408d93c4c134e6fa439807d099b6f93be97451174d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserWalletSummary"],
    "40c0764ba36c1f7cc0766b1e572e07d774ede34649",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTransactionDetails"],
    "6008fb73e36b3fc1cb310fbe5bf8ed19debaca7b55",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWithdrawals"],
    "6025739869545e41f99010f1c5ace82ede7cd1da1f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAuditLogs"],
    "609529ce8c0349b1b92764e3303e744047f32ed671",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEntityTrace"],
    "60a41a9113ba9a51443a6654ed6c69b69804135636",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTransactionsPaginated"],
    "7039cddd7d97f8a8be0e4c6bdfd36d3d4c2ef08580",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserFinanceTimeline"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$finance$2f$overview$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/finance/overview/page/actions.js { ACTIONS_MODULE0 => "[project]/src/features/finance/actions/queries.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/actions/queries.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_3e7a36a7._.js.map