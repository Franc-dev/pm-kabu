/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /libs/logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface LogMessage {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private logQueue: LogMessage[] = [];
  private isProcessing: boolean = false;

  private readonly LOG_LEVELS = {
    debug: { emoji: '🔍', color: '\x1b[36m' },    // Cyan
    info: { emoji: 'ℹ️', color: '\x1b[34m' },     // Blue
    warn: { emoji: '⚠️', color: '\x1b[33m' },     // Yellow
    error: { emoji: '❌', color: '\x1b[31m' },     // Red
    success: { emoji: '✅', color: '\x1b[32m' }    // Green
  };

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(logMessage: LogMessage): string {
    const { level, message, timestamp, metadata } = logMessage;
    const { emoji, color } = this.LOG_LEVELS[level];
    
    let formattedMessage = `${color}${emoji} [${timestamp}] [${level.toUpperCase()}]: ${message}\x1b[0m`;
    
    if (metadata) {
      formattedMessage += `\n${color}Metadata: ${JSON.stringify(metadata, null, 2)}\x1b[0m`;
    }
    
    return formattedMessage;
  }

  private async processQueue() {
    if (this.isProcessing || this.logQueue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.logQueue.length > 0) {
        const logMessage = this.logQueue.shift();
        if (logMessage) {
          const formattedMessage = this.formatMessage(logMessage);
          
          // In production, you might want to send logs to a service like CloudWatch or DataDog
          if (process.env.NODE_ENV === 'production') {
            // Implement production logging service here
            await this.sendToLoggingService(logMessage);
          }

          // Console output for development
          console.log(formattedMessage);
        }
      }
    } catch (error) {
      console.error('Error processing log queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async sendToLoggingService(logMessage: LogMessage): Promise<void> {
    // Implement your production logging service integration here
    // Example: AWS CloudWatch, DataDog, etc.
    try {
      // await cloudWatchLogs.putLogEvents({...});
    } catch (error) {
      console.error('Failed to send log to logging service:', error);
    }
  }

  private queueLog(level: LogLevel, message: string, metadata?: Record<string, any>) {
    this.logQueue.push({
      timestamp: this.getTimestamp(),
      level,
      message,
      metadata
    });

    // Process queue asynchronously
    setTimeout(() => this.processQueue(), 0);
  }

  public debug(message: string, metadata?: Record<string, any>) {
    this.queueLog('debug', message, metadata);
  }

  public info(message: string, metadata?: Record<string, any>) {
    this.queueLog('info', message, metadata);
  }

  public warn(message: string, metadata?: Record<string, any>) {
    this.queueLog('warn', message, metadata);
  }

  public error(message: string, metadata?: Record<string, any>) {
    this.queueLog('error', message, metadata);
  }

  public success(message: string, metadata?: Record<string, any>) {
    this.queueLog('success', message, metadata);
  }
}

// Export a singleton instance
export const logger = Logger.getInstance();

// Usage example:
/*
import { logger } from '@/libs/logger';

// Basic usage
logger.info('Starting process');
logger.debug('Debugging information');
logger.warn('Warning: resource usage high');
logger.error('Failed to connect to database');
logger.success('Process completed successfully');

// With metadata
logger.info('User action', { 
  userId: '123', 
  action: 'login', 
  timestamp: new Date() 
});

// In API routes
export async function GET(req: Request) {
  try {
    logger.info('Processing GET request', { 
      path: req.url,
      headers: Object.fromEntries(req.headers)
    });
    
    // Your API logic here
    
    logger.success('Request processed successfully');
    return Response.json({ status: 'success' });
  } catch (error) {
    logger.error('Request failed', { 
      error: error.message,
      stack: error.stack
    });
    return Response.json({ status: 'error' }, { status: 500 });
  }
}
*/