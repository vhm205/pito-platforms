import { CUSTOMER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationRepository } from '../notification.repository';

import { NotificationEntity } from './entities/notification.entity';
import { NotificationRelationalRepository } from './repositories/notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity], CUSTOMER_DB_SOURCE)],
  providers: [
    {
      provide: NotificationRepository,
      useClass: NotificationRelationalRepository,
    },
  ],
  exports: [NotificationRepository],
})
export class RelationalNotificationPersistenceModule {}
