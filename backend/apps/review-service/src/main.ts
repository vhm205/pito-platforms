import { join } from 'path';

import { LoggerService, REVIEW_PACKAGE_NAME } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ReviewModule } from './review.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ReviewModule, {
    transport: Transport.GRPC,
    options: {
      package: REVIEW_PACKAGE_NAME,
      protoPath: join(__dirname, '../review.proto'),
      url: `0.0.0.0:${process.env.REVIEW_GRPC_PORT}`,
    },
  });
  app.useLogger(app.get(LoggerService));

  await app.listen();
}

void bootstrap();
