import { join } from 'path';

import { BILLING_PACKAGE_NAME } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

import { BillingModule } from './billing.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BillingModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../billing.proto'),
      package: BILLING_PACKAGE_NAME,
      url: `${process.env.BILLING_GRPC_HOST}:${process.env.BILLING_GRPC_PORT}`,
    },
  });
  await app.listen();
}
bootstrap();
