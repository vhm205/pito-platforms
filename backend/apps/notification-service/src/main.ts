import 'dotenv/config';
import { LoggerService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${
          process.env.RABBITMQ_HOST
        }:${process.env.RABBITMQ_PORT}${process.env.RABBITMQ_VHOST}`,
      ],
      queue: 'notifications_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
      prefetchCount: 1,
    },
  });

  app.useLogger(app.get(LoggerService));

  await app.listen();
}

void bootstrap();
