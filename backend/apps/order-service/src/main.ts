import 'dotenv/config';
import { join } from 'path';

import { LoggerService, ORDER_PACKAGE_NAME } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrderModule, {
    transport: Transport.GRPC,
    options: {
      package: ORDER_PACKAGE_NAME,
      protoPath: join(__dirname, '../order.proto'),
      url: `0.0.0.0:${process.env.ORDER_GRPC_PORT}`,
    },
  });
  app.useLogger(app.get(LoggerService));

  await app.listen();
}

void bootstrap();
