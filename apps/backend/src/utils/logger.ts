import { env } from '../config/env';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };
const CURRENT_LOG_LEVEL = LOG_LEVELS[env.LOG_LEVEL];

const COLORS = {
  error: '\x1b[31m',
  warn: '\x1b[33m',
  info: '\x1b[36m',
  debug: '\x1b[35m',
  reset: '\x1b[0m',
};

const shouldLog = (level: LogLevel) => LOG_LEVELS[level] <= CURRENT_LOG_LEVEL;

const formatLog = (level: LogLevel, message: string, meta?: unknown): string => {
  const timestamp = new Date().toISOString();

  if (env.NODE_ENV === 'production') {
    return JSON.stringify({ timestamp, level, message, ...(meta && typeof meta === 'object' ? meta : {}) });
  }

  const color = COLORS[level];
  const reset = COLORS.reset;
  let logStr = `${color}[${timestamp}] ${level.toUpperCase().padEnd(5)}${reset} ${message}`;
  if (meta) logStr += `\n${JSON.stringify(meta, null, 2)}`;
  return logStr;
};

export const error = (message: string, meta?: unknown): void => {
  if (shouldLog('error')) console.error(formatLog('error', message, meta));
};

export const warn = (message: string, meta?: unknown): void => {
  if (shouldLog('warn')) console.warn(formatLog('warn', message, meta));
};

export const info = (message: string, meta?: unknown): void => {
  if (shouldLog('info')) console.log(formatLog('info', message, meta));
};

export const debug = (message: string, meta?: unknown): void => {
  if (shouldLog('debug')) console.log(formatLog('debug', message, meta));
};

export const http = (method: string, path: string, statusCode: number, duration: number): void => {
  const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
  if (shouldLog(level)) console.log(formatLog(level, `${method} ${path} ${statusCode} - ${duration}ms`));
};

export const logger = { error, warn, info, debug, http };
export default logger;
