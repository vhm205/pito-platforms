import {
  WebhookEvent,
  AhamoveOrderCallback,
  OrderEvent,
  OrderEventData,
} from '@gateway/modules/webhook/types';
import { Injectable } from '@nestjs/common';

import { WebhookEventTransformer } from './transformer.interface';

@Injectable()
export class AhamoveOrderTransformer implements WebhookEventTransformer<OrderEventData> {
  transform(body: AhamoveOrderCallback): WebhookEvent<OrderEventData> {
    const [pickupPath, deliveryPath] = body.path;

    const eventType = this.getEventType(body);
    const eventData: OrderEventData = {
      orderCode: pickupPath.tracking_number ?? deliveryPath.tracking_number,
      isUserCancelled: body.cancel_by_user,
      duration: body.duration,
      timestamps: {
        pickup: body.pickup_time,
        cancel: deliveryPath.fail_time,
        completion: deliveryPath.complete_time,
      },
      ...(deliveryPath.fail_comment && {
        cancelInfo: { reason: this.translateFailComment(deliveryPath.fail_comment) },
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
    const [pickupPath, deliveryPath] = path;
    if (status === 'IN PROCESS') {
      if (!pickupPath.status && !deliveryPath.status) {
        return OrderEvent.Delivering;
      }
    } else if (status === 'COMPLETED') {
      switch (deliveryPath.status) {
        case 'COMPLETED':
          return OrderEvent.Delivered;
        case 'FAILED':
          return OrderEvent.FailedDelivery;
      }
    }
    return OrderEvent.Unhandled;
  }

  private translateFailComment(reason: string) {
    const translations = {
      "recipient doesn't pickup phone calls": 'Người nhận không nghe máy',
      'recipient cannot be reached': 'Thuê bao Người nhận không liên lạc được',
      "incorrect recipient's phone number": 'Sai số điện thoại',
      'recipient does not show up': 'Người nhận không xuất hiện',
      'recipient reschedules the delivery to a different day': 'Người nhận hẹn lại ngày giao',
      'the recipient reschedules the delivery to a different time of day':
        'Người nhận hẹn giao lại trong ngày',
      'recipient changes delivery address': 'Người nhận đổi địa chỉ giao hàng',
      'sender changes delivery address': 'Người gửi thay đổi địa điểm nhận hàng',
      'recipient provides incorrect address': 'Người nhận đặt hàng sai địa chỉ',
      'package inspection is not allowed': 'Không được kiểm/thử hàng',
      'drop-off location has been changed': 'Điểm giao hàng bị thay đổi',
      "package does not match recipient's request": 'Hàng hóa không như người nhận yêu cầu',
      'incorrect cod amount': 'Sai tiền thu hộ COD',
      'recipient changes decision': 'Người nhận đổi ý',
      'duplicated or scam order': 'Người nhận không đặt hàng, đơn trùng',
      'broken package': 'Hàng hóa hư hỏng',
      'lost package': 'Hàng hóa thất lạc',
      'recipient has no cash available': 'Người nhận không có đủ tiền để thanh toán',
      'language diffrences': 'Bất đồng ngôn ngữ',
      'sender ask to return the package': 'Người gửi yêu cầu trả lại hàng',
    };
    return translations[reason.toLowerCase()];
  }
}
