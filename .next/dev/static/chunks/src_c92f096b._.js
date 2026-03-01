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
"[project]/src/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript) <export * as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Select({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Root, {
        "data-slot": "select",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Select;
function SelectGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Group, {
        "data-slot": "select-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = SelectGroup;
function SelectValue({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Value, {
        "data-slot": "select-value",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = SelectValue;
function SelectTrigger({ className, size = "default", children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Trigger, {
        "data-slot": "select-trigger",
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Icon, {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                    className: "size-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c3 = SelectTrigger;
function SelectContent({ className, children, position = "item-aligned", align = "center", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Portal, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Content, {
            "data-slot": "select-content",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            align: align,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Viewport, {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_c4 = SelectContent;
function SelectLabel({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Label, {
        "data-slot": "select-label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground px-2 py-1.5 text-xs", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c5 = SelectLabel;
function SelectItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Item, {
        "data-slot": "select-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "data-slot": "select-item-indicator",
                className: "absolute right-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].ItemIndicator, {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/select.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].ItemText, {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_c6 = SelectItem;
function SelectSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Separator, {
        "data-slot": "select-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border pointer-events-none -mx-1 my-1 h-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_c7 = SelectSeparator;
function SelectScrollUpButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].ScrollUpButton, {
        "data-slot": "select-scroll-up-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__["ChevronUpIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 156,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
_c8 = SelectScrollUpButton;
function SelectScrollDownButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].ScrollDownButton, {
        "data-slot": "select-scroll-down-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 174,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
_c9 = SelectScrollDownButton;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Select");
__turbopack_context__.k.register(_c1, "SelectGroup");
__turbopack_context__.k.register(_c2, "SelectValue");
__turbopack_context__.k.register(_c3, "SelectTrigger");
__turbopack_context__.k.register(_c4, "SelectContent");
__turbopack_context__.k.register(_c5, "SelectLabel");
__turbopack_context__.k.register(_c6, "SelectItem");
__turbopack_context__.k.register(_c7, "SelectSeparator");
__turbopack_context__.k.register(_c8, "SelectScrollUpButton");
__turbopack_context__.k.register(_c9, "SelectScrollDownButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/use-debounce.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebouncedCallback",
    ()=>useDebouncedCallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useDebouncedCallback(callback, delay) {
    _s();
    const timeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDebouncedCallback.useCallback": (...args)=>{
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout({
                "useDebouncedCallback.useCallback": ()=>{
                    callback(...args);
                }
            }["useDebouncedCallback.useCallback"], delay);
        }
    }["useDebouncedCallback.useCallback"], [
        callback,
        delay
    ]);
}
_s(useDebouncedCallback, "aX3H9w8I659ydesPwuJ+mASHjvQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/users/UserSearch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserSearch",
    ()=>UserSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$debounce$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-debounce.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function UserSearch() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { replace } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$debounce$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedCallback"])({
        "UserSearch.useDebouncedCallback[handleSearch]": (term)=>{
            const params = new URLSearchParams(searchParams);
            params.set('page', '1'); // Reset pagination
            if (term) {
                params.set('query', term);
            } else {
                params.delete('query');
            }
            replace(`${window.location.pathname}?${params.toString()}`);
        }
    }["UserSearch.useDebouncedCallback[handleSearch]"], 300);
    const handleRoleFilter = (value)=>{
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (value && value !== 'all') {
            params.set('role', value);
        } else {
            params.delete('role');
        }
        replace(`${window.location.pathname}?${params.toString()}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex-1 max-w-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                        className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                    }, void 0, false, {
                        fileName: "[project]/src/components/users/UserSearch.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        placeholder: "Search users...",
                        className: "pl-8",
                        defaultValue: searchParams.get('query')?.toString(),
                        onChange: (e)=>handleSearch(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/src/components/users/UserSearch.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/users/UserSearch.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                defaultValue: searchParams.get('role')?.toString() || "all",
                onValueChange: handleRoleFilter,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                        className: "w-[180px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                            placeholder: "Filter by Role"
                        }, void 0, false, {
                            fileName: "[project]/src/components/users/UserSearch.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/users/UserSearch.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                value: "all",
                                children: "All Roles"
                            }, void 0, false, {
                                fileName: "[project]/src/components/users/UserSearch.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                value: "client",
                                children: "Client"
                            }, void 0, false, {
                                fileName: "[project]/src/components/users/UserSearch.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                value: "freelancer",
                                children: "Freelancer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/users/UserSearch.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                value: "admin",
                                children: "Admin"
                            }, void 0, false, {
                                fileName: "[project]/src/components/users/UserSearch.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/users/UserSearch.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/users/UserSearch.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/users/UserSearch.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(UserSearch, "nywdl9IQFstacwyntd69tRIi3Ss=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$debounce$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedCallback"]
    ];
});
_c = UserSearch;
var _c;
__turbopack_context__.k.register(_c, "UserSearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/users/PaginationControls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PaginationControls",
    ()=>PaginationControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function PaginationControls({ totalPages }) {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { replace } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const currentPage = Number(searchParams.get('page')) || 1;
    const handlePageChange = (page)=>{
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        replace(`${window.location.pathname}?${params.toString()}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-end space-x-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "outline",
                size: "sm",
                onClick: ()=>handlePageChange(Math.max(currentPage - 1, 1)),
                disabled: currentPage <= 1,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/users/PaginationControls.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    "Previous"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/users/PaginationControls.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm font-medium",
                children: [
                    "Page ",
                    currentPage,
                    " of ",
                    totalPages
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/users/PaginationControls.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "outline",
                size: "sm",
                onClick: ()=>handlePageChange(Math.min(currentPage + 1, totalPages)),
                disabled: currentPage >= totalPages,
                children: [
                    "Next",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/users/PaginationControls.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/users/PaginationControls.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/users/PaginationControls.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_s(PaginationControls, "/tDAUr21Nld8EE/o0al+5H2ECJM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PaginationControls;
var _c;
__turbopack_context__.k.register(_c, "PaginationControls");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/alert-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertDialog",
    ()=>AlertDialog,
    "AlertDialogAction",
    ()=>AlertDialogAction,
    "AlertDialogCancel",
    ()=>AlertDialogCancel,
    "AlertDialogContent",
    ()=>AlertDialogContent,
    "AlertDialogDescription",
    ()=>AlertDialogDescription,
    "AlertDialogFooter",
    ()=>AlertDialogFooter,
    "AlertDialogHeader",
    ()=>AlertDialogHeader,
    "AlertDialogOverlay",
    ()=>AlertDialogOverlay,
    "AlertDialogPortal",
    ()=>AlertDialogPortal,
    "AlertDialogTitle",
    ()=>AlertDialogTitle,
    "AlertDialogTrigger",
    ()=>AlertDialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs [app-client] (ecmascript) <export * as AlertDialog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
function AlertDialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Root, {
        "data-slot": "alert-dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = AlertDialog;
function AlertDialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Trigger, {
        "data-slot": "alert-dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c1 = AlertDialogTrigger;
function AlertDialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Portal, {
        "data-slot": "alert-dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c2 = AlertDialogPortal;
function AlertDialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Overlay, {
        "data-slot": "alert-dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c3 = AlertDialogOverlay;
function AlertDialogContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/ui/alert-dialog.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Content, {
                "data-slot": "alert-dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/alert-dialog.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c4 = AlertDialogContent;
function AlertDialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert-dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_c5 = AlertDialogHeader;
function AlertDialogFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert-dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_c6 = AlertDialogFooter;
function AlertDialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Title, {
        "data-slot": "alert-dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_c7 = AlertDialogTitle;
function AlertDialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Description, {
        "data-slot": "alert-dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
_c8 = AlertDialogDescription;
function AlertDialogAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Action, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_c9 = AlertDialogAction;
function AlertDialogCancel({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Cancel, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])({
            variant: "outline"
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_c10 = AlertDialogCancel;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "AlertDialog");
__turbopack_context__.k.register(_c1, "AlertDialogTrigger");
__turbopack_context__.k.register(_c2, "AlertDialogPortal");
__turbopack_context__.k.register(_c3, "AlertDialogOverlay");
__turbopack_context__.k.register(_c4, "AlertDialogContent");
__turbopack_context__.k.register(_c5, "AlertDialogHeader");
__turbopack_context__.k.register(_c6, "AlertDialogFooter");
__turbopack_context__.k.register(_c7, "AlertDialogTitle");
__turbopack_context__.k.register(_c8, "AlertDialogDescription");
__turbopack_context__.k.register(_c9, "AlertDialogAction");
__turbopack_context__.k.register(_c10, "AlertDialogCancel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/users/services/data:99f3bd [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "suspendUser",
    ()=>$$RSC_SERVER_ACTION_2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"70971c68966d52546dc36cefc7e70584a998c9a501":"suspendUser"},"src/features/users/services/user_actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("70971c68966d52546dc36cefc7e70584a998c9a501", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "suspendUser");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdXNlcl9hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgY3JlYXRlQWRtaW5DbGllbnQgfSBmcm9tICdAL2xpYi9zdXBhYmFzZS9hZG1pbic7XG5pbXBvcnQgeyByZXZhbGlkYXRlUGF0aCB9IGZyb20gJ25leHQvY2FjaGUnO1xuaW1wb3J0IHsgcmVxdWlyZUFkbWluUm9sZSwgbG9nQXVkaXRFdmVudCwgZW5mb3JjZVJhdGVMaW1pdCB9IGZyb20gJ0AvZmVhdHVyZXMvY29yZS9zZWN1cml0eS9zZWN1cml0eV9ndWFyZHMnO1xuaW1wb3J0IHsgb2ssIGZhaWwsIFNlcnZpY2VSZXN1bHQsIHRvRXJyb3JNZXNzYWdlIH0gZnJvbSAnQC9mZWF0dXJlcy9jb3JlL21vZGVscy9yZXN1bHQnO1xuaW1wb3J0IHsgR2V0VXNlcnNTY2hlbWEsIEdldFVzZXJEZXRhaWxzU2NoZW1hLCBTdXNwZW5kVXNlclNjaGVtYSwgQmFuVXNlclNjaGVtYSwgVW5iYW5Vc2VyU2NoZW1hLCBWZXJpZnlVc2VyU2NoZW1hLCBVU0VSU19SRUFEX1JPTEVTLCBVU0VSU19XUklURV9ST0xFUyB9IGZyb20gJy4uL21vZGVscy91c2VyLnNjaGVtYSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlckRUTyB7XG4gIGlkOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIGZ1bGxfbmFtZTogc3RyaW5nO1xuICBhdmF0YXJfdXJsOiBzdHJpbmc7XG4gIHJvbGU6IHN0cmluZztcbiAgcm9sZXM6IHN0cmluZ1tdO1xuICBhY3RpdmVfcm9sZTogc3RyaW5nO1xuICBzdGF0dXM6ICdhY3RpdmUnIHwgJ3N1c3BlbmRlZCcgfCAnYmFubmVkJztcbiAgY3JlYXRlZF9hdDogc3RyaW5nO1xuICBsYXN0X3NpZ25faW5fYXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVc2VyRGV0YWlsc0RUTyBleHRlbmRzIFVzZXJEVE8ge1xuICBwaG9uZTogc3RyaW5nO1xuICBiaW86IHN0cmluZztcbiAgcmF0aW5nOiBudW1iZXI7XG4gIHNwZW50OiBudW1iZXI7XG4gIGVhcm5lZDogbnVtYmVyO1xuICBqb2JfY291bnQ6IG51bWJlcjtcbiAgd2FsbGV0X2JhbGFuY2U6IG51bWJlcjtcbiAgcmVjZW50X2FjdGl2aXR5OiBhbnlbXTtcbiAgbWV0YWRhdGE6IGFueTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFVzZXJzKFxuICBwYWdlID0gMSwgXG4gIHF1ZXJ5ID0gJycsIFxuICByb2xlU3RyID0gJ2FsbCdcbik6IFByb21pc2U8U2VydmljZVJlc3VsdDx7IHVzZXJzOiBVc2VyRFRPW107IHRvdGFsUGFnZXM6IG51bWJlcjsgdG90YWxVc2VyczogbnVtYmVyIH0+PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkID0gR2V0VXNlcnNTY2hlbWEuc2FmZVBhcnNlKHsgcGFnZSwgcXVlcnksIHJvbGU6IHJvbGVTdHIgfSk7XG4gICAgaWYgKCFwYXJzZWQuc3VjY2VzcykgcmV0dXJuIGZhaWwocGFyc2VkLmVycm9yLmlzc3Vlc1swXS5tZXNzYWdlKTtcblxuICAgIGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoVVNFUlNfUkVBRF9ST0xFUyk7XG5cbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUFkbWluQ2xpZW50KCk7XG4gICAgY29uc3QgUEFHRV9TSVpFID0gMTA7XG4gICAgY29uc3QgZnJvbSA9IChwYXJzZWQuZGF0YS5wYWdlIC0gMSkgKiBQQUdFX1NJWkU7XG4gICAgY29uc3QgdG8gPSBmcm9tICsgUEFHRV9TSVpFIC0gMTtcblxuICAgIGxldCBxdWVyeUJ1aWxkZXIgPSBzdXBhYmFzZVxuICAgICAgLmZyb20oJ3Byb2ZpbGVzJylcbiAgICAgIC5zZWxlY3QoJyonLCB7IGNvdW50OiAnZXhhY3QnIH0pO1xuXG4gICAgaWYgKHBhcnNlZC5kYXRhLnF1ZXJ5KSB7XG4gICAgICBxdWVyeUJ1aWxkZXIgPSBxdWVyeUJ1aWxkZXIub3IoYGZ1bGxfbmFtZS5pbGlrZS4lJHtwYXJzZWQuZGF0YS5xdWVyeX0lLGVtYWlsLmlsaWtlLiUke3BhcnNlZC5kYXRhLnF1ZXJ5fSVgKTtcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkLmRhdGEucm9sZSAmJiBwYXJzZWQuZGF0YS5yb2xlICE9PSAnYWxsJykge1xuICAgICAgIHF1ZXJ5QnVpbGRlciA9IHF1ZXJ5QnVpbGRlci5lcSgncm9sZScsIHBhcnNlZC5kYXRhLnJvbGUpO1xuICAgIH1cblxuICAgIHF1ZXJ5QnVpbGRlciA9IHF1ZXJ5QnVpbGRlci5yYW5nZShmcm9tLCB0bykub3JkZXIoJ2NyZWF0ZWRfYXQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XG5cbiAgICBjb25zdCB7IGRhdGE6IHByb2ZpbGVzLCBlcnJvciwgY291bnQgfSA9IGF3YWl0IHF1ZXJ5QnVpbGRlcjtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgcHJvZmlsZXM6JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIGZhaWwoJ0ZhaWxlZCB0byBmZXRjaCB1c2VycycpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCB1c2VyczogVXNlckRUT1tdID0gcHJvZmlsZXMubWFwKChwOiBhbnkpID0+ICh7XG4gICAgICBpZDogcC5pZCxcbiAgICAgIGVtYWlsOiBwLmVtYWlsIHx8ICcnLFxuICAgICAgZnVsbF9uYW1lOiBwLmZ1bGxfbmFtZSB8fCAnVW5rbm93bicsXG4gICAgICBhdmF0YXJfdXJsOiBwLmF2YXRhcl91cmwgfHwgJycsXG4gICAgICByb2xlOiBwLmFjdGl2ZV9yb2xlIHx8IChwLnJvbGVzICYmIHAucm9sZXNbMF0pIHx8ICd1c2VyJyxcbiAgICAgIHJvbGVzOiBwLnJvbGVzIHx8IFsndXNlciddLFxuICAgICAgYWN0aXZlX3JvbGU6IHAuYWN0aXZlX3JvbGUgfHwgJ3VzZXInLFxuICAgICAgc3RhdHVzOiBwLnN0YXR1cyB8fCAnYWN0aXZlJyxcbiAgICAgIGNyZWF0ZWRfYXQ6IHAuY3JlYXRlZF9hdCxcbiAgICAgIGxhc3Rfc2lnbl9pbl9hdDogcC51cGRhdGVkX2F0LFxuICAgIH0pKTtcblxuICAgIHJldHVybiBvayh7XG4gICAgICB1c2VycyxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCgoY291bnQgfHwgMCkgLyBQQUdFX1NJWkUpLFxuICAgICAgdG90YWxVc2VyczogY291bnQgfHwgMFxuICAgIH0pO1xuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0VXNlcnMgZXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWlsKHRvRXJyb3JNZXNzYWdlKGVycm9yKSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFVzZXJEZXRhaWxzKGlkOiBzdHJpbmcpOiBQcm9taXNlPFNlcnZpY2VSZXN1bHQ8VXNlckRldGFpbHNEVE8+PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkID0gR2V0VXNlckRldGFpbHNTY2hlbWEuc2FmZVBhcnNlKHsgaWQgfSk7XG4gICAgaWYgKCFwYXJzZWQuc3VjY2VzcykgcmV0dXJuIGZhaWwocGFyc2VkLmVycm9yLmlzc3Vlc1swXS5tZXNzYWdlKTtcblxuICAgIGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoVVNFUlNfUkVBRF9ST0xFUyk7XG5cbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUFkbWluQ2xpZW50KCk7XG5cbiAgICBjb25zdCBbYXV0aFJlcywgcHJvZmlsZVJlcywgdGFza3NSZXMsIHdhbGxldFJlc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBzdXBhYmFzZS5hdXRoLmFkbWluLmdldFVzZXJCeUlkKHBhcnNlZC5kYXRhLmlkKSxcbiAgICAgIHN1cGFiYXNlLmZyb20oJ3Byb2ZpbGVzJykuc2VsZWN0KCcqJykuZXEoJ2lkJywgcGFyc2VkLmRhdGEuaWQpLnNpbmdsZSgpLFxuICAgICAgc3VwYWJhc2UuZnJvbSgndGFza3MnKS5zZWxlY3QoJyonKS5vcihgY2xpZW50X2lkLmVxLiR7cGFyc2VkLmRhdGEuaWR9LGZyZWVsYW5jZXJfaWQuZXEuJHtwYXJzZWQuZGF0YS5pZH1gKS5vcmRlcignY3JlYXRlZF9hdCcsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KS5saW1pdCgxMCksXG4gICAgICBzdXBhYmFzZS5mcm9tKCd2d193YWxsZXRfYmFsYW5jZXNfdXNlcicpLnNlbGVjdCgnYXZhaWxhYmxlX2JhbGFuY2UnKS5lcSgndXNlcl9pZCcsIHBhcnNlZC5kYXRhLmlkKS5tYXliZVNpbmdsZSgpXG4gICAgXSk7XG5cbiAgICBpZiAoYXV0aFJlcy5lcnJvciB8fCAhYXV0aFJlcy5kYXRhLnVzZXIpIHJldHVybiBmYWlsKCdVc2VyIG5vdCBmb3VuZCBpbiBBdXRoIHN5c3RlbScpO1xuICAgIGNvbnN0IGF1dGhVc2VyID0gYXV0aFJlcy5kYXRhLnVzZXI7XG4gICAgY29uc3QgcHJvZmlsZSA9IHByb2ZpbGVSZXMuZGF0YSB8fCB7fTtcbiAgICBjb25zdCByZWNlbnRfYWN0aXZpdHkgPSB0YXNrc1Jlcy5kYXRhIHx8IFtdO1xuICAgIGNvbnN0IHdhbGxldF9iYWxhbmNlID0gd2FsbGV0UmVzLmRhdGE/LmF2YWlsYWJsZV9iYWxhbmNlIHx8IDA7XG4gICAgY29uc3Qgam9iX2NvdW50ID0gcmVjZW50X2FjdGl2aXR5Lmxlbmd0aDsgLy8gQXBwcm94aW1hdGUgZm9yIG5vd1xuXG4gICAgY29uc3QgdXNlcjogVXNlckRldGFpbHNEVE8gPSB7XG4gICAgICBpZDogYXV0aFVzZXIuaWQsXG4gICAgICBlbWFpbDogYXV0aFVzZXIuZW1haWwgfHwgJycsXG4gICAgICBmdWxsX25hbWU6IHByb2ZpbGUuZnVsbF9uYW1lIHx8IGF1dGhVc2VyLnVzZXJfbWV0YWRhdGE/LmZ1bGxfbmFtZSB8fCAnVW5rbm93bicsXG4gICAgICBhdmF0YXJfdXJsOiBwcm9maWxlLmF2YXRhcl91cmwgfHwgYXV0aFVzZXIudXNlcl9tZXRhZGF0YT8uYXZhdGFyX3VybCB8fCAnJyxcbiAgICAgIHJvbGU6IHByb2ZpbGUuYWN0aXZlX3JvbGUgfHwgKHByb2ZpbGUucm9sZXMgJiYgcHJvZmlsZS5yb2xlc1swXSkgfHwgYXV0aFVzZXIuYXBwX21ldGFkYXRhPy5yb2xlIHx8ICd1c2VyJyxcbiAgICAgIHJvbGVzOiBwcm9maWxlLnJvbGVzIHx8IFsndXNlciddLFxuICAgICAgYWN0aXZlX3JvbGU6IHByb2ZpbGUuYWN0aXZlX3JvbGUgfHwgJ3VzZXInLFxuICAgICAgc3RhdHVzOiBhdXRoVXNlci5iYW5uZWRfdW50aWwgPyAnYmFubmVkJyA6IChwcm9maWxlLnN0YXR1cyB8fCAnYWN0aXZlJyksXG4gICAgICBjcmVhdGVkX2F0OiBhdXRoVXNlci5jcmVhdGVkX2F0LFxuICAgICAgbGFzdF9zaWduX2luX2F0OiBhdXRoVXNlci5sYXN0X3NpZ25faW5fYXQgfHwgJycsXG4gICAgICBwaG9uZTogYXV0aFVzZXIucGhvbmUgfHwgJycsXG4gICAgICBiaW86IHByb2ZpbGUuYmlvIHx8ICcnLFxuICAgICAgcmF0aW5nOiBwcm9maWxlLnJhdGluZyB8fCAwLFxuICAgICAgc3BlbnQ6IDAsIFxuICAgICAgZWFybmVkOiAwLFxuICAgICAgam9iX2NvdW50LFxuICAgICAgd2FsbGV0X2JhbGFuY2UsXG4gICAgICByZWNlbnRfYWN0aXZpdHksXG4gICAgICBtZXRhZGF0YTogYXV0aFVzZXIudXNlcl9tZXRhZGF0YVxuICAgIH07XG5cbiAgICByZXR1cm4gb2sodXNlcik7XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRVc2VyRGV0YWlscyBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhaWwodG9FcnJvck1lc3NhZ2UoZXJyb3IpKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3VzcGVuZFVzZXIoaWQ6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIGR1cmF0aW9uPzogc3RyaW5nKTogUHJvbWlzZTxTZXJ2aWNlUmVzdWx0PHsgaWQ6IHN0cmluZyB9Pj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHBhcnNlZCA9IFN1c3BlbmRVc2VyU2NoZW1hLnNhZmVQYXJzZSh7IGlkLCByZWFzb24sIGR1cmF0aW9uIH0pO1xuICAgIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHJldHVybiBmYWlsKHBhcnNlZC5lcnJvci5pc3N1ZXNbMF0ubWVzc2FnZSk7XG5cbiAgICBjb25zdCB7IHVzZXJJZCB9ID0gYXdhaXQgcmVxdWlyZUFkbWluUm9sZShVU0VSU19XUklURV9ST0xFUyk7XG4gICAgYXdhaXQgZW5mb3JjZVJhdGVMaW1pdCgnc3VzcGVuZF91c2VyJywgdXNlcklkLCA1LCA2MDAwMCk7XG5cbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUFkbWluQ2xpZW50KCk7XG4gICAgXG4gICAgY29uc3QgZHVyYXRpb25JbnB1dCA9IHBhcnNlZC5kYXRhLmR1cmF0aW9uO1xuICAgIGNvbnN0IGJhbkR1cmF0aW9uU3RyID0gZHVyYXRpb25JbnB1dCA9PT0gJ3Blcm1hbmVudCcgPyAnODc2MDAwaCcgOiBkdXJhdGlvbklucHV0ID09PSAnMzBkJyA/ICc3MjBoJyA6ICcyNGgnO1xuXG4gICAgLy8gMS4gVXBkYXRlIEF1dGggVXNlciAoQmFuKVxuICAgIGNvbnN0IHsgZXJyb3I6IGJhbkVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmFkbWluLnVwZGF0ZVVzZXJCeUlkKHBhcnNlZC5kYXRhLmlkLCB7XG4gICAgICBiYW5fZHVyYXRpb246IGJhbkR1cmF0aW9uU3RyXG4gICAgfSk7XG4gICAgIFxuICAgIGlmIChiYW5FcnJvcikgcmV0dXJuIGZhaWwoYEJhbiBmYWlsZWQ6ICR7YmFuRXJyb3IubWVzc2FnZX1gKTtcblxuICAgIC8vIDIuIFVwZGF0ZSBQdWJsaWMgUHJvZmlsZSBTdGF0dXNcbiAgICBhd2FpdCBzdXBhYmFzZS5mcm9tKCdwcm9maWxlcycpLnVwZGF0ZSh7IHN0YXR1czogJ3N1c3BlbmRlZCcgfSkuZXEoJ2lkJywgcGFyc2VkLmRhdGEuaWQpO1xuXG4gICAgLy8gMy4gTG9nIEFjdGlvbiBzZWN1cmVseSB0byBhdWRpdF9sb2dzXG4gICAgYXdhaXQgbG9nQXVkaXRFdmVudCh7XG4gICAgICAgIGFjdGlvbjogJ2FkbWluLnVzZXJzLnN1c3BlbmQnLFxuICAgICAgICBhY3Rvcl91c2VyX2lkOiB1c2VySWQsXG4gICAgICAgIHJlbGF0ZWRfZW50aXR5X3R5cGU6ICdwcm9maWxlJyxcbiAgICAgICAgcmVsYXRlZF9lbnRpdHlfaWQ6IHBhcnNlZC5kYXRhLmlkLFxuICAgICAgICBtZXRhOiB7IHJlYXNvbjogcGFyc2VkLmRhdGEucmVhc29uLCBkdXJhdGlvbjogZHVyYXRpb25JbnB1dCB9XG4gICAgfSk7XG5cbiAgICByZXZhbGlkYXRlUGF0aCgnL2Rhc2hib2FyZC91c2VycycpO1xuICAgIHJldmFsaWRhdGVQYXRoKGAvZGFzaGJvYXJkL3VzZXJzLyR7cGFyc2VkLmRhdGEuaWR9YCk7XG4gICAgXG4gICAgcmV0dXJuIG9rKHsgaWQ6IHBhcnNlZC5kYXRhLmlkIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3N1c3BlbmRVc2VyIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gZmFpbCh0b0Vycm9yTWVzc2FnZShlcnJvcikpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBiYW5Vc2VyKHVzZXJJZDogc3RyaW5nLCByZWFzb246IHN0cmluZyk6IFByb21pc2U8U2VydmljZVJlc3VsdDx7IHVzZXJJZDogc3RyaW5nIH0+PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkID0gQmFuVXNlclNjaGVtYS5zYWZlUGFyc2UoeyB1c2VySWQsIHJlYXNvbiB9KTtcbiAgICBpZiAoIXBhcnNlZC5zdWNjZXNzKSByZXR1cm4gZmFpbChwYXJzZWQuZXJyb3IuaXNzdWVzWzBdLm1lc3NhZ2UpO1xuXG4gICAgY29uc3QgeyB1c2VySWQ6IGFkbWluSWQgfSA9IGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoVVNFUlNfV1JJVEVfUk9MRVMpO1xuICAgIGF3YWl0IGVuZm9yY2VSYXRlTGltaXQoJ2Jhbl91c2VyJywgYWRtaW5JZCwgNSwgNjAwMDApO1xuICAgIGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVBZG1pbkNsaWVudCgpO1xuICAgIFxuICAgIC8vIEZldGNoIGV4aXN0aW5nIG1ldGFkYXRhIHRvIGF2b2lkIG92ZXJ3cml0aW5nXG4gICAgY29uc3QgeyBkYXRhOiBwcm9maWxlIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmZyb20oJ3Byb2ZpbGVzJykuc2VsZWN0KCdtZXRhZGF0YScpLmVxKCdpZCcsIHBhcnNlZC5kYXRhLnVzZXJJZCkuc2luZ2xlKCk7XG4gICAgY29uc3QgY3VycmVudE1ldGFkYXRhID0gcHJvZmlsZT8ubWV0YWRhdGEgfHwge307XG5cbiAgICBjb25zdCB7IGVycm9yOiBwcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCdwcm9maWxlcycpXG4gICAgICAudXBkYXRlKHsgXG4gICAgICAgIHN0YXR1czogJ2Jhbm5lZCcsXG4gICAgICAgIG1ldGFkYXRhOiB7IC4uLmN1cnJlbnRNZXRhZGF0YSwgYmFuX3JlYXNvbjogcGFyc2VkLmRhdGEucmVhc29uLCBiYW5uZWRfYnk6IGFkbWluSWQsIGJhbm5lZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0gXG4gICAgICB9IGFzIGFueSlcbiAgICAgIC5lcSgnaWQnLCBwYXJzZWQuZGF0YS51c2VySWQpO1xuXG4gICAgaWYgKHByb2ZpbGVFcnJvcikgcmV0dXJuIGZhaWwoYEZhaWxlZCB0byBiYW4gdXNlciBwcm9maWxlOiAke3Byb2ZpbGVFcnJvci5tZXNzYWdlfWApO1xuXG4gICAgY29uc3QgeyBlcnJvcjogYmFuRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW4uYXV0aC5hZG1pbi51cGRhdGVVc2VyQnlJZChwYXJzZWQuZGF0YS51c2VySWQsIHtcbiAgICAgIGJhbl9kdXJhdGlvbjogJzg3NjAwMGgnIC8vIH4xMDAgeWVhcnNcbiAgICB9KTtcbiAgICAgXG4gICAgaWYgKGJhbkVycm9yKSBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gYmFuIHVzZXIgaW4gQXV0aDonLCBiYW5FcnJvcik7XG5cbiAgICBhd2FpdCBsb2dBdWRpdEV2ZW50KHtcbiAgICAgICAgYWN0aW9uOiAnYWRtaW4udXNlcnMuYmFuJyxcbiAgICAgICAgYWN0b3JfdXNlcl9pZDogYWRtaW5JZCxcbiAgICAgICAgcmVsYXRlZF9lbnRpdHlfdHlwZTogJ3Byb2ZpbGUnLFxuICAgICAgICByZWxhdGVkX2VudGl0eV9pZDogcGFyc2VkLmRhdGEudXNlcklkLFxuICAgICAgICBtZXRhOiB7IHJlYXNvbjogcGFyc2VkLmRhdGEucmVhc29uIH1cbiAgICB9KTtcblxuICAgIHJldmFsaWRhdGVQYXRoKCcvZGFzaGJvYXJkL3VzZXJzJyk7XG4gICAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdXNlcnMvJHtwYXJzZWQuZGF0YS51c2VySWR9YCk7XG4gICAgXG4gICAgcmV0dXJuIG9rKHsgdXNlcklkOiBwYXJzZWQuZGF0YS51c2VySWQgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignYmFuVXNlciBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhaWwodG9FcnJvck1lc3NhZ2UoZXJyb3IpKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdW5iYW5Vc2VyKHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTxTZXJ2aWNlUmVzdWx0PHsgdXNlcklkOiBzdHJpbmcgfT4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJzZWQgPSBVbmJhblVzZXJTY2hlbWEuc2FmZVBhcnNlKHsgdXNlcklkIH0pO1xuICAgIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHJldHVybiBmYWlsKHBhcnNlZC5lcnJvci5pc3N1ZXNbMF0ubWVzc2FnZSk7XG5cbiAgICBjb25zdCB7IHVzZXJJZDogYWRtaW5JZCB9ID0gYXdhaXQgcmVxdWlyZUFkbWluUm9sZShVU0VSU19XUklURV9ST0xFUyk7XG4gICAgYXdhaXQgZW5mb3JjZVJhdGVMaW1pdCgndW5iYW5fdXNlcicsIGFkbWluSWQsIDUsIDYwMDAwKTtcbiAgICBjb25zdCBzdXBhYmFzZUFkbWluID0gY3JlYXRlQWRtaW5DbGllbnQoKTtcblxuICAgIC8vIEZldGNoIGV4aXN0aW5nIG1ldGFkYXRhIHRvIGF2b2lkIG92ZXJ3cml0aW5nXG4gICAgY29uc3QgeyBkYXRhOiBwcm9maWxlIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmZyb20oJ3Byb2ZpbGVzJykuc2VsZWN0KCdtZXRhZGF0YScpLmVxKCdpZCcsIHBhcnNlZC5kYXRhLnVzZXJJZCkuc2luZ2xlKCk7XG4gICAgY29uc3QgY3VycmVudE1ldGFkYXRhID0gcHJvZmlsZT8ubWV0YWRhdGEgfHwge307XG5cbiAgICBjb25zdCB7IGVycm9yOiBwcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCdwcm9maWxlcycpXG4gICAgICAudXBkYXRlKHsgXG4gICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgICAgIG1ldGFkYXRhOiB7IC4uLmN1cnJlbnRNZXRhZGF0YSwgdW5iYW5uZWRfYnk6IGFkbWluSWQsIHVuYmFubmVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSBcbiAgICAgIH0gYXMgYW55KVxuICAgICAgLmVxKCdpZCcsIHBhcnNlZC5kYXRhLnVzZXJJZCk7XG5cbiAgICBpZiAocHJvZmlsZUVycm9yKSByZXR1cm4gZmFpbChgRmFpbGVkIHRvIHVuYmFuIHVzZXIgcHJvZmlsZTogJHtwcm9maWxlRXJyb3IubWVzc2FnZX1gKTtcblxuICAgIGNvbnN0IHsgZXJyb3I6IGJhbkVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmF1dGguYWRtaW4udXBkYXRlVXNlckJ5SWQocGFyc2VkLmRhdGEudXNlcklkLCB7XG4gICAgICBiYW5fZHVyYXRpb246ICdub25lJ1xuICAgIH0pO1xuICAgICBcbiAgICBpZiAoYmFuRXJyb3IpIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byB1bmJhbiB1c2VyIGluIEF1dGg6JywgYmFuRXJyb3IpO1xuXG4gICAgYXdhaXQgbG9nQXVkaXRFdmVudCh7XG4gICAgICAgIGFjdGlvbjogJ2FkbWluLnVzZXJzLnVuYmFuJyxcbiAgICAgICAgYWN0b3JfdXNlcl9pZDogYWRtaW5JZCxcbiAgICAgICAgcmVsYXRlZF9lbnRpdHlfdHlwZTogJ3Byb2ZpbGUnLFxuICAgICAgICByZWxhdGVkX2VudGl0eV9pZDogcGFyc2VkLmRhdGEudXNlcklkLFxuICAgICAgICBtZXRhOiB7fVxuICAgIH0pO1xuXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy9kYXNoYm9hcmQvdXNlcnMnKTtcbiAgICByZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC91c2Vycy8ke3BhcnNlZC5kYXRhLnVzZXJJZH1gKTtcbiAgICBcbiAgICByZXR1cm4gb2soeyB1c2VySWQ6IHBhcnNlZC5kYXRhLnVzZXJJZCB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCd1bmJhblVzZXIgZXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWlsKHRvRXJyb3JNZXNzYWdlKGVycm9yKSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeVVzZXIodXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPFNlcnZpY2VSZXN1bHQ8eyB1c2VySWQ6IHN0cmluZyB9Pj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHBhcnNlZCA9IFZlcmlmeVVzZXJTY2hlbWEuc2FmZVBhcnNlKHsgdXNlcklkIH0pO1xuICAgIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHJldHVybiBmYWlsKHBhcnNlZC5lcnJvci5pc3N1ZXNbMF0ubWVzc2FnZSk7XG5cbiAgICBjb25zdCB7IHVzZXJJZDogYWRtaW5JZCB9ID0gYXdhaXQgcmVxdWlyZUFkbWluUm9sZShVU0VSU19XUklURV9ST0xFUyk7XG4gICAgYXdhaXQgZW5mb3JjZVJhdGVMaW1pdCgndmVyaWZ5X3VzZXInLCBhZG1pbklkLCAxMCwgNjAwMDApO1xuICAgIGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVBZG1pbkNsaWVudCgpO1xuXG4gICAgLy8gRmV0Y2ggZXhpc3RpbmcgbWV0YWRhdGEgdG8gYXZvaWQgb3ZlcndyaXRpbmdcbiAgICBjb25zdCB7IGRhdGE6IHByb2ZpbGUgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW4uZnJvbSgncHJvZmlsZXMnKS5zZWxlY3QoJ21ldGFkYXRhJykuZXEoJ2lkJywgcGFyc2VkLmRhdGEudXNlcklkKS5zaW5nbGUoKTtcbiAgICBjb25zdCBjdXJyZW50TWV0YWRhdGEgPSBwcm9maWxlPy5tZXRhZGF0YSB8fCB7fTtcblxuICAgIGNvbnN0IHsgZXJyb3I6IHByb2ZpbGVFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ3Byb2ZpbGVzJylcbiAgICAgIC51cGRhdGUoeyBcbiAgICAgICAgbWV0YWRhdGE6IHsgLi4uY3VycmVudE1ldGFkYXRhLCBpc192ZXJpZmllZDogdHJ1ZSwgdmVyaWZpZWRfYnk6IGFkbWluSWQsIHZlcmlmaWVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSBcbiAgICAgIH0gYXMgYW55KVxuICAgICAgLmVxKCdpZCcsIHBhcnNlZC5kYXRhLnVzZXJJZCk7XG5cbiAgICBpZiAocHJvZmlsZUVycm9yKSByZXR1cm4gZmFpbChgRmFpbGVkIHRvIHZlcmlmeSB1c2VyIHByb2ZpbGU6ICR7cHJvZmlsZUVycm9yLm1lc3NhZ2V9YCk7XG5cbiAgICBhd2FpdCBsb2dBdWRpdEV2ZW50KHtcbiAgICAgICAgYWN0aW9uOiAnYWRtaW4udXNlcnMudmVyaWZ5JyxcbiAgICAgICAgYWN0b3JfdXNlcl9pZDogYWRtaW5JZCxcbiAgICAgICAgcmVsYXRlZF9lbnRpdHlfdHlwZTogJ3Byb2ZpbGUnLFxuICAgICAgICByZWxhdGVkX2VudGl0eV9pZDogcGFyc2VkLmRhdGEudXNlcklkLFxuICAgICAgICBtZXRhOiB7fVxuICAgIH0pO1xuXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy9kYXNoYm9hcmQvdXNlcnMnKTtcbiAgICByZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC91c2Vycy8ke3BhcnNlZC5kYXRhLnVzZXJJZH1gKTtcbiAgICBcbiAgICByZXR1cm4gb2soeyB1c2VySWQ6IHBhcnNlZC5kYXRhLnVzZXJJZCB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCd2ZXJpZnlVc2VyIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gZmFpbCh0b0Vycm9yTWVzc2FnZShlcnJvcikpO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjJTQW9Kc0Isd0xBQUEifQ==
}),
"[project]/src/features/users/viewmodels/use_user_actions.vm.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUserActionsViewModel",
    ()=>useUserActionsViewModel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$services$2f$data$3a$99f3bd__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/features/users/services/data:99f3bd [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function useUserActionsViewModel(userId) {
    _s();
    const [showBanDialog, setShowBanDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [banReason, setBanReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [confirmText, setConfirmText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isBanning, setIsBanning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleBan = async ()=>{
        if (!banReason.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please provide a reason for the ban.");
            return;
        }
        setIsBanning(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$services$2f$data$3a$99f3bd__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["suspendUser"])(userId, banReason, 'permanent');
            if (res.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("User has been banned.");
                setShowBanDialog(false);
                setBanReason("");
                setConfirmText("");
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(res.error || "Failed to ban user.");
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message || "Failed to ban user.");
        } finally{
            setIsBanning(false);
        }
    };
    return {
        showBanDialog,
        setShowBanDialog,
        banReason,
        setBanReason,
        confirmText,
        setConfirmText,
        isBanning,
        handleBan
    };
}
_s(useUserActionsViewModel, "WjWFwCC+8n9YZSh+dO/lVFnl1b8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Label$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript) <export * as Label>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Label$3e$__["Label"].Root, {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Label;
;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/users/UserActionsMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserActionsMenu",
    ()=>UserActionsMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$viewmodels$2f$use_user_actions$2e$vm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/users/viewmodels/use_user_actions.vm.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/label.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function UserActionsMenu({ userId }) {
    _s();
    const vm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$viewmodels$2f$use_user_actions$2e$vm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserActionsViewModel"])(userId);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "icon",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "sr-only",
                                    children: "Open menu"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                        align: "end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                children: "Actions"
                            }, void 0, false, {
                                fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/dashboard/users/${userId}`,
                                    children: "View Details"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                    lineNumber: 46,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                children: "Edit User"
                            }, void 0, false, {
                                fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                className: "text-destructive focus:text-destructive",
                                onSelect: ()=>vm.setShowBanDialog(true),
                                children: "Ban User"
                            }, void 0, false, {
                                fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: vm.showBanDialog,
                onOpenChange: vm.setShowBanDialog,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Are you absolutely sure?"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "This user will be logged out immediately and prevented from logging in again."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-2 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "reason",
                                            children: "Ban Reason"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                            lineNumber: 69,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "reason",
                                            placeholder: "Violation of terms...",
                                            value: vm.banReason,
                                            onChange: (e)=>vm.setBanReason(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1 mt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "confirm",
                                            className: "text-destructive font-semibold",
                                            children: 'Type "CONFIRM" to proceed with banning'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "confirm",
                                            placeholder: "CONFIRM",
                                            value: vm.confirmText,
                                            onChange: (e)=>vm.setConfirmText(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                            lineNumber: 79,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    disabled: vm.isBanning,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: (e)=>{
                                        e.preventDefault(); // Prevent auto-close
                                        vm.handleBan();
                                    },
                                    disabled: vm.isBanning || vm.confirmText !== "CONFIRM",
                                    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                                    children: vm.isBanning ? "Banning..." : "Ban User"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/users/UserActionsMenu.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(UserActionsMenu, "18yhPxf3hEnlhe/9W6I343m+T9w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$viewmodels$2f$use_user_actions$2e$vm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserActionsViewModel"]
    ];
});
_c = UserActionsMenu;
var _c;
__turbopack_context__.k.register(_c, "UserActionsMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/users/services/data:c6e476 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUsers",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"704823146b11fe2e607674c0df61e6171879aef5ef":"getUsers"},"src/features/users/services/user_actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("704823146b11fe2e607674c0df61e6171879aef5ef", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getUsers");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdXNlcl9hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgY3JlYXRlQWRtaW5DbGllbnQgfSBmcm9tICdAL2xpYi9zdXBhYmFzZS9hZG1pbic7XG5pbXBvcnQgeyByZXZhbGlkYXRlUGF0aCB9IGZyb20gJ25leHQvY2FjaGUnO1xuaW1wb3J0IHsgcmVxdWlyZUFkbWluUm9sZSwgbG9nQXVkaXRFdmVudCwgZW5mb3JjZVJhdGVMaW1pdCB9IGZyb20gJ0AvZmVhdHVyZXMvY29yZS9zZWN1cml0eS9zZWN1cml0eV9ndWFyZHMnO1xuaW1wb3J0IHsgb2ssIGZhaWwsIFNlcnZpY2VSZXN1bHQsIHRvRXJyb3JNZXNzYWdlIH0gZnJvbSAnQC9mZWF0dXJlcy9jb3JlL21vZGVscy9yZXN1bHQnO1xuaW1wb3J0IHsgR2V0VXNlcnNTY2hlbWEsIEdldFVzZXJEZXRhaWxzU2NoZW1hLCBTdXNwZW5kVXNlclNjaGVtYSwgQmFuVXNlclNjaGVtYSwgVW5iYW5Vc2VyU2NoZW1hLCBWZXJpZnlVc2VyU2NoZW1hLCBVU0VSU19SRUFEX1JPTEVTLCBVU0VSU19XUklURV9ST0xFUyB9IGZyb20gJy4uL21vZGVscy91c2VyLnNjaGVtYSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlckRUTyB7XG4gIGlkOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIGZ1bGxfbmFtZTogc3RyaW5nO1xuICBhdmF0YXJfdXJsOiBzdHJpbmc7XG4gIHJvbGU6IHN0cmluZztcbiAgcm9sZXM6IHN0cmluZ1tdO1xuICBhY3RpdmVfcm9sZTogc3RyaW5nO1xuICBzdGF0dXM6ICdhY3RpdmUnIHwgJ3N1c3BlbmRlZCcgfCAnYmFubmVkJztcbiAgY3JlYXRlZF9hdDogc3RyaW5nO1xuICBsYXN0X3NpZ25faW5fYXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVc2VyRGV0YWlsc0RUTyBleHRlbmRzIFVzZXJEVE8ge1xuICBwaG9uZTogc3RyaW5nO1xuICBiaW86IHN0cmluZztcbiAgcmF0aW5nOiBudW1iZXI7XG4gIHNwZW50OiBudW1iZXI7XG4gIGVhcm5lZDogbnVtYmVyO1xuICBqb2JfY291bnQ6IG51bWJlcjtcbiAgd2FsbGV0X2JhbGFuY2U6IG51bWJlcjtcbiAgcmVjZW50X2FjdGl2aXR5OiBhbnlbXTtcbiAgbWV0YWRhdGE6IGFueTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFVzZXJzKFxuICBwYWdlID0gMSwgXG4gIHF1ZXJ5ID0gJycsIFxuICByb2xlU3RyID0gJ2FsbCdcbik6IFByb21pc2U8U2VydmljZVJlc3VsdDx7IHVzZXJzOiBVc2VyRFRPW107IHRvdGFsUGFnZXM6IG51bWJlcjsgdG90YWxVc2VyczogbnVtYmVyIH0+PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkID0gR2V0VXNlcnNTY2hlbWEuc2FmZVBhcnNlKHsgcGFnZSwgcXVlcnksIHJvbGU6IHJvbGVTdHIgfSk7XG4gICAgaWYgKCFwYXJzZWQuc3VjY2VzcykgcmV0dXJuIGZhaWwocGFyc2VkLmVycm9yLmlzc3Vlc1swXS5tZXNzYWdlKTtcblxuICAgIGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoVVNFUlNfUkVBRF9ST0xFUyk7XG5cbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUFkbWluQ2xpZW50KCk7XG4gICAgY29uc3QgUEFHRV9TSVpFID0gMTA7XG4gICAgY29uc3QgZnJvbSA9IChwYXJzZWQuZGF0YS5wYWdlIC0gMSkgKiBQQUdFX1NJWkU7XG4gICAgY29uc3QgdG8gPSBmcm9tICsgUEFHRV9TSVpFIC0gMTtcblxuICAgIGxldCBxdWVyeUJ1aWxkZXIgPSBzdXBhYmFzZVxuICAgICAgLmZyb20oJ3Byb2ZpbGVzJylcbiAgICAgIC5zZWxlY3QoJyonLCB7IGNvdW50OiAnZXhhY3QnIH0pO1xuXG4gICAgaWYgKHBhcnNlZC5kYXRhLnF1ZXJ5KSB7XG4gICAgICBxdWVyeUJ1aWxkZXIgPSBxdWVyeUJ1aWxkZXIub3IoYGZ1bGxfbmFtZS5pbGlrZS4lJHtwYXJzZWQuZGF0YS5xdWVyeX0lLGVtYWlsLmlsaWtlLiUke3BhcnNlZC5kYXRhLnF1ZXJ5fSVgKTtcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkLmRhdGEucm9sZSAmJiBwYXJzZWQuZGF0YS5yb2xlICE9PSAnYWxsJykge1xuICAgICAgIHF1ZXJ5QnVpbGRlciA9IHF1ZXJ5QnVpbGRlci5lcSgncm9sZScsIHBhcnNlZC5kYXRhLnJvbGUpO1xuICAgIH1cblxuICAgIHF1ZXJ5QnVpbGRlciA9IHF1ZXJ5QnVpbGRlci5yYW5nZShmcm9tLCB0bykub3JkZXIoJ2NyZWF0ZWRfYXQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XG5cbiAgICBjb25zdCB7IGRhdGE6IHByb2ZpbGVzLCBlcnJvciwgY291bnQgfSA9IGF3YWl0IHF1ZXJ5QnVpbGRlcjtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgcHJvZmlsZXM6JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIGZhaWwoJ0ZhaWxlZCB0byBmZXRjaCB1c2VycycpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCB1c2VyczogVXNlckRUT1tdID0gcHJvZmlsZXMubWFwKChwOiBhbnkpID0+ICh7XG4gICAgICBpZDogcC5pZCxcbiAgICAgIGVtYWlsOiBwLmVtYWlsIHx8ICcnLFxuICAgICAgZnVsbF9uYW1lOiBwLmZ1bGxfbmFtZSB8fCAnVW5rbm93bicsXG4gICAgICBhdmF0YXJfdXJsOiBwLmF2YXRhcl91cmwgfHwgJycsXG4gICAgICByb2xlOiBwLmFjdGl2ZV9yb2xlIHx8IChwLnJvbGVzICYmIHAucm9sZXNbMF0pIHx8ICd1c2VyJyxcbiAgICAgIHJvbGVzOiBwLnJvbGVzIHx8IFsndXNlciddLFxuICAgICAgYWN0aXZlX3JvbGU6IHAuYWN0aXZlX3JvbGUgfHwgJ3VzZXInLFxuICAgICAgc3RhdHVzOiBwLnN0YXR1cyB8fCAnYWN0aXZlJyxcbiAgICAgIGNyZWF0ZWRfYXQ6IHAuY3JlYXRlZF9hdCxcbiAgICAgIGxhc3Rfc2lnbl9pbl9hdDogcC51cGRhdGVkX2F0LFxuICAgIH0pKTtcblxuICAgIHJldHVybiBvayh7XG4gICAgICB1c2VycyxcbiAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCgoY291bnQgfHwgMCkgLyBQQUdFX1NJWkUpLFxuICAgICAgdG90YWxVc2VyczogY291bnQgfHwgMFxuICAgIH0pO1xuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0VXNlcnMgZXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWlsKHRvRXJyb3JNZXNzYWdlKGVycm9yKSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFVzZXJEZXRhaWxzKGlkOiBzdHJpbmcpOiBQcm9taXNlPFNlcnZpY2VSZXN1bHQ8VXNlckRldGFpbHNEVE8+PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkID0gR2V0VXNlckRldGFpbHNTY2hlbWEuc2FmZVBhcnNlKHsgaWQgfSk7XG4gICAgaWYgKCFwYXJzZWQuc3VjY2VzcykgcmV0dXJuIGZhaWwocGFyc2VkLmVycm9yLmlzc3Vlc1swXS5tZXNzYWdlKTtcblxuICAgIGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoVVNFUlNfUkVBRF9ST0xFUyk7XG5cbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUFkbWluQ2xpZW50KCk7XG5cbiAgICBjb25zdCBbYXV0aFJlcywgcHJvZmlsZVJlcywgdGFza3NSZXMsIHdhbGxldFJlc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBzdXBhYmFzZS5hdXRoLmFkbWluLmdldFVzZXJCeUlkKHBhcnNlZC5kYXRhLmlkKSxcbiAgICAgIHN1cGFiYXNlLmZyb20oJ3Byb2ZpbGVzJykuc2VsZWN0KCcqJykuZXEoJ2lkJywgcGFyc2VkLmRhdGEuaWQpLnNpbmdsZSgpLFxuICAgICAgc3VwYWJhc2UuZnJvbSgndGFza3MnKS5zZWxlY3QoJyonKS5vcihgY2xpZW50X2lkLmVxLiR7cGFyc2VkLmRhdGEuaWR9LGZyZWVsYW5jZXJfaWQuZXEuJHtwYXJzZWQuZGF0YS5pZH1gKS5vcmRlcignY3JlYXRlZF9hdCcsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KS5saW1pdCgxMCksXG4gICAgICBzdXBhYmFzZS5mcm9tKCd2d193YWxsZXRfYmFsYW5jZXNfdXNlcicpLnNlbGVjdCgnYXZhaWxhYmxlX2JhbGFuY2UnKS5lcSgndXNlcl9pZCcsIHBhcnNlZC5kYXRhLmlkKS5tYXliZVNpbmdsZSgpXG4gICAgXSk7XG5cbiAgICBpZiAoYXV0aFJlcy5lcnJvciB8fCAhYXV0aFJlcy5kYXRhLnVzZXIpIHJldHVybiBmYWlsKCdVc2VyIG5vdCBmb3VuZCBpbiBBdXRoIHN5c3RlbScpO1xuICAgIGNvbnN0IGF1dGhVc2VyID0gYXV0aFJlcy5kYXRhLnVzZXI7XG4gICAgY29uc3QgcHJvZmlsZSA9IHByb2ZpbGVSZXMuZGF0YSB8fCB7fTtcbiAgICBjb25zdCByZWNlbnRfYWN0aXZpdHkgPSB0YXNrc1Jlcy5kYXRhIHx8IFtdO1xuICAgIGNvbnN0IHdhbGxldF9iYWxhbmNlID0gd2FsbGV0UmVzLmRhdGE/LmF2YWlsYWJsZV9iYWxhbmNlIHx8IDA7XG4gICAgY29uc3Qgam9iX2NvdW50ID0gcmVjZW50X2FjdGl2aXR5Lmxlbmd0aDsgLy8gQXBwcm94aW1hdGUgZm9yIG5vd1xuXG4gICAgY29uc3QgdXNlcjogVXNlckRldGFpbHNEVE8gPSB7XG4gICAgICBpZDogYXV0aFVzZXIuaWQsXG4gICAgICBlbWFpbDogYXV0aFVzZXIuZW1haWwgfHwgJycsXG4gICAgICBmdWxsX25hbWU6IHByb2ZpbGUuZnVsbF9uYW1lIHx8IGF1dGhVc2VyLnVzZXJfbWV0YWRhdGE/LmZ1bGxfbmFtZSB8fCAnVW5rbm93bicsXG4gICAgICBhdmF0YXJfdXJsOiBwcm9maWxlLmF2YXRhcl91cmwgfHwgYXV0aFVzZXIudXNlcl9tZXRhZGF0YT8uYXZhdGFyX3VybCB8fCAnJyxcbiAgICAgIHJvbGU6IHByb2ZpbGUuYWN0aXZlX3JvbGUgfHwgKHByb2ZpbGUucm9sZXMgJiYgcHJvZmlsZS5yb2xlc1swXSkgfHwgYXV0aFVzZXIuYXBwX21ldGFkYXRhPy5yb2xlIHx8ICd1c2VyJyxcbiAgICAgIHJvbGVzOiBwcm9maWxlLnJvbGVzIHx8IFsndXNlciddLFxuICAgICAgYWN0aXZlX3JvbGU6IHByb2ZpbGUuYWN0aXZlX3JvbGUgfHwgJ3VzZXInLFxuICAgICAgc3RhdHVzOiBhdXRoVXNlci5iYW5uZWRfdW50aWwgPyAnYmFubmVkJyA6IChwcm9maWxlLnN0YXR1cyB8fCAnYWN0aXZlJyksXG4gICAgICBjcmVhdGVkX2F0OiBhdXRoVXNlci5jcmVhdGVkX2F0LFxuICAgICAgbGFzdF9zaWduX2luX2F0OiBhdXRoVXNlci5sYXN0X3NpZ25faW5fYXQgfHwgJycsXG4gICAgICBwaG9uZTogYXV0aFVzZXIucGhvbmUgfHwgJycsXG4gICAgICBiaW86IHByb2ZpbGUuYmlvIHx8ICcnLFxuICAgICAgcmF0aW5nOiBwcm9maWxlLnJhdGluZyB8fCAwLFxuICAgICAgc3BlbnQ6IDAsIFxuICAgICAgZWFybmVkOiAwLFxuICAgICAgam9iX2NvdW50LFxuICAgICAgd2FsbGV0X2JhbGFuY2UsXG4gICAgICByZWNlbnRfYWN0aXZpdHksXG4gICAgICBtZXRhZGF0YTogYXV0aFVzZXIudXNlcl9tZXRhZGF0YVxuICAgIH07XG5cbiAgICByZXR1cm4gb2sodXNlcik7XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRVc2VyRGV0YWlscyBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhaWwodG9FcnJvck1lc3NhZ2UoZXJyb3IpKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3VzcGVuZFVzZXIoaWQ6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIGR1cmF0aW9uPzogc3RyaW5nKTogUHJvbWlzZTxTZXJ2aWNlUmVzdWx0PHsgaWQ6IHN0cmluZyB9Pj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHBhcnNlZCA9IFN1c3BlbmRVc2VyU2NoZW1hLnNhZmVQYXJzZSh7IGlkLCByZWFzb24sIGR1cmF0aW9uIH0pO1xuICAgIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHJldHVybiBmYWlsKHBhcnNlZC5lcnJvci5pc3N1ZXNbMF0ubWVzc2FnZSk7XG5cbiAgICBjb25zdCB7IHVzZXJJZCB9ID0gYXdhaXQgcmVxdWlyZUFkbWluUm9sZShVU0VSU19XUklURV9ST0xFUyk7XG4gICAgYXdhaXQgZW5mb3JjZVJhdGVMaW1pdCgnc3VzcGVuZF91c2VyJywgdXNlcklkLCA1LCA2MDAwMCk7XG5cbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUFkbWluQ2xpZW50KCk7XG4gICAgXG4gICAgY29uc3QgZHVyYXRpb25JbnB1dCA9IHBhcnNlZC5kYXRhLmR1cmF0aW9uO1xuICAgIGNvbnN0IGJhbkR1cmF0aW9uU3RyID0gZHVyYXRpb25JbnB1dCA9PT0gJ3Blcm1hbmVudCcgPyAnODc2MDAwaCcgOiBkdXJhdGlvbklucHV0ID09PSAnMzBkJyA/ICc3MjBoJyA6ICcyNGgnO1xuXG4gICAgLy8gMS4gVXBkYXRlIEF1dGggVXNlciAoQmFuKVxuICAgIGNvbnN0IHsgZXJyb3I6IGJhbkVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmFkbWluLnVwZGF0ZVVzZXJCeUlkKHBhcnNlZC5kYXRhLmlkLCB7XG4gICAgICBiYW5fZHVyYXRpb246IGJhbkR1cmF0aW9uU3RyXG4gICAgfSk7XG4gICAgIFxuICAgIGlmIChiYW5FcnJvcikgcmV0dXJuIGZhaWwoYEJhbiBmYWlsZWQ6ICR7YmFuRXJyb3IubWVzc2FnZX1gKTtcblxuICAgIC8vIDIuIFVwZGF0ZSBQdWJsaWMgUHJvZmlsZSBTdGF0dXNcbiAgICBhd2FpdCBzdXBhYmFzZS5mcm9tKCdwcm9maWxlcycpLnVwZGF0ZSh7IHN0YXR1czogJ3N1c3BlbmRlZCcgfSkuZXEoJ2lkJywgcGFyc2VkLmRhdGEuaWQpO1xuXG4gICAgLy8gMy4gTG9nIEFjdGlvbiBzZWN1cmVseSB0byBhdWRpdF9sb2dzXG4gICAgYXdhaXQgbG9nQXVkaXRFdmVudCh7XG4gICAgICAgIGFjdGlvbjogJ2FkbWluLnVzZXJzLnN1c3BlbmQnLFxuICAgICAgICBhY3Rvcl91c2VyX2lkOiB1c2VySWQsXG4gICAgICAgIHJlbGF0ZWRfZW50aXR5X3R5cGU6ICdwcm9maWxlJyxcbiAgICAgICAgcmVsYXRlZF9lbnRpdHlfaWQ6IHBhcnNlZC5kYXRhLmlkLFxuICAgICAgICBtZXRhOiB7IHJlYXNvbjogcGFyc2VkLmRhdGEucmVhc29uLCBkdXJhdGlvbjogZHVyYXRpb25JbnB1dCB9XG4gICAgfSk7XG5cbiAgICByZXZhbGlkYXRlUGF0aCgnL2Rhc2hib2FyZC91c2VycycpO1xuICAgIHJldmFsaWRhdGVQYXRoKGAvZGFzaGJvYXJkL3VzZXJzLyR7cGFyc2VkLmRhdGEuaWR9YCk7XG4gICAgXG4gICAgcmV0dXJuIG9rKHsgaWQ6IHBhcnNlZC5kYXRhLmlkIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3N1c3BlbmRVc2VyIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gZmFpbCh0b0Vycm9yTWVzc2FnZShlcnJvcikpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBiYW5Vc2VyKHVzZXJJZDogc3RyaW5nLCByZWFzb246IHN0cmluZyk6IFByb21pc2U8U2VydmljZVJlc3VsdDx7IHVzZXJJZDogc3RyaW5nIH0+PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkID0gQmFuVXNlclNjaGVtYS5zYWZlUGFyc2UoeyB1c2VySWQsIHJlYXNvbiB9KTtcbiAgICBpZiAoIXBhcnNlZC5zdWNjZXNzKSByZXR1cm4gZmFpbChwYXJzZWQuZXJyb3IuaXNzdWVzWzBdLm1lc3NhZ2UpO1xuXG4gICAgY29uc3QgeyB1c2VySWQ6IGFkbWluSWQgfSA9IGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoVVNFUlNfV1JJVEVfUk9MRVMpO1xuICAgIGF3YWl0IGVuZm9yY2VSYXRlTGltaXQoJ2Jhbl91c2VyJywgYWRtaW5JZCwgNSwgNjAwMDApO1xuICAgIGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVBZG1pbkNsaWVudCgpO1xuICAgIFxuICAgIC8vIEZldGNoIGV4aXN0aW5nIG1ldGFkYXRhIHRvIGF2b2lkIG92ZXJ3cml0aW5nXG4gICAgY29uc3QgeyBkYXRhOiBwcm9maWxlIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmZyb20oJ3Byb2ZpbGVzJykuc2VsZWN0KCdtZXRhZGF0YScpLmVxKCdpZCcsIHBhcnNlZC5kYXRhLnVzZXJJZCkuc2luZ2xlKCk7XG4gICAgY29uc3QgY3VycmVudE1ldGFkYXRhID0gcHJvZmlsZT8ubWV0YWRhdGEgfHwge307XG5cbiAgICBjb25zdCB7IGVycm9yOiBwcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCdwcm9maWxlcycpXG4gICAgICAudXBkYXRlKHsgXG4gICAgICAgIHN0YXR1czogJ2Jhbm5lZCcsXG4gICAgICAgIG1ldGFkYXRhOiB7IC4uLmN1cnJlbnRNZXRhZGF0YSwgYmFuX3JlYXNvbjogcGFyc2VkLmRhdGEucmVhc29uLCBiYW5uZWRfYnk6IGFkbWluSWQsIGJhbm5lZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0gXG4gICAgICB9IGFzIGFueSlcbiAgICAgIC5lcSgnaWQnLCBwYXJzZWQuZGF0YS51c2VySWQpO1xuXG4gICAgaWYgKHByb2ZpbGVFcnJvcikgcmV0dXJuIGZhaWwoYEZhaWxlZCB0byBiYW4gdXNlciBwcm9maWxlOiAke3Byb2ZpbGVFcnJvci5tZXNzYWdlfWApO1xuXG4gICAgY29uc3QgeyBlcnJvcjogYmFuRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW4uYXV0aC5hZG1pbi51cGRhdGVVc2VyQnlJZChwYXJzZWQuZGF0YS51c2VySWQsIHtcbiAgICAgIGJhbl9kdXJhdGlvbjogJzg3NjAwMGgnIC8vIH4xMDAgeWVhcnNcbiAgICB9KTtcbiAgICAgXG4gICAgaWYgKGJhbkVycm9yKSBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gYmFuIHVzZXIgaW4gQXV0aDonLCBiYW5FcnJvcik7XG5cbiAgICBhd2FpdCBsb2dBdWRpdEV2ZW50KHtcbiAgICAgICAgYWN0aW9uOiAnYWRtaW4udXNlcnMuYmFuJyxcbiAgICAgICAgYWN0b3JfdXNlcl9pZDogYWRtaW5JZCxcbiAgICAgICAgcmVsYXRlZF9lbnRpdHlfdHlwZTogJ3Byb2ZpbGUnLFxuICAgICAgICByZWxhdGVkX2VudGl0eV9pZDogcGFyc2VkLmRhdGEudXNlcklkLFxuICAgICAgICBtZXRhOiB7IHJlYXNvbjogcGFyc2VkLmRhdGEucmVhc29uIH1cbiAgICB9KTtcblxuICAgIHJldmFsaWRhdGVQYXRoKCcvZGFzaGJvYXJkL3VzZXJzJyk7XG4gICAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdXNlcnMvJHtwYXJzZWQuZGF0YS51c2VySWR9YCk7XG4gICAgXG4gICAgcmV0dXJuIG9rKHsgdXNlcklkOiBwYXJzZWQuZGF0YS51c2VySWQgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignYmFuVXNlciBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhaWwodG9FcnJvck1lc3NhZ2UoZXJyb3IpKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdW5iYW5Vc2VyKHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTxTZXJ2aWNlUmVzdWx0PHsgdXNlcklkOiBzdHJpbmcgfT4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJzZWQgPSBVbmJhblVzZXJTY2hlbWEuc2FmZVBhcnNlKHsgdXNlcklkIH0pO1xuICAgIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHJldHVybiBmYWlsKHBhcnNlZC5lcnJvci5pc3N1ZXNbMF0ubWVzc2FnZSk7XG5cbiAgICBjb25zdCB7IHVzZXJJZDogYWRtaW5JZCB9ID0gYXdhaXQgcmVxdWlyZUFkbWluUm9sZShVU0VSU19XUklURV9ST0xFUyk7XG4gICAgYXdhaXQgZW5mb3JjZVJhdGVMaW1pdCgndW5iYW5fdXNlcicsIGFkbWluSWQsIDUsIDYwMDAwKTtcbiAgICBjb25zdCBzdXBhYmFzZUFkbWluID0gY3JlYXRlQWRtaW5DbGllbnQoKTtcblxuICAgIC8vIEZldGNoIGV4aXN0aW5nIG1ldGFkYXRhIHRvIGF2b2lkIG92ZXJ3cml0aW5nXG4gICAgY29uc3QgeyBkYXRhOiBwcm9maWxlIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmZyb20oJ3Byb2ZpbGVzJykuc2VsZWN0KCdtZXRhZGF0YScpLmVxKCdpZCcsIHBhcnNlZC5kYXRhLnVzZXJJZCkuc2luZ2xlKCk7XG4gICAgY29uc3QgY3VycmVudE1ldGFkYXRhID0gcHJvZmlsZT8ubWV0YWRhdGEgfHwge307XG5cbiAgICBjb25zdCB7IGVycm9yOiBwcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCdwcm9maWxlcycpXG4gICAgICAudXBkYXRlKHsgXG4gICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgICAgIG1ldGFkYXRhOiB7IC4uLmN1cnJlbnRNZXRhZGF0YSwgdW5iYW5uZWRfYnk6IGFkbWluSWQsIHVuYmFubmVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSBcbiAgICAgIH0gYXMgYW55KVxuICAgICAgLmVxKCdpZCcsIHBhcnNlZC5kYXRhLnVzZXJJZCk7XG5cbiAgICBpZiAocHJvZmlsZUVycm9yKSByZXR1cm4gZmFpbChgRmFpbGVkIHRvIHVuYmFuIHVzZXIgcHJvZmlsZTogJHtwcm9maWxlRXJyb3IubWVzc2FnZX1gKTtcblxuICAgIGNvbnN0IHsgZXJyb3I6IGJhbkVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmF1dGguYWRtaW4udXBkYXRlVXNlckJ5SWQocGFyc2VkLmRhdGEudXNlcklkLCB7XG4gICAgICBiYW5fZHVyYXRpb246ICdub25lJ1xuICAgIH0pO1xuICAgICBcbiAgICBpZiAoYmFuRXJyb3IpIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byB1bmJhbiB1c2VyIGluIEF1dGg6JywgYmFuRXJyb3IpO1xuXG4gICAgYXdhaXQgbG9nQXVkaXRFdmVudCh7XG4gICAgICAgIGFjdGlvbjogJ2FkbWluLnVzZXJzLnVuYmFuJyxcbiAgICAgICAgYWN0b3JfdXNlcl9pZDogYWRtaW5JZCxcbiAgICAgICAgcmVsYXRlZF9lbnRpdHlfdHlwZTogJ3Byb2ZpbGUnLFxuICAgICAgICByZWxhdGVkX2VudGl0eV9pZDogcGFyc2VkLmRhdGEudXNlcklkLFxuICAgICAgICBtZXRhOiB7fVxuICAgIH0pO1xuXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy9kYXNoYm9hcmQvdXNlcnMnKTtcbiAgICByZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC91c2Vycy8ke3BhcnNlZC5kYXRhLnVzZXJJZH1gKTtcbiAgICBcbiAgICByZXR1cm4gb2soeyB1c2VySWQ6IHBhcnNlZC5kYXRhLnVzZXJJZCB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCd1bmJhblVzZXIgZXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWlsKHRvRXJyb3JNZXNzYWdlKGVycm9yKSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeVVzZXIodXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPFNlcnZpY2VSZXN1bHQ8eyB1c2VySWQ6IHN0cmluZyB9Pj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHBhcnNlZCA9IFZlcmlmeVVzZXJTY2hlbWEuc2FmZVBhcnNlKHsgdXNlcklkIH0pO1xuICAgIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHJldHVybiBmYWlsKHBhcnNlZC5lcnJvci5pc3N1ZXNbMF0ubWVzc2FnZSk7XG5cbiAgICBjb25zdCB7IHVzZXJJZDogYWRtaW5JZCB9ID0gYXdhaXQgcmVxdWlyZUFkbWluUm9sZShVU0VSU19XUklURV9ST0xFUyk7XG4gICAgYXdhaXQgZW5mb3JjZVJhdGVMaW1pdCgndmVyaWZ5X3VzZXInLCBhZG1pbklkLCAxMCwgNjAwMDApO1xuICAgIGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVBZG1pbkNsaWVudCgpO1xuXG4gICAgLy8gRmV0Y2ggZXhpc3RpbmcgbWV0YWRhdGEgdG8gYXZvaWQgb3ZlcndyaXRpbmdcbiAgICBjb25zdCB7IGRhdGE6IHByb2ZpbGUgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW4uZnJvbSgncHJvZmlsZXMnKS5zZWxlY3QoJ21ldGFkYXRhJykuZXEoJ2lkJywgcGFyc2VkLmRhdGEudXNlcklkKS5zaW5nbGUoKTtcbiAgICBjb25zdCBjdXJyZW50TWV0YWRhdGEgPSBwcm9maWxlPy5tZXRhZGF0YSB8fCB7fTtcblxuICAgIGNvbnN0IHsgZXJyb3I6IHByb2ZpbGVFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ3Byb2ZpbGVzJylcbiAgICAgIC51cGRhdGUoeyBcbiAgICAgICAgbWV0YWRhdGE6IHsgLi4uY3VycmVudE1ldGFkYXRhLCBpc192ZXJpZmllZDogdHJ1ZSwgdmVyaWZpZWRfYnk6IGFkbWluSWQsIHZlcmlmaWVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSBcbiAgICAgIH0gYXMgYW55KVxuICAgICAgLmVxKCdpZCcsIHBhcnNlZC5kYXRhLnVzZXJJZCk7XG5cbiAgICBpZiAocHJvZmlsZUVycm9yKSByZXR1cm4gZmFpbChgRmFpbGVkIHRvIHZlcmlmeSB1c2VyIHByb2ZpbGU6ICR7cHJvZmlsZUVycm9yLm1lc3NhZ2V9YCk7XG5cbiAgICBhd2FpdCBsb2dBdWRpdEV2ZW50KHtcbiAgICAgICAgYWN0aW9uOiAnYWRtaW4udXNlcnMudmVyaWZ5JyxcbiAgICAgICAgYWN0b3JfdXNlcl9pZDogYWRtaW5JZCxcbiAgICAgICAgcmVsYXRlZF9lbnRpdHlfdHlwZTogJ3Byb2ZpbGUnLFxuICAgICAgICByZWxhdGVkX2VudGl0eV9pZDogcGFyc2VkLmRhdGEudXNlcklkLFxuICAgICAgICBtZXRhOiB7fVxuICAgIH0pO1xuXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy9kYXNoYm9hcmQvdXNlcnMnKTtcbiAgICByZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC91c2Vycy8ke3BhcnNlZC5kYXRhLnVzZXJJZH1gKTtcbiAgICBcbiAgICByZXR1cm4gb2soeyB1c2VySWQ6IHBhcnNlZC5kYXRhLnVzZXJJZCB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCd2ZXJpZnlVc2VyIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gZmFpbCh0b0Vycm9yTWVzc2FnZShlcnJvcikpO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IndTQWlDc0IscUxBQUEifQ==
}),
"[project]/src/features/users/viewmodels/useUsersViewModel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUsersViewModel",
    ()=>useUsersViewModel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$services$2f$data$3a$c6e476__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/features/users/services/data:c6e476 [app-client] (ecmascript) <text/javascript>");
var _s = __turbopack_context__.k.signature();
;
;
;
function useUsersViewModel() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get('query') || '';
    const role = searchParams.get('role') || 'all';
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [totalUsers, setTotalUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUsersViewModel.useEffect": ()=>{
            let active = true;
            setIsLoading(true);
            setError(null);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$services$2f$data$3a$c6e476__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getUsers"])(page, query, role).then({
                "useUsersViewModel.useEffect": (res)=>{
                    if (!active) return;
                    if (res.success) {
                        setUsers(res.data.users);
                        setTotalPages(res.data.totalPages);
                        setTotalUsers(res.data.totalUsers);
                    } else {
                        setError(res.error);
                        setUsers([]);
                    }
                    setIsLoading(false);
                }
            }["useUsersViewModel.useEffect"]);
            return ({
                "useUsersViewModel.useEffect": ()=>{
                    active = false;
                }
            })["useUsersViewModel.useEffect"];
        }
    }["useUsersViewModel.useEffect"], [
        page,
        query,
        role
    ]);
    return {
        users,
        totalPages,
        totalUsers,
        isLoading,
        error
    };
}
_s(useUsersViewModel, "H7hI7lzb7cyd+p3jFm0u20BWlgM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/users/views/UsersScreen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UsersScreen",
    ()=>UsersScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$users$2f$UserSearch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/users/UserSearch.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$users$2f$PaginationControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/users/PaginationControls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$users$2f$UserActionsMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/users/UserActionsMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$viewmodels$2f$useUsersViewModel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/users/viewmodels/useUsersViewModel.ts [app-client] (ecmascript)");
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
;
function UsersScreen() {
    _s();
    const vm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$viewmodels$2f$useUsersViewModel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUsersViewModel"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-3xl font-bold tracking-tight",
                        children: "Users"
                    }, void 0, false, {
                        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        children: "Add User"
                    }, void 0, false, {
                        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$users$2f$UserSearch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserSearch"], {}, void 0, false, {
                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            vm.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-medium",
                        children: "Error loading users"
                    }, void 0, false, {
                        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        children: vm.error
                    }, void 0, false, {
                        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-md border bg-card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "User"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                        lineNumber: 42,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Role"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                        lineNumber: 43,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                        lineNumber: 44,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Join Date"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "text-right",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                        lineNumber: 46,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                lineNumber: 41,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                            children: vm.isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: 5,
                                    className: "h-24 text-center text-muted-foreground",
                                    children: "Loading users..."
                                }, void 0, false, {
                                    fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                    lineNumber: 52,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                lineNumber: 51,
                                columnNumber: 15
                            }, this) : vm.users.length > 0 ? vm.users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                                    className: "h-9 w-9",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                                            src: user.avatar_url,
                                                            alt: user.full_name || "User"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                            lineNumber: 61,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                            children: (user.full_name || user.email || "U").charAt(0).toUpperCase()
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                            lineNumber: 62,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                    lineNumber: 60,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: user.full_name || "Unknown"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                            lineNumber: 65,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-muted-foreground",
                                                            children: user.email
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                            lineNumber: 66,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                    lineNumber: 64,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                            lineNumber: 59,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-1 flex-wrap",
                                                children: user.roles?.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "outline",
                                                        className: "capitalize",
                                                        children: r
                                                    }, r, false, {
                                                        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                        lineNumber: 72,
                                                        columnNumber: 25
                                                    }, this)) || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "outline",
                                                    className: "capitalize",
                                                    children: user.active_role || "User"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                    lineNumber: 73,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                lineNumber: 70,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                            lineNumber: 69,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary',
                                                className: user.status === 'active' ? 'bg-success hover:bg-success/80' : '',
                                                children: user.status || "Unknown"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                lineNumber: 77,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                            lineNumber: 76,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: new Date(user.created_at).toLocaleDateString()
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                            lineNumber: 84,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$users$2f$UserActionsMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserActionsMenu"], {
                                                userId: user.id
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                                lineNumber: 86,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                            lineNumber: 85,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, user.id, true, {
                                    fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                    lineNumber: 58,
                                    columnNumber: 17
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: 5,
                                    className: "h-24 text-center",
                                    children: "No users found."
                                }, void 0, false, {
                                    fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                    lineNumber: 92,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                                lineNumber: 91,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$users$2f$PaginationControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PaginationControls"], {
                totalPages: vm.totalPages
            }, void 0, false, {
                fileName: "[project]/src/features/users/views/UsersScreen.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/users/views/UsersScreen.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(UsersScreen, "4ktHwNoXetpfFsDur5+6WsnnS3o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$users$2f$viewmodels$2f$useUsersViewModel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUsersViewModel"]
    ];
});
_c = UsersScreen;
var _c;
__turbopack_context__.k.register(_c, "UsersScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_c92f096b._.js.map