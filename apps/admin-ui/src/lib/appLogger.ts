/**
 * App logger for admin-ui: trace flows (e.g. Tasks/App View), errors, and testability.
 * In dev: logs debug/info/warn/error. In production: only warn/error to avoid verbosity.
 * In test can be mocked.
 */

const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV !== false;

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface AppLogger {
  debug(context: string, message: string, meta?: Record<string, unknown>): void;
  info(context: string, message: string, meta?: Record<string, unknown>): void;
  warn(context: string, message: string, meta?: Record<string, unknown>): void;
  error(context: string, message: string, meta?: Record<string, unknown>): void;
}

function formatPayload(context: string, level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const prefix = `[${context}][${level.toUpperCase()}]`;
  if (meta && Object.keys(meta).length > 0) {
    return `${prefix} ${message} ${JSON.stringify(meta)}`;
  }
  return `${prefix} ${message}`;
}

function log(level: LogLevel, context: string, message: string, meta?: Record<string, unknown>): void {
  if (!isDev && (level === 'debug' || level === 'info')) return;
  const payload = formatPayload(context, level, message, meta);
  switch (level) {
    case 'debug':
      console.debug(payload);
      break;
    case 'info':
      console.info(payload);
      break;
    case 'warn':
      console.warn(payload);
      break;
    case 'error':
      console.error(payload);
      break;
  }
}

export const appLogger: AppLogger = {
  debug: (context, message, meta) => log('debug', context, message, meta),
  info: (context, message, meta) => log('info', context, message, meta),
  warn: (context, message, meta) => log('warn', context, message, meta),
  error: (context, message, meta) => log('error', context, message, meta),
};

/** Scoped logger: context is fixed; call with (message, meta?). */
export interface ScopedLogger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

/** Create a scoped logger for a feature (e.g. "Tasks:AppView"). */
export function createScopedLogger(scope: string): ScopedLogger {
  return {
    debug: (message, meta) => appLogger.debug(scope, message, meta),
    info: (message, meta) => appLogger.info(scope, message, meta),
    warn: (message, meta) => appLogger.warn(scope, message, meta),
    error: (message, meta) => appLogger.error(scope, message, meta),
  };
}
