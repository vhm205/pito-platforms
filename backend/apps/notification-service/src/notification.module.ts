import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      service: NotificationService.name,
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
