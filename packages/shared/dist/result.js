/**
 * Standard Result pattern for all service and API operations.
 */
/**
 * Helper to create a successful result.
 */
export function success(data) {
    return { ok: true, data };
}
/**
 * Helper to create a failure result.
 */
export function failure(code, message, details) {
    return { ok: false, error: { code, message, details } };
}
