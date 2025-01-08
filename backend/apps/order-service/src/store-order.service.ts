import {
  FindStoreOrderRequest,
  FindStoreOrdersRequest,
  transformFilterRule,
  UpdateStoreOrderStatusRequest,
} from '@app/common';
import { StoreOrderStatus } from '@app/common/enums';
import { OrderStatus } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';

import { StoreOrder } from './domain';
import { StoreOrderRepository } from './infrastructure/persistence/store-order.repository';

@Injectable()
export class StoreOrderService {
  constructor(private readonly repository: StoreOrderRepository) {}

  async findOneStoreOrder(filters: FindStoreOrderRequest) {
    return this.repository.findOne(filters);
  }

  async findStoreOrdersWithPagination({
    pagination,
    filters,
    sorts,
  }: FindStoreOrdersRequest): Promise<[StoreOrder[], number]> {
    return this.repository.findWithPagination({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });
  }

  async updateStoreOrderStatus({
    id,
    orderId,
    status,
  }: UpdateStoreOrderStatusRequest): Promise<StoreOrder> {
    const storeOrder = await this.repository.findOne({ id, orderId }).then(order => order!);

    const currentTimestamp = new Date();
    storeOrder.statusCode = status;

    switch (status) {
      case OrderStatus.CONFIRMED:
        storeOrder.orderLogs.confirmed_at = currentTimestamp;
        storeOrder.status = StoreOrderStatus.CONFIRMED;
        break;
      case OrderStatus.UNCONFIRMED:
        storeOrder.orderLogs.not_confirmed_at = currentTimestamp;
        storeOrder.status = StoreOrderStatus.NOT_CONFIRMED;
        break;
      case OrderStatus.CANCELED:
        storeOrder.orderLogs.canceled_at = currentTimestamp;
        storeOrder.status = StoreOrderStatus.CANCELLED;
        break;
      case OrderStatus.REJECTED:
        storeOrder.orderLogs.rejected_at = currentTimestamp;
        storeOrder.status = StoreOrderStatus.REJECTED;
        break;
      case OrderStatus.PREPARING:
        storeOrder.orderLogs.preparing_at = currentTimestamp;
        storeOrder.status = StoreOrderStatus.PREPARING;
        break;
      case OrderStatus.PREPARED:
        storeOrder.orderLogs.prepared_at = currentTimestamp;
        storeOrder.metadata.before_delivery_images = [];
        storeOrder.status = StoreOrderStatus.PREPARED;
        break;
      case OrderStatus.COMPLETED:
        storeOrder.orderLogs.completed_at = currentTimestamp;
        storeOrder.metadata.after_delivery_images = [];
        storeOrder.status = StoreOrderStatus.COMPLETED;
        break;
    }

    return this.repository.update(storeOrder);
  }

  async getRevenueAndCountOrderByStoreIds(storeIds: string[]) {
    return this.repository.getTotalRevenueAndCountOrders(storeIds);
  }
}
