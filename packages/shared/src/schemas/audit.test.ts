import { describe, it, expect } from 'vitest';
import {
  AuditActionEnum,
  AuditLogRowSchema,
  TaskActivityItemSchema,
  TaskActivityResponseSchema,
  MutationAckSchema,
} from './audit.js';

describe('audit schemas', () => {
  describe('AuditActionEnum', () => {
    it('accepts known actions', () => {
      expect(AuditActionEnum.safeParse('admin.team.invite').success).toBe(true);
      expect(AuditActionEnum.safeParse('admin.tasks.force_cancel').success).toBe(true);
    });
    it('rejects invalid strings', () => {
      expect(AuditActionEnum.safeParse('unknown.action').success).toBe(false);
    });
  });

  describe('AuditLogRowSchema', () => {
    it('parses valid canonical row', () => {
      const row = {
        actor_user_id: '00000000-0000-0000-0000-000000000001',
        action: 'admin.tasks.force_cancel',
        related_entity_type: 'task',
        related_entity_id: '00000000-0000-0000-0000-000000000002',
        meta: { reason: 'test' },
      };
      expect(AuditLogRowSchema.safeParse(row).success).toBe(true);
    });
    it('accepts nullable actor and entity', () => {
      const row = {
        actor_user_id: null,
        action: 'system.event',
        related_entity_type: null,
        related_entity_id: null,
        meta: {},
      };
      expect(AuditLogRowSchema.safeParse(row).success).toBe(true);
    });
    it('rejects invalid uuid', () => {
      const row = {
        actor_user_id: 'not-a-uuid',
        action: 'admin.team.invite',
        related_entity_type: 'admin_user',
        related_entity_id: null,
        meta: {},
      };
      expect(AuditLogRowSchema.safeParse(row).success).toBe(false);
    });
  });

  describe('TaskActivityItemSchema', () => {
    it('parses item with actor', () => {
      const item = {
        id: '00000000-0000-0000-0000-000000000001',
        actor_user_id: '00000000-0000-0000-0000-000000000002',
        actor: { id: '00000000-0000-0000-0000-000000000002', full_name: 'Admin', avatar_url: null },
        action: 'admin.tasks.force_cancel',
        related_entity_type: 'task',
        related_entity_id: '00000000-0000-0000-0000-000000000003',
        created_at: new Date().toISOString(),
        meta: { reason: 'test' },
      };
      expect(TaskActivityItemSchema.safeParse(item).success).toBe(true);
    });
    it('parses item without actor (system)', () => {
      const item = {
        id: '00000000-0000-0000-0000-000000000001',
        actor_user_id: null,
        action: 'admin.tasks.force_cancel',
        related_entity_type: 'task',
        related_entity_id: '00000000-0000-0000-0000-000000000003',
        created_at: new Date().toISOString(),
      };
      expect(TaskActivityItemSchema.safeParse(item).success).toBe(true);
    });
  });

  describe('TaskActivityResponseSchema', () => {
    it('parses empty array', () => {
      expect(TaskActivityResponseSchema.safeParse([]).success).toBe(true);
    });
  });

  describe('MutationAckSchema', () => {
    it('parses ack with id', () => {
      expect(MutationAckSchema.safeParse({ id: '00000000-0000-0000-0000-000000000001' }).success).toBe(true);
    });
    it('parses ack with requestId', () => {
      expect(MutationAckSchema.safeParse({ requestId: '00000000-0000-0000-0000-000000000001' }).success).toBe(true);
    });
  });
});
