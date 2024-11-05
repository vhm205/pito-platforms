import { Injectable } from '@nestjs/common';
import { WebhookEvent, OrderEvent, OrderEventData } from '@gateway/modules/webhook/types';

@Injectable()
export class OrderEventsService {
  async processEvent(event: WebhookEvent<OrderEventData>): Promise<void> {
    switch (event.type) {
      case OrderEvent.Delivering:
        return this.handleOrderDelivering(event.data);
      case OrderEvent.Delivered:
        return this.handleOrderDelivered(event.data);
      case OrderEvent.FailedDelivery:
        return this.handleOrderDeliveryFailed(event.data);
      default:
        console.warn('Unhandled event:', event.type);
    }
  }

  protected async handleOrderDelivering(data: OrderEventData): Promise<void> {
    console.info('Handling order delivering:', data);
    return Promise.resolve();
  }

  protected async handleOrderDelivered(data: OrderEventData): Promise<void> {
    console.info('Handling order completed:', data);
    return Promise.resolve();
  }

  protected async handleOrderDeliveryFailed(data: OrderEventData): Promise<void> {
    console.info('Handling order delivery failed:', data);
    return Promise.resolve();
  }
}
