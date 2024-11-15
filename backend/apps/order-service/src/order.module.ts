import { LoggerModule } from '@app/common';
import { AllConfigType, appConfig, databaseConfig } from '@app/common/configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { OrderEntity } from './infrastructure/persistence/relational/entities/order.entity';
// eslint-disable-next-line max-len
import { RelationalOrderPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig],
    }),
    LoggerModule.forRoot({
      service: OrderService.name,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        type: 'postgres',
        host: configService.get('database.host', { infer: true }),
        port: configService.get('database.port', { infer: true }),
        username: configService.get('database.username', { infer: true }),
        password: configService.get('database.password', { infer: true }),
        database: configService.get('database.name', { infer: true }),
        entities: [OrderEntity],
      }),
    }),
    TypeOrmModule.forFeature([OrderEntity]),
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
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
