import { Order, OrderItem } from '@app/common';
import { FilterRule } from '@app/common/types/proto/common';

export function transformFilterOrder(filter: FilterRule) {
  if (filter.column === 'search') {
    filter.column = 'orderCode';
  }
  return filter;
}

export function transformCustomer(order: Order) {
  return {
    id: order.userId,
    name: order.receiverName,
    phone: order.receiverPhone,
    email: order.receiverEmail,
  };
}

export function transformOrderItem(orderItem: OrderItem) {
  return {
    ...orderItem,
    selectedOptions: [],
  };
}
