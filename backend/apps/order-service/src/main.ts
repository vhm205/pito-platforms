import { join } from 'path';

import { ORDER_PACKAGE_NAME } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

import { OrderModule } from './order.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrderModule, {
    transport: Transport.GRPC,
    options: {
      package: ORDER_PACKAGE_NAME,
      protoPath: join(__dirname, '../order.proto'),
      url: `${process.env.ORDER_GRPC_HOST}:${process.env.ORDER_GRPC_PORT}`,
    },
  });
  await app.listen();
}
bootstrap();
