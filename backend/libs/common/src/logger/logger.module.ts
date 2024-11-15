import { DynamicModule, Global, Module } from '@nestjs/common';

import { LoggerOptions } from './logger.interface';
import { LoggerService } from './logger.service';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          useValue: new LoggerService(options),
        },
      ],
      exports: [LoggerService],
    };
  }
}
