import { Order, OrderItem } from '@app/common';
import { FilterRule, OrderStatus } from '@app/common/types/proto/common';
import { IMAGE_BASE_URLS } from '@gateway/constants';
import { generatePublicImageUrl } from '@gateway/utils/common';
import { getBoundaryIsoStringForDay } from '@gateway/utils/datetime';
import { find, get, map } from 'lodash';

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
  const { item, rawOptionsChoices } = orderItem;
  return {
    id: item?.id,
    slug: item?.slug,
    name: item?.name,
    basePrice: item?.basePrice,
    quantity: orderItem.quantity,
    totalPrice: orderItem.totalPrice,
    note: orderItem.notes,
    peopleCount: get(item, 'unitQuantity', -1), // -1 means no people counts
    images: map(item?.images, path => generatePublicImageUrl(path, IMAGE_BASE_URLS.item)) ?? [],
    selectedOptions: map(rawOptionsChoices, option => transformOption(item, option)),
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

function transformChoice(selectedOption: any, choice: Record<string, string>) {
  const selectedChoice = find(selectedOption.choices, { choiceId: choice.choiceId })!;
  return {
    id: choice.choiceId,
    name: get(selectedChoice, 'name', ''),
    price: get(selectedChoice, 'basePrice', 0),
    quantity: get(choice, 'quantity', 0),
  };
}

function transformOption(item, option) {
  const { optionId, choices } = option;
  const selectedOption = find(item.optionsAndChoices, { optionId });
  const selectedChoices = map(choices, choice => transformChoice(selectedOption, choice));
  return {
    id: optionId,
    name: selectedOption?.name,
    selectedChoices,
  };
}

export function transformRefundOrderFilter(f: FilterRule) {
  if (f.column === 'createdAt') {
    const [from, to] = f.value.split(',');
    f.value = `${getBoundaryIsoStringForDay(from)},${getBoundaryIsoStringForDay(to, 'end')}`;
  }
  return f;
}
