import { NullableType } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { CartItem, Item, ShoppingSession } from '../../domain';

export abstract class ShoppingSessionRepository {
  abstract findOne(
    filter: FindOptionsWhere<Pick<ShoppingSession, 'id' | 'storeId' | 'customerId'>>,
  ): Promise<NullableType<ShoppingSession>>;

  abstract findCartItemsBySessionId(sessionId: string): Promise<CartItem[]>;

  abstract deleteShoppingSessionById(sessionId: string): Promise<boolean>;

  abstract insertShoppingSession(session: Partial<ShoppingSession>): Promise<ShoppingSession>;

  abstract insertCartItem(cartItem: Partial<CartItem>): Promise<CartItem>;

  abstract updateCartItem(cartItem: Partial<CartItem>): Promise<boolean>;

  abstract findCartItem(
    filter: FindOptionsWhere<Pick<CartItem, 'id' | 'sessionId' | 'itemId'>>,
  ): Promise<NullableType<CartItem>>;

  abstract findItem(
    filter: FindOptionsWhere<Pick<Item, 'id' | 'storeId'>>,
  ): Promise<NullableType<Item>>;

  abstract getCartSessionsByCustomerId(customerId: string): Promise<ShoppingSession[]>;

  abstract getCartSessionsOfCustomerByStore(
    customerId: string,
    storeId: string,
  ): Promise<ShoppingSession[]>;

  abstract getCartItemsBySessionIds(sessionIds: string[]): Promise<CartItem[]>;
}
