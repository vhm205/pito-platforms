import { join } from 'path';

import {
  CUSTOMER_DB_SOURCE,
  PARTNER_DB_SOURCE,
  LoggerModule,
  BILLING_SERVICE,
  BILLING_PACKAGE_NAME,
  RabbitMQModule,
  RabbitMQService,
  RabbitMQExchange,
  RabbitMQQueue,
} from '@app/common';
import {
  AllConfigType,
  Environment,
  appConfig,
  databaseConfig,
  externalConfig,
} from '@app/common/configs';
import { GlobalRpcExceptionFilter } from '@app/common/filters';
import { SlackModule } from '@app/common/slack/slack.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';

import { BillingService } from './billing.service';
import { CartService } from './cart.service';
import { CartItemEntity } from './infrastructure/persistence/relational/entities/cart-item.entity';
import { ItemEntity } from './infrastructure/persistence/relational/entities/item.entity';
import { OrderEntity } from './infrastructure/persistence/relational/entities/order.entity';
import { PartnerEntity } from './infrastructure/persistence/relational/entities/partner.entity';
import { ShoppingSessionEntity } from './infrastructure/persistence/relational/entities/shopping-session.entity';
import { StoreOrderEntity } from './infrastructure/persistence/relational/entities/store-order.entity';
import { StoreEntity } from './infrastructure/persistence/relational/entities/store.entity';
import { TransactionEntity } from './infrastructure/persistence/relational/entities/transaction.entity';
import { UserVoucherEntity } from './infrastructure/persistence/relational/entities/user-voucher.entity';
import { VoucherEntity } from './infrastructure/persistence/relational/entities/voucher.entity';
import { RelationalOrderPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { OrderNotificationService } from './order-notification.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PromotionService } from './promotion.service';
import { StoreOrderService } from './store-order.service';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig, externalConfig],
    }),
    LoggerModule.forRoot({
      service: OrderService.name,
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: +(process.env.REDIS_PORT as string),
          },
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: BILLING_SERVICE,
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.GRPC,
          options: {
            package: BILLING_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'proto/billing.proto'),
            url: configService.getOrThrow('app.billingGrpcUrl', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${
              process.env.RABBITMQ_HOST
            }:${process.env.RABBITMQ_PORT}${process.env.RABBITMQ_VHOST}`,
          ],
          queue: RabbitMQQueue.NOTIFICATION_QUEUE,
          queueOptions: {
            durable: true,
            noAck: false,
          },
          persistent: true,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'PAYMENT_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${
              process.env.RABBITMQ_HOST
            }:${process.env.RABBITMQ_PORT}${process.env.RABBITMQ_VHOST}`,
          ],
          queue: RabbitMQQueue.PAYMENT_QUEUE,
          queueOptions: {
            durable: true,
            noAck: false,
          },
          persistent: true,
        },
      },
    ]),
    RabbitMQModule.forRoot({
      uri: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${
        process.env.RABBITMQ_HOST
      }:${process.env.RABBITMQ_PORT}${process.env.RABBITMQ_VHOST}`,
      exchanges: [
        {
          name: RabbitMQExchange.ORDER_DL_EXCHANGE,
          type: 'fanout',
          bindings: [
            {
              queue: RabbitMQQueue.ORDER_DL_QUEUE,
              routingKey: '',
              options: {
                arguments: {
                  'x-dead-letter-exchange': RabbitMQExchange.ORDER_DL_EXCHANGE,
                },
              },
            },
          ],
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      name: CUSTOMER_DB_SOURCE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        type: 'postgres',
        host: configService.getOrThrow('database.host', { infer: true }),
        port: configService.getOrThrow('database.port', { infer: true }),
        username: configService.getOrThrow('database.username', { infer: true }),
        password: configService.getOrThrow('database.password', { infer: true }),
        database: configService.getOrThrow('database.name', { infer: true }),
        logging:
          configService.getOrThrow('app.nodeEnv', { infer: true }) !== Environment.PRODUCTION,
        // synchronize: configService.get('database.synchronize', { infer: true }),
        // dropSchema: false,
        // extra: {
        //   max: configService.get('database.maxConnections', { infer: true }),
        //   ssl: configService.get('database.sslEnabled', { infer: true }) && {
        //     rejectUnauthorized: configService.get('database.rejectUnauthorized', { infer: true }),
        //     ca: configService.get('database.ca', { infer: true }),
        //     key: configService.get('database.key', { infer: true }),
        //     cert: configService.get('database.cert', { infer: true }),
        //   },
        // },
        entities: [
          OrderEntity,
          ShoppingSessionEntity,
          CartItemEntity,
          ItemEntity,
          VoucherEntity,
          UserVoucherEntity,
          TransactionEntity,
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: PARTNER_DB_SOURCE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('PARTNER_DB_HOST', { infer: true }),
        port: configService.getOrThrow<number>('PARTNER_DB_PORT', { infer: true }),
        username: configService.getOrThrow<string>('PARTNER_DB_USER', { infer: true }),
        password: configService.getOrThrow<string>('PARTNER_DB_PASSWORD', { infer: true }),
        database: configService.getOrThrow<string>('PARTNER_DB_NAME', { infer: true }),
        logging: configService.get('app.nodeEnv', { infer: true }) !== Environment.PRODUCTION,
        entities: [StoreOrderEntity, StoreEntity, PartnerEntity],
      }),
    }),
    RelationalOrderPersistenceModule,
    SlackModule,
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalRpcExceptionFilter,
    },
    RabbitMQService,
    OrderService,
    StoreOrderService,
    OrderNotificationService,
    BillingService,
    PromotionService,
    TransactionService,
    CartService,
  ],
  exports: [
    OrderService,
    StoreOrderService,
    OrderNotificationService,
    BillingService,
    PromotionService,
    TransactionService,
    CartService,
  ],
})
export class OrderModule {}
