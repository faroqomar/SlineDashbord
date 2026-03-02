import { describe, it, expect } from 'vitest';
import {
  AdminCaseCreateInputSchema,
  AdminCaseAttachEntityInputSchema,
  AdminCaseSchema,
  CaseEntityTypeSchema,
} from './cases.js';

const validUuid = '00000000-0000-0000-0000-000000000001';

describe('cases schemas (PAGE 08 contracts)', () => {
  describe('AdminCaseCreateInputSchema', () => {
    it('accepts valid subject and optional fields', () => {
      const r = AdminCaseCreateInputSchema.safeParse({ subject: 'User report #1' });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.source).toBe('dashboard');
        expect(r.data.priority).toBe('medium');
      }
    });
    it('accepts full input with idempotency_key', () => {
      const r = AdminCaseCreateInputSchema.safeParse({
        subject: 'Dispute escalation',
        source: 'support_ticket',
        priority: 'high',
        assignee_id: validUuid,
        idempotency_key: validUuid,
      });
      expect(r.success).toBe(true);
    });
    it('rejects empty subject', () => {
      expect(AdminCaseCreateInputSchema.safeParse({ subject: '' }).success).toBe(false);
    });
    it('rejects missing subject', () => {
      expect(AdminCaseCreateInputSchema.safeParse({}).success).toBe(false);
    });
    it('rejects invalid assignee_id', () => {
      expect(
        AdminCaseCreateInputSchema.safeParse({ subject: 'x', assignee_id: 'not-uuid' }).success
      ).toBe(false);
    });
  });

  describe('AdminCaseAttachEntityInputSchema', () => {
    it('accepts valid entity_type and entity_id', () => {
      const r = AdminCaseAttachEntityInputSchema.safeParse({
        entity_type: 'task',
        entity_id: validUuid,
      });
      expect(r.success).toBe(true);
    });
    it('accepts all entity types', () => {
      for (const t of CaseEntityTypeSchema.options) {
        const r = AdminCaseAttachEntityInputSchema.safeParse({
          entity_type: t,
          entity_id: validUuid,
        });
        expect(r.success).toBe(true);
      }
    });
    it('rejects invalid entity_type', () => {
      expect(
        AdminCaseAttachEntityInputSchema.safeParse({
          entity_type: 'invalid',
          entity_id: validUuid,
        }).success
      ).toBe(false);
    });
    it('rejects invalid entity_id', () => {
      expect(
        AdminCaseAttachEntityInputSchema.safeParse({
          entity_type: 'task',
          entity_id: 'not-uuid',
        }).success
      ).toBe(false);
    });
  });

  describe('AdminCaseSchema', () => {
    it('parses API response shape', () => {
      const r = AdminCaseSchema.safeParse({
        id: validUuid,
        subject: 'Test case',
        source: 'dashboard',
        status: 'open',
        priority: 'medium',
        created_at: '2025-01-01T00:00:00Z',
      });
      expect(r.success).toBe(true);
    });
  });
});
