import { Injectable } from '@nestjs/common';
import { WebhookEvent, OrderEvent, OrderEventData } from '@gateway/modules/webhook/types';
import { LoggerService } from '@app/common';

@Injectable()
export class OrderEventsService {
  constructor(private readonly logger: LoggerService) {}

  async processEvent({ type, data }: WebhookEvent<OrderEventData>): Promise<void> {
    switch (type) {
      case OrderEvent.Delivering:
        return this.handleOrderDelivering(data);
      case OrderEvent.Delivered:
        return this.handleOrderDelivered(data);
      case OrderEvent.FailedDelivery:
        return this.handleOrderDeliveryFailed(data);
      default:
        this.logger.warn(`Unhandled event ${type}`);
    }
  }

  protected async handleOrderDelivering(data: OrderEventData): Promise<void> {
    this.logger.log('Handling order delivering', { metadata: data });
    return Promise.resolve();
  }

  protected async handleOrderDelivered(data: OrderEventData): Promise<void> {
    this.logger.log('Handling order completed', { metadata: data });
    return Promise.resolve();
  }

  protected async handleOrderDeliveryFailed(data: OrderEventData): Promise<void> {
    this.logger.log('Handling order delivery failed', { metadata: data });
    return Promise.resolve();
  }
}
