import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE, LoggerModule } from '@app/common';
import {
  AllConfigType,
  Environment,
  appConfig,
  databaseConfig,
  externalConfig,
} from '@app/common/configs';
import { GlobalRpcExceptionFilter } from '@app/common/filters';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderEntity } from './infrastructure/persistence/relational/entities/order.entity';
import { StoreOrderEntity } from './infrastructure/persistence/relational/entities/store-order.entity';
import { StoreEntity } from './infrastructure/persistence/relational/entities/store.entity';
import { TransactionEntity } from './infrastructure/persistence/relational/entities/transaction.entity';
import { RelationalOrderPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { NotificationService } from './notification.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
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
    TypeOrmModule.forRootAsync({
      name: CUSTOMER_DB_SOURCE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        type: 'postgres',
        host: configService.get('database.host', { infer: true }),
        port: configService.get('database.port', { infer: true }),
        username: configService.get('database.username', { infer: true }),
        password: configService.get('database.password', { infer: true }),
        database: configService.get('database.name', { infer: true }),
        logging: configService.get('app.nodeEnv', { infer: true }) !== Environment.PRODUCTION,
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
        entities: [OrderEntity, TransactionEntity],
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
        entities: [StoreOrderEntity, StoreEntity],
      }),
    }),
    RelationalOrderPersistenceModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${
              process.env.RABBITMQ_HOST
            }:${process.env.RABBITMQ_PORT}${process.env.RABBITMQ_VHOST}`,
          ],
          queue: 'notifications_queue',
          queueOptions: {
            durable: true,
            noAck: false,
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalRpcExceptionFilter,
    },
    OrderService,
    StoreOrderService,
    NotificationService,
    TransactionService,
  ],
  exports: [OrderService, StoreOrderService, NotificationService, TransactionService],
})
export class OrderModule {}
