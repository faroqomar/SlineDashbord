import { z } from 'zod';
/** Entity types returned by global search (PAGE 11). */
export declare const AdminSearchEntityTypeEnum: z.ZodEnum<["user", "task", "booking", "dispute", "transaction"]>;
export type AdminSearchEntityType = z.infer<typeof AdminSearchEntityTypeEnum>;
/** Request: GET /api/v1/search query params. q min 2 chars, limit max 50. */
export declare const AdminGlobalSearchRequestSchema: z.ZodObject<{
    q: z.ZodString;
    types: z.ZodOptional<z.ZodArray<z.ZodEnum<["user", "task", "booking", "dispute", "transaction"]>, "many">>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    q: string;
    types?: ("task" | "booking" | "user" | "dispute" | "transaction")[] | undefined;
}, {
    q: string;
    limit?: number | undefined;
    types?: ("task" | "booking" | "user" | "dispute" | "transaction")[] | undefined;
}>;
export type AdminGlobalSearchRequest = z.infer<typeof AdminGlobalSearchRequestSchema>;
/** Parsed from query string (GET ?q=...&types=user,task&limit=20). */
export declare const AdminGlobalSearchQuerySchema: z.ZodEffects<z.ZodObject<{
    q: z.ZodString;
    types: z.ZodEffects<z.ZodOptional<z.ZodString>, ("task" | "booking" | "user" | "dispute" | "transaction")[] | undefined, string | undefined>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    q: string;
    types?: ("task" | "booking" | "user" | "dispute" | "transaction")[] | undefined;
}, {
    q: string;
    limit?: number | undefined;
    types?: string | undefined;
}>, {
    limit: number;
    q: string;
    types?: ("task" | "booking" | "user" | "dispute" | "transaction")[] | undefined;
}, {
    q: string;
    limit?: number | undefined;
    types?: string | undefined;
}>;
/** Single result item: user. */
export declare const AdminSearchUserItemSchema: z.ZodObject<{
    entityType: z.ZodLiteral<"user">;
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    entityType: "user";
    title: string;
    link: string;
    subtitle?: string | undefined;
}, {
    id: string;
    entityType: "user";
    title: string;
    link: string;
    subtitle?: string | undefined;
}>;
export type AdminSearchUserItem = z.infer<typeof AdminSearchUserItemSchema>;
/** Single result item: task. */
export declare const AdminSearchTaskItemSchema: z.ZodObject<{
    entityType: z.ZodLiteral<"task">;
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    entityType: "task";
    title: string;
    link: string;
    subtitle?: string | undefined;
}, {
    id: string;
    entityType: "task";
    title: string;
    link: string;
    subtitle?: string | undefined;
}>;
export type AdminSearchTaskItem = z.infer<typeof AdminSearchTaskItemSchema>;
/** Single result item: booking. */
export declare const AdminSearchBookingItemSchema: z.ZodObject<{
    entityType: z.ZodLiteral<"booking">;
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    entityType: "booking";
    title: string;
    link: string;
    subtitle?: string | undefined;
}, {
    id: string;
    entityType: "booking";
    title: string;
    link: string;
    subtitle?: string | undefined;
}>;
export type AdminSearchBookingItem = z.infer<typeof AdminSearchBookingItemSchema>;
/** Single result item: dispute. */
export declare const AdminSearchDisputeItemSchema: z.ZodObject<{
    entityType: z.ZodLiteral<"dispute">;
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    entityType: "dispute";
    title: string;
    link: string;
    subtitle?: string | undefined;
}, {
    id: string;
    entityType: "dispute";
    title: string;
    link: string;
    subtitle?: string | undefined;
}>;
export type AdminSearchDisputeItem = z.infer<typeof AdminSearchDisputeItemSchema>;
/** Single result item: transaction (journal). */
export declare const AdminSearchTransactionItemSchema: z.ZodObject<{
    entityType: z.ZodLiteral<"transaction">;
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    entityType: "transaction";
    title: string;
    link: string;
    subtitle?: string | undefined;
}, {
    id: string;
    entityType: "transaction";
    title: string;
    link: string;
    subtitle?: string | undefined;
}>;
export type AdminSearchTransactionItem = z.infer<typeof AdminSearchTransactionItemSchema>;
/** Discriminated union of all search result items. */
export declare const AdminGlobalSearchResultItemSchema: z.ZodDiscriminatedUnion<"entityType", [z.ZodObject<{
    entityType: z.ZodLiteral<"user">;
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    entityType: "user";
    title: string;
    link: string;
    subtitle?: string | undefined;
}, {
    id: string;
    entityType: "user";
    title: string;
    link: string;
    subtitle?: string | undefined;
}>, z.ZodObject<{
    entityType: z.ZodLiteral<"task">;
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    entityType: "task";
    title: string;
    link: string;
    subtitle?: string | undefined;
}, {
    id: string;
    entityType: "task";
    title: string;
    link: string;
    subtitle?: string | undefined;
}>, z.ZodObject<{
    entityType: z.ZodLiteral<"booking">;
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    entityType: "booking";
    title: string;
    link: string;
    subtitle?: string | undefined;
}, {
    id: string;
    entityType: "booking";
    title: string;
    link: string;
    subtitle?: string | undefined;
}>, z.ZodObject<{
    entityType: z.ZodLiteral<"dispute">;
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    entityType: "dispute";
    title: string;
    link: string;
    subtitle?: string | undefined;
}, {
    id: string;
    entityType: "dispute";
    title: string;
    link: string;
    subtitle?: string | undefined;
}>, z.ZodObject<{
    entityType: z.ZodLiteral<"transaction">;
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    entityType: "transaction";
    title: string;
    link: string;
    subtitle?: string | undefined;
}, {
    id: string;
    entityType: "transaction";
    title: string;
    link: string;
    subtitle?: string | undefined;
}>]>;
export type AdminGlobalSearchResultItem = z.infer<typeof AdminGlobalSearchResultItemSchema>;
/** Response: GET /api/v1/search. */
export declare const AdminGlobalSearchResultSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodDiscriminatedUnion<"entityType", [z.ZodObject<{
        entityType: z.ZodLiteral<"user">;
        id: z.ZodString;
        title: z.ZodString;
        subtitle: z.ZodOptional<z.ZodString>;
        link: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        entityType: "user";
        title: string;
        link: string;
        subtitle?: string | undefined;
    }, {
        id: string;
        entityType: "user";
        title: string;
        link: string;
        subtitle?: string | undefined;
    }>, z.ZodObject<{
        entityType: z.ZodLiteral<"task">;
        id: z.ZodString;
        title: z.ZodString;
        subtitle: z.ZodOptional<z.ZodString>;
        link: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        entityType: "task";
        title: string;
        link: string;
        subtitle?: string | undefined;
    }, {
        id: string;
        entityType: "task";
        title: string;
        link: string;
        subtitle?: string | undefined;
    }>, z.ZodObject<{
        entityType: z.ZodLiteral<"booking">;
        id: z.ZodString;
        title: z.ZodString;
        subtitle: z.ZodOptional<z.ZodString>;
        link: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        entityType: "booking";
        title: string;
        link: string;
        subtitle?: string | undefined;
    }, {
        id: string;
        entityType: "booking";
        title: string;
        link: string;
        subtitle?: string | undefined;
    }>, z.ZodObject<{
        entityType: z.ZodLiteral<"dispute">;
        id: z.ZodString;
        title: z.ZodString;
        subtitle: z.ZodOptional<z.ZodString>;
        link: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        entityType: "dispute";
        title: string;
        link: string;
        subtitle?: string | undefined;
    }, {
        id: string;
        entityType: "dispute";
        title: string;
        link: string;
        subtitle?: string | undefined;
    }>, z.ZodObject<{
        entityType: z.ZodLiteral<"transaction">;
        id: z.ZodString;
        title: z.ZodString;
        subtitle: z.ZodOptional<z.ZodString>;
        link: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        entityType: "transaction";
        title: string;
        link: string;
        subtitle?: string | undefined;
    }, {
        id: string;
        entityType: "transaction";
        title: string;
        link: string;
        subtitle?: string | undefined;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    items: ({
        id: string;
        entityType: "user";
        title: string;
        link: string;
        subtitle?: string | undefined;
    } | {
        id: string;
        entityType: "task";
        title: string;
        link: string;
        subtitle?: string | undefined;
    } | {
        id: string;
        entityType: "booking";
        title: string;
        link: string;
        subtitle?: string | undefined;
    } | {
        id: string;
        entityType: "dispute";
        title: string;
        link: string;
        subtitle?: string | undefined;
    } | {
        id: string;
        entityType: "transaction";
        title: string;
        link: string;
        subtitle?: string | undefined;
    })[];
}, {
    items: ({
        id: string;
        entityType: "user";
        title: string;
        link: string;
        subtitle?: string | undefined;
    } | {
        id: string;
        entityType: "task";
        title: string;
        link: string;
        subtitle?: string | undefined;
    } | {
        id: string;
        entityType: "booking";
        title: string;
        link: string;
        subtitle?: string | undefined;
    } | {
        id: string;
        entityType: "dispute";
        title: string;
        link: string;
        subtitle?: string | undefined;
    } | {
        id: string;
        entityType: "transaction";
        title: string;
        link: string;
        subtitle?: string | undefined;
    })[];
}>;
export type AdminGlobalSearchResult = z.infer<typeof AdminGlobalSearchResultSchema>;
/** Query params for GET /api/v1/search/insights. */
export declare const AdminSearchInsightsQuerySchema: z.ZodObject<{
    window: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"24h">>>;
    tz: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"UTC">>>;
}, "strip", z.ZodTypeAny, {
    window: "24h";
    tz: "UTC";
}, {
    window?: "24h" | undefined;
    tz?: "UTC" | undefined;
}>;
export type AdminSearchInsightsQuery = z.infer<typeof AdminSearchInsightsQuerySchema>;
/** Metric payload used in Search KPI insights cards. */
export declare const AdminSearchKpiMetricSchema: z.ZodObject<{
    value: z.ZodNumber;
    deltaPercent: z.ZodNumber;
    sparkline: z.ZodArray<z.ZodNumber, "many">;
    stale: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    value: number;
    sparkline: number[];
    deltaPercent: number;
    stale: boolean;
}, {
    value: number;
    sparkline: number[];
    deltaPercent: number;
    stale?: boolean | undefined;
}>;
export type AdminSearchKpiMetric = z.infer<typeof AdminSearchKpiMetricSchema>;
/** Response for GET /api/v1/search/insights. */
export declare const AdminSearchInsightsResultSchema: z.ZodObject<{
    windowHours: z.ZodLiteral<24>;
    generatedAt: z.ZodString;
    stale: z.ZodDefault<z.ZodBoolean>;
    metrics: z.ZodObject<{
        searchesToday: z.ZodObject<{
            value: z.ZodNumber;
            deltaPercent: z.ZodNumber;
            sparkline: z.ZodArray<z.ZodNumber, "many">;
            stale: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        }, {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        }>;
        avgResultsPerQuery: z.ZodObject<{
            value: z.ZodNumber;
            deltaPercent: z.ZodNumber;
            sparkline: z.ZodArray<z.ZodNumber, "many">;
            stale: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        }, {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        }>;
        instantMatchRate: z.ZodObject<{
            value: z.ZodNumber;
            deltaPercent: z.ZodNumber;
            sparkline: z.ZodArray<z.ZodNumber, "many">;
            stale: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        }, {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        }>;
        zeroResultQueries: z.ZodObject<{
            value: z.ZodNumber;
            deltaPercent: z.ZodNumber;
            sparkline: z.ZodArray<z.ZodNumber, "many">;
            stale: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        }, {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        searchesToday: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        };
        avgResultsPerQuery: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        };
        instantMatchRate: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        };
        zeroResultQueries: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        };
    }, {
        searchesToday: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        };
        avgResultsPerQuery: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        };
        instantMatchRate: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        };
        zeroResultQueries: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    stale: boolean;
    windowHours: 24;
    generatedAt: string;
    metrics: {
        searchesToday: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        };
        avgResultsPerQuery: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        };
        instantMatchRate: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        };
        zeroResultQueries: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale: boolean;
        };
    };
}, {
    windowHours: 24;
    generatedAt: string;
    metrics: {
        searchesToday: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        };
        avgResultsPerQuery: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        };
        instantMatchRate: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        };
        zeroResultQueries: {
            value: number;
            sparkline: number[];
            deltaPercent: number;
            stale?: boolean | undefined;
        };
    };
    stale?: boolean | undefined;
}>;
export type AdminSearchInsightsResult = z.infer<typeof AdminSearchInsightsResultSchema>;
