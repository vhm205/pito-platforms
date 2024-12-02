import 'dotenv/config';
import { join } from 'path';

import { BILLING_PACKAGE_NAME, LoggerService } from '@app/common';
import { RabbitMQQueue } from '@app/common/rabbitmq/rabbitmq.constant';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { BillingModule } from './billing.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);

  app.useLogger(app.get(LoggerService));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../billing.proto'),
      package: BILLING_PACKAGE_NAME,
      url: `0.0.0.0:${process.env.BILLING_GRPC_PORT}`,
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
      queue: RabbitMQQueue.PAYMENT_QUEUE,
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
