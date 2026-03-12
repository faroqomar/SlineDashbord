/**
 * Dispute feature types: use shared canonical schemas.
 * List row matches API response (DisputeQueueRow + derived fields).
 */
import type { DisputeQueueRow, DisputeDetail, DisputeStatus } from '@sline/shared';

export type { DisputeQueueRow, DisputeDetail, DisputeStatus };

/** List row as returned by API (shared DisputeQueueRow + server-derived fields) */
export type DisputeDTO = DisputeQueueRow & {
  amount?: number;
  category?: string;
  severity?: 'low' | 'med' | 'high' | 'crit';
  comments_count?: number;
};

export {
  GetDisputesSchema,
  UpdateDisputeStatusSchema,
  DisputeStatusEnum,
  DisputeTabCountsSchema,
  DisputeActionAvailabilitySchema,
  AdminAcceptDisputeInputSchema,
  AdminCancelDisputeInputSchema,
  AdminResolveDisputeInputSchema,
} from '@sline/shared';
