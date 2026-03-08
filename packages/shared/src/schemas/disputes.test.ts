import { describe, expect, it } from 'vitest';
import { CreateDisputeInputSchema } from './disputes.js';

const validUuidA = '00000000-0000-0000-0000-000000000001';
const validUuidB = '00000000-0000-0000-0000-000000000002';
const validUuidTask = '00000000-0000-0000-0000-000000000010';

describe('disputes schemas', () => {
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
});
