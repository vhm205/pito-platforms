import {
  Order,
  ORDER_SERVICE,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
  StoreOrder as StoreOrderMessage,
} from '@app/common';
import { OrderStatus } from '@app/common/types/proto/common';
import { WebhookEvent, OrderEvent, OrderEventData } from '@gateway/modules/webhook/types';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderEventsService implements OnModuleInit {
  private orderService: OrdersServiceClient;

  constructor(@Inject(ORDER_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
  }

  async processEvent({ type, data }: WebhookEvent<OrderEventData>): Promise<void> {
    switch (type) {
      case OrderEvent.Delivering:
        return this.handleOrderDelivering(data);
      case OrderEvent.Delivered:
        return this.handleOrderDelivered(data);
      case OrderEvent.FailedDelivery:
        return this.handleOrderDeliveryFailed(data);
    }
  }

  protected async getOrderByCode(orderCode: string): Promise<Order> {
    const { order } = await firstValueFrom(this.orderService.findOrder({ orderCode }));
    if (!order) throw new NotFoundException(`Order with code ${orderCode} does not exist`);
    return order!;
  }

  protected async getStoreOrderByCode(orderCode: string): Promise<StoreOrderMessage> {
    const { storeOrder } = await firstValueFrom(this.orderService.findStoreOrder({ orderCode }));
    if (!storeOrder) {
      throw new NotFoundException(`Store Order with code ${orderCode} does not exist`);
    }
    return storeOrder;
  }

  protected async handleOrderDelivering(data: OrderEventData): Promise<void> {
    const [order, storeOrder] = await Promise.all([
      this.getOrderByCode(data.orderCode),
      this.getStoreOrderByCode(data.orderCode),
    ]);

    const promises = [
      this.orderService.updateOrderStatus({
        id: order.id,
        status: OrderStatus.DELIVERING,
        deliveryEta: data.duration,
      }),
      this.orderService.updateStoreOrderStatus({
        id: storeOrder.id,
        status: OrderStatus.COMPLETED,
      }),
    ];

    await Promise.all(promises.map(firstValueFrom));
  }

  protected async handleOrderDelivered(data: OrderEventData): Promise<void> {
    const [order] = await Promise.all([this.getOrderByCode(data.orderCode)]);

    const promises = [
      this.orderService.updateOrderStatus({
        id: order.id,
        status: OrderStatus.COMPLETED,
      }),
    ];

    await Promise.all(promises.map(firstValueFrom));
  }

  protected async handleOrderDeliveryFailed(data: OrderEventData): Promise<void> {
    const [order] = await Promise.all([this.getOrderByCode(data.orderCode)]);

    const promises = [
      this.orderService.updateOrderStatus({
        id: order.id,
        status: OrderStatus.DELIVERY_FAILED,
        cancelReason: data.cancelInfo?.reason,
      }),
    ];

    await Promise.all(promises.map(firstValueFrom));
  }
}

// export enum OrderStatus {
//   PendingPayment = 'pending_payment', // 1000 - Chờ thanh toán
//   PaymentFailed = 'payment_failed', // 704 - Thanh toán thất bại
//   AwaitingConfirmation = 'awaiting_confirmation', // 100 - Chờ xác nhận
//   Canceled = 'canceled', // 701 - Đã hủy
//   Rejected = 'rejected', // 702 - Không nhận đơn
//   Preparing = 'preparing', // 300 - Đang chuẩn bị
//   Delivering = 'delivering', // 400 - Đang giao hàng
//   Completed = 'completed', // 500 - Hoàn thành
//   DeliveryFailed = 'delivery_failed', // 600 - Giao hàng thất bại
// }

// export enum StoreOrderStatus {
//   AwaitingConfirmation = 'awaiting_confirmation', // 100
//   Confirmed = 'confirmed', // 101 - Đã xác nhận
//   Canceled = 'canceled', // 701 - Đã hủy, 702 - Đơn không được đối chấp nhận
//   Preparing = 'preparing', // 300 - Đang chuẩn bị
//   Prepared = 'prepared', // 301 - Chuẩn bị xong
//   Completed = 'completed', // 500 - Hoàn thành
// }
