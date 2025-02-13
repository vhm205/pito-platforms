import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import type { FindOperator, FindOptionsWhere } from 'typeorm';

import { Order } from '../../domain/order';

export abstract class OrderRepository {
  abstract findOne(
    filter: FindOptionsWhere<Pick<Order, 'id' | 'orderCode' | 'storeId' | 'statusCode'>>,
  ): Promise<NullableType<Order>>;

  abstract findAllOrders(filters: Record<string, FindOperator<unknown>>[]): Promise<Order[]>;
  abstract findOrdersWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Order[], number]>;

  abstract saveOrder(order: Partial<Order>): Promise<Order>;
  abstract updateOrder(order: Order): Promise<NullableType<Order>>;
  abstract deleteOrder(orderId: Order['id']): Promise<void>;
  abstract getLastOrderOfStore(storeId: Order['storeId']): Promise<NullableType<Order>>;
}
