import { join } from 'path';

import { LoggerService, MENU_PACKAGE_NAME } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { MenuModule } from './menu.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MenuModule, {
    transport: Transport.GRPC,
    options: {
      package: MENU_PACKAGE_NAME,
      protoPath: [
        join(process.cwd(), 'proto/menu.proto'),
        join(process.cwd(), 'proto/common.proto'),
      ],
      url: `0.0.0.0:${process.env.MENU_GRPC_PORT}`,
      loader: {
        arrays: true,
      },
    },
  });
  app.useLogger(app.get(LoggerService));

  await app.listen();
}
bootstrap();
