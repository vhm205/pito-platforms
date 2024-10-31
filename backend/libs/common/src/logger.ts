import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class Logger implements LoggerService {
  protected logger: winston.Logger;

  constructor(service: string) {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
          winston.format.printf(({ level, message, timestamp, service }) => {
            return `[${service}] ${level.toUpperCase()}: ${timestamp} - ${message}`;
          }),
        ),
      }),
    ];

    if (['production', 'stage'].includes(process.env.NODE_ENV)) {
      transports.push(
        new DailyRotateFile({
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
          level: 'info',
        }),
        new DailyRotateFile({
          dirname: 'logs',
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
          level: 'error',
        }),
      );
    }

    this.logger = winston.createLogger({
      transports,
      defaultMeta: { service },
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
