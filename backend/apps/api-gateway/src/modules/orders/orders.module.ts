import { join } from 'path';

import { ORDER_SERVICE, ORDER_PACKAGE_NAME, MENU_SERVICE, MENU_PACKAGE_NAME } from '@app/common';
import { AllConfigType } from '@app/common/configs';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-yet';

import { OperatorOrdersController } from './operator-order.controller';
import { OperatorOrderService } from './operator-order.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: ORDER_SERVICE,
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.GRPC,
          options: {
            package: ORDER_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'proto/order.proto'),
            url: configService.get('app.orderGrpcUrl', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: MENU_SERVICE,
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.GRPC,
          options: {
            package: MENU_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'proto/menu.proto'),
            url: configService.get('app.menuGrpcUrl', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT!,
          },
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
  ],
  controllers: [OrdersController, OperatorOrdersController],
  providers: [OrdersService, OperatorOrderService],
})
export class OrdersModule {}
