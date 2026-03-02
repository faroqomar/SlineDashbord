/**
 * Standard Result pattern for all service and API operations.
 */

export type ServiceResult<T> = 
  | { ok: true; data: T; error?: never }
  | { ok: false; data?: never; error: ServiceError };

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Helper to create a successful result.
 */
export function success<T>(data: T): ServiceResult<T> {
  return { ok: true, data };
}

/**
 * Helper to create a failure result.
 */
export function failure(code: string, message: string, details?: Record<string, unknown>): ServiceResult<never> {
  return { ok: false, error: { code, message, details } };
}
