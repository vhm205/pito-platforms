import { NullableType, PaginationOptions } from '@app/common/types/common';

import { Order } from '../../domain/order';
import { FilterOrderDto, SortOrderDto } from '../../dto';

export abstract class OrderRepository {
  abstract findOrderById(orderId: Order['id']): Promise<NullableType<Order>>;
  abstract findOrderByCode(code: Order['orderCode']): Promise<NullableType<Order>>;
  abstract findOrdersByUserId(userId: string): Promise<Order[]>;

  abstract findAllOrders(): Promise<Order[]>;
  abstract findOrdersWithPagination(options: {
    paginationOptions: PaginationOptions;
    sorts: SortOrderDto[];
    filters?: FilterOrderDto;
  }): Promise<[Order[], number]>;
  abstract findOrdersInDelivery(): Promise<Order[]>;

  abstract saveOrder(order: Omit<Order, 'id'>): Promise<Order>;
  abstract updateOrder(order: Order): Promise<Order>;
  abstract deleteOrder(orderId: Order['id']): Promise<void>;
}
