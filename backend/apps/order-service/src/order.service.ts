import { transformFilterRule } from '@app/common';
import { GrpcStatus, ReadableOrderStatus } from '@app/common/enums';
import { FindOrderRequest, FindOrdersRequest, UpdateOrderStatusRequest } from '@app/common/types';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Order } from './domain';
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
    order.status = status as ReadableOrderStatus;
    order.updatedAt = timestamp;

    switch (status as ReadableOrderStatus) {
      case ReadableOrderStatus.DELIVERING:
        order.deliveryAt = timestamp;
        order.deliveryEta = deliveryEta ?? null;
        break;
      case ReadableOrderStatus.DELIVERY_FAILED:
        order.cancelReason = cancelReason ?? '';
        order.deliveryFailedAt = timestamp;
        break;
      case ReadableOrderStatus.COMPLETED:
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

  async findAllOrders({ filters }: FindOrdersRequest): Promise<[Order[], number]> {
    return this.orderRepository
      .findAllOrders(filters.map(transformFilterRule))
      .then(orders => [orders, orders.length]);
  }

  async findOrdersWithPagination({
    pagination,
    filters,
    sorts,
  }: FindOrdersRequest): Promise<[Order[], number]> {
    return this.orderRepository.findOrdersWithPagination({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });
  }
}
