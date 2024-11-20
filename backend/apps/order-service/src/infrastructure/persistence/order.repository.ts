import { NullableType, PaginationOptions } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { Order } from '../../domain/order';
import { FilterOrderDto, SortOrderDto } from '../../dto';

export abstract class OrderRepository {
  abstract findOne(
    filter: FindOptionsWhere<Pick<Order, 'id' | 'orderCode' | 'storeId'>>,
  ): Promise<NullableType<Order>>;

  abstract findAllOrders(): Promise<Order[]>;
  abstract findOrdersWithPagination(options: {
    paginationOptions: PaginationOptions;
    sorts: SortOrderDto[];
    filters?: FilterOrderDto;
  }): Promise<[Order[], number]>;

  abstract saveOrder(order: Omit<Order, 'id'>): Promise<Order>;
  abstract updateOrder(order: Order): Promise<NullableType<Order>>;
  abstract deleteOrder(orderId: Order['id']): Promise<void>;
}
