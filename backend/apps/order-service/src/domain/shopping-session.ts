import { NullableType } from '@app/common/types/common';

import { Item } from './item';

export class ShoppingSession {
  id: string;
  customerId: string;
  storeId: string;
  shippingFee: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RawChoice {
  choice_id: string;
  quantity: number;
}

export interface RawOptionChoice {
  option_id: string;
  choices: RawChoice[];
}

export class CartItem {
  id: string;
  sessionId: string;
  itemId: string;
  quantity: number;
  totalPrice: number;
  notes: NullableType<string>;
  rawOptionsChoices: RawOptionChoice[];
  item?: Item;
}
