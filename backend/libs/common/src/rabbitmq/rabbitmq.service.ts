import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  public channel: amqp.Channel;

  async createChannel(connection: amqp.Connection) {
    this.channel = await connection.createChannel();
  }

  publishToExchange(
    exchangeName: string,
    routingKey: string,
    message: any,
    opts?: amqp.Options.Publish,
  ) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized.');
    }

    return this.channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)), {
      persistent: true,
      ...opts,
    });
  }
}
