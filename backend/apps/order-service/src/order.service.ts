import { transformFilterRule } from '@app/common';
import { GrpcStatus, ReadableOrderStatus } from '@app/common/enums';
import {
  FindOrderRequest,
  FindOrdersRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
} from '@app/common/types';
import { NullableType } from '@app/common/types/common';
import { OrderStatus } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { isNumber } from 'lodash';

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
    const order = await this.orderRepository.findOne({ id }).then(order => order!); // Order must exist

    const timestamp = payload.timestamp ?? new Date();

    order.statusCode = status;
    order.operatorStatusCode = status;
    order.updatedAt = timestamp;

    if (cancelReason) order.cancelReason = cancelReason;

    switch (status) {
      case OrderStatus.PAYMENT_FAILED:
        order.status = ReadableOrderStatus.PAYMENT_FAILED;
        order.cancelReason ??= 'Thanh toán thất bại';
        break;
      case OrderStatus.CANCELED:
        // order.status = ReadableOrderStatus.CANCELED;
        order.cancelledAt = timestamp;
        break;
      case OrderStatus.REJECTED:
        // order.status = ReadableOrderStatus.REJECTED;
        order.cancelledAt = timestamp;
        break;
      case OrderStatus.CONFIRMED:
        // order.status = ReadableOrderStatus.CONFIRMED;
        order.confirmedAt = timestamp;
        break;
      case OrderStatus.PREPARING:
        // order.status = ReadableOrderStatus.PREPARING;
        order.preparingAt = timestamp;
        break;
      case OrderStatus.UNCONFIRMED:
        // order.status = ReadableOrderStatus.UNCONFIRMED;
        order.cancelledAt = timestamp;
        break;
      case OrderStatus.PREPARED:
        // order.status = ReadableOrderStatus.PREPARING; // TODO: change to PREPARED
        order.preparedAt = timestamp;
        break;
      case OrderStatus.DELIVERING:
        // order.status = ReadableOrderStatus.DELIVERING;
        order.deliveryAt = timestamp;
        order.deliveryEta = deliveryEta ?? null;
        break;
      case OrderStatus.DELIVERY_FAILED:
        // order.status = ReadableOrderStatus.DELIVERY_FAILED;
        order.deliveryFailedAt = timestamp;
        break;
      case OrderStatus.COMPLETED:
        // order.status = ReadableOrderStatus.COMPLETED;
        order.completedAt = timestamp;
        break;
    }

    const updatedOrder = await this.orderRepository.updateOrder(order);
    if (!updatedOrder) {
      throw new RpcException({
        message: `Failed to update order with ID ${order.id}`,
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

  async updateOrder(request: UpdateOrderRequest): Promise<NullableType<Order>> {
    const order = await this.orderRepository.findOne({ id: request.id });
    if (!order) {
      throw new RpcException({
        message: `We could not find the order with id ${request.id}`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const currentDateTime = new Date();

    if (request.statusCode) order.statusCode = request.statusCode;
    if (request.operatorStatusCode) order.operatorStatusCode = request.operatorStatusCode;
    // if (request.operationNotes)
    //   order.metadata = assign(order.metadata, { operationNotes: request.operationNotes });
    // if (request.changeLogs)
    //   order.metadata = assign(order.metadata, { changeLogs: request.changeLogs });
    if (isNumber(request.refundStatus)) {
      order.refundStatus = request.refundStatus;
      if (order.refundStatus) order.refundedAt = currentDateTime; // if refundStatus is equal to 1
    }
    if (request.metadata) order.metadata = request.metadata;

    order.updatedAt = currentDateTime;

    return this.orderRepository.updateOrder(order);
  }
}
