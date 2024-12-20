import { LoggerService, formatCurrency, formatTimestamp } from '@app/common';
import { Channel, NotificationEventPattern, NotificationType } from '@app/common/enums';
import { SendNotificationDto } from '@app/common/types';
import { OrderStatus } from '@app/common/types/proto/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecord, RmqRecordBuilder } from '@nestjs/microservices';

import { Order, Store, StoreOrder } from './domain';
import { StoreRepository } from './infrastructure/persistence/store.repository';
import { getOrderTemplateIds } from './utils/sendgrid-template';

@Injectable()
export class NotificationService {
  private readonly version = '1.0.0';
  private readonly fromEmail = { name: 'PITO', email: 'no-reply@pito.vn' };

  constructor(
    private readonly logger: LoggerService,
    private readonly storeRepository: StoreRepository,
    @Inject('NOTIFICATIONS_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  async notifyOrder(order: Order) {
    const shouldNotify = [
      OrderStatus.COMPLETED,
      OrderStatus.DELIVERING,
      OrderStatus.DELIVERY_FAILED,

      OrderStatus.CANCELED,
      OrderStatus.REJECTED,
      OrderStatus.UNCONFIRMED,
      // Additional order statuses that require notifications can be added here
    ].includes(order.statusCode);

    if (!shouldNotify) {
      this.logger.log(`Don't need to send a notification for order status: ${order.status}`, {
        metadata: {
          orderId: order.id,
        },
      });
      return;
    }

    const store = await this.storeRepository.findOne({ id: order.storeId });
    const messages = this.buildMessagesForOrder(order, store!);
    const records = messages.map(message => this.buildRmqRecord(message));
    records.forEach(record => this.notify(record));
  }

  notifyStoreOrder(storeOrder: StoreOrder) {
    const messages = this.buildMessagesForStoreOrder(storeOrder);
    const records = messages.map(message => this.buildRmqRecord(message));
    records.forEach(record => this.notify(record));
  }

  private notify(record: RmqRecord<SendNotificationDto>) {
    try {
      this.rabbitClient.emit(NotificationEventPattern.SEND, record);
      this.logger.log(`Notification event emitted: ${NotificationEventPattern.SEND}`, {
        metadata: record.data,
      });
    } catch (e) {
      const error = e as Error;
      this.logger.error(`Failed to emit event: ${error.message}`, {
        trace: error.stack,
        metadata: record.data,
      });
    }
  }

  private buildRmqRecord(data: SendNotificationDto): RmqRecord<SendNotificationDto> {
    return new RmqRecordBuilder(data)
      .setOptions({
        headers: { 'x-version': this.version },
        persistent: true,
        priority: 0,
      })
      .build();
  }

  private buildMessagesForOrder(order: Order, store: Store): Array<SendNotificationDto> {
    const templateIds = getOrderTemplateIds();
    return [
      {
        notificationType: NotificationType.ORDER_STATUS_UPDATE,
        channels: [Channel.EMAIL],
        message: {
          email: {
            from: this.fromEmail,
            to: order.receiverEmail!,
            templateId: templateIds[order.statusCode],
            dynamicTemplateData: this.getDynamicTemplateData(order, store),
          },
        },
      },
    ];
  }

  private buildMessagesForStoreOrder(_storeOrder: StoreOrder): Array<SendNotificationDto> {
    // Implement logic for store order notifications.
    return [];
  }

  private getDynamicTemplateData(order: Order, store: Store): Record<string, unknown> {
    const orderPayload = {
      code: order.orderCode,
      createdAt: formatTimestamp(order.createdAt),
      deliveryTime: order.deliveryDate && formatTimestamp(order.deliveryDate),
      statusCode: order.statusCode,
      canceledByCustomer: order.canceledByUser,
      items: order.orderItems.map(orderItem => ({
        name: orderItem.item?.name,
        amount: formatCurrency(orderItem.totalPrice),
        quantity: orderItem.quantity,
        notes: orderItem.notes,
      })),
      pricing: {
        subtotal: formatCurrency(order.subTotalPrice),
        shippingFee: formatCurrency(order.shippingFee),
        discountShippingFee: formatCurrency(order.discountShippingFee),
        voucherDiscount: formatCurrency(order.discountAmount),
        totalPaid: formatCurrency(order.totalPrice),
      },
    };

    switch (order.statusCode) {
      case OrderStatus.COMPLETED:
        return {
          subject: `Đơn hàng ${order.orderCode} đã được giao thành công`,
          user_name: order.receiverName,
          store_name: store.storeName,
          order_code: order.orderCode,
          order_time: formatTimestamp(order.createdAt),

          total_sub_amount: formatCurrency(order.subTotalPrice),
          shipping_fee: formatCurrency(order.shippingFee),
          discount_shipping_fee: formatCurrency(order.discountShippingFee),
          voucher: formatCurrency(order.discountAmount),
          total_paid: formatCurrency(order.totalPrice),
          link: 'https://pito.vn/tim-kiem',
        };
      case OrderStatus.DELIVERY_FAILED: {
        orderPayload['cancel_reason'] = order.cancelReason;
        break;
      }
    }

    return {
      recipient: {
        name: order.receiverName,
        email: order.receiverEmail,
      },
      store: { name: store.storeName },
      order: orderPayload,
      extraLinks: {
        deliveryTrackingURL: order.trackingUrl,
        searchPageURL: process.env.CUSTOMER_CLIENT_URL,
        orderDetailURL: `${process.env.CUSTOMER_CLIENT_URL}/don-hang/${order.id}`, // Maybe need to change this to orderCode in the future
      },
    };
  }
}
