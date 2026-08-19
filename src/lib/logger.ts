/**
 * Structured Logger
 *
 * Outputs JSON in production (for log aggregators), colored text in development.
 * Every log entry includes: timestamp, level, message, and optional context.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[90m", // gray
  info: "\x1b[36m",  // cyan
  warn: "\x1b[33m",  // yellow
  error: "\x1b[31m", // red
};
const RESET = "\x1b[0m";

const MIN_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[MIN_LEVEL];
}

function formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();

  if (process.env.NODE_ENV === "production") {
    const entry: Record<string, unknown> = {
      timestamp,
      level,
      message,
      ...context,
    };
    return JSON.stringify(entry);
  }

  // Development: colored, human-readable
  const color = LEVEL_COLORS[level];
  const ctxStr = context ? " " + JSON.stringify(context) : "";
  return `${color}${timestamp} [${level.toUpperCase()}]${RESET} ${message}${ctxStr}`;
}

export const log = {
  debug(message: string, context?: Record<string, unknown>) {
    if (shouldLog("debug")) console.debug(formatMessage("debug", message, context));
  },

  info(message: string, context?: Record<string, unknown>) {
    if (shouldLog("info")) console.log(formatMessage("info", message, context));
  },

  warn(message: string, context?: Record<string, unknown>) {
    if (shouldLog("warn")) console.warn(formatMessage("warn", message, context));
  },

  error(message: string, context?: Record<string, unknown>) {
    if (shouldLog("error")) console.error(formatMessage("error", message, context));
  },
};
