import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

dotenv.config();

@Module({
  imports: [
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
    LoggerModule.forRoot({
      service: BillingService.name,
    }),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
