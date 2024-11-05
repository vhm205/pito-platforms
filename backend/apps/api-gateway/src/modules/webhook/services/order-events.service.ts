import { Injectable } from '@nestjs/common';
import { WebhookEvent, OrderEvent, OrderEventData } from '@gateway/modules/webhook/types';

@Injectable()
export class OrderEventsService {
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

  protected async orderDelivering(data: OrderEventData): Promise<void> {
    console.info('Processing order delivering:', data);
    return Promise.resolve();
  }

  protected async orderDelivered(data: OrderEventData): Promise<void> {
    console.info('Processing order completed:', data);
    return Promise.resolve();
  }

  protected async orderNotDelivered(data: OrderEventData): Promise<void> {
    console.info('Processing order cannot deliver:', data);
    return Promise.resolve();
  }
}
