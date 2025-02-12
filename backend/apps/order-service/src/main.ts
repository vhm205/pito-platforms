import 'dotenv/config';
import { join } from 'path';

import { LoggerService, ORDER_PACKAGE_NAME } from '@app/common';
import { RabbitMQQueue } from '@app/common/rabbitmq/rabbitmq.constant';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);

  app.useLogger(app.get(LoggerService));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ORDER_PACKAGE_NAME,
      protoPath: [
        join(process.cwd(), 'proto/order.proto'),
        join(process.cwd(), 'proto/common.proto'),
      ],
      url: `0.0.0.0:${process.env.ORDER_GRPC_PORT}`,
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
      queue: RabbitMQQueue.ORDER_QUEUE,
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
