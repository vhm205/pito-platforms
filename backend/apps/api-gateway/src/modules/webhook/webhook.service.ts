import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { OrderEventHandler, WebhookEventHandler } from './events';

export type EventType = 'order_events' | 'user_events' | 'payment_events';

@Injectable()
export class WebhookService {
  constructor(private readonly orderEventHandler: OrderEventHandler) {}

  async processEvent(eventType: EventType, req: Request): Promise<void> {
    const handler = this.getEventHandler(eventType);
    return this.withAuthentication(handler, req).processEvent(handler.transformEvent(req.body));
  }

  protected getEventHandler(eventType: EventType) {
    switch (eventType) {
      case 'order_events':
        return this.orderEventHandler;
      case 'user_events':
      case 'payment_events':
        throw new Error('Not implemented');
    }
  }

  protected withAuthentication(handler: WebhookEventHandler, req: Request) {
    if (!handler.authenticate(req)) {
      throw new UnauthorizedException('The request is not authenticated');
    }
    return handler;
  }
}
