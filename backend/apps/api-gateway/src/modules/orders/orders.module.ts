import { join } from 'path';

import { ORDER_SERVICE, ORDER_PACKAGE_NAME } from '@app/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-yet';
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
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
          },
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
