import { z } from 'zod';
export declare const DisputeStatusEnum: z.ZodEnum<["open", "active", "resolved", "canceled"]>;
export type DisputeStatus = z.infer<typeof DisputeStatusEnum>;
export type DisputeDTO = {
    id: string;
    task_id: string;
    reporter_id: string;
    reported_id: string;
    reason: string;
    description: string;
    status: DisputeStatus;
    resolution?: string;
    created_at: string;
    updated_at: string;
    reporter: {
        id: string;
        full_name: string;
        avatar_url: string;
    };
    reported: {
        id: string;
        full_name: string;
        avatar_url: string;
    };
    task: {
        title: string;
        budget: number;
        status: string;
    };
};
export declare const GetDisputesSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["all", "open", "active", "resolved", "canceled"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    status: "open" | "active" | "resolved" | "canceled" | "all";
    limit: number;
}, {
    page?: number | undefined;
    status?: "open" | "active" | "resolved" | "canceled" | "all" | undefined;
    limit?: number | undefined;
}>;
export type GetDisputesInput = z.infer<typeof GetDisputesSchema>;
export declare const DisputeQueueRowSchema: z.ZodObject<{
    id: z.ZodString;
    task_id: z.ZodString;
    status: z.ZodEnum<["open", "active", "resolved", "canceled"]>;
    reason: z.ZodString;
    created_at: z.ZodString;
    updated_at: z.ZodOptional<z.ZodString>;
    resolved_at: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    complainant: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        full_name: z.ZodString;
        avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    }, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    }>>;
    defendant: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        full_name: z.ZodString;
        avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    }, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    }>>;
    task: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        budget: z.ZodOptional<z.ZodNumber>;
        budget_cents: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        budget?: number | undefined;
        budget_cents?: number | undefined;
    }, {
        id: string;
        title: string;
        budget?: number | undefined;
        budget_cents?: number | undefined;
    }>>;
    amount: z.ZodOptional<z.ZodNumber>;
    comments_count: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<["low", "med", "high", "crit"]>>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "active" | "resolved" | "canceled";
    id: string;
    task_id: string;
    reason: string;
    created_at: string;
    updated_at?: string | undefined;
    resolved_at?: string | null | undefined;
    complainant?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    } | undefined;
    defendant?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    } | undefined;
    task?: {
        id: string;
        title: string;
        budget?: number | undefined;
        budget_cents?: number | undefined;
    } | undefined;
    amount?: number | undefined;
    comments_count?: number | undefined;
    category?: string | undefined;
    severity?: "low" | "med" | "high" | "crit" | undefined;
}, {
    status: "open" | "active" | "resolved" | "canceled";
    id: string;
    task_id: string;
    reason: string;
    created_at: string;
    updated_at?: string | undefined;
    resolved_at?: string | null | undefined;
    complainant?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    } | undefined;
    defendant?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    } | undefined;
    task?: {
        id: string;
        title: string;
        budget?: number | undefined;
        budget_cents?: number | undefined;
    } | undefined;
    amount?: number | undefined;
    comments_count?: number | undefined;
    category?: string | undefined;
    severity?: "low" | "med" | "high" | "crit" | undefined;
}>;
export type DisputeQueueRow = z.infer<typeof DisputeQueueRowSchema>;
export declare const DisputeTabCountsSchema: z.ZodObject<{
    all: z.ZodNumber;
    open: z.ZodNumber;
    active: z.ZodNumber;
    resolved: z.ZodNumber;
    canceled: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    open: number;
    active: number;
    resolved: number;
    canceled: number;
    all: number;
}, {
    open: number;
    active: number;
    resolved: number;
    canceled: number;
    all: number;
}>;
export type DisputeTabCounts = z.infer<typeof DisputeTabCountsSchema>;
export declare const DisputeListResponseSchema: z.ZodObject<{
    disputes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        task_id: z.ZodString;
        status: z.ZodEnum<["open", "active", "resolved", "canceled"]>;
        reason: z.ZodString;
        created_at: z.ZodString;
        updated_at: z.ZodOptional<z.ZodString>;
        resolved_at: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        complainant: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            full_name: z.ZodString;
            avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        }, {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        }>>;
        defendant: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            full_name: z.ZodString;
            avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        }, {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        }>>;
        task: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            budget: z.ZodOptional<z.ZodNumber>;
            budget_cents: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            budget?: number | undefined;
            budget_cents?: number | undefined;
        }, {
            id: string;
            title: string;
            budget?: number | undefined;
            budget_cents?: number | undefined;
        }>>;
        amount: z.ZodOptional<z.ZodNumber>;
        comments_count: z.ZodOptional<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<["low", "med", "high", "crit"]>>;
    }, "strip", z.ZodTypeAny, {
        status: "open" | "active" | "resolved" | "canceled";
        id: string;
        task_id: string;
        reason: string;
        created_at: string;
        updated_at?: string | undefined;
        resolved_at?: string | null | undefined;
        complainant?: {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        } | undefined;
        defendant?: {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        } | undefined;
        task?: {
            id: string;
            title: string;
            budget?: number | undefined;
            budget_cents?: number | undefined;
        } | undefined;
        amount?: number | undefined;
        comments_count?: number | undefined;
        category?: string | undefined;
        severity?: "low" | "med" | "high" | "crit" | undefined;
    }, {
        status: "open" | "active" | "resolved" | "canceled";
        id: string;
        task_id: string;
        reason: string;
        created_at: string;
        updated_at?: string | undefined;
        resolved_at?: string | null | undefined;
        complainant?: {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        } | undefined;
        defendant?: {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        } | undefined;
        task?: {
            id: string;
            title: string;
            budget?: number | undefined;
            budget_cents?: number | undefined;
        } | undefined;
        amount?: number | undefined;
        comments_count?: number | undefined;
        category?: string | undefined;
        severity?: "low" | "med" | "high" | "crit" | undefined;
    }>, "many">;
    totalDisputes: z.ZodNumber;
    totalPages: z.ZodNumber;
    tabCounts: z.ZodOptional<z.ZodObject<{
        all: z.ZodNumber;
        open: z.ZodNumber;
        active: z.ZodNumber;
        resolved: z.ZodNumber;
        canceled: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        open: number;
        active: number;
        resolved: number;
        canceled: number;
        all: number;
    }, {
        open: number;
        active: number;
        resolved: number;
        canceled: number;
        all: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    disputes: {
        status: "open" | "active" | "resolved" | "canceled";
        id: string;
        task_id: string;
        reason: string;
        created_at: string;
        updated_at?: string | undefined;
        resolved_at?: string | null | undefined;
        complainant?: {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        } | undefined;
        defendant?: {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        } | undefined;
        task?: {
            id: string;
            title: string;
            budget?: number | undefined;
            budget_cents?: number | undefined;
        } | undefined;
        amount?: number | undefined;
        comments_count?: number | undefined;
        category?: string | undefined;
        severity?: "low" | "med" | "high" | "crit" | undefined;
    }[];
    totalDisputes: number;
    totalPages: number;
    tabCounts?: {
        open: number;
        active: number;
        resolved: number;
        canceled: number;
        all: number;
    } | undefined;
}, {
    disputes: {
        status: "open" | "active" | "resolved" | "canceled";
        id: string;
        task_id: string;
        reason: string;
        created_at: string;
        updated_at?: string | undefined;
        resolved_at?: string | null | undefined;
        complainant?: {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        } | undefined;
        defendant?: {
            id: string;
            full_name: string;
            avatar_url?: string | null | undefined;
        } | undefined;
        task?: {
            id: string;
            title: string;
            budget?: number | undefined;
            budget_cents?: number | undefined;
        } | undefined;
        amount?: number | undefined;
        comments_count?: number | undefined;
        category?: string | undefined;
        severity?: "low" | "med" | "high" | "crit" | undefined;
    }[];
    totalDisputes: number;
    totalPages: number;
    tabCounts?: {
        open: number;
        active: number;
        resolved: number;
        canceled: number;
        all: number;
    } | undefined;
}>;
export type DisputeListResponse = z.infer<typeof DisputeListResponseSchema>;
export declare const BookingCandidateSchema: z.ZodObject<{
    booking_id: z.ZodString;
    status: z.ZodString;
    client_id: z.ZodOptional<z.ZodString>;
    provider_id: z.ZodOptional<z.ZodString>;
    amount_cents: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: string;
    booking_id: string;
    client_id?: string | undefined;
    provider_id?: string | undefined;
    amount_cents?: number | undefined;
}, {
    status: string;
    booking_id: string;
    client_id?: string | undefined;
    provider_id?: string | undefined;
    amount_cents?: number | undefined;
}>;
export type BookingCandidate = z.infer<typeof BookingCandidateSchema>;
export declare const DisputeActionAvailabilitySchema: z.ZodObject<{
    can_accept: z.ZodBoolean;
    can_cancel: z.ZodBoolean;
    can_resolve: z.ZodBoolean;
    requires_booking_id: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    can_accept: boolean;
    can_cancel: boolean;
    can_resolve: boolean;
    requires_booking_id?: boolean | undefined;
}, {
    can_accept: boolean;
    can_cancel: boolean;
    can_resolve: boolean;
    requires_booking_id?: boolean | undefined;
}>;
export type DisputeActionAvailability = z.infer<typeof DisputeActionAvailabilitySchema>;
export declare const DisputeDetailSchema: z.ZodObject<{
    id: z.ZodString;
    task_id: z.ZodNullable<z.ZodString>;
    direct_offer_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodEnum<["open", "active", "resolved", "canceled"]>;
    reason: z.ZodString;
    resolution: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    resolved_at: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    complainant: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        full_name: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
        email?: string | undefined;
    }, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
        email?: string | undefined;
    }>>;
    defendant: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        full_name: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
        email?: string | undefined;
    }, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
        email?: string | undefined;
    }>>;
    task: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        budget: z.ZodOptional<z.ZodNumber>;
        budget_cents: z.ZodOptional<z.ZodNumber>;
        status: z.ZodString;
        deadline: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        id: string;
        title: string;
        budget?: number | undefined;
        budget_cents?: number | undefined;
        description?: string | undefined;
        deadline?: string | undefined;
    }, {
        status: string;
        id: string;
        title: string;
        budget?: number | undefined;
        budget_cents?: number | undefined;
        description?: string | undefined;
        deadline?: string | undefined;
    }>>>;
    amount: z.ZodOptional<z.ZodNumber>;
    messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        created_at: z.ZodString;
        is_admin: z.ZodOptional<z.ZodBoolean>;
        sender: z.ZodOptional<z.ZodObject<{
            full_name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            full_name: string;
        }, {
            full_name: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        content: string;
        is_admin?: boolean | undefined;
        sender?: {
            full_name: string;
        } | undefined;
    }, {
        id: string;
        created_at: string;
        content: string;
        is_admin?: boolean | undefined;
        sender?: {
            full_name: string;
        } | undefined;
    }>, "many">>;
    evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        file_url: z.ZodString;
        file_type: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        created_at: z.ZodString;
        uploader: z.ZodOptional<z.ZodObject<{
            full_name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            full_name: string;
        }, {
            full_name: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        file_url: string;
        description?: string | undefined;
        file_type?: string | undefined;
        uploader?: {
            full_name: string;
        } | undefined;
    }, {
        id: string;
        created_at: string;
        file_url: string;
        description?: string | undefined;
        file_type?: string | undefined;
        uploader?: {
            full_name: string;
        } | undefined;
    }>, "many">>;
    booking_candidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
        booking_id: z.ZodString;
        status: z.ZodString;
        client_id: z.ZodOptional<z.ZodString>;
        provider_id: z.ZodOptional<z.ZodString>;
        amount_cents: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        booking_id: string;
        client_id?: string | undefined;
        provider_id?: string | undefined;
        amount_cents?: number | undefined;
    }, {
        status: string;
        booking_id: string;
        client_id?: string | undefined;
        provider_id?: string | undefined;
        amount_cents?: number | undefined;
    }>, "many">>;
    action_availability: z.ZodOptional<z.ZodObject<{
        can_accept: z.ZodBoolean;
        can_cancel: z.ZodBoolean;
        can_resolve: z.ZodBoolean;
        requires_booking_id: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        can_accept: boolean;
        can_cancel: boolean;
        can_resolve: boolean;
        requires_booking_id?: boolean | undefined;
    }, {
        can_accept: boolean;
        can_cancel: boolean;
        can_resolve: boolean;
        requires_booking_id?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "active" | "resolved" | "canceled";
    id: string;
    task_id: string | null;
    reason: string;
    created_at: string;
    updated_at: string;
    resolved_at?: string | null | undefined;
    complainant?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
        email?: string | undefined;
    } | undefined;
    defendant?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
        email?: string | undefined;
    } | undefined;
    task?: {
        status: string;
        id: string;
        title: string;
        budget?: number | undefined;
        budget_cents?: number | undefined;
        description?: string | undefined;
        deadline?: string | undefined;
    } | null | undefined;
    amount?: number | undefined;
    direct_offer_id?: string | null | undefined;
    resolution?: string | null | undefined;
    messages?: {
        id: string;
        created_at: string;
        content: string;
        is_admin?: boolean | undefined;
        sender?: {
            full_name: string;
        } | undefined;
    }[] | undefined;
    evidence?: {
        id: string;
        created_at: string;
        file_url: string;
        description?: string | undefined;
        file_type?: string | undefined;
        uploader?: {
            full_name: string;
        } | undefined;
    }[] | undefined;
    booking_candidates?: {
        status: string;
        booking_id: string;
        client_id?: string | undefined;
        provider_id?: string | undefined;
        amount_cents?: number | undefined;
    }[] | undefined;
    action_availability?: {
        can_accept: boolean;
        can_cancel: boolean;
        can_resolve: boolean;
        requires_booking_id?: boolean | undefined;
    } | undefined;
}, {
    status: "open" | "active" | "resolved" | "canceled";
    id: string;
    task_id: string | null;
    reason: string;
    created_at: string;
    updated_at: string;
    resolved_at?: string | null | undefined;
    complainant?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
        email?: string | undefined;
    } | undefined;
    defendant?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
        email?: string | undefined;
    } | undefined;
    task?: {
        status: string;
        id: string;
        title: string;
        budget?: number | undefined;
        budget_cents?: number | undefined;
        description?: string | undefined;
        deadline?: string | undefined;
    } | null | undefined;
    amount?: number | undefined;
    direct_offer_id?: string | null | undefined;
    resolution?: string | null | undefined;
    messages?: {
        id: string;
        created_at: string;
        content: string;
        is_admin?: boolean | undefined;
        sender?: {
            full_name: string;
        } | undefined;
    }[] | undefined;
    evidence?: {
        id: string;
        created_at: string;
        file_url: string;
        description?: string | undefined;
        file_type?: string | undefined;
        uploader?: {
            full_name: string;
        } | undefined;
    }[] | undefined;
    booking_candidates?: {
        status: string;
        booking_id: string;
        client_id?: string | undefined;
        provider_id?: string | undefined;
        amount_cents?: number | undefined;
    }[] | undefined;
    action_availability?: {
        can_accept: boolean;
        can_cancel: boolean;
        can_resolve: boolean;
        requires_booking_id?: boolean | undefined;
    } | undefined;
}>;
export type DisputeDetail = z.infer<typeof DisputeDetailSchema>;
export declare const AdminAcceptDisputeInputSchema: z.ZodObject<{
    dispute_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    dispute_id: string;
}, {
    dispute_id: string;
}>;
export type AdminAcceptDisputeInput = z.infer<typeof AdminAcceptDisputeInputSchema>;
export declare const AdminCancelDisputeInputSchema: z.ZodObject<{
    dispute_id: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    dispute_id: string;
}, {
    reason: string;
    dispute_id: string;
}>;
export type AdminCancelDisputeInput = z.infer<typeof AdminCancelDisputeInputSchema>;
export declare const ResolveOutcomeEnum: z.ZodEnum<["refund_client", "release_freelancer", "no_financial"]>;
export type ResolveOutcome = z.infer<typeof ResolveOutcomeEnum>;
export declare const AdminResolveDisputeInputSchema: z.ZodObject<{
    dispute_id: z.ZodString;
    reason: z.ZodString;
    outcome: z.ZodOptional<z.ZodEnum<["refund_client", "release_freelancer", "no_financial"]>>;
    booking_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    dispute_id: string;
    booking_id?: string | undefined;
    outcome?: "refund_client" | "release_freelancer" | "no_financial" | undefined;
}, {
    reason: string;
    dispute_id: string;
    booking_id?: string | undefined;
    outcome?: "refund_client" | "release_freelancer" | "no_financial" | undefined;
}>;
export type AdminResolveDisputeInput = z.infer<typeof AdminResolveDisputeInputSchema>;
export declare const UpdateDisputeStatusSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["open", "active", "resolved", "canceled"]>;
    resolution: z.ZodOptional<z.ZodString>;
    decision: z.ZodOptional<z.ZodEnum<["refund_client", "release_freelancer"]>>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "active" | "resolved" | "canceled";
    id: string;
    resolution?: string | undefined;
    decision?: "refund_client" | "release_freelancer" | undefined;
}, {
    status: "open" | "active" | "resolved" | "canceled";
    id: string;
    resolution?: string | undefined;
    decision?: "refund_client" | "release_freelancer" | undefined;
}>;
export declare const CreateDisputeInputSchema: z.ZodEffects<z.ZodObject<{
    task_id: z.ZodString;
    complainant_id: z.ZodString;
    defendant_id: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    task_id: string;
    reason: string;
    complainant_id: string;
    defendant_id: string;
}, {
    task_id: string;
    reason: string;
    complainant_id: string;
    defendant_id: string;
}>, {
    task_id: string;
    reason: string;
    complainant_id: string;
    defendant_id: string;
}, {
    task_id: string;
    reason: string;
    complainant_id: string;
    defendant_id: string;
}>;
export type CreateDisputeInput = z.infer<typeof CreateDisputeInputSchema>;
export declare const CreateDisputeAckSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type CreateDisputeAck = z.infer<typeof CreateDisputeAckSchema>;
export declare const DISPUTES_READ_ROLES: string[];
export declare const DISPUTES_WRITE_ROLES: string[];
