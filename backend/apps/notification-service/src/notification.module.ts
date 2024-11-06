import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { externalConfig } from '@app/common/configs';
import { LoggerModule } from '@app/common';

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
  providers: [NotificationService],
})
export class NotificationModule {}
