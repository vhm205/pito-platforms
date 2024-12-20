import { Order, OrderItem } from '@app/common';
import { FilterRule, OrderStatus } from '@app/common/types/proto/common';
import { IMAGE_BASE_URLS } from '@gateway/constants';
import { generatePublicImageUrl } from '@gateway/utils/common';
import { getBoundaryIsoStringForDay } from '@gateway/utils/datetime';

export function transformFilterOrder(f: FilterRule) {
  if (f.column === 'search') f.column = 'orderCode';
  else if (f.column === 'status') {
    if (Number(f.value) === OrderStatus.PREPARED) f.column = 'operatorStatusCode';
    else f.column = 'statusCode';
  } else if (f.column === 'deliveryDate') {
    const [from, to] = f.value.split(',');
    f.value = `${getBoundaryIsoStringForDay(from)},${getBoundaryIsoStringForDay(to, 'end')}`;
  }

  return f;
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
    id: orderItem.item?.id,
    slug: orderItem.item?.slug,
    name: orderItem.item?.name,
    basePrice: orderItem.item?.basePrice,
    quantity: orderItem.quantity,
    totalPrice: orderItem.totalPrice,
    note: orderItem.notes,
    // peopleCount: -1, // TODO: Implement this later
    images:
      orderItem.item?.images?.map(path => generatePublicImageUrl(path, IMAGE_BASE_URLS.item)) ?? [],
    selectedOptions: [], // TODO: Implement this later
  };
}

export function transformStoreOrderFilter(f: FilterRule) {
  if (f.column === 'status') f.column = 'statusCode';
  else if (f.column === 'deliveryDate') {
    const [from, to] = f.value.split(',');
    f.value = `${getBoundaryIsoStringForDay(from)},${getBoundaryIsoStringForDay(to, 'end')}`;
  }
  return f;
}
