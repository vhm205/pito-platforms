import 'dotenv/config';
import { join } from 'path';

import { BILLING_PACKAGE_NAME } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { BillingModule } from './billing.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BillingModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../billing.proto'),
      package: BILLING_PACKAGE_NAME,
      url: `0.0.0.0:${process.env.BILLING_GRPC_PORT}`,
    },
  });
  await app.listen();
}

void bootstrap();
