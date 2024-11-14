import 'dotenv/config';
import * as path from 'path';

import { Injectable, LoggerService as NestjsLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { LoggerOptions, LogMetadata } from './logger.interface';

@Injectable()
export class LoggerService implements NestjsLoggerService {
  protected logger: winston.Logger;

  constructor(options: LoggerOptions) {
    const {
      level = process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      logPath = 'logs',
      rotationFrequency = 'YYYY-MM-DD',
      maxSize = '20m',
      maxFiles = '14d',
      service,
    } = options;

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.sssZ' }),
          winston.format.printf(({ level, message, timestamp, context, trace, extra }) => {
            const contextPart = context ? ` ${context}` : '';
            return [
              `${timestamp} ${service} ${level.toUpperCase()}${contextPart}: ${message}`,
              trace ?? '',
              extra ?? '',
            ].join('');
          }),
        ),
      }),
    ];

    if (['production', 'stage'].includes(process.env.NODE_ENV)) {
      transports.push(
        new DailyRotateFile({
          dirname: path.resolve(logPath),
          filename: 'application-%DATE%.log',
          datePattern: rotationFrequency,
          zippedArchive: true,
          maxSize,
          maxFiles,
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
          level,
        }),
        new DailyRotateFile({
          dirname: path.resolve(logPath),
          filename: 'error-%DATE%.log',
          datePattern: rotationFrequency,
          zippedArchive: true,
          maxSize,
          maxFiles,
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
          level: 'error',
        }),
      );
    }

    this.logger = winston.createLogger({ transports });
  }

  private formatMeta(metadata?: LogMetadata) {
    if (!metadata) return '';
    const { context, trace, metadata: extra } = metadata;
    return {
      context,
      trace: trace ? `\n${trace}` : '',
      extra: extra ? `\n${JSON.stringify(extra, null, 2)}` : '',
    };
  }

  log(message: string, metadata?: LogMetadata) {
    this.logger.info(message, this.formatMeta(metadata));
  }

  error(message: string, metadata?: any) {
    this.logger.error(message, this.formatMeta(metadata));
  }

  warn(message: string, metadata?: any) {
    this.logger.warn(message, this.formatMeta(metadata));
  }

  debug(message: string, metadata?: any) {
    this.logger.debug(message, this.formatMeta(metadata));
  }

  verbose(message: string, metadata?: any) {
    this.logger.verbose(message, this.formatMeta(metadata));
  }
}
