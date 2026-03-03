import { describe, it, expect } from 'vitest';
import {
  UserInvestigationResponseSchema,
  UserConversationsResponseSchema,
  EvidencePackExportQuerySchema,
  ReportsStubSchema,
} from './investigation.js';
import { RevealPiiInputSchema } from './users.js';

const validUuid = '00000000-0000-0000-0000-000000000001';

describe('investigation schemas (PAGE 15)', () => {
  describe('UserInvestigationResponseSchema', () => {
    it('accepts minimal valid response with masked profile', () => {
      const r = UserInvestigationResponseSchema.safeParse({
        profile: { id: validUuid },
        tasks: [],
        offers: [],
        bookings: [],
        disputes: [],
        ledgerActivity: [],
        reportsStub: { count: 0 },
        conversationsSummary: [],
      });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.profile.id).toBe(validUuid);
        expect(r.data.tasks).toEqual([]);
      }
    });
    it('accepts with optional arrays populated', () => {
      const r = UserInvestigationResponseSchema.safeParse({
        profile: { id: validUuid, full_name: 'Test', email: '[MASKED]' },
        tasks: [{ id: validUuid, title: 'T1', status: 'open' }],
        offers: [],
        bookings: [],
        disputes: [],
        ledgerActivity: [],
        reportsStub: { count: 2, linkToReports: '/reports' },
        conversationsSummary: [{ threadId: validUuid }],
      });
      expect(r.success).toBe(true);
    });
  });

  describe('UserConversationsResponseSchema', () => {
    it('accepts empty conversations', () => {
      const r = UserConversationsResponseSchema.safeParse({ conversations: [] });
      expect(r.success).toBe(true);
    });
    it('accepts with nextCursor', () => {
      const r = UserConversationsResponseSchema.safeParse({
        conversations: [{ threadId: validUuid }],
        nextCursor: 'cursor-1',
      });
      expect(r.success).toBe(true);
    });
  });

  describe('EvidencePackExportQuerySchema', () => {
    it('defaults format to json and limit to 5000', () => {
      const r = EvidencePackExportQuerySchema.safeParse({});
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.format).toBe('json');
        expect(r.data.limit).toBe(5000);
      }
    });
    it('accepts format csv and limit 100', () => {
      const r = EvidencePackExportQuerySchema.safeParse({ format: 'csv', limit: 100 });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.format).toBe('csv');
        expect(r.data.limit).toBe(100);
      }
    });
    it('rejects limit above 10000', () => {
      expect(EvidencePackExportQuerySchema.safeParse({ limit: 15000 }).success).toBe(false);
    });
  });

  describe('RevealPiiInputSchema', () => {
    it('accepts reason only', () => {
      const r = RevealPiiInputSchema.safeParse({ reason: 'Investigation case 123' });
      expect(r.success).toBe(true);
    });
    it('accepts reason and case_id', () => {
      const r = RevealPiiInputSchema.safeParse({
        reason: 'Case review',
        case_id: validUuid,
      });
      expect(r.success).toBe(true);
    });
    it('rejects empty reason', () => {
      expect(RevealPiiInputSchema.safeParse({ reason: '' }).success).toBe(false);
    });
  });
});
