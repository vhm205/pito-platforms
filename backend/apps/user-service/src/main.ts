import { join } from 'path';

import { USER_PACKAGE_NAME } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

import { UserModule } from './user.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
    transport: Transport.GRPC,
    options: {
      package: USER_PACKAGE_NAME,
      protoPath: join(__dirname, '../user.proto'),
      url: `${process.env.USER_GRPC_HOST}:${process.env.USER_GRPC_PORT}`,
    },
  });
  await app.listen();
}
bootstrap();
