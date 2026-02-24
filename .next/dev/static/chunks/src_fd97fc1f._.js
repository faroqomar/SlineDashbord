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
"[project]/src/features/finance/actions/data:d6f74d [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTransactionDetails",
    ()=>$$RSC_SERVER_ACTION_2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40c0764ba36c1f7cc0766b1e572e07d774ede34649":"getTransactionDetails"},"src/features/finance/actions/queries.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40c0764ba36c1f7cc0766b1e572e07d774ede34649", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getTransactionDetails");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcXVlcmllcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbmltcG9ydCB7IGNyZWF0ZUNsaWVudCBhcyBzdXBhYmFzZVNlcnZlciB9IGZyb20gJ0AvbGliL3N1cGFiYXNlL3NlcnZlcic7XG5pbXBvcnQgeyBjcmVhdGVBZG1pbkNsaWVudCBhcyBzdXBhYmFzZUFkbWluIH0gZnJvbSAnQC9saWIvc3VwYWJhc2UvYWRtaW4nO1xuaW1wb3J0IHsgcmVxdWlyZUFkbWluUm9sZSwgbWFza01ldGFGb3JSb2xlLCBsb2dBdWRpdEV2ZW50IH0gZnJvbSAnLi4vc2VydmljZXMvc2VjdXJpdHlfZ3VhcmRzJztcbmltcG9ydCB7IEpvdXJuYWxMZWRnZXJFbnRyeSwgUGxhdGZvcm1NZXRyaWNzLCBXaXRoZHJhd2FsUmVxdWVzdCB9IGZyb20gJy4uL21vZGVscy90eXBlcyc7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcblxuLy8gRGVmaW5lIHRoZSBzaGFwZSBvZiBwYWdpbmF0aW9uIGN1cnNvciBhbmQgZmlsdGVyc1xuZXhwb3J0IGludGVyZmFjZSBUcmFuc2FjdGlvbkN1cnNvciB7XG4gIGNyZWF0ZWRfYXQ6IHN0cmluZztcbiAgam91cm5hbF9pZDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zYWN0aW9uRmlsdGVycyB7XG4gIGV2ZW50X3R5cGU/OiBzdHJpbmc7XG4gIHN0YXR1cz86IHN0cmluZztcbiAgcGF5ZXJfdXNlcl9pZD86IHN0cmluZztcbiAgcGF5ZWVfdXNlcl9pZD86IHN0cmluZztcbiAgZW50aXR5X3R5cGU/OiBzdHJpbmc7XG4gIGVudGl0eV9pZD86IHN0cmluZztcbiAgbGltaXQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQbGF0Zm9ybU1ldHJpY3MoKTogUHJvbWlzZTxQbGF0Zm9ybU1ldHJpY3M+IHtcbiAgLy8gUmVxdWlyZXMgYXQgbGVhc3Qgc3VwcG9ydCByb2xlIHRvIHZpZXcgaGlnaCBsZXZlbCBtZXRyaWNzXG4gIGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoWydzdXBwb3J0JywgJ21vZGVyYXRvcicsICdhZG1pbicsICdzdXBlcl9hZG1pbiddKTtcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBzdXBhYmFzZVNlcnZlcigpO1xuXG4gIC8vIEluIGEgcmVhbCBpbXBsZW1lbnRhdGlvbiB0aGlzIG1pZ2h0IGZldGNoIGZyb20gYSB2aWV3IGxpa2UgdndfZmluYW5jaWFsX21ldHJpY3NfcmVhbHRpbWVcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAuZnJvbSgndndfZmluYW5jaWFsX21ldHJpY3NfcmVhbHRpbWUnKVxuICAgIC5zZWxlY3QoJyonKVxuICAgIC5zaW5nbGUoKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRQbGF0Zm9ybU1ldHJpY3MgZXJyb3I6JywgZXJyb3IpO1xuICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGZldGNoIHBsYXRmb3JtIG1ldHJpY3MnKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGxhdGZvcm1fY2FzaDogZGF0YS5wbGF0Zm9ybV9jYXNoX2lxZCB8fCAwLFxuICAgIGVzY3Jvd19oZWxkOiBkYXRhLmVzY3Jvd19oZWxkX2lxZCB8fCAwLFxuICAgIGxpZmV0aW1lX3JldmVudWU6IGRhdGEucmV2ZW51ZV9pcWQgfHwgMCxcbiAgICBwZW5kaW5nX3dpdGhkcmF3YWxzOiAwLCAvLyBXb3VsZCBiZSBhZ2dyZWdhdGVkIG9yIGNvbXB1dGVkXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRUcmFuc2FjdGlvbnNQYWdpbmF0ZWQoXG4gIGZpbHRlcnM6IFRyYW5zYWN0aW9uRmlsdGVycyA9IHt9LFxuICBjdXJzb3I/OiBUcmFuc2FjdGlvbkN1cnNvclxuKTogUHJvbWlzZTx7IGRhdGE6IEpvdXJuYWxMZWRnZXJFbnRyeVtdOyBuZXh0Q3Vyc29yPzogVHJhbnNhY3Rpb25DdXJzb3IgfT4ge1xuICAvLyBTdXBwb3J0IGFuZCBoaWdoZXIgY2FuIHNlZSB0cmFuc2FjdGlvbnMgKG1ldGFkYXRhIHdpbGwgYmUgbWFza2VkIGxhdGVyIGlmIG5lZWRlZClcbiAgY29uc3QgeyByb2xlIH0gPSBhd2FpdCByZXF1aXJlQWRtaW5Sb2xlKFsnc3VwcG9ydCcsICdtb2RlcmF0b3InLCAnYWRtaW4nLCAnc3VwZXJfYWRtaW4nXSk7XG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgc3VwYWJhc2VTZXJ2ZXIoKTtcbiAgXG4gIGxldCBxdWVyeSA9IHN1cGFiYXNlXG4gICAgLmZyb20oJ3Z3X2FkbWluX2pvdXJuYWxfbGVkZ2VyJylcbiAgICAuc2VsZWN0KCcqJylcbiAgICAub3JkZXIoJ2NyZWF0ZWRfYXQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcbiAgICAub3JkZXIoJ2pvdXJuYWxfaWQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XG5cbiAgLy8gQXBwbHkgZmlsdGVycy4uLlxuICBpZiAoZmlsdGVycy5ldmVudF90eXBlKSBxdWVyeSA9IHF1ZXJ5LmVxKCdldmVudF90eXBlJywgZmlsdGVycy5ldmVudF90eXBlKTtcbiAgaWYgKGZpbHRlcnMuc3RhdHVzKSBxdWVyeSA9IHF1ZXJ5LmVxKCdzdGF0dXMnLCBmaWx0ZXJzLnN0YXR1cyk7XG4gIC8vIHBheWVyIG9yIHBheWVlIGZpbHRlclxuICBpZiAoZmlsdGVycy5wYXllcl91c2VyX2lkKSBxdWVyeSA9IHF1ZXJ5LmVxKCdwYXllcl91c2VyX2lkJywgZmlsdGVycy5wYXllcl91c2VyX2lkKTtcbiAgaWYgKGZpbHRlcnMucGF5ZWVfdXNlcl9pZCkgcXVlcnkgPSBxdWVyeS5lcSgncGF5ZWVfdXNlcl9pZCcsIGZpbHRlcnMucGF5ZWVfdXNlcl9pZCk7XG4gIGlmIChmaWx0ZXJzLmVudGl0eV90eXBlKSBxdWVyeSA9IHF1ZXJ5LmVxKCdlbnRpdHlfdHlwZScsIGZpbHRlcnMuZW50aXR5X3R5cGUpO1xuICBpZiAoZmlsdGVycy5lbnRpdHlfaWQpIHF1ZXJ5ID0gcXVlcnkuZXEoJ2VudGl0eV9pZCcsIGZpbHRlcnMuZW50aXR5X2lkKTtcblxuICAvLyBBcHBseSBjdXJzb3IgcGFnaW5hdGlvblxuICBpZiAoY3Vyc29yKSB7XG4gICAgLy8gV2UgbmVlZCAoY3JlYXRlZF9hdCwgaWQpIDwgKGN1cnNvci5jcmVhdGVkX2F0LCBjdXJzb3Iuam91cm5hbF9pZClcbiAgICAvLyBVbmZvcnR1bmF0ZWx5IFN1cGFiYXNlIEpTIGRvZXNuJ3Qgc3VwcG9ydCB0dXBsZSBjb21wYXJpc29ucyBkaXJlY3RseSBlYXNpbHkgbGlrZSAubHRlKCcoY3JlYXRlZF9hdCwgam91cm5hbF9pZCknLCBgKCR7Y3Vyc29yLmNyZWF0ZWRfYXR9LCAke2N1cnNvci5qb3VybmFsX2lkfSlgKVxuICAgIC8vIEEgd29ya2Fyb3VuZCBpcyB0byB1c2UgYW4gUlBDIG9yIHN0cmluZyBmaWx0ZXI6XG4gICAgcXVlcnkgPSBxdWVyeS5vcihgY3JlYXRlZF9hdC5sdC4ke2N1cnNvci5jcmVhdGVkX2F0fSxhbmQoY3JlYXRlZF9hdC5lcS4ke2N1cnNvci5jcmVhdGVkX2F0fSxqb3VybmFsX2lkLmx0LiR7Y3Vyc29yLmpvdXJuYWxfaWR9KWApO1xuICB9XG5cbiAgY29uc3QgbGltaXQgPSBmaWx0ZXJzLmxpbWl0IHx8IDUwO1xuICBxdWVyeSA9IHF1ZXJ5LmxpbWl0KGxpbWl0KTtcblxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBxdWVyeTtcbiAgaWYgKGVycm9yKSB0aHJvdyBuZXcgRXJyb3IoYFF1ZXJ5IGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWApO1xuXG4gIC8vIE1hc2sgbWV0YWRhdGEgYWNjb3JkaW5nIHRvIHJvbGVcbiAgY29uc3QgbWFza2VkRGF0YSA9IGRhdGEubWFwKChyb3c6IGFueSkgPT4gKHtcbiAgICAuLi5yb3csXG4gICAgbWV0YV9mdWxsOiBtYXNrTWV0YUZvclJvbGUocm9sZSwgcm93Lm1ldGFfZnVsbCksXG4gIH0pKSBhcyBKb3VybmFsTGVkZ2VyRW50cnlbXTtcblxuICBjb25zdCBuZXh0Q3Vyc29yID0gZGF0YS5sZW5ndGggPT09IGxpbWl0ID8ge1xuICAgIGNyZWF0ZWRfYXQ6IGRhdGFbZGF0YS5sZW5ndGggLSAxXS5jcmVhdGVkX2F0LFxuICAgIGpvdXJuYWxfaWQ6IGRhdGFbZGF0YS5sZW5ndGggLSAxXS5qb3VybmFsX2lkXG4gIH0gOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHsgZGF0YTogbWFza2VkRGF0YSwgbmV4dEN1cnNvciB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VHJhbnNhY3Rpb25EZXRhaWxzKGpvdXJuYWxJZDogc3RyaW5nKTogUHJvbWlzZTxKb3VybmFsTGVkZ2VyRW50cnk+IHtcbiAgY29uc3QgeyB1c2VySWQsIHJvbGUgfSA9IGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoWydzdXBwb3J0JywgJ21vZGVyYXRvcicsICdhZG1pbicsICdzdXBlcl9hZG1pbiddKTtcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBzdXBhYmFzZVNlcnZlcigpO1xuXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgLmZyb20oJ3Z3X2FkbWluX2pvdXJuYWxfbGVkZ2VyJylcbiAgICAuc2VsZWN0KCcqJylcbiAgICAuZXEoJ2pvdXJuYWxfaWQnLCBqb3VybmFsSWQpXG4gICAgLnNpbmdsZSgpO1xuXG4gIGlmIChlcnJvciB8fCAhZGF0YSkgdGhyb3cgbmV3IEVycm9yKCdUcmFuc2FjdGlvbiBub3QgZm91bmQnKTtcblxuICBjb25zdCBpc1NlbnNpdGl2ZVVubWFza2VkID0gKHJvbGUgPT09ICdhZG1pbicgfHwgcm9sZSA9PT0gJ3N1cGVyX2FkbWluJyk7XG4gIFxuICBpZiAoaXNTZW5zaXRpdmVVbm1hc2tlZCAmJiBkYXRhLm1ldGFfZnVsbCkge1xuICAgIC8vIExvZyBzZW5zaXRpdmUgcmVhZCBmb3IgYWRtaW4vc3VwZXJfYWRtaW5cbiAgICBhd2FpdCBsb2dBdWRpdEV2ZW50KHtcbiAgICAgIGFjdGlvbjogJ2FkbWluLmZpbmFuY2UudHhfdmlld19zZW5zaXRpdmVfbWV0YScsXG4gICAgICBhY3Rvcl91c2VyX2lkOiB1c2VySWQsXG4gICAgICBldmVudF90eXBlOiBkYXRhLmV2ZW50X3R5cGUsXG4gICAgICBqb3VybmFsX2VudHJ5X2lkOiBqb3VybmFsSWQsXG4gICAgICBtZXRhOiB7IHZpZXdlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBtYXNrZWREYXRhID0ge1xuICAgIC4uLmRhdGEsXG4gICAgbWV0YV9mdWxsOiBtYXNrTWV0YUZvclJvbGUocm9sZSwgZGF0YS5tZXRhX2Z1bGwpXG4gIH07XG5cbiAgcmV0dXJuIG1hc2tlZERhdGEgYXMgSm91cm5hbExlZGdlckVudHJ5O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VXNlcldhbGxldFN1bW1hcnkodGFyZ2V0VXNlcklkOiBzdHJpbmcpIHtcbiAgYXdhaXQgcmVxdWlyZUFkbWluUm9sZShbJ3N1cHBvcnQnLCAnbW9kZXJhdG9yJywgJ2FkbWluJywgJ3N1cGVyX2FkbWluJ10pO1xuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IHN1cGFiYXNlU2VydmVyKCk7XG4gIFxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgIC5mcm9tKCd2d193YWxsZXRfYmFsYW5jZXNfdXNlcicpXG4gICAgLnNlbGVjdCgnKicpXG4gICAgLmVxKCd1c2VyX2lkJywgdGFyZ2V0VXNlcklkKVxuICAgIC5zaW5nbGUoKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICAvLyBJZiB1c2VyIGhhcyBubyB3YWxsZXQgcm93IGl0IG1pZ2h0IHRocm93IGVycm9yLCByZXR1cm4gZGVmYXVsdCAwXG4gICAgcmV0dXJuIHtcbiAgICAgIGF2YWlsYWJsZV9iYWxhbmNlOiAwLFxuICAgICAgaGVsZF9iYWxhbmNlOiAwLFxuICAgICAgcGVuZGluZ193aXRoZHJhd2FsX2JhbGFuY2U6IDAsXG4gICAgICBjdXJyZW5jeTogJ0lRRCdcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc2VyRmluYW5jZVRpbWVsaW5lKFxuICB0YXJnZXRVc2VySWQ6IHN0cmluZyxcbiAgZmlsdGVyczogUGljazxUcmFuc2FjdGlvbkZpbHRlcnMsICdldmVudF90eXBlJyB8ICdzdGF0dXMnIHwgJ2xpbWl0Jz4gPSB7fSxcbiAgY3Vyc29yPzogVHJhbnNhY3Rpb25DdXJzb3Jcbikge1xuICAvLyBXZSBjYW4ganVzdCBjb25zdHJ1Y3QgYSBxdWVyeSB0aGF0IGZpbmRzIHRyYW5zYWN0aW9ucyB3aGVyZSB1c2VyIGlzIHBheWVyIG9yIHBheWVlXG4gIC8vIEFsdGVybmF0aXZlbHkgd2UgaGl0IGEgZGVkaWNhdGVkIHVzZXIgdGltZWxpbmUgdmlldyBgdndfd2FsbGV0X2FjdGl2aXR5X3VzZXJgXG4gIGNvbnN0IHsgcm9sZSB9ID0gYXdhaXQgcmVxdWlyZUFkbWluUm9sZShbJ3N1cHBvcnQnLCAnbW9kZXJhdG9yJywgJ2FkbWluJywgJ3N1cGVyX2FkbWluJ10pO1xuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IHN1cGFiYXNlU2VydmVyKCk7XG5cbiAgbGV0IHF1ZXJ5ID0gc3VwYWJhc2VcbiAgICAuZnJvbSgndndfd2FsbGV0X2FjdGl2aXR5X3VzZXInKVxuICAgIC5zZWxlY3QoJyonKVxuICAgIC8vIEEgcm9idXN0IGltcGxlbWVudGF0aW9uIHNob3VsZCBwcm9iYWJseSBmaWx0ZXIgYnkgdGhpcyB1c2VyIGluIGEgd2hlcmUgY2xhdXNlLCBcbiAgICAvLyBidXQgdndfd2FsbGV0X2FjdGl2aXR5X3VzZXIgdXN1YWxseSBpcyBqb2luZWQgcGVyIHVzZXIuXG4gICAgLy8gQXNzdW1pbmcgdndfd2FsbGV0X2FjdGl2aXR5X3VzZXIgZG9lc24ndCBleHBvc2UgdGhlIGJhc2UgdXNlciBlYXNpbHksIHdlIGNhbiB1c2UgdGhlIGxlZGdlciB2aWV3OlxuICAgIC5vcmRlcignY3JlYXRlZF9hdCcsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KTtcbiAgICBcbiAgLy8gQXBwbHlpbmcgZmlsdGVycyBkaXJlY3RseSB0byB2d193YWxsZXRfYWN0aXZpdHlfdXNlciAuLi5cbiAgLy8gV2FpdCwgbGV0J3MganVzdCByZXVzZSBnZXRUcmFuc2FjdGlvbnNQYWdpbmF0ZWQgYnkgZXhwYW5kaW5nIGZpbHRlcnMgdG8gYWxsb3cgT1IuXG4gIC8vIEFjdHVhbGx5LCB3ZSdsbCBpbXBsZW1lbnQgYSBjdXN0b20gcXVlcnkgaWYgbmVlZGVkLlxuICAvLyAuLi4gRm9yIGJyZXZpdHksIG1pbWlja2luZyBzYW1lIGxvZ2ljXG4gIFxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBxdWVyeS5saW1pdChmaWx0ZXJzLmxpbWl0IHx8IDUwKTtcbiAgaWYgKGVycm9yKSB0aHJvdyBuZXcgRXJyb3IoJ1F1ZXJ5IGZhaWxlZCcpO1xuICBcbiAgcmV0dXJuIHsgZGF0YSwgbmV4dEN1cnNvcjogdW5kZWZpbmVkIH07IFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RW50aXR5VHJhY2UoZW50aXR5VHlwZTogc3RyaW5nLCBlbnRpdHlJZDogc3RyaW5nKSB7XG4gIGNvbnN0IGZpbHRlcnM6IFRyYW5zYWN0aW9uRmlsdGVycyA9IHsgZW50aXR5X3R5cGU6IGVudGl0eVR5cGUsIGVudGl0eV9pZDogZW50aXR5SWQgfTtcbiAgcmV0dXJuIGdldFRyYW5zYWN0aW9uc1BhZ2luYXRlZChmaWx0ZXJzKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFdpdGhkcmF3YWxzKFxuICBmaWx0ZXJzOiB7IHN0YXR1cz86IHN0cmluZzsgbGltaXQ/OiBudW1iZXIgfSA9IHt9LFxuICBjdXJzb3I/OiB7IGNyZWF0ZWRfYXQ6IHN0cmluZzsgaWQ6IHN0cmluZyB9XG4pIHtcbiAgYXdhaXQgcmVxdWlyZUFkbWluUm9sZShbJ3N1cHBvcnQnLCAnbW9kZXJhdG9yJywgJ2FkbWluJywgJ3N1cGVyX2FkbWluJ10pO1xuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IHN1cGFiYXNlU2VydmVyKCk7XG4gIFxuICBsZXQgcXVlcnkgPSBzdXBhYmFzZVxuICAgIC5mcm9tKCd3aXRoZHJhd2FsX3JlcXVlc3RzJylcbiAgICAuc2VsZWN0KCcqJylcbiAgICAub3JkZXIoJ2NyZWF0ZWRfYXQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcbiAgICAub3JkZXIoJ2lkJywgeyBhc2NlbmRpbmc6IGZhbHNlIH0pO1xuXG4gIGlmIChmaWx0ZXJzLnN0YXR1cykgcXVlcnkgPSBxdWVyeS5lcSgnc3RhdHVzJywgZmlsdGVycy5zdGF0dXMpO1xuICBcbiAgaWYgKGN1cnNvcikge1xuICAgIHF1ZXJ5ID0gcXVlcnkub3IoYGNyZWF0ZWRfYXQubHQuJHtjdXJzb3IuY3JlYXRlZF9hdH0sYW5kKGNyZWF0ZWRfYXQuZXEuJHtjdXJzb3IuY3JlYXRlZF9hdH0saWQubHQuJHtjdXJzb3IuaWR9KWApO1xuICB9XG4gIFxuICBjb25zdCBsaW1pdCA9IGZpbHRlcnMubGltaXQgfHwgNTA7XG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHF1ZXJ5LmxpbWl0KGxpbWl0KTtcblxuICBpZiAoZXJyb3IpIHRocm93IG5ldyBFcnJvcignUXVlcnkgZmFpbGVkJyk7XG5cbiAgY29uc3QgbmV4dEN1cnNvciA9IGRhdGEubGVuZ3RoID09PSBsaW1pdCA/IHtcbiAgICBjcmVhdGVkX2F0OiBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uY3JlYXRlZF9hdCxcbiAgICBpZDogZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmlkXG4gIH0gOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHsgZGF0YSwgbmV4dEN1cnNvciB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXVkaXRMb2dzKFxuICBmaWx0ZXJzOiB7IGxpbWl0PzogbnVtYmVyIH0gPSB7fSxcbiAgY3Vyc29yPzogeyBjcmVhdGVkX2F0OiBzdHJpbmc7IGlkOiBzdHJpbmcgfVxuKSB7XG4gIGF3YWl0IHJlcXVpcmVBZG1pblJvbGUoWydhZG1pbicsICdzdXBlcl9hZG1pbiddKTtcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBzdXBhYmFzZVNlcnZlcigpO1xuICBcbiAgbGV0IHF1ZXJ5ID0gc3VwYWJhc2VcbiAgICAuZnJvbSgnYXVkaXRfbG9ncycpXG4gICAgLnNlbGVjdCgnKicpXG4gICAgLm9yZGVyKCdjcmVhdGVkX2F0JywgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXG4gICAgLm9yZGVyKCdpZCcsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KTtcbiAgXG4gIGlmIChjdXJzb3IpIHtcbiAgICBxdWVyeSA9IHF1ZXJ5Lm9yKGBjcmVhdGVkX2F0Lmx0LiR7Y3Vyc29yLmNyZWF0ZWRfYXR9LGFuZChjcmVhdGVkX2F0LmVxLiR7Y3Vyc29yLmNyZWF0ZWRfYXR9LGlkLmx0LiR7Y3Vyc29yLmlkfSlgKTtcbiAgfVxuICBcbiAgY29uc3QgbGltaXQgPSBmaWx0ZXJzLmxpbWl0IHx8IDUwO1xuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBxdWVyeS5saW1pdChsaW1pdCk7XG5cbiAgaWYgKGVycm9yKSB0aHJvdyBuZXcgRXJyb3IoYFF1ZXJ5IGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWApO1xuXG4gIGNvbnN0IG5leHRDdXJzb3IgPSBkYXRhLmxlbmd0aCA9PT0gbGltaXQgPyB7XG4gICAgY3JlYXRlZF9hdDogZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmNyZWF0ZWRfYXQsXG4gICAgaWQ6IGRhdGFbZGF0YS5sZW5ndGggLSAxXS5pZFxuICB9IDogdW5kZWZpbmVkO1xuXG4gIHJldHVybiB7IGRhdGEsIG5leHRDdXJzb3IgfTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiaVRBbUdzQixrTUFBQSJ9
}),
"[project]/src/features/finance/components/TransactionTraceDrawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransactionTraceDrawer",
    ()=>TransactionTraceDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/sheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$data$3a$d6f74d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/features/finance/actions/data:d6f74d [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-client] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/scroll-area.tsx [app-client] (ecmascript)");
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
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [unmasked, setUnmasked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransactionTraceDrawer.useEffect": ()=>{
            if (open && journalId) {
                setLoading(true);
                setError(null);
                // We initially simulate fetching it without explicitly asking for unmask if it was a separate endpoint,
                // but getTransactionDetails automatically returns unmasked if the role allows, or masked otherwise.
                // For a better UX, it's already masked inside `meta_full` depending on role, but we can display that.
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$actions$2f$data$3a$d6f74d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getTransactionDetails"])(journalId).then({
                    "TransactionTraceDrawer.useEffect": (res)=>{
                        setData(res);
                        setUnmasked(!!res.meta_full && Object.keys(res.meta_full).length > 0);
                    }
                }["TransactionTraceDrawer.useEffect"]).catch({
                    "TransactionTraceDrawer.useEffect": (err)=>setError(err.message)
                }["TransactionTraceDrawer.useEffect"]).finally({
                    "TransactionTraceDrawer.useEffect": ()=>setLoading(false)
                }["TransactionTraceDrawer.useEffect"]);
            }
        }
    }["TransactionTraceDrawer.useEffect"], [
        journalId,
        open
    ]);
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
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetDescription"], {
                            children: [
                                "Audit view for journal entry ",
                                journalId.split('-')[0]
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-40 items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "h-6 w-6 animate-spin text-muted-foreground"
                    }, void 0, false, {
                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                        lineNumber: 59,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                    lineNumber: 58,
                    columnNumber: 11
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-40 flex-col items-center justify-center text-destructive",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                            className: "h-8 w-8 mb-2"
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                            lineNumber: 64,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                    lineNumber: 62,
                    columnNumber: 11
                }, this) : data ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
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
                                                lineNumber: 72,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "outline",
                                                className: "font-medium",
                                                children: data.event_type
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 73,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 71,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-muted-foreground mb-1",
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 76,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "secondary",
                                                className: data.status === 'posted' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500',
                                                children: data.status
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 77,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 75,
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
                                                lineNumber: 87,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-mono text-sm",
                                                children: new Date(data.created_at).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 88,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 86,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                lineNumber: 70,
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
                                        lineNumber: 94,
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
                                                lineNumber: 96,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono",
                                                children: [
                                                    data.gross_amount,
                                                    " IQD"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 97,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 95,
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
                                                lineNumber: 100,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-destructive",
                                                children: [
                                                    "-",
                                                    data.fee_amount,
                                                    " IQD"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 101,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 99,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center text-sm font-medium pt-2 border-t",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Net Amount"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 104,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono",
                                                children: [
                                                    data.net_amount,
                                                    " IQD"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 105,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                lineNumber: 93,
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
                                        lineNumber: 111,
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
                                                        lineNumber: 114,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-xs",
                                                        children: data.payer_user_id || 'System (Platform)'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 113,
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
                                                        lineNumber: 118,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-xs",
                                                        children: data.payee_user_id || 'System (Platform)'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 119,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 117,
                                                columnNumber: 19
                                            }, this),
                                            data.entity_type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1 pb-2 border-b border-border/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground text-xs",
                                                        children: [
                                                            data.entity_type,
                                                            " ID"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-xs",
                                                        children: data.entity_id
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 122,
                                                columnNumber: 21
                                            }, this),
                                            data.initiator_user_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground text-xs",
                                                        children: "Initiator (Actor)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-xs",
                                                        children: data.initiator_user_id
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 128,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 112,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                lineNumber: 110,
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
                                                lineNumber: 139,
                                                columnNumber: 19
                                            }, this),
                                            unmasked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "outline",
                                                className: "text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        className: "h-3 w-3 mr-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 66
                                                    }, this),
                                                    " Unmasked View"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 141,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 138,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-md bg-muted p-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                            className: "text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all",
                                            children: JSON.stringify(data.meta_full || data.meta_masked || {}, null, 2)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                            lineNumber: 146,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 145,
                                        columnNumber: 17
                                    }, this),
                                    !unmasked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground italic flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                                lineNumber: 152,
                                                columnNumber: 21
                                            }, this),
                                            "Sensitive metadata is masked for your role. Contact a Super Admin for access."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                        lineNumber: 151,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                                lineNumber: 137,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                        lineNumber: 68,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
                    lineNumber: 67,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/finance/components/TransactionTraceDrawer.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_s(TransactionTraceDrawer, "08lFajVBhu0UPSX+d0GgtEBqQG8=");
