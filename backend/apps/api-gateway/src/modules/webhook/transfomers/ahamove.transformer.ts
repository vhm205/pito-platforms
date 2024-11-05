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

    const [pickupPath, deliveryPath] = body.path;

    return {
      type: this.getEventType(body),
      timestamp: new Date().toISOString(),
      data: {
        orderCode: pickupPath.tracking_number ?? deliveryPath.tracking_number,
        isCancelledByUser: body.cancel_by_user,
        pickupTimestamp: body.pickup_time,
        completionTimestamp: deliveryPath.complete_time,
        cancelTimestamp: body.cancel_time,
        cancelReason: body.cancel_comment,
        images: {
          pickupImageUrl: pickupPath.pop_info,
          deliveryImageUrl: deliveryPath.pop_info,
        },
      },
    };
  }

  protected getEventType({ status, path }: AhamoveOrderCallback): OrderEvent {
    switch (status) {
      case 'IN PROCESS':
        return OrderEvent.Delivering;
      case 'COMPLETED': {
        const [, deliveryPath] = path;
        return deliveryPath.status === 'COMPLETED'
          ? OrderEvent.Delivered
          : deliveryPath.status === 'FAILED'
            ? OrderEvent.FailedDelivery
            : OrderEvent.Unhandled;
      }
      default:
        return OrderEvent.Unhandled;
    }
  }
}
