import * as amqp from 'amqplib';

export interface QueueBinding {
  queue: string;
  routingKey: string;
  options?: amqp.Options.AssertQueue;
}

export interface ExchangeConfig {
  name: string;
  type: 'topic' | 'fanout' | 'direct' | 'headers' | 'x-delayed-message';
  options?: amqp.Options.AssertExchange;
  bindings: QueueBinding[];
}

export async function setupRabbitMQ(
  rabbitMQUrl: string,
  exchanges: ExchangeConfig[],
): Promise<amqp.Connection> {
  const connection = await amqp.connect(rabbitMQUrl);
  const channel = await connection.createChannel();

  for (const exchange of exchanges) {
    await channel.assertExchange(exchange.name, exchange.type, {
      durable: true,
      ...exchange.options,
    });

    for (const binding of exchange.bindings) {
      await channel.assertQueue(binding.queue, { durable: true, ...binding.options });
      await channel.bindQueue(binding.queue, exchange.name, binding.routingKey);
    }
  }

  await channel.close();

  return connection;
}

export async function disconnectRabbitMQ(connection: amqp.Connection) {
  if (connection) {
    await connection.close();
  }
}
