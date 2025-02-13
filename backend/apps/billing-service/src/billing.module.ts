import { CUSTOMER_DB_SOURCE, LoggerModule, RabbitMQService } from '@app/common';
import {
  AllConfigType,
  appConfig,
  databaseConfig,
  Environment,
  externalConfig,
} from '@app/common/configs';
import { PaymentPatternEvent } from '@app/common/enums';
import { GlobalRpcExceptionFilter } from '@app/common/filters';
import { RabbitMQExchange, RabbitMQQueue } from '@app/common/rabbitmq/rabbitmq.constant';
import { RabbitMQModule } from '@app/common/rabbitmq/rabbitmq.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import 'dotenv/config';

import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { TransactionEntity } from './infrastructure/persistence/relational/entities/transaction.entity';
import { RelationalTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RelationalTransactionPersistenceModule,
    LoggerModule.forRoot({
      service: BillingService.name,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [externalConfig, appConfig, databaseConfig],
    }),
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
    ClientsModule.register([
      {
        name: 'ORDER_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${
              process.env.RABBITMQ_HOST
            }:${process.env.RABBITMQ_PORT}${process.env.RABBITMQ_VHOST}`,
          ],
          queue: RabbitMQQueue.ORDER_QUEUE,
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
          name: RabbitMQExchange.DELAYED_EXCHANGE,
          type: 'x-delayed-message',
          options: {
            arguments: {
              'x-delayed-type': 'topic',
            },
          },
          bindings: [
            { queue: RabbitMQQueue.PAYMENT_QUEUE, routingKey: PaymentPatternEvent.PAYMENT_TIMEOUT },
          ],
        },
        {
          name: RabbitMQExchange.PAYMENT_DL_EXCHANGE,
          type: 'fanout',
          bindings: [
            {
              queue: RabbitMQQueue.PAYMENT_DL_QUEUE,
              routingKey: '',
              options: {
                arguments: {
                  'x-dead-letter-exchange': RabbitMQExchange.PAYMENT_DL_EXCHANGE,
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
        entities: [TransactionEntity],
      }),
    }),
  ],
  controllers: [BillingController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalRpcExceptionFilter,
    },
    RabbitMQService,
    BillingService,
  ],
})
export class BillingModule {}
