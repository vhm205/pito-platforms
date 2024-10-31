import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { AhamoveAuthStrategy } from './event.auth';
import {
  WebhookAuthStrategy,
  WebhookEventHandler,
  WebhookEventTransformer,
} from './event.interface';
import { AhamoveOrderTransformer } from '../transfomers';
import { OrderEventData, OrderEvent, WebhookEvent } from '../types';

@Injectable()
export class OrderEventHandler implements WebhookEventHandler {
  private transformers: WebhookEventTransformer<OrderEventData>[];
  private authStrategies: WebhookAuthStrategy[];

  constructor(private readonly configService: ConfigService) {
    this.transformers = [new AhamoveOrderTransformer()];
    this.authStrategies = [
      new AhamoveAuthStrategy(this.configService.get<string>('AHAMOVE_ORDER_EVENTS_API_KEY')),
    ];
  }

  async processEvent(event: WebhookEvent<OrderEventData>): Promise<void> {
    switch (event.type) {
      case OrderEvent.Delivering:
        return this.orderDelivering(event.data);
      case OrderEvent.Delivered:
        return this.orderDelivered(event.data);
      case OrderEvent.NotDelivered:
        return this.orderNotDelivered(event.data);
    }
  }

  authenticate(req: Request): boolean {
    return this.authStrategies.some(strategy => strategy.authenticate(req));
  }

  transformEvent(body: object): WebhookEvent<OrderEventData> {
    const transformer = this.transformers.find(t => t.canHandle(body));
    if (!transformer) {
      throw new BadRequestException('Unsupported event format');
    }
    return transformer.transform(body);
  }

  protected async orderDelivering(data: OrderEventData): Promise<void> {
    console.info('Processing order delivering:', data);
  }

  protected async orderDelivered(data: OrderEventData): Promise<void> {
    console.info('Processing order completed:', data);
  }

  protected async orderNotDelivered(data: OrderEventData): Promise<void> {
    console.info('Processing order cannot deliver:', data);
  }
}
