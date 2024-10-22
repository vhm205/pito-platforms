import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

import './instrument';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.API_GATEWAY_PORT);

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: ORDER_PACKAGE_NAME,
  //     protoPath: './order.proto',
  //     url: `${process.env.ORDER_GRPC_HOST}:${process.env.ORDER_GRPC_PORT}`,
  //   },
  // });
  // await app.startAllMicroservices();
}
bootstrap();
