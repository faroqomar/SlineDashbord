(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableFooter",
    ()=>TableFooter,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
function Table({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "table-container",
        className: "relative w-full overflow-x-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            "data-slot": "table",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/table.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Table;
function TableHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        "data-slot": "table-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c1 = TableHeader;
function TableBody({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        "data-slot": "table-body",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c2 = TableBody;
function TableFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        "data-slot": "table-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c3 = TableFooter;
function TableRow({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        "data-slot": "table-row",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c4 = TableRow;
function TableHead({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        "data-slot": "table-head",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c5 = TableHead;
function TableCell({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        "data-slot": "table-cell",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c6 = TableCell;
function TableCaption({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        "data-slot": "table-caption",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground mt-4 text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_c7 = TableCaption;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "Table");
__turbopack_context__.k.register(_c1, "TableHeader");
__turbopack_context__.k.register(_c2, "TableBody");
__turbopack_context__.k.register(_c3, "TableFooter");
__turbopack_context__.k.register(_c4, "TableRow");
__turbopack_context__.k.register(_c5, "TableHead");
__turbopack_context__.k.register(_c6, "TableCell");
__turbopack_context__.k.register(_c7, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript) <export * as Slot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive: "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            link: "text-primary underline-offset-4 [a&]:hover:underline"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant = "default", asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__["Slot"].Root : "span";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        "data-variant": variant,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/finance/models/finance.model.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
const JournalLedgerEntrySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    journal_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    event_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    entity_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().optional(),
    entity_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable().optional(),
    payer_user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable().optional(),
    payee_user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable().optional(),
    gross_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    fee_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    net_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    initiator_user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable().optional(),
    meta_masked: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional(),
    meta_full: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional()
});
const PlatformMetricsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    platform_cash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    escrow_held: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    lifetime_revenue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    pending_withdrawals: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
});
const WithdrawalRequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'requested',
        'processing',
        'completed',
        'failed'
    ]),
    amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    currency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/finance/actions/data:4cf513 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTransactionDetails",
    ()=>$$RSC_SERVER_ACTION_2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"4097e642c2325d2134ca7b55698ebccf84fb88bea3":"getTransactionDetails"},"src/features/finance/actions/queries.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4097e642c2325d2134ca7b55698ebccf84fb88bea3", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getTransactionDetails");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcXVlcmllcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbmltcG9ydCB7IGNyZWF0ZUNsaWVudCBhcyBzdXBhYmFzZVNlcnZlciB9IGZyb20gJ0AvbGliL3N1cGFiYXNlL3NlcnZlcic7XG5pbXBvcnQgeyByZXF1aXJlQWRtaW5Sb2xlLCBsb2dBdWRpdEV2ZW50IH0gZnJvbSAnQC9mZWF0dXJlcy9jb3JlL3NlY3VyaXR5L3NlY3VyaXR5X2d1YXJkcyc7XG5pbXBvcnQgeyBtYXNrTWV0YUZvclJvbGUgfSBmcm9tICdAL2ZlYXR1cmVzL2NvcmUvc2VjdXJpdHkvZGF0YV9tYXNraW5nJztcbmltcG9ydCB7IG9rLCBmYWlsLCBTZXJ2aWNlUmVzdWx0IH0gZnJvbSAnLi4vbW9kZWxzL3Jlc3VsdCc7XG5pbXBvcnQge1xuICBKb3VybmFsTGVkZ2VyRW50cnksXG4gIFBsYXRmb3JtTWV0cmljcyxcbiAgVHJhbnNhY3Rpb25DdXJzb3IsXG4gIFRyYW5zYWN0aW9uRmlsdGVycyxcbiAgV2FsbGV0U3VtbWFyeSxcbiAgV2l0aGRyYXdhbFJlcXVlc3QsXG4gIEF1ZGl0TG9nRW50cnksXG4gIEZJTkFOQ0VfUkVBRF9ST0xFUyxcbiAgRklOQU5DRV9XUklURV9ST0xFUyxcbn0gZnJvbSAnLi4vbW9kZWxzL2ZpbmFuY2UubW9kZWwnO1xuaW1wb3J0IHtcbiAgVHJhbnNhY3Rpb25EZXRhaWxzU2NoZW1hLFxuICBVc2VyTG9va3VwU2NoZW1hLFxuICBFbnRpdHlUcmFjZVNjaGVtYSxcbiAgVHJhbnNhY3Rpb25GaWx0ZXJzU2NoZW1hLFxuICBDdXJzb3JTY2hlbWEsXG59IGZyb20gJy4uL21vZGVscy9maW5hbmNlLnNjaGVtYSc7XG5cbi8vIFJlLWV4cG9ydCBtb2RlbCB0eXBlcyBzbyBwYWdlcyBpbXBvcnRpbmcgZnJvbSB0aGlzIGZpbGUgY29udGludWUgdG8gd29ya1xuZXhwb3J0IHR5cGUgeyBUcmFuc2FjdGlvbkN1cnNvciwgVHJhbnNhY3Rpb25GaWx0ZXJzIH0gZnJvbSAnLi4vbW9kZWxzL2ZpbmFuY2UubW9kZWwnO1xuXG4vLyDilIDilIDilIAgRXJyb3IgSGVscGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuZnVuY3Rpb24gdG9FcnJvck1lc3NhZ2UoZTogdW5rbm93bik6IHN0cmluZyB7XG4gIHJldHVybiBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcic7XG59XG5cbi8vIOKUgOKUgOKUgCBQbGF0Zm9ybSBNZXRyaWNzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UGxhdGZvcm1NZXRyaWNzKCk6IFByb21pc2U8U2VydmljZVJlc3VsdDxQbGF0Zm9ybU1ldHJpY3M+PiB7XG4gIHRyeSB7XG4gICAgYXdhaXQgcmVxdWlyZUFkbWluUm9sZShGSU5BTkNFX1JFQURfUk9MRVMpO1xuICAgIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgc3VwYWJhc2VTZXJ2ZXIoKTtcblxuICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAuZnJvbSgndndfZmluYW5jaWFsX21ldHJpY3NfcmVhbHRpbWUnKVxuICAgICAgLnNlbGVjdCgnKicpXG4gICAgICAuc2luZ2xlKCk7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2dldFBsYXRmb3JtTWV0cmljcyBlcnJvcjonLCBlcnJvcik7XG4gICAgICByZXR1cm4gZmFpbCgnRmFpbGVkIHRvIGZldGNoIHBsYXRmb3JtIG1ldHJpY3MnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2soe1xuICAgICAgcGxhdGZvcm1fY2FzaDogZGF0YS5wbGF0Zm9ybV9jYXNoX2lxZCB8fCAwLFxuICAgICAgZXNjcm93X2hlbGQ6IGRhdGEuZXNjcm93X2hlbGRfaXFkIHx8IDAsXG4gICAgICBsaWZldGltZV9yZXZlbnVlOiBkYXRhLnJldmVudWVfaXFkIHx8IDAsXG4gICAgICBwZW5kaW5nX3dpdGhkcmF3YWxzOiAwLFxuICAgIH0pO1xuICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgcmV0dXJuIGZhaWwodG9FcnJvck1lc3NhZ2UoZSkpO1xuICB9XG59XG5cbi8vIOKUgOKUgOKUgCBQYWdpbmF0ZWQgVHJhbnNhY3Rpb25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VHJhbnNhY3Rpb25zUGFnaW5hdGVkKFxuICBmaWx0ZXJzOiBUcmFuc2FjdGlvbkZpbHRlcnMgPSB7fSxcbiAgY3Vyc29yPzogVHJhbnNhY3Rpb25DdXJzb3Jcbik6IFByb21pc2U8U2VydmljZVJlc3VsdDx7IGRhdGE6IEpvdXJuYWxMZWRnZXJFbnRyeVtdOyBuZXh0Q3Vyc29yPzogVHJhbnNhY3Rpb25DdXJzb3IgfT4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJzZWRGaWx0ZXJzID0gVHJhbnNhY3Rpb25GaWx0ZXJzU2NoZW1hLnNhZmVQYXJzZShmaWx0ZXJzKTtcbiAgICBpZiAoIXBhcnNlZEZpbHRlcnMuc3VjY2VzcykgcmV0dXJuIGZhaWwocGFyc2VkRmlsdGVycy5lcnJvci5pc3N1ZXNbMF0ubWVzc2FnZSk7XG5cbiAgICBjb25zdCBwYXJzZWRDdXJzb3IgPSBDdXJzb3JTY2hlbWEuc2FmZVBhcnNlKGN1cnNvcik7XG4gICAgaWYgKCFwYXJzZWRDdXJzb3Iuc3VjY2VzcykgcmV0dXJuIGZhaWwocGFyc2VkQ3Vyc29yLmVycm9yLmlzc3Vlc1swXS5tZXNzYWdlKTtcblxuICAgIGNvbnN0IHsgcm9sZSB9ID0gYXdhaXQgcmVxdWlyZUFkbWluUm9sZShGSU5BTkNFX1JFQURfUk9MRVMpO1xuICAgIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgc3VwYWJhc2VTZXJ2ZXIoKTtcblxuICAgIGxldCBxdWVyeSA9IHN1cGFiYXNlXG4gICAgICAuZnJvbSgndndfYWRtaW5fam91cm5hbF9sZWRnZXInKVxuICAgICAgLnNlbGVjdCgnKicpXG4gICAgICAub3JkZXIoJ2NyZWF0ZWRfYXQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcbiAgICAgIC5vcmRlcignam91cm5hbF9pZCcsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KTtcblxuICAgIGlmIChwYXJzZWRGaWx0ZXJzLmRhdGEuZXZlbnRfdHlwZSkgcXVlcnkgPSBxdWVyeS5lcSgnZXZlbnRfdHlwZScsIHBhcnNlZEZpbHRlcnMuZGF0YS5ldmVudF90eXBlKTtcbiAgICBpZiAocGFyc2VkRmlsdGVycy5kYXRhLnN0YXR1cykgcXVlcnkgPSBxdWVyeS5lcSgnc3RhdHVzJywgcGFyc2VkRmlsdGVycy5kYXRhLnN0YXR1cyk7XG4gICAgaWYgKHBhcnNlZEZpbHRlcnMuZGF0YS5wYXllcl91c2VyX2lkKSBxdWVyeSA9IHF1ZXJ5LmVxKCdwYXllcl91c2VyX2lkJywgcGFyc2VkRmlsdGVycy5kYXRhLnBheWVyX3VzZXJfaWQpO1xuICAgIGlmIChwYXJzZWRGaWx0ZXJzLmRhdGEucGF5ZWVfdXNlcl9pZCkgcXVlcnkgPSBxdWVyeS5lcSgncGF5ZWVfdXNlcl9pZCcsIHBhcnNlZEZpbHRlcnMuZGF0YS5wYXllZV91c2VyX2lkKTtcbiAgICBpZiAocGFyc2VkRmlsdGVycy5kYXRhLmVudGl0eV90eXBlKSBxdWVyeSA9IHF1ZXJ5LmVxKCdlbnRpdHlfdHlwZScsIHBhcnNlZEZpbHRlcnMuZGF0YS5lbnRpdHlfdHlwZSk7XG4gICAgaWYgKHBhcnNlZEZpbHRlcnMuZGF0YS5lbnRpdHlfaWQpIHF1ZXJ5ID0gcXVlcnkuZXEoJ2VudGl0eV9pZCcsIHBhcnNlZEZpbHRlcnMuZGF0YS5lbnRpdHlfaWQpO1xuXG4gICAgaWYgKHBhcnNlZEN1cnNvci5kYXRhKSB7XG4gICAgICBxdWVyeSA9IHF1ZXJ5Lm9yKFxuICAgICAgICBgY3JlYXRlZF9hdC5sdC4ke3BhcnNlZEN1cnNvci5kYXRhLmNyZWF0ZWRfYXR9LGFuZChjcmVhdGVkX2F0LmVxLiR7cGFyc2VkQ3Vyc29yLmRhdGEuY3JlYXRlZF9hdH0sam91cm5hbF9pZC5sdC4ke3BhcnNlZEN1cnNvci5kYXRhLmpvdXJuYWxfaWR9KWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbGltaXQgPSBwYXJzZWRGaWx0ZXJzLmRhdGEubGltaXQgfHwgNTA7XG4gICAgcXVlcnkgPSBxdWVyeS5saW1pdChsaW1pdCk7XG5cbiAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBxdWVyeTtcbiAgICBpZiAoZXJyb3IpIHJldHVybiBmYWlsKGBRdWVyeSBmYWlsZWQ6ICR7ZXJyb3IubWVzc2FnZX1gKTtcblxuICAgIGNvbnN0IG1hc2tlZERhdGEgPSAoZGF0YSBhcyBKb3VybmFsTGVkZ2VyRW50cnlbXSkubWFwKChyb3cpID0+ICh7XG4gICAgICAuLi5yb3csXG4gICAgICBtZXRhX2Z1bGw6IG1hc2tNZXRhRm9yUm9sZShyb2xlLCByb3cubWV0YV9mdWxsKSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBuZXh0Q3Vyc29yID1cbiAgICAgIGRhdGEubGVuZ3RoID09PSBsaW1pdFxuICAgICAgICA/IHsgY3JlYXRlZF9hdDogZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmNyZWF0ZWRfYXQsIGpvdXJuYWxfaWQ6IGRhdGFbZGF0YS5sZW5ndGggLSAxXS5qb3VybmFsX2lkIH1cbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gb2soeyBkYXRhOiBtYXNrZWREYXRhLCBuZXh0Q3Vyc29yIH0pO1xuICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgcmV0dXJuIGZhaWwodG9FcnJvck1lc3NhZ2UoZSkpO1xuICB9XG59XG5cbi8vIOKUgOKUgOKUgCBUcmFuc2FjdGlvbiBEZXRhaWxzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VHJhbnNhY3Rpb25EZXRhaWxzKFxuICBqb3VybmFsSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTxTZXJ2aWNlUmVzdWx0PEpvdXJuYWxMZWRnZXJFbnRyeT4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJzZWQgPSBUcmFuc2FjdGlvbkRldGFpbHNTY2hlbWEuc2FmZVBhcnNlKHsgam91cm5hbElkIH0pO1xuICAgIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHJldHVybiBmYWlsKHBhcnNlZC5lcnJvci5pc3N1ZXNbMF0ubWVzc2FnZSk7XG5cbiAgICBjb25zdCB7IHVzZXJJZCwgcm9sZSB9ID0gYXdhaXQgcmVxdWlyZUFkbWluUm9sZShGSU5BTkNFX1JFQURfUk9MRVMpO1xuICAgIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgc3VwYWJhc2VTZXJ2ZXIoKTtcblxuICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAuZnJvbSgndndfYWRtaW5fam91cm5hbF9sZWRnZXInKVxuICAgICAgLnNlbGVjdCgnKicpXG4gICAgICAuZXEoJ2pvdXJuYWxfaWQnLCBwYXJzZWQuZGF0YS5qb3VybmFsSWQpXG4gICAgICAuc2luZ2xlKCk7XG5cbiAgICBpZiAoZXJyb3IgfHwgIWRhdGEpIHJldHVybiBmYWlsKCdUcmFuc2FjdGlvbiBub3QgZm91bmQnKTtcblxuICAgIGlmICgocm9sZSA9PT0gJ2FkbWluJyB8fCByb2xlID09PSAnc3VwZXJfYWRtaW4nKSAmJiBkYXRhLm1ldGFfZnVsbCkge1xuICAgICAgYXdhaXQgbG9nQXVkaXRFdmVudCh7XG4gICAgICAgIGFjdGlvbjogJ2FkbWluLmZpbmFuY2UudHhfdmlld19zZW5zaXRpdmVfbWV0YScsXG4gICAgICAgIGFjdG9yX3VzZXJfaWQ6IHVzZXJJZCxcbiAgICAgICAgZXZlbnRfdHlwZTogZGF0YS5ldmVudF90eXBlLFxuICAgICAgICBqb3VybmFsX2VudHJ5X2lkOiBwYXJzZWQuZGF0YS5qb3VybmFsSWQsXG4gICAgICAgIG1ldGE6IHsgdmlld2VkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBvayh7IC4uLmRhdGEsIG1ldGFfZnVsbDogbWFza01ldGFGb3JSb2xlKHJvbGUsIGRhdGEubWV0YV9mdWxsKSB9IGFzIEpvdXJuYWxMZWRnZXJFbnRyeSk7XG4gIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICByZXR1cm4gZmFpbCh0b0Vycm9yTWVzc2FnZShlKSk7XG4gIH1cbn1cblxuLy8g4pSA4pSA4pSAIFVzZXIgV2FsbGV0IFN1bW1hcnkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc2VyV2FsbGV0U3VtbWFyeShcbiAgdGFyZ2V0VXNlcklkOiBzdHJpbmdcbik6IFByb21pc2U8U2VydmljZVJlc3VsdDxXYWxsZXRTdW1tYXJ5Pj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHBhcnNlZCA9IFVzZXJMb29rdXBTY2hlbWEuc2FmZVBhcnNlKHsgdXNlcklkOiB0YXJnZXRVc2VySWQgfSk7XG4gICAgaWYgKCFwYXJzZWQuc3VjY2VzcykgcmV0dXJuIGZhaWwocGFyc2VkLmVycm9yLmlzc3Vlc1swXS5tZXNzYWdlKTtcblxuICAgIGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoRklOQU5DRV9SRUFEX1JPTEVTKTtcbiAgICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IHN1cGFiYXNlU2VydmVyKCk7XG5cbiAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oJ3Z3X3dhbGxldF9iYWxhbmNlc191c2VyJylcbiAgICAgIC5zZWxlY3QoJyonKVxuICAgICAgLmVxKCd1c2VyX2lkJywgcGFyc2VkLmRhdGEudXNlcklkKVxuICAgICAgLnNpbmdsZSgpO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gb2soeyBhdmFpbGFibGVfYmFsYW5jZTogMCwgaGVsZF9iYWxhbmNlOiAwLCBwZW5kaW5nX3dpdGhkcmF3YWxfYmFsYW5jZTogMCwgY3VycmVuY3k6ICdJUUQnIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb2soZGF0YSBhcyBXYWxsZXRTdW1tYXJ5KTtcbiAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgIHJldHVybiBmYWlsKHRvRXJyb3JNZXNzYWdlKGUpKTtcbiAgfVxufVxuXG4vLyDilIDilIDilIAgVXNlciBGaW5hbmNlIFRpbWVsaW5lIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VXNlckZpbmFuY2VUaW1lbGluZShcbiAgdGFyZ2V0VXNlcklkOiBzdHJpbmcsXG4gIGZpbHRlcnM6IFBpY2s8VHJhbnNhY3Rpb25GaWx0ZXJzLCAnZXZlbnRfdHlwZScgfCAnc3RhdHVzJyB8ICdsaW1pdCc+ID0ge30sXG4gIGN1cnNvcj86IFRyYW5zYWN0aW9uQ3Vyc29yXG4pOiBQcm9taXNlPFNlcnZpY2VSZXN1bHQ8eyBkYXRhOiBKb3VybmFsTGVkZ2VyRW50cnlbXTsgbmV4dEN1cnNvcj86IFRyYW5zYWN0aW9uQ3Vyc29yIH0+PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkID0gVXNlckxvb2t1cFNjaGVtYS5zYWZlUGFyc2UoeyB1c2VySWQ6IHRhcmdldFVzZXJJZCB9KTtcbiAgICBpZiAoIXBhcnNlZC5zdWNjZXNzKSByZXR1cm4gZmFpbChwYXJzZWQuZXJyb3IuaXNzdWVzWzBdLm1lc3NhZ2UpO1xuXG4gICAgYXdhaXQgcmVxdWlyZUFkbWluUm9sZShGSU5BTkNFX1JFQURfUk9MRVMpO1xuICAgIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgc3VwYWJhc2VTZXJ2ZXIoKTtcblxuICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAuZnJvbSgndndfd2FsbGV0X2FjdGl2aXR5X3VzZXInKVxuICAgICAgLnNlbGVjdCgnKicpXG4gICAgICAuZXEoJ3VzZXJfaWQnLCBwYXJzZWQuZGF0YS51c2VySWQpXG4gICAgICAub3JkZXIoJ2NyZWF0ZWRfYXQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcbiAgICAgIC5saW1pdChmaWx0ZXJzLmxpbWl0IHx8IDUwKTtcblxuICAgIGlmIChlcnJvcikgcmV0dXJuIGZhaWwoJ1F1ZXJ5IGZhaWxlZCcpO1xuICAgIHJldHVybiBvayh7IGRhdGE6IGRhdGEgYXMgSm91cm5hbExlZGdlckVudHJ5W10sIG5leHRDdXJzb3I6IHVuZGVmaW5lZCB9KTtcbiAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgIHJldHVybiBmYWlsKHRvRXJyb3JNZXNzYWdlKGUpKTtcbiAgfVxufVxuXG4vLyDilIDilIDilIAgRW50aXR5IFRyYWNlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RW50aXR5VHJhY2UoXG4gIGVudGl0eVR5cGU6IHN0cmluZyxcbiAgZW50aXR5SWQ6IHN0cmluZ1xuKTogUHJvbWlzZTxTZXJ2aWNlUmVzdWx0PHsgZGF0YTogSm91cm5hbExlZGdlckVudHJ5W107IG5leHRDdXJzb3I/OiBUcmFuc2FjdGlvbkN1cnNvciB9Pj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHBhcnNlZCA9IEVudGl0eVRyYWNlU2NoZW1hLnNhZmVQYXJzZSh7IGVudGl0eVR5cGUsIGVudGl0eUlkIH0pO1xuICAgIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHJldHVybiBmYWlsKHBhcnNlZC5lcnJvci5pc3N1ZXNbMF0ubWVzc2FnZSk7XG4gICAgcmV0dXJuIGdldFRyYW5zYWN0aW9uc1BhZ2luYXRlZCh7IGVudGl0eV90eXBlOiBwYXJzZWQuZGF0YS5lbnRpdHlUeXBlLCBlbnRpdHlfaWQ6IHBhcnNlZC5kYXRhLmVudGl0eUlkIH0pO1xuICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgcmV0dXJuIGZhaWwodG9FcnJvck1lc3NhZ2UoZSkpO1xuICB9XG59XG5cbi8vIOKUgOKUgOKUgCBXaXRoZHJhd2FscyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFdpdGhkcmF3YWxzKFxuICBmaWx0ZXJzOiB7IHN0YXR1cz86IHN0cmluZzsgbGltaXQ/OiBudW1iZXIgfSA9IHt9LFxuICBjdXJzb3I/OiB7IGNyZWF0ZWRfYXQ6IHN0cmluZzsgaWQ6IHN0cmluZyB9XG4pOiBQcm9taXNlPFNlcnZpY2VSZXN1bHQ8eyBkYXRhOiBXaXRoZHJhd2FsUmVxdWVzdFtdOyBuZXh0Q3Vyc29yPzogeyBjcmVhdGVkX2F0OiBzdHJpbmc7IGlkOiBzdHJpbmcgfSB9Pj4ge1xuICB0cnkge1xuICAgIGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoRklOQU5DRV9SRUFEX1JPTEVTKTtcbiAgICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IHN1cGFiYXNlU2VydmVyKCk7XG5cbiAgICBsZXQgcXVlcnkgPSBzdXBhYmFzZVxuICAgICAgLmZyb20oJ3dpdGhkcmF3YWxfcmVxdWVzdHMnKVxuICAgICAgLnNlbGVjdCgnKicpXG4gICAgICAub3JkZXIoJ2NyZWF0ZWRfYXQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcbiAgICAgIC5vcmRlcignaWQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XG5cbiAgICBpZiAoZmlsdGVycy5zdGF0dXMpIHF1ZXJ5ID0gcXVlcnkuZXEoJ3N0YXR1cycsIGZpbHRlcnMuc3RhdHVzKTtcbiAgICBpZiAoY3Vyc29yKSB7XG4gICAgICBxdWVyeSA9IHF1ZXJ5Lm9yKGBjcmVhdGVkX2F0Lmx0LiR7Y3Vyc29yLmNyZWF0ZWRfYXR9LGFuZChjcmVhdGVkX2F0LmVxLiR7Y3Vyc29yLmNyZWF0ZWRfYXR9LGlkLmx0LiR7Y3Vyc29yLmlkfSlgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW1pdCA9IGZpbHRlcnMubGltaXQgfHwgNTA7XG4gICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgcXVlcnkubGltaXQobGltaXQpO1xuICAgIGlmIChlcnJvcikgcmV0dXJuIGZhaWwoJ1F1ZXJ5IGZhaWxlZCcpO1xuXG4gICAgY29uc3QgbmV4dEN1cnNvciA9IGRhdGEubGVuZ3RoID09PSBsaW1pdFxuICAgICAgPyB7IGNyZWF0ZWRfYXQ6IGRhdGFbZGF0YS5sZW5ndGggLSAxXS5jcmVhdGVkX2F0LCBpZDogZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmlkIH1cbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIG9rKHsgZGF0YTogZGF0YSBhcyBXaXRoZHJhd2FsUmVxdWVzdFtdLCBuZXh0Q3Vyc29yIH0pO1xuICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgcmV0dXJuIGZhaWwodG9FcnJvck1lc3NhZ2UoZSkpO1xuICB9XG59XG5cbi8vIOKUgOKUgOKUgCBBdWRpdCBMb2dzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXVkaXRMb2dzKFxuICBmaWx0ZXJzOiB7IGxpbWl0PzogbnVtYmVyOyBhY3Rpb24/OiBzdHJpbmc7IGFjdG9yX3VzZXJfaWQ/OiBzdHJpbmc7IHN0YXJ0X2RhdGU/OiBzdHJpbmc7IGVuZF9kYXRlPzogc3RyaW5nIH0gPSB7fSxcbiAgY3Vyc29yPzogeyBjcmVhdGVkX2F0OiBzdHJpbmc7IGlkOiBzdHJpbmcgfVxuKTogUHJvbWlzZTxTZXJ2aWNlUmVzdWx0PHsgZGF0YTogQXVkaXRMb2dFbnRyeVtdOyBuZXh0Q3Vyc29yPzogeyBjcmVhdGVkX2F0OiBzdHJpbmc7IGlkOiBzdHJpbmcgfSB9Pj4ge1xuICB0cnkge1xuICAgIGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoRklOQU5DRV9XUklURV9ST0xFUyk7XG4gICAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBzdXBhYmFzZVNlcnZlcigpO1xuXG4gICAgbGV0IHF1ZXJ5ID0gc3VwYWJhc2VcbiAgICAgIC5mcm9tKCdhdWRpdF9sb2dzJylcbiAgICAgIC5zZWxlY3QoJyonKVxuICAgICAgLm9yZGVyKCdjcmVhdGVkX2F0JywgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXG4gICAgICAub3JkZXIoJ2lkJywgeyBhc2NlbmRpbmc6IGZhbHNlIH0pO1xuXG4gICAgaWYgKGZpbHRlcnMuYWN0aW9uKSBxdWVyeSA9IHF1ZXJ5LmVxKCdhY3Rpb24nLCBmaWx0ZXJzLmFjdGlvbik7XG4gICAgaWYgKGZpbHRlcnMuYWN0b3JfdXNlcl9pZCkgcXVlcnkgPSBxdWVyeS5lcSgnYWN0b3JfdXNlcl9pZCcsIGZpbHRlcnMuYWN0b3JfdXNlcl9pZCk7XG4gICAgaWYgKGZpbHRlcnMuc3RhcnRfZGF0ZSkgcXVlcnkgPSBxdWVyeS5ndGUoJ2NyZWF0ZWRfYXQnLCBmaWx0ZXJzLnN0YXJ0X2RhdGUpO1xuICAgIGlmIChmaWx0ZXJzLmVuZF9kYXRlKSBxdWVyeSA9IHF1ZXJ5Lmx0ZSgnY3JlYXRlZF9hdCcsIGZpbHRlcnMuZW5kX2RhdGUpO1xuXG4gICAgaWYgKGN1cnNvcikge1xuICAgICAgcXVlcnkgPSBxdWVyeS5vcihgY3JlYXRlZF9hdC5sdC4ke2N1cnNvci5jcmVhdGVkX2F0fSxhbmQoY3JlYXRlZF9hdC5lcS4ke2N1cnNvci5jcmVhdGVkX2F0fSxpZC5sdC4ke2N1cnNvci5pZH0pYCk7XG4gICAgfVxuXG4gICAgY29uc3QgbGltaXQgPSBmaWx0ZXJzLmxpbWl0IHx8IDUwO1xuICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHF1ZXJ5LmxpbWl0KGxpbWl0KTtcbiAgICBpZiAoZXJyb3IpIHJldHVybiBmYWlsKGBRdWVyeSBmYWlsZWQ6ICR7ZXJyb3IubWVzc2FnZX1gKTtcblxuICAgIGNvbnN0IG5leHRDdXJzb3IgPSBkYXRhLmxlbmd0aCA9PT0gbGltaXRcbiAgICAgID8geyBjcmVhdGVkX2F0OiBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uY3JlYXRlZF9hdCwgaWQ6IGRhdGFbZGF0YS5sZW5ndGggLSAxXS5pZCB9XG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBvayh7IGRhdGEsIG5leHRDdXJzb3IgfSk7XG4gIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICByZXR1cm4gZmFpbCh0b0Vycm9yTWVzc2FnZShlKSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiaVRBd0hzQixrTUFBQSJ9
}),
"[project]/src/features/finance/viewmodels/useTransactionTrace.vm.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTransactionTraceVM",
    ()=>useTransactionTraceVM
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$data$3a$4cf513__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/features/finance/actions/data:4cf513 [app-client] (ecmascript) <text/javascript>");
var _s = __turbopack_context__.k.signature();
;
;
function useTransactionTraceVM(journalId, open) {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isUnmasked, setIsUnmasked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTransactionTraceVM.useEffect": ()=>{
            if (open && journalId) {
                setIsLoading(true);
                setError(null);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$data$3a$4cf513__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getTransactionDetails"])(journalId).then({
                    "useTransactionTraceVM.useEffect": (result)=>{
                        if (!result.success) {
                            setError(result.error);
                            return;
                        }
                        setData(result.data);
                        setIsUnmasked(!!result.data.meta_full && Object.keys(result.data.meta_full).length > 0);
                    }
                }["useTransactionTraceVM.useEffect"]).catch({
                    "useTransactionTraceVM.useEffect": (err)=>setError(err.message)
                }["useTransactionTraceVM.useEffect"]).finally({
                    "useTransactionTraceVM.useEffect": ()=>setIsLoading(false)
                }["useTransactionTraceVM.useEffect"]);
            }
        }
    }["useTransactionTraceVM.useEffect"], [
        journalId,
        open
    ]);
    return {
        data,
        isLoading,
        error,
        isUnmasked
    };
}
_s(useTransactionTraceVM, "Eta6l02enVPZOqpttK0bu3lvK2E=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/finance/components/TransactionTraceDrawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransactionTraceDrawer",
    ()=>TransactionTraceDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/sheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-client] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$viewmodels$2f$useTransactionTrace$2e$vm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/viewmodels/useTransactionTrace.vm.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/models/finance.model.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function TransactionTraceDrawer({ journalId, open, onOpenChange }) {
    _s();
    const vm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$viewmodels$2f$useTransactionTrace$2e$vm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransactionTraceVM"])(journalId, open);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"], {
            className: "sm:max-w-md md:max-w-lg overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTitle"], {
                            children: "Transaction Trace"
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetDescription"], {
                            children: [
                                "Audit view for journal entry ",
                                journalId.split('-')[0]
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                vm.isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-40 items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "h-6 w-6 animate-spin text-muted-foreground"
                    }, void 0, false, {
                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                        lineNumber: 37,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                    lineNumber: 36,
                    columnNumber: 11
                }, this) : vm.error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-40 flex-col items-center justify-center text-destructive",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                            className: "h-8 w-8 mb-2"
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                            lineNumber: 41,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium",
                            children: vm.error
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                            lineNumber: 42,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                    lineNumber: 40,
                    columnNumber: 11
                }, this) : vm.data ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                    className: "h-[calc(100vh-8rem)] mt-6 pr-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-muted-foreground mb-1",
                                                children: "Event Type"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 50,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "outline",
                                                className: "font-medium",
                                                children: vm.data.event_type
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 51,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 49,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-muted-foreground mb-1",
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 54,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "secondary",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatusBadgeClass"])(vm.data.status),
                                                children: vm.data.status
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 55,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 53,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "col-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-muted-foreground mb-1",
                                                children: "Date"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 60,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-mono text-sm",
                                                children: new Date(vm.data.created_at).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 61,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 59,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                lineNumber: 48,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-md border p-4 space-y-3 bg-secondary/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2",
                                        children: "Financials"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 67,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-muted-foreground",
                                                children: "Gross Amount"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 69,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono",
                                                children: [
                                                    vm.data.gross_amount,
                                                    " IQD"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 70,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 68,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-muted-foreground",
                                                children: "Fee Amount"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 73,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-destructive",
                                                children: [
                                                    "-",
                                                    vm.data.fee_amount,
                                                    " IQD"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 74,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center text-sm font-medium pt-2 border-t",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Net Amount"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 77,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono",
                                                children: [
                                                    vm.data.net_amount,
                                                    " IQD"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 78,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 76,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                lineNumber: 66,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-xs font-semibold uppercase text-muted-foreground tracking-wider",
                                        children: "Related Entities"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 84,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 gap-2 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1 pb-2 border-b border-border/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground text-xs",
                                                        children: "Payer ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 87,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-xs",
                                                        children: vm.data.payer_user_id || 'System (Platform)'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 88,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 86,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1 pb-2 border-b border-border/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground text-xs",
                                                        children: "Payee ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 91,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-xs",
                                                        children: vm.data.payee_user_id || 'System (Platform)'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 92,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 90,
                                                columnNumber: 19
                                            }, this),
                                            vm.data.entity_type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1 pb-2 border-b border-border/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground text-xs",
                                                        children: [
                                                            vm.data.entity_type,
                                                            " ID"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 96,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-xs",
                                                        children: vm.data.entity_id
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 95,
                                                columnNumber: 21
                                            }, this),
                                            vm.data.initiator_user_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground text-xs",
                                                        children: "Initiator (Actor)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-xs",
                                                        children: vm.data.initiator_user_id
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 101,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 85,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                lineNumber: 83,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-xs font-semibold uppercase text-muted-foreground tracking-wider",
                                                children: "Metadata"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 112,
                                                columnNumber: 19
                                            }, this),
                                            vm.isUnmasked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "outline",
                                                className: "text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        className: "h-3 w-3 mr-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 66
                                                    }, this),
                                                    " Unmasked View"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 114,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 111,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-md bg-muted p-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                            className: "text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all",
                                            children: JSON.stringify(vm.data.meta_full || vm.data.meta_masked || {}, null, 2)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                            lineNumber: 119,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this),
                                    !vm.isUnmasked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground italic flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 125,
                                                columnNumber: 21
                                            }, this),
                                            "Sensitive metadata is masked for your role. Contact a Super Admin for access."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 124,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                lineNumber: 110,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                    lineNumber: 45,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(TransactionTraceDrawer, "cDGlXur7vr/UzyN0/zjO6MgmwOM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$viewmodels$2f$useTransactionTrace$2e$vm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransactionTraceVM"]
    ];
});
_c = TransactionTraceDrawer;
var _c;
__turbopack_context__.k.register(_c, "TransactionTraceDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/finance/viewmodels/useTransactions.vm.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTransactionsVM",
    ()=>useTransactionsVM
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useTransactionsVM(nextCursor, filters = {}) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [selectedTxnId, setSelectedTxnId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const hasActiveFilters = !!(filters.event_type || filters.status);
    const canGoBack = !!searchParams.get('cursor_id');
    const selectTransaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTransactionsVM.useCallback[selectTransaction]": (id)=>{
            setSelectedTxnId(id);
        }
    }["useTransactionsVM.useCallback[selectTransaction]"], []);
    const clearSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTransactionsVM.useCallback[clearSelection]": ()=>{
            setSelectedTxnId(null);
        }
    }["useTransactionsVM.useCallback[clearSelection]"], []);
    const goNextPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTransactionsVM.useCallback[goNextPage]": ()=>{
            if (!nextCursor) return;
            const params = new URLSearchParams(searchParams.toString());
            params.set('cursor_created_at', nextCursor.created_at);
            params.set('cursor_id', nextCursor.journal_id);
            router.push(`?${params.toString()}`);
        }
    }["useTransactionsVM.useCallback[goNextPage]"], [
        nextCursor,
        searchParams,
        router
    ]);
    const clearFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTransactionsVM.useCallback[clearFilters]": ()=>{
            router.push('/dashboard/finance/transactions');
        }
    }["useTransactionsVM.useCallback[clearFilters]"], [
        router
    ]);
    return {
        selectedTxnId,
        hasActiveFilters,
        canGoBack,
        selectTransaction,
        clearSelection,
        goNextPage,
        clearFilters
    };
}
_s(useTransactionsVM, "2D8DF6xOEmv/tipcjj+k1/45hOg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/finance/components/TransactionsTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransactionsTable",
    ()=>TransactionsTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/models/finance.model.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$components$2f$TransactionTraceDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/components/TransactionTraceDrawer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$viewmodels$2f$useTransactions$2e$vm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/viewmodels/useTransactions.vm.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function TransactionsTable({ initialData, nextCursor, filters }) {
    _s();
    const vm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$viewmodels$2f$useTransactions$2e$vm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransactionsVM"])(nextCursor, filters);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-4 border-b",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold",
                                children: "Ledger Transactions"
                            }, void 0, false, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this),
                            vm.hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "secondary",
                                className: "ml-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                        className: "h-3 w-3 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 35,
                                        columnNumber: 15
                                    }, this),
                                    " Filters Active"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: vm.hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "sm",
                            onClick: vm.clearFilters,
                            children: "Clear Filters"
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                            lineNumber: 41,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Journal ID"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 52,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Event Type"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 53,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Payer / Payee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 55,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "text-right",
                                        children: "Gross"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 56,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "text-right",
                                        children: "Fee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "text-right",
                                        children: "Net"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Date"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {}, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                            children: initialData.length > 0 ? initialData.map((txn)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                    className: "hover:bg-muted/50 cursor-pointer",
                                    onClick: ()=>vm.selectTransaction(txn.journal_id),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "font-mono text-xs",
                                            children: [
                                                txn.journal_id.slice(0, 8),
                                                "..."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 67,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "outline",
                                                children: txn.event_type
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                lineNumber: 69,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 68,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "secondary",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$models$2f$finance$2e$model$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatusBadgeClass"])(txn.status),
                                                children: txn.status
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                lineNumber: 72,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 71,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground mr-1",
                                                            children: "Fr:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                            lineNumber: 77,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        txn.payer_user_id ? txn.payer_user_id.slice(0, 8) + '...' : 'System'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground mr-1",
                                                            children: "To:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                            lineNumber: 78,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        txn.payee_user_id ? txn.payee_user_id.slice(0, 8) + '...' : 'System'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                    lineNumber: 78,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 76,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right font-mono",
                                            children: txn.gross_amount
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right font-mono text-destructive",
                                            children: txn.fee_amount > 0 ? `-${txn.fee_amount}` : '0'
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 81,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right font-mono font-medium",
                                            children: txn.net_amount
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 82,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-muted-foreground text-sm",
                                            children: new Date(txn.created_at).toLocaleString()
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 83,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    vm.selectTransaction(txn.journal_id);
                                                },
                                                children: "Details"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                lineNumber: 87,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 86,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, txn.journal_id, true, {
                                    fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                    lineNumber: 66,
                                    columnNumber: 17
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: 9,
                                    className: "h-24 text-center text-muted-foreground",
                                    children: "No transactions found."
                                }, void 0, false, {
                                    fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                    lineNumber: 95,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 94,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-end space-x-2 py-4 px-4 border-t",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        onClick: ()=>window.history.back(),
                        disabled: !vm.canGoBack,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "h-4 w-4 mr-1"
                            }, void 0, false, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this),
                            " Previous"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        onClick: vm.goNextPage,
                        disabled: !nextCursor,
                        children: [
                            "Next ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "h-4 w-4 ml-1"
                            }, void 0, false, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 119,
                                columnNumber: 16
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            vm.selectedTxnId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$components$2f$TransactionTraceDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionTraceDrawer"], {
                journalId: vm.selectedTxnId,
                open: !!vm.selectedTxnId,
                onOpenChange: (open)=>!open && vm.clearSelection()
            }, void 0, false, {
                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                lineNumber: 124,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(TransactionsTable, "WfMMVuVn426jBW9BbWKwJKHwG6I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$viewmodels$2f$useTransactions$2e$vm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransactionsVM"]
    ];
});
_c = TransactionsTable;
var _c;
__turbopack_context__.k.register(_c, "TransactionsTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_a3783d96._.js.map