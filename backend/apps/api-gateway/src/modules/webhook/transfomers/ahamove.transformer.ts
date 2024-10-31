import { WebhookEvent, OrderEvent, OrderEventData, AhamoveOrderCallback } from '../types';
import { WebhookEventTransformer } from './transfomer.interface';

export class AhamoveOrderTransformer implements WebhookEventTransformer<OrderEventData> {
  canHandle(body: object): body is AhamoveOrderCallback {
    return 'order_id' in body && 'status' in body;
  }

  transform(body: AhamoveOrderCallback): WebhookEvent<OrderEventData> {
    return {
      type: this.getEventType(body.status),
      timestamp: new Date().toISOString(),
      data: {
        id: body.order_id || body._id,
      },
    };
  }

  protected getEventType(status: AhamoveOrderCallback['status']): OrderEvent {
    switch (status) {
      case 'IN PROCESS':
        return OrderEvent.Delivering;
      case 'COMPLETED':
        return OrderEvent.Delivered;
      case 'CANCELLED':
        return OrderEvent.NotDelivered;
    }
  }
}
