import { Module, Global, DynamicModule, OnModuleDestroy, Provider } from '@nestjs/common';
import * as amqp from 'amqplib';

import { ExchangeConfig, setupRabbitMQ, disconnectRabbitMQ } from './rabbitmq-setup';
import { RABBITMQ_CONNECTION } from './rabbitmq.constant';

export interface RabbitMQModuleOptions {
  exchanges: ExchangeConfig[];
  uri: string;
}

@Global()
@Module({})
export class RabbitMQModule implements OnModuleDestroy {
  private static connection: amqp.Connection;

  static forRoot(options: RabbitMQModuleOptions): DynamicModule {
    const rabbitMQConnectionProvider: Provider = {
      provide: RABBITMQ_CONNECTION,
      useFactory: async () => {
        RabbitMQModule.connection = await setupRabbitMQ(options.uri, options.exchanges);
        return RabbitMQModule.connection;
      },
    };

    return {
      module: RabbitMQModule,
      providers: [rabbitMQConnectionProvider],
      exports: [rabbitMQConnectionProvider],
    };
  }

  async onModuleDestroy() {
    await disconnectRabbitMQ(RabbitMQModule.connection);
  }
}