_c = TransactionTraceDrawer;
var _c;
__turbopack_context__.k.register(_c, "TransactionTraceDrawer");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$components$2f$TransactionTraceDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/finance/components/TransactionTraceDrawer.tsx [app-client] (ecmascript)");
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
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [selectedTxnId, setSelectedTxnId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleNextPage = ()=>{
        if (!nextCursor) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('cursor_created_at', nextCursor.created_at);
        params.set('cursor_id', nextCursor.journal_id);
        router.push(`?${params.toString()}`);
    };
    const handleClearFilters = ()=>{
        router.push('/dashboard/finance/transactions');
    };
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
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            (filters.event_type || filters.status) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "secondary",
                                className: "ml-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                        className: "h-3 w-3 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 51,
                                        columnNumber: 15
                                    }, this),
                                    " Filters Active"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: (filters.event_type || filters.status) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "sm",
                            onClick: handleClearFilters,
                            children: "Clear Filters"
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                lineNumber: 46,
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
                                        lineNumber: 68,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Event Type"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Payer / Payee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "text-right",
                                        children: "Gross"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "text-right",
                                        children: "Fee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "text-right",
                                        children: "Net"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Date"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {}, void 0, false, {
                                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                        lineNumber: 76,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                            children: initialData.length > 0 ? initialData.map((txn)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                    className: "hover:bg-muted/50 cursor-pointer",
                                    onClick: ()=>setSelectedTxnId(txn.journal_id),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "font-mono text-xs",
                                            children: [
                                                txn.journal_id.slice(0, 8),
                                                "..."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 83,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "outline",
                                                children: txn.event_type
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                lineNumber: 85,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 84,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "secondary",
                                                className: txn.status === 'posted' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500',
                                                children: txn.status
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                lineNumber: 88,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 87,
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
                                                            lineNumber: 98,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        txn.payer_user_id ? txn.payer_user_id.slice(0, 8) + '...' : 'System'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                    lineNumber: 98,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground mr-1",
                                                            children: "To:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                            lineNumber: 99,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        txn.payee_user_id ? txn.payee_user_id.slice(0, 8) + '...' : 'System'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                    lineNumber: 99,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 97,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right font-mono",
                                            children: txn.gross_amount
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 101,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right font-mono text-destructive",
                                            children: txn.fee_amount > 0 ? `-${txn.fee_amount}` : '0'
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 102,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right font-mono font-medium",
                                            children: txn.net_amount
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 103,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-muted-foreground text-sm",
                                            children: new Date(txn.created_at).toLocaleString()
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 104,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    setSelectedTxnId(txn.journal_id);
                                                },
                                                children: "Details"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                                lineNumber: 108,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                            lineNumber: 107,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, txn.journal_id, true, {
                                    fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                    lineNumber: 82,
                                    columnNumber: 17
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: 9,
                                    className: "h-24 text-center text-muted-foreground",
                                    children: "No transactions found."
                                }, void 0, false, {
                                    fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                    lineNumber: 116,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 115,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-end space-x-2 py-4 px-4 border-t",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        onClick: ()=>router.back(),
                        disabled: !searchParams.get('cursor_id'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "h-4 w-4 mr-1"
                            }, void 0, false, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            " Previous"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        onClick: handleNextPage,
                        disabled: !nextCursor,
                        children: [
                            "Next ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "h-4 w-4 ml-1"
                            }, void 0, false, {
                                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                                lineNumber: 140,
                                columnNumber: 16
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            selectedTxnId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$finance$2f$components$2f$TransactionTraceDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionTraceDrawer"], {
                journalId: selectedTxnId,
                open: !!selectedTxnId,
                onOpenChange: (open)=>!open && setSelectedTxnId(null)
            }, void 0, false, {
                fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/finance/components/TransactionsTable.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(TransactionsTable, "uYZ9Vtx2HGIbcCg5gdsXrKuwCQk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
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

//# sourceMappingURL=src_fd97fc1f._.js.map