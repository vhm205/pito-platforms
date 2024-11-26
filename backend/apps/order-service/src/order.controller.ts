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
  Order,
  OrderFilterDto,
  Orders,
  OrdersServiceController,
  OrderWithPagination,
  QueryOrderWithPagination,
  SortDirection,
  UpdateStoreOrderResponse,
  UpdateStoreOrderStatusRequest,
} from '@app/common/types';
import { Controller } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { SortOrderDto } from './dto';
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

    return { order: updatedOrder as Order };
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

  async findOrder(payload: FindOrderRequest): Promise<FindOrderResponse> {
    const order = await this.orderService.findOneOrder(payload);
    if (!order) {
      throw new RpcException({
        message: 'Order not found for the provided payload',
        status: GrpcStatus.NOT_FOUND,
      });
    }

    return {
      order: {
        id: order.id,
        orderCode: order.orderCode,
        totalPrice: order.totalPrice,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        deliveryDate: order.deliveryAt ?? undefined,
      },
    };
  }

  async findStoreOrder(request: FindStoreOrderRequest): Promise<FindStoreOrderResponse> {
    const storeOrder = await this.storeOrderService.findOneStoreOrder(request);
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

  async findOrders(dto: OrderFilterDto): Promise<Orders> {
    // eslint-disable-next-line no-console
    console.log('Finding orders', { metadata: dto });
    await this.orderService.findOrders(); // we will implement this method in the next steps
    return Promise.resolve({ orders: [], total: 0 });
  }

  async findOrdersWithPagination(args: QueryOrderWithPagination): Promise<OrderWithPagination> {
    const { page, pageSize, sorts } = args;

    const paginationOptions = { page, pageSize };
    const sortsFormatted = sorts?.map(sort => ({
      column: sort.field,
      direction: sort.direction === SortDirection.ASC ? 'ASC' : 'DESC',
    })) as SortOrderDto[];

    const { metadata } = await this.orderService.findOrdersWithPagination({
      paginationOptions,
      sorts: sortsFormatted ?? [],
    });

    return { orders: [], total: metadata.total };
  }
}
