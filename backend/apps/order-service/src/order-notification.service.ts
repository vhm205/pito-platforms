import { formatCurrency, formatTimestamp, LoggerService } from '@app/common';
import {
  Channel,
  NotificationEventPattern,
  NotificationTemplateCode,
  NotificationType,
  PushType,
} from '@app/common/enums';
import { SendNotificationDto } from '@app/common/types/notification';
import { OrderStatus } from '@app/common/types/proto/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecord, RmqRecordBuilder } from '@nestjs/microservices';
import { getOrderNotificationTemplate } from 'apps/notification-service/src/utils';
import { RedisStore } from 'cache-manager-redis-yet';
import { get, map } from 'lodash';

import { ORDER_CACHE_PREFIX } from './constants/order';
import { Order } from './domain';
import { StoreRepository } from './infrastructure/persistence/store.repository';
import { getOrderStatusTemplateIds } from './utils/sendgrid-template';

@Injectable()
export class OrderNotificationService {
  private readonly version = '1.0.0';
  private readonly fromEmail = { name: 'PITO', email: 'no-reply@pito.vn' };

  constructor(
    private readonly logger: LoggerService,
    private readonly storeRepository: StoreRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: RedisStore,
    @Inject('NOTIFICATIONS_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  private buildRmqRecord(data: SendNotificationDto, priority = 0): RmqRecord<SendNotificationDto> {
    return new RmqRecordBuilder(data)
      .setOptions({
        headers: { 'x-version': this.version },
        persistent: true,
        priority,
      })
      .build();
  }

  private notify(record: RmqRecord<SendNotificationDto>) {
    try {
      this.rabbitClient.emit(NotificationEventPattern.SEND, record);
      this.logger.log(`Notification event emitted`);
    } catch (e) {
      const error = e as Error;
      this.logger.error(`Failed to emit event: ${error.message}`, {
        context: OrderNotificationService.name,
        trace: error.stack,
        metadata: record.data,
      });
    }
  }

  private getBaseDynamicDataForOrder(order: Order) {
    return {
      recipient: {
        name: order.receiverName,
        email: order.receiverEmail,
      },
      order: {
        code: order.orderCode,
        createdAt: order.createdAt && formatTimestamp(order.createdAt),
        deliveryTime: order.deliveryDate && formatTimestamp(order.deliveryDate),
        // time: order.deliveryDate && formatTimestamp(order.deliveryDate),
        statusCode: order.statusCode,
        canceledByCustomer: order.canceledByUser,
        items: map(order.orderItems, orderItem => ({
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
      },
      extraLinks: {
        searchPageURL: process.env.CUSTOMER_CLIENT_URL,
        orderDetailURL: `${process.env.CUSTOMER_CLIENT_URL}/don-hang/${order.id}`, // Maybe need to change this to orderCode in the future
      },
    };
  }

  async sendOrderStatusUpdateNotification(order: Order) {
    const dynamicData = this.getBaseDynamicDataForOrder(order);

    switch (order.statusCode) {
      case OrderStatus.COMPLETED: {
        const store = await this.storeRepository.findOne({ id: order.storeId })!;
        dynamicData['store'] = { name: get(store, 'storeName') };
      }
      case OrderStatus.DELIVERING:
        dynamicData.order['deliveryEta'] = order.deliveryEta;
        dynamicData.extraLinks['deliveryTrackingURL'] = order.trackingUrl;
        break;
      case OrderStatus.DELIVERY_FAILED: {
        dynamicData.order['cancel_reason'] = order.cancelReason;
      }
    }

    const emailMessage: SendNotificationDto['message']['email'] = {
      from: this.fromEmail,
      to: dynamicData.recipient.email!,
      templateId: getOrderStatusTemplateIds()[order.statusCode],
      dynamicTemplateData: dynamicData,
    };

    const messageRequest: SendNotificationDto = {
      notificationType: NotificationType.ORDER_STATUS_UPDATE,
      channels: [Channel.EMAIL],
      message: {
        email: emailMessage,
      },
    };

    this.notify(this.buildRmqRecord(messageRequest));
  }

  sendRefundStatusNotification(order: Order) {
    const dynamicData = this.getBaseDynamicDataForOrder(order);
    const emailMessage: SendNotificationDto['message']['email'] = {
      from: this.fromEmail,
      to: dynamicData.recipient.email!,
      templateId: process.env.SENDGRID_ORDER_REFUND_TEMPLATE_ID!, // Don't need to write a function to get this template ID
      dynamicTemplateData: dynamicData,
    };

    const messageRequest: SendNotificationDto = {
      notificationType: NotificationType.ORDER_STATUS_UPDATE,
      channels: [Channel.EMAIL],
      message: {
        email: emailMessage,
      },
    };

    this.notify(this.buildRmqRecord(messageRequest));
  }

  sendOrderConfirmNotification(payload: Record<string, any>) {
    const templateId = getOrderStatusTemplateIds()[OrderStatus.WAITING_FOR_DEPOSIT];

    const message: SendNotificationDto = {
      notificationType: NotificationType.ORDER_STATUS_UPDATE,
      channels: [Channel.EMAIL],
      message: {
        email: {
          from: this.fromEmail,
          to: payload.to,
          templateId,
          dynamicTemplateData: payload,
        },
      },
    };

    this.notify(this.buildRmqRecord(message));
  }

  async sendPaymentFailedNotification(order: Order) {
    const templateId = getOrderStatusTemplateIds()[OrderStatus.PAYMENT_FAILED];
    const cacheKey = `${ORDER_CACHE_PREFIX}:${order.orderCode}:mail`;
    const mailPayload: undefined | Record<string, any> = await this.cacheManager.get(cacheKey);

    if (!mailPayload) {
      return this.logger.error(`Failed to get mail payload for order ${order.orderCode}`, {
        metadata: {
          cacheKey,
        },
      });
    }

    const message: SendNotificationDto = {
      notificationType: NotificationType.ORDER_STATUS_UPDATE,
      channels: [Channel.EMAIL],
      message: {
        email: {
          from: this.fromEmail,
          to: order.receiverEmail!,
          templateId,
          dynamicTemplateData: mailPayload,
        },
      },
    };

    this.notify(this.buildRmqRecord(message));
  }

  async sendPaymentSuccessNotification(order: Order) {
    const templateIds = getOrderStatusTemplateIds();
    const templateId = templateIds[OrderStatus.WAITING_FOR_CONFIRMATION];
    const code = order.deliveryLater
      ? NotificationTemplateCode.ORDER_WAITING_FOR_CONFIRMATION
      : NotificationTemplateCode.ORDER_CREATED;
    const sound = [
      NotificationTemplateCode.ORDER_CREATED,
      NotificationTemplateCode.ORDER_WAITING_FOR_CONFIRMATION,
      NotificationTemplateCode.ORDER_NOT_CONFIRMED,
    ].includes(code)
      ? 'delivery_report.wav'
      : 'default';

    const cacheKey = `${ORDER_CACHE_PREFIX}:${order.orderCode}:mail`;
    const mailPayload: undefined | Record<string, any> = await this.cacheManager.get(cacheKey);

    if (!mailPayload) {
      return this.logger.error(`Failed to get mail payload for order ${order.orderCode}`, {
        metadata: {
          cacheKey,
        },
      });
    }

    const { title, body } = getOrderNotificationTemplate(code, order.orderCode);

    const message: SendNotificationDto = {
      notificationType: NotificationType.ORDER_STATUS_UPDATE,
      channels: [Channel.EMAIL, Channel.PUSH],
      message: {
        email: {
          from: this.fromEmail,
          to: order.receiverEmail!,
          templateId,
          dynamicTemplateData: mailPayload,
        },
        pushNotification: {
          type: PushType.TOPIC,
          topic: order.partnerId,
          platforms: {
            android: {
              priority: 'high',
            },
            apns: {
              payload: {
                aps: {
                  alert: {
                    title,
                    body,
                  },
                  'content-available': 1,
                  sound,
                },
              },
            },
          },
          data: {
            objectId: order.id,
            type: 'partnerOrder',
            title,
            body,
            code,
          },
        },
      },
    };

    this.notify(this.buildRmqRecord(message));
  }
}
