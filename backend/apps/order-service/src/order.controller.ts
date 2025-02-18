import {
  OrdersServiceControllerMethods,
  UpdateOrderResponse,
  UpdateOrderStatusRequest,
  FindOrderResponse,
  LoggerService,
} from '@app/common';
import { GrpcStatus, OrderPatternEvent, OrderStatusCode } from '@app/common/enums';
import { PaymentFailedEvent, PaymentSuccessEvent, PaymentTimeoutEvent } from '@app/common/events';
import {
  CreateOrderRequest,
  CreateOrderResponse,
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
  FindTransactionsRequest,
  FindTransactionsResponse,
  GetRevenueAndCountOrderByStoreIdsRequest,
  GetRevenueAndCountOrderByStoreIdsResponse,
  GetTotalOrderCountByStoreIdRequest,
  GetTotalOrderCountByStoreIdResponse,
} from '@app/common/types';
import { OrderStatus } from '@app/common/types/proto/common';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { Not } from 'typeorm';

import { OrderNotificationService } from './order-notification.service';
import { OrderService } from './order.service';
import { StoreOrderService } from './store-order.service';
import { TransactionService } from './transaction.service';

@Controller()
@OrdersServiceControllerMethods()
export class OrderController implements OrdersServiceController {
  constructor(
    private readonly orderService: OrderService,
    private readonly storeOrderService: StoreOrderService,
    private readonly orderNotificationService: OrderNotificationService,
    private readonly transactionService: TransactionService,
    private readonly logger: LoggerService,
  ) {}

  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.orderService.createOrder(request);
  }

  async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<UpdateOrderResponse> {
    const updatedOrder = await this.orderService.updateOrderStatus(request);
    const shouldNotify = [
      OrderStatus.COMPLETED,
      OrderStatus.DELIVERING,
      OrderStatus.DELIVERY_FAILED,
      OrderStatus.CANCELED,
      OrderStatus.REJECTED,
      OrderStatus.UNCONFIRMED,
      OrderStatus.CONFIRMED,
      // Additional order statuses that require notifications can be added here
    ].includes(updatedOrder.statusCode);
    if (shouldNotify) {
      this.orderNotificationService.sendOrderStatusUpdateNotification(updatedOrder);
    }

    return { order: updatedOrder.toMessage() };
  }

  async updateStoreOrderStatus(
    payload: UpdateStoreOrderStatusRequest,
  ): Promise<UpdateStoreOrderResponse> {
    const updatedStoreOrder = await this.storeOrderService.updateStoreOrderStatus(payload);
    // this.notificationService.notifyStoreOrder(updatedStoreOrder);

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

    if (request.refundStatus) {
      this.orderNotificationService.sendRefundStatusNotification(updatedOrder);
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

  async findTransactions(request: FindTransactionsRequest): Promise<FindTransactionsResponse> {
    request.filters ??= [];
    request.sorts ??= [];

    const [transactions, totalCount] =
      await this.transactionService.findTransactionsWithPagination(request);

    return {
      transactions: transactions.map(transaction => transaction.toMessage()),
      totalCount,
    };
  }

  async getRevenueAndCountOrderByStoreIds(
    request: GetRevenueAndCountOrderByStoreIdsRequest,
  ): Promise<GetRevenueAndCountOrderByStoreIdsResponse> {
    const result = await this.storeOrderService.getRevenueAndCountOrderByStoreIds(request.ids);

    return {
      storeRevenueAndCount: result,
    };
  }

  async getTotalOrderCountByStoreId(
    request: GetTotalOrderCountByStoreIdRequest,
  ): Promise<GetTotalOrderCountByStoreIdResponse> {
    const result = await this.storeOrderService.getTotalOrderCountByStoreId(request.storeId);

    return {
      totalOrderCount: result,
    };
  }

  @EventPattern(OrderPatternEvent.PAYMENT_SUCCESS)
  async paymentSuccess(@Ctx() context: RmqContext, @Payload() payload: PaymentSuccessEvent) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log('PAYMENT SUCCESS EVENT RECEIVED', {
      metadata: payload,
    });

    try {
      const { orderId } = payload;

      const order = await this.orderService.findOrderByFilter({
        id: orderId,
        statusCode: Not(OrderStatusCode.WAITING_FOR_CONFIRMATION),
      });
      if (!order) {
        throw new Error(
          `Failed to get order with id ${orderId} from ${OrderPatternEvent.PAYMENT_SUCCESS} event`,
        );
      }

      const updatedOrder = await this.orderService.updateOrderToWaiting(order);
      const { storeId, userId, metadata } = updatedOrder;

      await Promise.all([
        this.orderService.createStoreOrder(updatedOrder),
        this.orderService.removeShoppingCart(storeId, userId),
        this.orderService.updateNumberOfVoucherUses(userId, metadata?.voucherIds),
        this.orderNotificationService.sendPaymentSuccessNotification(updatedOrder),
        this.orderService.sendSlackMessageForNewOrder({
          orderCode: updatedOrder.orderCode,
          totalPrice: updatedOrder.totalPrice,
        }),
      ]);

      this.logger.log('PAYMENT SUCCESS EVENT PROCESSED', {
        metadata: payload,
      });

      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error((error as Error).message, {
        metadata: error,
      });
      channel.nack(originalMessage, false, false);
    }
  }

  @EventPattern(OrderPatternEvent.PAYMENT_FAILED)
  async paymentFailed(@Ctx() context: RmqContext, @Payload() payload: PaymentFailedEvent) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log('PAYMENT FAILED EVENT RECEIVED', {
      metadata: payload,
    });

    try {
      const { orderId } = payload;

      const order = await this.orderService.findOrderByFilter({
        id: orderId,
        statusCode: Not(OrderStatusCode.PAYMENT_FAILED),
      });
      if (!order) {
        throw new Error(
          `Failed to get order with id ${orderId} from ${OrderPatternEvent.PAYMENT_FAILED} event`,
        );
      }

      const updatedOrder = await this.orderService.updateOrderToFailed(order);
      await this.orderNotificationService.sendPaymentFailedNotification(updatedOrder);

      this.logger.log('PAYMENT FAILED EVENT PROCESSED', {
        metadata: payload,
      });

      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error((error as Error).message, {
        metadata: error,
      });
      channel.nack(originalMessage, false, false);
    }
  }

  @EventPattern(OrderPatternEvent.PAYMENT_TIMEOUT)
  async paymentTimeout(@Ctx() context: RmqContext, @Payload() payload: PaymentTimeoutEvent) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log('PAYMENT TIMEOUT EVENT RECEIVED', {
      metadata: payload,
    });

    try {
      const { orderId } = payload;

      const order = await this.orderService.findOrderByFilter({
        id: orderId,
        statusCode: OrderStatusCode.DRAFT,
      });
      if (order) {
        await this.orderService.updateOrderToFailed(order);
      }

      this.logger.log('PAYMENT TIMEOUT EVENT PROCESSED', {
        metadata: payload,
      });

      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error((error as Error).message, {
        metadata: error,
      });
      channel.nack(originalMessage, false, false);
    }
  }
}
