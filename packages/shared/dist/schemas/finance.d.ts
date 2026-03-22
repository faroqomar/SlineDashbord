import { z } from 'zod';
export declare const ApproveWithdrawalSchema: z.ZodObject<{
    requestId: z.ZodString;
    reason: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    requestId: string;
}, {
    requestId: string;
    reason?: string | undefined;
}>;
export type ApproveWithdrawalInput = z.infer<typeof ApproveWithdrawalSchema>;
export declare const RejectWithdrawalSchema: z.ZodObject<{
    requestId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    requestId: string;
}, {
    reason: string;
    requestId: string;
}>;
export type RejectWithdrawalInput = z.infer<typeof RejectWithdrawalSchema>;
export declare const FreezeWalletSchema: z.ZodObject<{
    targetUserId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    targetUserId: string;
}, {
    reason: string;
    targetUserId: string;
}>;
export type FreezeWalletInput = z.infer<typeof FreezeWalletSchema>;
export declare const UnfreezeWalletSchema: z.ZodObject<{
    targetUserId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    targetUserId: string;
}, {
    reason: string;
    targetUserId: string;
}>;
export type UnfreezeWalletInput = z.infer<typeof UnfreezeWalletSchema>;
/** Wallet adjust (credit/debit). Positive amount_cents = credit, negative = debit. approval_id required when |amount_cents| >= WALLET_ADJUST_DANGEROUS_MIN. */
export declare const AdjustWalletInputSchema: z.ZodObject<{
    target_user_id: z.ZodString;
    amount_cents: z.ZodNumber;
    reason: z.ZodString;
    approval_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    target_user_id: string;
    amount_cents: number;
    approval_id?: string | undefined;
}, {
    reason: string;
    target_user_id: string;
    amount_cents: number;
    approval_id?: string | undefined;
}>;
export type AdjustWalletInput = z.infer<typeof AdjustWalletInputSchema>;
export declare const SoftDeleteUserSchema: z.ZodObject<{
    targetUserId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    targetUserId: string;
}, {
    reason: string;
    targetUserId: string;
}>;
export type SoftDeleteUserInput = z.infer<typeof SoftDeleteUserSchema>;
export declare const ExportCSVSchema: z.ZodObject<{
    event_type: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    payer_user_id: z.ZodOptional<z.ZodString>;
    payee_user_id: z.ZodOptional<z.ZodString>;
    entity_type: z.ZodOptional<z.ZodString>;
    entity_id: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: string | undefined;
    event_type?: string | undefined;
    payer_user_id?: string | undefined;
    payee_user_id?: string | undefined;
    entity_type?: string | undefined;
    entity_id?: string | undefined;
    limit?: number | undefined;
}, {
    status?: string | undefined;
    event_type?: string | undefined;
    payer_user_id?: string | undefined;
    payee_user_id?: string | undefined;
    entity_type?: string | undefined;
    entity_id?: string | undefined;
    limit?: number | undefined;
}>;
export type ExportCSVInput = z.infer<typeof ExportCSVSchema>;
export declare const TransactionDetailsSchema: z.ZodObject<{
    journalId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    journalId: string;
}, {
    journalId: string;
}>;
export type TransactionDetailsInput = z.infer<typeof TransactionDetailsSchema>;
export declare const UserLookupSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export type UserLookupInput = z.infer<typeof UserLookupSchema>;
export declare const EntityTraceSchema: z.ZodObject<{
    entityType: z.ZodString;
    entityId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    entityType: string;
    entityId: string;
}, {
    entityType: string;
    entityId: string;
}>;
export type EntityTraceInput = z.infer<typeof EntityTraceSchema>;
export declare const TransactionFiltersSchema: z.ZodObject<{
    event_type: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    payer_user_id: z.ZodOptional<z.ZodString>;
    payee_user_id: z.ZodOptional<z.ZodString>;
    entity_type: z.ZodOptional<z.ZodString>;
    entity_id: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: string | undefined;
    event_type?: string | undefined;
    payer_user_id?: string | undefined;
    payee_user_id?: string | undefined;
    entity_type?: string | undefined;
    entity_id?: string | undefined;
    limit?: number | undefined;
}, {
    status?: string | undefined;
    event_type?: string | undefined;
    payer_user_id?: string | undefined;
    payee_user_id?: string | undefined;
    entity_type?: string | undefined;
    entity_id?: string | undefined;
    limit?: number | undefined;
}>;
/** Query params for GET /finance/transactions (list). Validates limit + cursor + filters. */
export declare const TransactionListQuerySchema: z.ZodObject<{
    event_type: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    payer_user_id: z.ZodOptional<z.ZodString>;
    payee_user_id: z.ZodOptional<z.ZodString>;
    entity_type: z.ZodOptional<z.ZodString>;
    entity_id: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
    cursor_created_at: z.ZodOptional<z.ZodString>;
    cursor_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: string | undefined;
    event_type?: string | undefined;
    payer_user_id?: string | undefined;
    payee_user_id?: string | undefined;
    entity_type?: string | undefined;
    entity_id?: string | undefined;
    limit?: number | undefined;
    cursor_created_at?: string | undefined;
    cursor_id?: string | undefined;
}, {
    status?: string | undefined;
    event_type?: string | undefined;
    payer_user_id?: string | undefined;
    payee_user_id?: string | undefined;
    entity_type?: string | undefined;
    entity_id?: string | undefined;
    limit?: number | undefined;
    cursor_created_at?: string | undefined;
    cursor_id?: string | undefined;
}>;
export type TransactionListQuery = z.infer<typeof TransactionListQuerySchema>;
export type FinanceRole = 'support' | 'moderator' | 'admin' | 'super_admin';
export declare const FINANCE_READ_ROLES: FinanceRole[];
export declare const FINANCE_WRITE_ROLES: FinanceRole[];
export declare const FINANCE_SUPERADMIN_ROLES: FinanceRole[];
export declare const JournalLedgerEntrySchema: z.ZodObject<{
    journal_id: z.ZodString;
    created_at: z.ZodString;
    event_type: z.ZodString;
    status: z.ZodString;
    related_entity_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    related_entity_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    entity_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    entity_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    payer_user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    payee_user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    gross_amount: z.ZodNumber;
    fee_amount: z.ZodNumber;
    net_amount: z.ZodNumber;
    initiator_user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    meta_masked: z.ZodOptional<z.ZodAny>;
    meta_full: z.ZodOptional<z.ZodAny>;
    escrow_delta_iqd: z.ZodOptional<z.ZodNumber>;
    user_available_delta_iqd: z.ZodOptional<z.ZodNumber>;
    freelancer_payables_available_delta_iqd: z.ZodOptional<z.ZodNumber>;
    pending_payouts_delta_iqd: z.ZodOptional<z.ZodNumber>;
    platform_revenue_delta_iqd: z.ZodOptional<z.ZodNumber>;
    platform_cash_delta_iqd: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: string;
    created_at: string;
    event_type: string;
    journal_id: string;
    gross_amount: number;
    fee_amount: number;
    net_amount: number;
    payer_user_id?: string | null | undefined;
    payee_user_id?: string | null | undefined;
    entity_type?: string | null | undefined;
    entity_id?: string | null | undefined;
    related_entity_type?: string | null | undefined;
    related_entity_id?: string | null | undefined;
    initiator_user_id?: string | null | undefined;
    meta_masked?: any;
    meta_full?: any;
    escrow_delta_iqd?: number | undefined;
    user_available_delta_iqd?: number | undefined;
    freelancer_payables_available_delta_iqd?: number | undefined;
    pending_payouts_delta_iqd?: number | undefined;
    platform_revenue_delta_iqd?: number | undefined;
    platform_cash_delta_iqd?: number | undefined;
}, {
    status: string;
    created_at: string;
    event_type: string;
    journal_id: string;
    gross_amount: number;
    fee_amount: number;
    net_amount: number;
    payer_user_id?: string | null | undefined;
    payee_user_id?: string | null | undefined;
    entity_type?: string | null | undefined;
    entity_id?: string | null | undefined;
    related_entity_type?: string | null | undefined;
    related_entity_id?: string | null | undefined;
    initiator_user_id?: string | null | undefined;
    meta_masked?: any;
    meta_full?: any;
    escrow_delta_iqd?: number | undefined;
    user_available_delta_iqd?: number | undefined;
    freelancer_payables_available_delta_iqd?: number | undefined;
    pending_payouts_delta_iqd?: number | undefined;
    platform_revenue_delta_iqd?: number | undefined;
    platform_cash_delta_iqd?: number | undefined;
}>;
export type JournalLedgerEntry = z.infer<typeof JournalLedgerEntrySchema>;
export declare const WithdrawalRequestSchema: z.ZodObject<{
    id: z.ZodString;
    user_id: z.ZodString;
    status: z.ZodEnum<["requested", "processing", "completed", "failed"]>;
    amount: z.ZodNumber;
    currency: z.ZodString;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "requested" | "processing" | "completed" | "failed";
    id: string;
    created_at: string;
    user_id: string;
    amount: number;
    currency: string;
}, {
    status: "requested" | "processing" | "completed" | "failed";
    id: string;
    created_at: string;
    user_id: string;
    amount: number;
    currency: string;
}>;
export type WithdrawalRequest = z.infer<typeof WithdrawalRequestSchema>;
/** Wallet summary from vw_wallet_balances_user (PAGE 12 user lookup). */
export declare const WalletSummarySchema: z.ZodObject<{
    available_balance: z.ZodNumber;
    held_balance: z.ZodNumber;
    pending_withdrawal_balance: z.ZodNumber;
    freelancer_payables_balance: z.ZodOptional<z.ZodNumber>;
    other_wallet_liabilities_balance: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodString;
    is_wallet_frozen: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    currency: string;
    available_balance: number;
    held_balance: number;
    pending_withdrawal_balance: number;
    freelancer_payables_balance?: number | undefined;
    other_wallet_liabilities_balance?: number | undefined;
    is_wallet_frozen?: boolean | undefined;
}, {
    currency: string;
    available_balance: number;
    held_balance: number;
    pending_withdrawal_balance: number;
    freelancer_payables_balance?: number | undefined;
    other_wallet_liabilities_balance?: number | undefined;
    is_wallet_frozen?: boolean | undefined;
}>;
export type WalletSummary = z.infer<typeof WalletSummarySchema>;
export declare const UserHeldFundsSummarySchema: z.ZodObject<{
    held_in_escrow: z.ZodNumber;
    total_wallet_balances: z.ZodNumber;
    total_owed_to_users: z.ZodNumber;
    freelancer_payables_available: z.ZodNumber;
    pending_payouts: z.ZodNumber;
    freelancer_payables_total: z.ZodNumber;
    total_user_wallet_liabilities: z.ZodNumber;
    other_user_wallet_liabilities: z.ZodNumber;
    total_platform_obligations: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    held_in_escrow: number;
    total_wallet_balances: number;
    total_owed_to_users: number;
    freelancer_payables_available: number;
    pending_payouts: number;
    freelancer_payables_total: number;
    total_user_wallet_liabilities: number;
    other_user_wallet_liabilities: number;
    total_platform_obligations: number;
}, {
    held_in_escrow: number;
    total_wallet_balances: number;
    total_owed_to_users: number;
    freelancer_payables_available: number;
    pending_payouts: number;
    freelancer_payables_total: number;
    total_user_wallet_liabilities: number;
    other_user_wallet_liabilities: number;
    total_platform_obligations: number;
}>;
export type UserHeldFundsSummary = z.infer<typeof UserHeldFundsSummarySchema>;
export declare const CompanyFundsSummarySchema: z.ZodObject<{
    total_fee_revenue: z.ZodNumber;
    net_platform_earnings: z.ZodNumber;
    actual_company_owned_balance: z.ZodNumber;
    platform_revenue: z.ZodNumber;
    actual_company_owned_cash: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total_fee_revenue: number;
    net_platform_earnings: number;
    actual_company_owned_balance: number;
    platform_revenue: number;
    actual_company_owned_cash: number;
}, {
    total_fee_revenue: number;
    net_platform_earnings: number;
    actual_company_owned_balance: number;
    platform_revenue: number;
    actual_company_owned_cash: number;
}>;
export type CompanyFundsSummary = z.infer<typeof CompanyFundsSummarySchema>;
export declare const FinanceReconciliationSummarySchema: z.ZodObject<{
    gap_to_platform_revenue: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    gap_to_platform_revenue: number;
}, {
    gap_to_platform_revenue: number;
}>;
export type FinanceReconciliationSummary = z.infer<typeof FinanceReconciliationSummarySchema>;
export declare const FinanceMetricsSummarySchema: z.ZodObject<{
    platform_cash_position: z.ZodNumber;
    userFunds: z.ZodObject<{
        held_in_escrow: z.ZodNumber;
        total_wallet_balances: z.ZodNumber;
        total_owed_to_users: z.ZodNumber;
        freelancer_payables_available: z.ZodNumber;
        pending_payouts: z.ZodNumber;
        freelancer_payables_total: z.ZodNumber;
        total_user_wallet_liabilities: z.ZodNumber;
        other_user_wallet_liabilities: z.ZodNumber;
        total_platform_obligations: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        held_in_escrow: number;
        total_wallet_balances: number;
        total_owed_to_users: number;
        freelancer_payables_available: number;
        pending_payouts: number;
        freelancer_payables_total: number;
        total_user_wallet_liabilities: number;
        other_user_wallet_liabilities: number;
        total_platform_obligations: number;
    }, {
        held_in_escrow: number;
        total_wallet_balances: number;
        total_owed_to_users: number;
        freelancer_payables_available: number;
        pending_payouts: number;
        freelancer_payables_total: number;
        total_user_wallet_liabilities: number;
        other_user_wallet_liabilities: number;
        total_platform_obligations: number;
    }>;
    companyFunds: z.ZodObject<{
        total_fee_revenue: z.ZodNumber;
        net_platform_earnings: z.ZodNumber;
        actual_company_owned_balance: z.ZodNumber;
        platform_revenue: z.ZodNumber;
        actual_company_owned_cash: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total_fee_revenue: number;
        net_platform_earnings: number;
        actual_company_owned_balance: number;
        platform_revenue: number;
        actual_company_owned_cash: number;
    }, {
        total_fee_revenue: number;
        net_platform_earnings: number;
        actual_company_owned_balance: number;
        platform_revenue: number;
        actual_company_owned_cash: number;
    }>;
    reconciliation: z.ZodObject<{
        gap_to_platform_revenue: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        gap_to_platform_revenue: number;
    }, {
        gap_to_platform_revenue: number;
    }>;
}, "strip", z.ZodTypeAny, {
    platform_cash_position: number;
    userFunds: {
        held_in_escrow: number;
        total_wallet_balances: number;
        total_owed_to_users: number;
        freelancer_payables_available: number;
        pending_payouts: number;
        freelancer_payables_total: number;
        total_user_wallet_liabilities: number;
        other_user_wallet_liabilities: number;
        total_platform_obligations: number;
    };
    companyFunds: {
        total_fee_revenue: number;
        net_platform_earnings: number;
        actual_company_owned_balance: number;
        platform_revenue: number;
        actual_company_owned_cash: number;
    };
    reconciliation: {
        gap_to_platform_revenue: number;
    };
}, {
    platform_cash_position: number;
    userFunds: {
        held_in_escrow: number;
        total_wallet_balances: number;
        total_owed_to_users: number;
        freelancer_payables_available: number;
        pending_payouts: number;
        freelancer_payables_total: number;
        total_user_wallet_liabilities: number;
        other_user_wallet_liabilities: number;
        total_platform_obligations: number;
    };
    companyFunds: {
        total_fee_revenue: number;
        net_platform_earnings: number;
        actual_company_owned_balance: number;
        platform_revenue: number;
        actual_company_owned_cash: number;
    };
    reconciliation: {
        gap_to_platform_revenue: number;
    };
}>;
export type FinanceMetricsSummary = z.infer<typeof FinanceMetricsSummarySchema>;
/** Wallet activity row from vw_wallet_activity_user. Use this (not JournalLedgerEntry) for wallet activity; preserves spent semantics e.g. gateway_escrow. */
export declare const WalletActivityEntrySchema: z.ZodObject<{
    journal_entry_id: z.ZodString;
    created_at: z.ZodString;
    event_type: z.ZodString;
    amount_gross: z.ZodNumber;
    amount_net: z.ZodNumber;
    fee_amount: z.ZodNumber;
    currency: z.ZodString;
    related_entity_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    related_entity_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    counterparty_user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodString;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    created_at: string;
    event_type: string;
    fee_amount: number;
    currency: string;
    journal_entry_id: string;
    amount_gross: number;
    amount_net: number;
    related_entity_type?: string | null | undefined;
    related_entity_id?: string | null | undefined;
    user_id?: string | undefined;
    counterparty_user_id?: string | null | undefined;
}, {
    status: string;
    created_at: string;
    event_type: string;
    fee_amount: number;
    currency: string;
    journal_entry_id: string;
    amount_gross: number;
    amount_net: number;
    related_entity_type?: string | null | undefined;
    related_entity_id?: string | null | undefined;
    user_id?: string | undefined;
    counterparty_user_id?: string | null | undefined;
}>;
export type WalletActivityEntry = z.infer<typeof WalletActivityEntrySchema>;
export declare const WORKFLOW_BUCKETS: readonly ["delivered_awaiting_client", "disputed_money", "stuck_direct_offer", "held_funds", "withdrawals_pending"];
export type WorkflowBucket = (typeof WORKFLOW_BUCKETS)[number];
export declare const FinanceWorkflowOverviewSchema: z.ZodObject<{
    platform_cash: z.ZodNumber;
    escrow_held: z.ZodNumber;
    delivered_awaiting_count: z.ZodOptional<z.ZodNumber>;
    disputed_count: z.ZodOptional<z.ZodNumber>;
    stuck_direct_offer_count: z.ZodOptional<z.ZodNumber>;
    pending_withdrawals_count: z.ZodOptional<z.ZodNumber>;
    /** True when counts are stub (not yet from real queries). */
    stub: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    platform_cash: number;
    escrow_held: number;
    delivered_awaiting_count?: number | undefined;
    disputed_count?: number | undefined;
    stuck_direct_offer_count?: number | undefined;
    pending_withdrawals_count?: number | undefined;
    stub?: boolean | undefined;
}, {
    platform_cash: number;
    escrow_held: number;
    delivered_awaiting_count?: number | undefined;
    disputed_count?: number | undefined;
    stuck_direct_offer_count?: number | undefined;
    pending_withdrawals_count?: number | undefined;
    stub?: boolean | undefined;
}>;
export type FinanceWorkflowOverview = z.infer<typeof FinanceWorkflowOverviewSchema>;
export declare const FinanceWorkflowCaseSchema: z.ZodObject<{
    entityType: z.ZodString;
    entityId: z.ZodString;
    bucket: z.ZodEnum<["delivered_awaiting_client", "disputed_money", "stuck_direct_offer", "held_funds", "withdrawals_pending"]>;
    summary: z.ZodOptional<z.ZodString>;
    amount_cents: z.ZodOptional<z.ZodNumber>;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    entityType: string;
    entityId: string;
    bucket: "delivered_awaiting_client" | "disputed_money" | "stuck_direct_offer" | "held_funds" | "withdrawals_pending";
    created_at?: string | undefined;
    amount_cents?: number | undefined;
    summary?: string | undefined;
}, {
    entityType: string;
    entityId: string;
    bucket: "delivered_awaiting_client" | "disputed_money" | "stuck_direct_offer" | "held_funds" | "withdrawals_pending";
    created_at?: string | undefined;
    amount_cents?: number | undefined;
    summary?: string | undefined;
}>;
export type FinanceWorkflowCase = z.infer<typeof FinanceWorkflowCaseSchema>;
export declare const FinanceWorkflowCaseDetailSchema: z.ZodObject<{
    entityType: z.ZodString;
    entityId: z.ZodString;
    bucket: z.ZodEnum<["delivered_awaiting_client", "disputed_money", "stuck_direct_offer", "held_funds", "withdrawals_pending"]>;
    state: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    journal_links: z.ZodOptional<z.ZodArray<z.ZodObject<{
        journal_id: z.ZodString;
        event_type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        event_type: string;
        journal_id: string;
    }, {
        event_type: string;
        journal_id: string;
    }>, "many">>;
    payer_user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    payee_user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    available_actions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    entityType: string;
    entityId: string;
    bucket: "delivered_awaiting_client" | "disputed_money" | "stuck_direct_offer" | "held_funds" | "withdrawals_pending";
    payer_user_id?: string | null | undefined;
    payee_user_id?: string | null | undefined;
    state?: Record<string, unknown> | undefined;
    journal_links?: {
        event_type: string;
        journal_id: string;
    }[] | undefined;
    available_actions?: string[] | undefined;
}, {
    entityType: string;
    entityId: string;
    bucket: "delivered_awaiting_client" | "disputed_money" | "stuck_direct_offer" | "held_funds" | "withdrawals_pending";
    payer_user_id?: string | null | undefined;
    payee_user_id?: string | null | undefined;
    state?: Record<string, unknown> | undefined;
    journal_links?: {
        event_type: string;
        journal_id: string;
    }[] | undefined;
    available_actions?: string[] | undefined;
}>;
export type FinanceWorkflowCaseDetail = z.infer<typeof FinanceWorkflowCaseDetailSchema>;
/** GET /api/v1/finance/fee-settings response. */
export declare const PlatformFeeSettingsSchema: z.ZodObject<{
    fee_rate_default_bps: z.ZodNumber;
    max_fee_rate_bps: z.ZodNumber;
    updated_at: z.ZodString;
    updated_by: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    updated_at: string;
    fee_rate_default_bps: number;
    max_fee_rate_bps: number;
    updated_by?: string | null | undefined;
}, {
    updated_at: string;
    fee_rate_default_bps: number;
    max_fee_rate_bps: number;
    updated_by?: string | null | undefined;
}>;
export type PlatformFeeSettings = z.infer<typeof PlatformFeeSettingsSchema>;
/** PATCH /api/v1/finance/fee-settings body; reason required. */
export declare const UpdatePlatformFeeSettingsBodySchema: z.ZodObject<{
    fee_rate_default_bps: z.ZodNumber;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    fee_rate_default_bps: number;
}, {
    reason: string;
    fee_rate_default_bps: number;
}>;
export type UpdatePlatformFeeSettingsBody = z.infer<typeof UpdatePlatformFeeSettingsBodySchema>;
