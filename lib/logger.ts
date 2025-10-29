type LogLevel = 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

interface Logger {
  info(message: string, context?: LogContext): void
  warn(message: string, context?: LogContext): void
  error(message: string, error?: Error, context?: LogContext): void
}

const createLogger = (): Logger => {
  const log = (level: LogLevel, message: string, error?: Error, context?: LogContext) => {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...context,
      ...(error && { error: error.message, stack: error.stack }),
    }

    // In development, log to console for visibility
    if (process.env.NODE_ENV === 'development') {
      const color = {
        info: '\x1b[36m', // Cyan
        warn: '\x1b[33m', // Yellow
        error: '\x1b[31m', // Red
      }[level]
      const reset = '\x1b[0m'
      console.log(`${color}[${logEntry.timestamp}] [${logEntry.level}] ${logEntry.message} | Context: ${JSON.stringify(context || {})} ${error ? `| Error: ${error.message}` : ''}${reset}`)
      if (error) {
        console.error('Error stack:', error.stack)
      }
    } else {
      // In production, send to a logging service (e.g., Sentry, CloudWatch, etc.)
      // For now, we'll just log to console as a placeholder
      console.log(JSON.stringify(logEntry))
    }
  }

  return {
    info: (message, context) => log('info', message, undefined, context),
    warn: (message, context) => log('warn', message, undefined, context),
    error: (message, error, context) => log('error', message, error, context),
  }
}

export const logger = createLogger()
