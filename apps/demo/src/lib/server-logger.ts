/**
 * Server-side logger utility with log levels
 * 
 * Log levels:
 * - debug: Detailed information for debugging (development only)
 * - info: General informational messages (development only)
 * - warn: Warning messages (always logged)
 * - error: Error messages (always logged)
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const isDevelopment = process.env.NODE_ENV === "development";

// Get log level from environment variable or default to 'info' in dev, 'warn' in prod
const getLogLevel = (): LogLevel => {
  if (!isDevelopment) return "warn"; // Only warn/error in production
  
  const envLevel = process.env.LOG_LEVEL as LogLevel | undefined;
  if (envLevel && ["debug", "info", "warn", "error"].includes(envLevel)) {
    return envLevel;
  }
  return "info";
};

const currentLogLevel = getLogLevel();

const logLevels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const shouldLog = (level: LogLevel): boolean => {
  return logLevels[level] >= logLevels[currentLogLevel];
};

const formatMessage = (level: LogLevel, ...args: any[]): any[] => {
  const timestamp = new Date().toISOString();
  return [`[${timestamp}] [${level.toUpperCase()}]`, ...args];
};

export const logger = {
  debug: (...args: any[]) => {
    if (shouldLog("debug") && isDevelopment) {
      console.log(...formatMessage("debug", ...args));
    }
  },
  
  info: (...args: any[]) => {
    if (shouldLog("info") && isDevelopment) {
      console.info(...formatMessage("info", ...args));
    }
  },
  
  warn: (...args: any[]) => {
    if (shouldLog("warn")) {
      console.warn(...formatMessage("warn", ...args));
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors
    if (shouldLog("error")) {
      console.error(...formatMessage("error", ...args));
    }
  },
  
  // Legacy methods for backward compatibility
  log: (...args: any[]) => {
    logger.info(...args);
  },
};

