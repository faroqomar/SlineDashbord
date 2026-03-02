/**
 * Standard Result pattern for all service and API operations.
 */
export type ServiceResult<T> = {
    ok: true;
    data: T;
    error?: never;
} | {
    ok: false;
    data?: never;
    error: ServiceError;
};
export interface ServiceError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
/**
 * Helper to create a successful result.
 */
export declare function success<T>(data: T): ServiceResult<T>;
/**
 * Helper to create a failure result.
 */
export declare function failure(code: string, message: string, details?: Record<string, unknown>): ServiceResult<never>;
