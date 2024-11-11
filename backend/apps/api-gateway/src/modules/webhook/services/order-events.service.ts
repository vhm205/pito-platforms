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

  protected async handleOrderDelivering({ orderCode }: OrderEventData): Promise<void> {
    // status for order of store will be completed
    // status for order of customer will be delivering
    this.logger.log('Handling order delivering', { metadata: orderCode });
    // this.orderService.updateOrderDeliveryStatus({ orderCode, status: 'completed' });
    return Promise.resolve();
  }

  protected async handleOrderDelivered(data: OrderEventData): Promise<void> {
    // status for order of customer will be completed
    this.logger.log('Handling order completed', { metadata: data });
    return Promise.resolve();
  }

  protected async handleOrderDeliveryFailed(data: OrderEventData): Promise<void> {
    this.logger.log('Handling order delivery failed', { metadata: data });
    // status for order of customer will be delivery_failed
    return Promise.resolve();
  }
}

export enum OrderStatus {
  PendingPayment = 'pending_payment', // 1000 - Chờ thanh toán
  PaymentFailed = 'payment_failed', // 704 - Thanh toán thất bại
  AwaitingConfirmation = 'awaiting_confirmation', // 100 - Chờ xác nhận
  Canceled = 'canceled', // 701 - Đã hủy
  Rejected = 'rejected', // 702 - Không nhận đơn
  Preparing = 'preparing', // 300 - Đang chuẩn bị
  Delivering = 'delivering', // 400 - Đang giao hàng
  Completed = 'completed', // 500 - Hoàn thành
  DeliveryFailed = 'delivery_failed', // 600 - Giao hàng thất bại
}

export enum StoreOrderStatus {
  AwaitingConfirmation = 'awaiting_confirmation', // 100
  Confirmed = 'confirmed', // 101 - Đã xác nhận
  Canceled = 'canceled', // 701 - Đã hủy, 702 - Đơn không được đối chấp nhận
  Preparing = 'preparing', // 300 - Đang chuẩn bị
  Prepared = 'prepared', // 301 - Chuẩn bị xong
  Completed = 'completed', // 500 - Hoàn thành
}
