import { z } from 'zod';
/** Canonical profile account status for moderation (marketplace users). */
export declare const AccountStatusEnum: z.ZodEnum<["active", "suspended", "banned"]>;
export type AccountStatus = z.infer<typeof AccountStatusEnum>;
/** Optional restriction scope for partial restrictions (e.g. posting only). */
export declare const RestrictionScopeEnum: z.ZodOptional<z.ZodEnum<["full", "posting"]>>;
export type RestrictionScope = z.infer<typeof RestrictionScopeEnum>;
export declare const GetUsersSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    query: z.ZodDefault<z.ZodString>;
    role: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    query: string;
    role: string;
}, {
    page?: number | undefined;
    query?: string | undefined;
    role?: string | undefined;
}>;
export declare const GetUserDetailsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
/** API body for suspend: userId from route, reason + duration in body. */
export declare const SuspendUserSchema: z.ZodObject<{
    userId: z.ZodString;
    reason: z.ZodString;
    duration: z.ZodDefault<z.ZodEnum<["24h", "30d", "permanent"]>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    reason: string;
    duration: "24h" | "30d" | "permanent";
}, {
    userId: string;
    reason: string;
    duration?: "24h" | "30d" | "permanent" | undefined;
}>;
export declare const BanUserSchema: z.ZodObject<{
    userId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    reason: string;
}, {
    userId: string;
    reason: string;
}>;
export declare const UnbanUserSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export declare const VerifyUserSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
/** Request for POST /users/:userId/force-logout. userId from path; body may include reason and idempotency_key. */
export declare const ForceLogoutInputSchema: z.ZodObject<{
    userId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    idempotency_key: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    reason?: string | undefined;
    idempotency_key?: string | undefined;
}, {
    userId: string;
    reason?: string | undefined;
    idempotency_key?: string | undefined;
}>;
export type ForceLogoutInput = z.infer<typeof ForceLogoutInputSchema>;
export declare const USERS_READ_ROLES: string[];
export declare const USERS_WRITE_ROLES: string[];
/** Profile summary with PII masked (e.g. email/phone redacted). */
export declare const UserSummaryMaskedSchema: z.ZodObject<{
    id: z.ZodString;
    full_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatar_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    account_status: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodLiteral<"[MASKED]">>;
    phone: z.ZodOptional<z.ZodLiteral<"[MASKED]">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    full_name?: string | null | undefined;
    avatar_url?: string | null | undefined;
    account_status?: string | undefined;
    created_at?: string | undefined;
    email?: "[MASKED]" | undefined;
    phone?: "[MASKED]" | undefined;
}, {
    id: string;
    full_name?: string | null | undefined;
    avatar_url?: string | null | undefined;
    account_status?: string | undefined;
    created_at?: string | undefined;
    email?: "[MASKED]" | undefined;
    phone?: "[MASKED]" | undefined;
}>;
export type UserSummaryMasked = z.infer<typeof UserSummaryMaskedSchema>;
/** User detail with PII masked (for investigation default view). */
export declare const UserDetailMaskedSchema: z.ZodObject<{
    id: z.ZodString;
    full_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatar_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    account_status: z.ZodOptional<z.ZodString>;
    moderation_reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    moderated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodLiteral<"[MASKED]">>;
    phone: z.ZodOptional<z.ZodLiteral<"[MASKED]">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    full_name?: string | null | undefined;
    avatar_url?: string | null | undefined;
    account_status?: string | undefined;
    created_at?: string | undefined;
    email?: "[MASKED]" | undefined;
    phone?: "[MASKED]" | undefined;
    moderation_reason?: string | null | undefined;
    moderated_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}, {
    id: string;
    full_name?: string | null | undefined;
    avatar_url?: string | null | undefined;
    account_status?: string | undefined;
    created_at?: string | undefined;
    email?: "[MASKED]" | undefined;
    phone?: "[MASKED]" | undefined;
    moderation_reason?: string | null | undefined;
    moderated_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}>;
export type UserDetailMasked = z.infer<typeof UserDetailMaskedSchema>;
/** User detail with PII revealed (only after POST reveal-pii, logged in admin_pii_access_logs). */
export declare const UserDetailRevealedSchema: z.ZodObject<{
    id: z.ZodString;
    full_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatar_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    account_status: z.ZodOptional<z.ZodString>;
    moderation_reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    moderated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    full_name?: string | null | undefined;
    avatar_url?: string | null | undefined;
    account_status?: string | undefined;
    created_at?: string | undefined;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    moderation_reason?: string | null | undefined;
    moderated_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}, {
    id: string;
    full_name?: string | null | undefined;
    avatar_url?: string | null | undefined;
    account_status?: string | undefined;
    created_at?: string | undefined;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    moderation_reason?: string | null | undefined;
    moderated_at?: string | null | undefined;
    updated_at?: string | null | undefined;
}>;
export type UserDetailRevealed = z.infer<typeof UserDetailRevealedSchema>;
/** Request body for POST /api/v1/users/:userId/reveal-pii. */
export declare const RevealPiiInputSchema: z.ZodObject<{
    reason: z.ZodString;
    case_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    case_id?: string | undefined;
}, {
    reason: string;
    case_id?: string | undefined;
}>;
export type RevealPiiInput = z.infer<typeof RevealPiiInputSchema>;
