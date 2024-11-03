import { WebhookEvent, OrderEvent, OrderEventData, AhamoveOrderCallback } from '../types';
import { WebhookEventTransformer } from './transfomer.interface';

export class AhamoveOrderTransformer implements WebhookEventTransformer<OrderEventData> {
  canHandle(_body: object): _body is AhamoveOrderCallback {
    // return '_id' in body && 'status' in body && 'path' in body && 'service_id' in body;
    return true; // for testing
  }

  transform(body: AhamoveOrderCallback): WebhookEvent<OrderEventData> {
    console.info('Transforming Ahamove order event');
    console.log(JSON.stringify(body, null, 2));
    return {
      type: this.getEventType(body.status),
      timestamp: new Date().toISOString(),
      data: {
        order_code: body.path.find(path => path.tracking_number).tracking_number,
        cancel_by_user: body.cancel_by_user,
        cancel_comment: body.cancel_comment,
        cancel_image_url: body.cancel_image_url,
        cancel_time: body.cancel_time,
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
