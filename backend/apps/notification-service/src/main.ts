import 'dotenv/config';
import { join } from 'path';

import { LoggerService } from '@app/common';
import { NOTIFICATION_PACKAGE_NAME } from '@app/common/types/proto/notification';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);

  app.useLogger(app.get(LoggerService));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../notification.proto'),
      package: NOTIFICATION_PACKAGE_NAME,
      url: `0.0.0.0:${process.env.NOTIFICATION_GRPC_PORT}`,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${
          process.env.RABBITMQ_HOST
        }:${process.env.RABBITMQ_PORT}${process.env.RABBITMQ_VHOST}`,
      ],
      queue: 'notification_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
      persistent: true,
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();
}

void bootstrap();
