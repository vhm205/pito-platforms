import { Injectable } from '@nestjs/common';
import {
  WebhookEvent,
  AhamoveOrderCallback,
  OrderEvent,
  OrderEventData,
} from '@gateway/modules/webhook/types';
import { WebhookEventTransformer } from './transformer.interface';
import { LoggerService } from '@app/common';

@Injectable()
export class AhamoveOrderTransformer implements WebhookEventTransformer<OrderEventData> {
  constructor(private readonly logger: LoggerService) {}

  transform(body: AhamoveOrderCallback): WebhookEvent<OrderEventData> {
    this.logger.log('Transforming Ahamove order event', { metadata: body });

    const [pickupPath, deliveryPath] = body.path;

    const eventType = this.getEventType(body);
    const eventData: OrderEventData = {
      orderCode: pickupPath.tracking_number ?? deliveryPath.tracking_number,
      isUserCancelled: body.cancel_by_user,
      timestamps: {
        pickup: body.pickup_time,
        cancel: deliveryPath.fail_time,
        completion: deliveryPath.complete_time,
      },
      ...(deliveryPath.fail_comment && {
        cancelInfo: { reason: deliveryPath.fail_comment },
      }),
      images: {
        pickupUrl: pickupPath.pop_info,
        deliveryUrl: deliveryPath.pod_info ?? deliveryPath.pof_info,
      },
      trackingUrl: body.shared_link,
    };

    return {
      type: eventType,
      timestamp: new Date().getTime(),
      data: eventData,
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
