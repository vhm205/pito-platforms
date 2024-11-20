import { FindStoreOrderRequest, UpdateStoreOrderStatusRequest } from '@app/common';
import { GrpcStatus, StoreOrderStatus } from '@app/common/enums';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { StoreOrder } from './domain';
import { StoreOrderRepository } from './infrastructure/persistence/store-order.repository';

@Injectable()
export class StoreOrderService {
  constructor(private readonly repository: StoreOrderRepository) {}

  async findOneStoreOrder(filters: FindStoreOrderRequest) {
    return this.repository.findOne(filters);
  }

  async updateStoreOrderStatus({ id, status }: UpdateStoreOrderStatusRequest): Promise<StoreOrder> {
    const storeOrder = await this.repository.findOne({ id });
    if (!storeOrder) {
      throw new RpcException({
        message: `Store Order with ID ${id} not found`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const currentTimestamp = new Date();
    storeOrder.status = status as StoreOrderStatus;

    switch (status as StoreOrderStatus) {
      case StoreOrderStatus.CONFIRMED:
        storeOrder.orderLogs.confirmed_at = currentTimestamp;
        break;
      case StoreOrderStatus.NOT_CONFIRMED:
        storeOrder.orderLogs.not_confirmed_at = currentTimestamp;
        break;
      case StoreOrderStatus.CANCELLED:
        storeOrder.orderLogs.canceled_at = currentTimestamp;
        break;
      case StoreOrderStatus.REJECTED:
        storeOrder.orderLogs.rejected_at = currentTimestamp;
        break;
      case StoreOrderStatus.PREPARING:
        storeOrder.orderLogs.preparing_at = currentTimestamp;
        break;
      case StoreOrderStatus.PREPARED:
        storeOrder.orderLogs.prepared_at = currentTimestamp;
        storeOrder.metadata.before_delivery_images = [];
        break;
      case StoreOrderStatus.COMPLETED:
        storeOrder.orderLogs.completed_at = currentTimestamp;
        storeOrder.metadata.after_delivery_images = [];
        break;
    }

    return this.repository.update(storeOrder);
  }
}
