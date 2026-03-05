import { z } from 'zod';

/** Canonical profile account status for moderation (marketplace users). */
export const AccountStatusEnum = z.enum(['active', 'suspended', 'banned']);
export type AccountStatus = z.infer<typeof AccountStatusEnum>;

/** Optional restriction scope for partial restrictions (e.g. posting only). */
export const RestrictionScopeEnum = z.enum(['full', 'posting']).optional();
export type RestrictionScope = z.infer<typeof RestrictionScopeEnum>;

export const GetUsersSchema = z.object({
  page: z.number().int().positive().default(1),
  query: z.string().default(''),
  role: z.string().default('all'),
  statusTab: z.enum(['all', 'active', 'inactive']).default('all'),
});
export type UsersStatusTab = z.infer<typeof GetUsersSchema>['statusTab'];

/** KPI aggregates used by Users page cards. */
export const UsersKpiCountsSchema = z.object({
  activeUsers: z.number().int().nonnegative(),
  inactiveUsers: z.number().int().nonnegative(),
  joinedThisMonth: z.number().int().nonnegative(),
});
export type UsersKpiCounts = z.infer<typeof UsersKpiCountsSchema>;

/** Global counts used by Users status tabs. */
export const UsersTabCountsSchema = z.object({
  all: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  inactive: z.number().int().nonnegative(),
});
export type UsersTabCounts = z.infer<typeof UsersTabCountsSchema>;

/** Response shape for GET /users list endpoint. */
export const GetUsersResultSchema = z.object({
  users: z.array(z.unknown()),
  totalUsers: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  kpiCounts: UsersKpiCountsSchema,
  tabCounts: UsersTabCountsSchema,
});
export type GetUsersResult = z.infer<typeof GetUsersResultSchema>;

export const GetUserDetailsSchema = z.object({
  id: z.string().uuid("Invalid User ID"),
});

/** API body for suspend: userId from route, reason + duration in body. */
export const SuspendUserSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
  reason: z.string().min(5, "Reason must be at least 5 characters").max(500, "Reason is too long"),
  duration: z.enum(['24h', '30d', 'permanent']).default('24h'),
});

export const BanUserSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
  reason: z.string().min(5, "Reason must be at least 5 characters").max(500, "Reason is too long"),
});

export const UnbanUserSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
});

export const VerifyUserSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
});

/** Request for POST /users/:userId/force-logout. userId from path; body may include reason and idempotency_key. */
export const ForceLogoutInputSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
  reason: z.string().max(500).optional(),
  idempotency_key: z.string().optional(),
});
export type ForceLogoutInput = z.infer<typeof ForceLogoutInputSchema>;

// Role Access Control Definitions
export const USERS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const USERS_WRITE_ROLES = ['admin', 'super_admin'];

// --- PAGE 15: Investigation / PII masking ---

/** Profile summary with PII masked (e.g. email/phone redacted). */
export const UserSummaryMaskedSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  account_status: z.string().optional(),
  created_at: z.string().optional(),
  email: z.literal('[MASKED]').optional(),
  phone: z.literal('[MASKED]').optional(),
});
export type UserSummaryMasked = z.infer<typeof UserSummaryMaskedSchema>;

/** User detail with PII masked (for investigation default view). */
export const UserDetailMaskedSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  account_status: z.string().optional(),
  moderation_reason: z.string().nullable().optional(),
  moderated_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().nullable().optional(),
  email: z.literal('[MASKED]').optional(),
  phone: z.literal('[MASKED]').optional(),
});
export type UserDetailMasked = z.infer<typeof UserDetailMaskedSchema>;

/** User detail with PII revealed (only after POST reveal-pii, logged in admin_pii_access_logs). */
export const UserDetailRevealedSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  account_status: z.string().optional(),
  moderation_reason: z.string().nullable().optional(),
  moderated_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});
export type UserDetailRevealed = z.infer<typeof UserDetailRevealedSchema>;

/** Request body for POST /api/v1/users/:userId/reveal-pii. */
export const RevealPiiInputSchema = z.object({
  reason: z.string().min(1).max(500),
  case_id: z.string().uuid().optional(),
});
export type RevealPiiInput = z.infer<typeof RevealPiiInputSchema>;
