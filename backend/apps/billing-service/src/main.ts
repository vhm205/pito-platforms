import { join } from 'path';

import { BILLING_PACKAGE_NAME } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { BillingServiceModule } from './billing-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BillingServiceModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../billing.proto'),
      package: BILLING_PACKAGE_NAME,
    },
  });
  await app.listen();
}
bootstrap();
