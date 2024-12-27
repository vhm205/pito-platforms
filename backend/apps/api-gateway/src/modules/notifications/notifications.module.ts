import { join } from 'path';

import { NOTIFICATION_SERVICE } from '@app/common';
import { AllConfigType } from '@app/common/configs';
import { NOTIFICATION_PACKAGE_NAME } from '@app/common/types/proto/notification';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: NOTIFICATION_SERVICE,
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.GRPC,
          options: {
            package: NOTIFICATION_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'proto/notification.proto'),
            url: configService.getOrThrow('app.notificationGrpcUrl', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
