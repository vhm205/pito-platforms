import { pagePagination } from '@app/common';
import { GrpcStatus, OrderStatus } from '@app/common/enums';
import { FindOrderRequest, UpdateOrderStatusRequest } from '@app/common/types';
import { PaginationOptions } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Order } from './domain';
import { FilterOrderDto, SortOrderDto } from './dto';
import { OrderRepository } from './infrastructure/persistence/order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async findOneOrder(payload: FindOrderRequest) {
    return this.orderRepository.findOne(payload);
  }

  async updateOrderStatus(payload: UpdateOrderStatusRequest): Promise<Order> {
    const { id, status, cancelReason, deliveryEta } = payload;
    const order = await this.orderRepository.findOne({ id });
    if (!order) {
      throw new RpcException({
        message: `Order with ID ${id} not found`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const timestamp = payload.timestamp ?? new Date();
    order.status = status as OrderStatus;
    order.updatedAt = timestamp;

    switch (status as OrderStatus) {
      case OrderStatus.DELIVERING:
        order.deliveryAt = timestamp;
        order.deliveryEta = deliveryEta ?? null;
        break;
      case OrderStatus.DELIVERY_FAILED:
        order.cancelReason = cancelReason ?? '';
        order.deliveryFailedAt = timestamp;
        break;
      case OrderStatus.COMPLETED:
        order.completedAt = timestamp;
        break;
      default:
        return order as Order; // don't need to process
    }

    const updatedOrder = await this.orderRepository.updateOrder(order);
    if (!updatedOrder) {
      throw new RpcException({
        menubar: `Failed to update order with ID ${order.id}`,
        status: GrpcStatus.INTERNAL,
      });
    }

    return updatedOrder;
  }

  findOrders() {
    return Promise.resolve([[], 0]);
  }

  async findOrdersWithPagination(options: {
    paginationOptions: PaginationOptions;
    sorts: SortOrderDto[];
    filters?: FilterOrderDto;
  }) {
    const [orders, count] = await this.orderRepository.findOrdersWithPagination({
      paginationOptions: options.paginationOptions,
      sorts: options.sorts,
      filters: options.filters,
    });

    return pagePagination(orders, {
      total: count,
      page: options.paginationOptions.page,
      pageSize: options.paginationOptions.pageSize,
    });
  }
}
