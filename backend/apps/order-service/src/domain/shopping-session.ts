import { NullableType } from '@app/common/types/common';

import { Item, ItemOptionAndChoice } from './item';

export class ShoppingSession {
  id: string;
  customerId: string;
  storeId: string;
  shippingFee: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CartItem {
  id: string;
  sessionId: string;
  itemId: string;
  quantity: number;
  totalPrice: number;
  notes: NullableType<string>;
  rawOptionsChoices: ItemOptionAndChoice[];
  item?: Item;
}
