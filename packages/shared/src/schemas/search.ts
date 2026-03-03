import { z } from 'zod';

const uuid = z.string().uuid();

/** Entity types returned by global search (PAGE 11). */
export const AdminSearchEntityTypeEnum = z.enum([
  'user',
  'task',
  'booking',
  'dispute',
  'transaction',
]);
export type AdminSearchEntityType = z.infer<typeof AdminSearchEntityTypeEnum>;

/** Request: GET /api/v1/search query params. q min 2 chars, limit max 50. */
export const AdminGlobalSearchRequestSchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters').max(200, 'Query too long'),
  types: z.array(AdminSearchEntityTypeEnum).optional(),
  limit: z.number().int().positive().max(50).default(20),
});
export type AdminGlobalSearchRequest = z.infer<typeof AdminGlobalSearchRequestSchema>;

/** Parsed from query string (GET ?q=...&types=user,task&limit=20). */
export const AdminGlobalSearchQuerySchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters').max(200, 'Query too long'),
  types: z
    .string()
    .optional()
    .transform((s): AdminSearchEntityType[] | undefined => {
      if (!s?.trim()) return undefined;
      const arr = s.split(',').map((t) => t.trim()).filter(Boolean);
      return arr.length ? (arr as AdminSearchEntityType[]) : undefined;
    }),
  limit: z.coerce.number().int().positive().max(50).default(20),
}).refine(
  (d) =>
    !d.types ||
    d.types.every((t) => ['user', 'task', 'booking', 'dispute', 'transaction'].includes(t)),
  { message: 'Invalid types' }
);

/** Single result item: user. */
export const AdminSearchUserItemSchema = z.object({
  entityType: z.literal('user'),
  id: uuid,
  title: z.string(),
  subtitle: z.string().optional(),
  link: z.string(),
});
export type AdminSearchUserItem = z.infer<typeof AdminSearchUserItemSchema>;

/** Single result item: task. */
export const AdminSearchTaskItemSchema = z.object({
  entityType: z.literal('task'),
  id: uuid,
  title: z.string(),
  subtitle: z.string().optional(),
  link: z.string(),
});
export type AdminSearchTaskItem = z.infer<typeof AdminSearchTaskItemSchema>;

/** Single result item: booking. */
export const AdminSearchBookingItemSchema = z.object({
  entityType: z.literal('booking'),
  id: uuid,
  title: z.string(),
  subtitle: z.string().optional(),
  link: z.string(),
});
export type AdminSearchBookingItem = z.infer<typeof AdminSearchBookingItemSchema>;

/** Single result item: dispute. */
export const AdminSearchDisputeItemSchema = z.object({
  entityType: z.literal('dispute'),
  id: uuid,
  title: z.string(),
  subtitle: z.string().optional(),
  link: z.string(),
});
export type AdminSearchDisputeItem = z.infer<typeof AdminSearchDisputeItemSchema>;

/** Single result item: transaction (journal). */
export const AdminSearchTransactionItemSchema = z.object({
  entityType: z.literal('transaction'),
  id: uuid,
  title: z.string(),
  subtitle: z.string().optional(),
  link: z.string(),
});
export type AdminSearchTransactionItem = z.infer<typeof AdminSearchTransactionItemSchema>;

/** Discriminated union of all search result items. */
export const AdminGlobalSearchResultItemSchema = z.discriminatedUnion('entityType', [
  AdminSearchUserItemSchema,
  AdminSearchTaskItemSchema,
  AdminSearchBookingItemSchema,
  AdminSearchDisputeItemSchema,
  AdminSearchTransactionItemSchema,
]);
export type AdminGlobalSearchResultItem = z.infer<typeof AdminGlobalSearchResultItemSchema>;

/** Response: GET /api/v1/search. */
export const AdminGlobalSearchResultSchema = z.object({
  items: z.array(AdminGlobalSearchResultItemSchema),
});
export type AdminGlobalSearchResult = z.infer<typeof AdminGlobalSearchResultSchema>;
