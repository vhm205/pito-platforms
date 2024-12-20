import {
  OrdersServiceControllerMethods,
  UpdateOrderResponse,
  UpdateOrderStatusRequest,
  FindOrderResponse,
} from '@app/common';
import { GrpcStatus } from '@app/common/enums';
import {
  FindOrderRequest,
  FindStoreOrderRequest,
  FindStoreOrderResponse,
  FindOrdersRequest,
  FindOrdersResponse,
  OrdersServiceController,
  UpdateStoreOrderResponse,
  UpdateStoreOrderStatusRequest,
  FindStoreOrdersRequest,
  FindStoreOrdersResponse,
  UpdateOrderRequest,
} from '@app/common/types';
import { Controller } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { NotificationService } from './notification.service';
import { OrderService } from './order.service';
import { StoreOrderService } from './store-order.service';

@Controller()
@OrdersServiceControllerMethods()
export class OrderController implements OrdersServiceController {
  constructor(
    private readonly orderService: OrderService,
    private readonly storeOrderService: StoreOrderService,
    private readonly notificationService: NotificationService,
  ) {}

  async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<UpdateOrderResponse> {
    const updatedOrder = await this.orderService.updateOrderStatus(request);
    this.notificationService.notifyOrder(updatedOrder);

    return { order: updatedOrder.toMessage() };
  }

  async updateStoreOrderStatus(
    payload: UpdateStoreOrderStatusRequest,
  ): Promise<UpdateStoreOrderResponse> {
    const updatedStoreOrder = await this.storeOrderService.updateStoreOrderStatus(payload);
    this.notificationService.notifyStoreOrder(updatedStoreOrder);

    return {
      id: updatedStoreOrder.id,
      status: updatedStoreOrder.status,
    };
  }

  async findOrder(request: FindOrderRequest): Promise<FindOrderResponse> {
    const order = await this.orderService.findOneOrder(request);
    if (!order) {
      throw new RpcException({
        message: 'Order not found for the provided request',
        status: GrpcStatus.NOT_FOUND,
      });
    }

    return { order: order.toMessage() };
  }

  async findOrders(request: FindOrdersRequest): Promise<FindOrdersResponse> {
    request.filters ??= [];
    request.sorts ??= [];

    const [orders, totalCount] = await this.orderService.findOrdersWithPagination(request);

    return {
      orders: orders.map(order => order.toMessage()),
      totalCount,
    };
  }

  async findStoreOrder(request: FindStoreOrderRequest): Promise<FindStoreOrderResponse> {
    const storeOrder = await this.storeOrderService
      .findOneStoreOrder(request)
      .then(order => order?.toMessage());

    if (!storeOrder) {
      throw new RpcException({
        message: 'Store order not found for the provided payload',
        status: GrpcStatus.NOT_FOUND,
      });
    }

    return {
      storeOrder,
    };
  }

  async updateOrder(request: UpdateOrderRequest): Promise<UpdateOrderResponse> {
    const updatedOrder = await this.orderService.updateOrder(request);
    if (!updatedOrder) {
      throw new RpcException({
        message: 'Failed to update order',
        status: GrpcStatus.INTERNAL,
      });
    }

    return { order: updatedOrder.toMessage() };
  }

  async findStoreOrders(request: FindStoreOrdersRequest): Promise<FindStoreOrdersResponse> {
    request.filters ??= [];
    request.sorts ??= [];

    const [storeOrders, totalCount] =
      await this.storeOrderService.findStoreOrdersWithPagination(request);

    return {
      orders: storeOrders.map(order => order.toMessage()),
      totalCount,
    };
  }
}
