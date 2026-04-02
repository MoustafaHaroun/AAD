import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context }) => {
            const ctx = typeof context === 'string' ? context : 'App';
            return `${String(timestamp)} [${ctx}] ${level}: ${String(message)}`;
          }),
        ),
      }),
    ];

    const lokiUrl = process.env.LOKI_URL;

    if (lokiUrl) {
      transports.push(
        new LokiTransport({
          host: lokiUrl,
          labels: { app: 'trade2-nestjs' },
          json: true,
          format: winston.format.json(),
          replaceTimestamp: true,
          onConnectionError: (err) =>
            console.error('Loki connection error:', err),
        }),
      );
    }

    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transports,
    });
  }

  log(message: unknown, context?: string) {
    this.logger.info(String(message), { context });
  }

  error(message: unknown, trace?: string, context?: string) {
    this.logger.error(String(message), { trace, context });
  }

  warn(message: unknown, context?: string) {
    this.logger.warn(String(message), { context });
  }

  debug(message: unknown, context?: string) {
    this.logger.debug(String(message), { context });
  }

  verbose(message: unknown, context?: string) {
    this.logger.verbose(String(message), { context });
  }
}
