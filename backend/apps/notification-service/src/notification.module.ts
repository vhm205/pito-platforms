import { LoggerModule } from '@app/common';
import { externalConfig } from '@app/common/configs';
import { CatchAllErrorInterceptor } from '@app/common/interceptors';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [externalConfig],
    }),
    LoggerModule.forRoot({
      service: NotificationService.name,
    }),
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CatchAllErrorInterceptor,
    },
    NotificationService,
  ],
})
export class NotificationModule {}
