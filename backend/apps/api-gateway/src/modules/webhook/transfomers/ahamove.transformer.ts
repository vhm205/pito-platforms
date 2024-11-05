import { Injectable } from '@nestjs/common';
import {
  WebhookEvent,
  AhamoveOrderCallback,
  OrderEvent,
  OrderEventData,
} from '@gateway/modules/webhook/types';
import { WebhookEventTransformer } from './transformer.interface';

@Injectable()
export class AhamoveOrderTransformer implements WebhookEventTransformer<OrderEventData> {
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
