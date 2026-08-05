// src/lib/logger.ts
import pino from 'pino';

// Determine log level from environment
const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

// Configure transport for pretty printing in development
const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      level,
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
    // Optionally send logs to a file or external service in production
    // {
    //   target: 'pino/file',
    //   level: 'error',
    //   options: { destination: '/var/log/app-error.log' },
    // },
  ],
});

// Create the logger instance
export const logger = pino(
  {
    level,
    // Add a base field to identify the service
    base: { service: 'payroll-api' },
    // Redact sensitive fields (passwords, tokens, etc.)
    redact: ['password', 'token', 'authorization'],
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

// Helper to create a child logger with request ID (for use in tRPC middleware)
export const createChildLogger = (requestId: string) => {
  return logger.child({ requestId });
};

// Optional: override console methods to route through Pino in development
if (process.env.NODE_ENV !== 'production') {
  // You can also redirect console.log to logger.debug etc.
}