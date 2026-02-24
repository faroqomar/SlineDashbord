/**
 * Standard service result type for all @SysOp server actions.
 * Functions NEVER throw — they return this shape.
 */
export type ServiceResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Helper to create a success result.
 */
export function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

/**
 * Helper to create an error result.
 */
export function fail(error: string): ServiceResult<never> {
  return { success: false, error };
}
