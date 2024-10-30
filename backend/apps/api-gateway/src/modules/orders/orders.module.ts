import { join } from 'path';

import { ORDER_SERVICE, ORDER_PACKAGE_NAME } from '@app/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: ORDER_PACKAGE_NAME,
          protoPath: join(__dirname, '../order.proto'),
          url: `${process.env.ORDER_GRPC_HOST}:${process.env.ORDER_GRPC_PORT}`,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
