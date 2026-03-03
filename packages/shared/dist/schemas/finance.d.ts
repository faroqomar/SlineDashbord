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
export type FinanceRole = 'support' | 'moderator' | 'admin' | 'super_admin';
export declare const FINANCE_READ_ROLES: FinanceRole[];
export declare const FINANCE_WRITE_ROLES: FinanceRole[];
export declare const FINANCE_SUPERADMIN_ROLES: FinanceRole[];
export declare const JournalLedgerEntrySchema: z.ZodObject<{
    journal_id: z.ZodString;
    created_at: z.ZodString;
    event_type: z.ZodString;
    status: z.ZodString;
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
    initiator_user_id?: string | null | undefined;
    meta_masked?: any;
    meta_full?: any;
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
    initiator_user_id?: string | null | undefined;
    meta_masked?: any;
    meta_full?: any;
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
    currency: z.ZodString;
    is_wallet_frozen: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    currency: string;
    available_balance: number;
    held_balance: number;
    pending_withdrawal_balance: number;
    is_wallet_frozen?: boolean | undefined;
}, {
    currency: string;
    available_balance: number;
    held_balance: number;
    pending_withdrawal_balance: number;
    is_wallet_frozen?: boolean | undefined;
}>;
export type WalletSummary = z.infer<typeof WalletSummarySchema>;
