import { describe, expect, it } from 'vitest';
import {
  CreateDisputeInputSchema,
  DisputeStatusEnum,
  GetDisputesSchema,
  AdminCancelDisputeInputSchema,
  AdminResolveDisputeInputSchema,
  AdminResolveDisputeResultSchema,
  AdminAcceptDisputeInputSchema,
  DisputeTabCountsSchema,
  DisputeActionAvailabilitySchema,
  DisputeDetailSchema,
  DisputeQueueRowSchema,
} from './disputes.js';

const validUuidA = '00000000-0000-0000-0000-000000000001';
const validUuidB = '00000000-0000-0000-0000-000000000002';
const validUuidTask = '00000000-0000-0000-0000-000000000010';
const validDisputeId = '00000000-0000-0000-0000-000000000099';

describe('disputes schemas', () => {
  describe('DisputeStatusEnum', () => {
    it('accepts only open, active, resolved, canceled', () => {
      expect(DisputeStatusEnum.safeParse('open').success).toBe(true);
      expect(DisputeStatusEnum.safeParse('active').success).toBe(true);
      expect(DisputeStatusEnum.safeParse('resolved').success).toBe(true);
      expect(DisputeStatusEnum.safeParse('canceled').success).toBe(true);
      expect(DisputeStatusEnum.safeParse('in_progress').success).toBe(false);
      expect(DisputeStatusEnum.safeParse('escalated').success).toBe(false);
    });
  });

  describe('GetDisputesSchema', () => {
    it('accepts status all, open, active, resolved, canceled', () => {
      expect(GetDisputesSchema.safeParse({ page: 1, status: 'all', limit: 10 }).success).toBe(true);
      expect(GetDisputesSchema.safeParse({ page: 1, status: 'active', limit: 20 }).success).toBe(true);
      expect(GetDisputesSchema.safeParse({ page: 1, status: 'canceled' }).success).toBe(true);
    });
  });

  describe('CreateDisputeInputSchema', () => {
    it('accepts valid payload', () => {
      const result = CreateDisputeInputSchema.safeParse({
        task_id: validUuidTask,
        complainant_id: validUuidA,
        defendant_id: validUuidB,
        reason: 'Provider did not deliver the agreed work',
      });

      expect(result.success).toBe(true);
    });

    it('rejects same complainant and defendant', () => {
      const result = CreateDisputeInputSchema.safeParse({
        task_id: validUuidTask,
        complainant_id: validUuidA,
        defendant_id: validUuidA,
        reason: 'Users must be different',
      });

      expect(result.success).toBe(false);
    });

    it('rejects short reason', () => {
      const result = CreateDisputeInputSchema.safeParse({
        task_id: validUuidTask,
        complainant_id: validUuidA,
        defendant_id: validUuidB,
        reason: 'bad',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('AdminCancelDisputeInputSchema', () => {
    it('requires reason', () => {
      expect(AdminCancelDisputeInputSchema.safeParse({ dispute_id: validDisputeId, reason: 'Dismissed by admin' }).success).toBe(true);
      expect(AdminCancelDisputeInputSchema.safeParse({ dispute_id: validDisputeId }).success).toBe(false);
      expect(AdminCancelDisputeInputSchema.safeParse({ dispute_id: validDisputeId, reason: '' }).success).toBe(false);
    });
  });

  describe('AdminResolveDisputeInputSchema', () => {
    it('accepts refund and release outcomes', () => {
      expect(AdminResolveDisputeInputSchema.safeParse({
        dispute_id: validDisputeId,
        reason: 'Refund client',
        outcome: 'refund_client',
        booking_id: validUuidA,
      }).success).toBe(true);
      expect(AdminResolveDisputeInputSchema.safeParse({
        dispute_id: validDisputeId,
        reason: 'Refund client on tender',
        outcome: 'refund_client',
        task_request_id: validUuidB,
      }).success).toBe(true);
      expect(AdminResolveDisputeInputSchema.safeParse({
        dispute_id: validDisputeId,
        reason: 'Release freelancer',
        outcome: 'release_freelancer',
      }).success).toBe(true);
    });

    it('accepts split settlement with explicit amounts', () => {
      expect(AdminResolveDisputeInputSchema.safeParse({
        dispute_id: validDisputeId,
        reason: 'Split funds',
        outcome: 'split_settlement',
        client_refund_amount: 4000,
        freelancer_payout_amount: 5000,
      }).success).toBe(true);
    });

    it('rejects empty reason', () => {
      expect(AdminResolveDisputeInputSchema.safeParse({ dispute_id: validDisputeId, reason: '', outcome: 'refund_client' }).success).toBe(false);
    });

    it('rejects split settlement without explicit amounts', () => {
      expect(AdminResolveDisputeInputSchema.safeParse({
        dispute_id: validDisputeId,
        reason: 'Split funds',
        outcome: 'split_settlement',
      }).success).toBe(false);
    });

    it('rejects split amounts on non-split outcomes', () => {
      expect(AdminResolveDisputeInputSchema.safeParse({
        dispute_id: validDisputeId,
        reason: 'Refund client',
        outcome: 'refund_client',
        client_refund_amount: 1000,
      }).success).toBe(false);
    });

    it('rejects multiple settlement targets', () => {
      expect(AdminResolveDisputeInputSchema.safeParse({
        dispute_id: validDisputeId,
        reason: 'Refund client',
        outcome: 'refund_client',
        booking_id: validUuidA,
        task_request_id: validUuidB,
      }).success).toBe(false);
    });
  });

  describe('AdminAcceptDisputeInputSchema', () => {
    it('accepts dispute_id only', () => {
      expect(AdminAcceptDisputeInputSchema.safeParse({ dispute_id: validDisputeId }).success).toBe(true);
    });
  });

  describe('DisputeTabCountsSchema', () => {
    it('parses tab counts', () => {
      const result = DisputeTabCountsSchema.safeParse({ all: 10, open: 2, active: 3, resolved: 4, canceled: 1 });
      expect(result.success).toBe(true);
    });
  });

  describe('DisputeActionAvailabilitySchema', () => {
    it('parses action availability', () => {
      const result = DisputeActionAvailabilitySchema.safeParse({
        can_accept: true,
        can_cancel: true,
        can_resolve: false,
        requires_booking_id: false,
        supports_split_resolution: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('DisputeDetailSchema', () => {
    it('parses direct-offer settlement candidates', () => {
      const result = DisputeDetailSchema.safeParse({
        id: validDisputeId,
        task_id: null,
        direct_offer_id: validUuidA,
        status: 'active',
        reason: 'Split offer settlement',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        settlement_candidates: [{
          target_type: 'direct_offer',
          target_id: validUuidA,
          status: 'active',
          payment_status: 'held',
          client_id: validUuidB,
          provider_id: validUuidTask,
          amount_cents: 12000,
          fee_rate_bps: 1000,
        }],
      });

      expect(result.success).toBe(true);
    });
  });

  describe('DisputeQueueRowSchema', () => {
    it('parses minimal queue row', () => {
      const result = DisputeQueueRowSchema.safeParse({
        id: validDisputeId,
        task_id: validUuidTask,
        status: 'open',
        reason: 'Test',
        created_at: '2026-01-01T00:00:00Z',
        complainant: { id: validUuidA, full_name: 'A' },
        defendant: { id: validUuidB, full_name: 'B' },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('AdminResolveDisputeResultSchema', () => {
    it('parses settlement summary result', () => {
      const result = AdminResolveDisputeResultSchema.safeParse({
        dispute_id: validDisputeId,
        status: 'resolved',
        outcome: 'split_settlement',
        entity_type: 'task_request',
        entity_id: validUuidTask,
        task_request_id: validUuidA,
        journal_entry_ids: [validUuidA, validUuidB],
        fee_amount: 1000,
        client_refund_amount: 4000,
        freelancer_payout_amount: 5000,
        client_wallet_destination: 'available_balance',
        freelancer_wallet_destination: 'available_balance',
      });
      expect(result.success).toBe(true);
    });
  });
});
