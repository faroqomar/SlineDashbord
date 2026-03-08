import { describe, expect, it } from 'vitest';
import { buildCreateReportInput, DEFAULT_CREATE_REPORT_DRAFT } from './use_reports_viewmodel';

describe('buildCreateReportInput', () => {
  it('builds normalized payload from draft', () => {
    const payload = buildCreateReportInput({
      ...DEFAULT_CREATE_REPORT_DRAFT,
      entity_type: 'chat',
      entity_id: ' 00000000-0000-0000-0000-000000000111 ',
      reason: '  Escalated abusive message content ',
      category: ' harassment ',
      severity: 'high',
    });

    expect(payload).toEqual({
      entity_type: 'chat',
      entity_id: '00000000-0000-0000-0000-000000000111',
      reason: 'Escalated abusive message content',
      category: 'harassment',
      severity: 'high',
      meta: {},
    });
  });

  it('throws when entity id is missing', () => {
    expect(() =>
      buildCreateReportInput({
        ...DEFAULT_CREATE_REPORT_DRAFT,
        entity_id: '   ',
        reason: 'Valid reason',
      }),
    ).toThrow('Entity ID is required');
  });

  it('throws when reason is missing', () => {
    expect(() =>
      buildCreateReportInput({
        ...DEFAULT_CREATE_REPORT_DRAFT,
        entity_id: '00000000-0000-0000-0000-000000000111',
        reason: '  ',
      }),
    ).toThrow('Reason is required');
  });
});
