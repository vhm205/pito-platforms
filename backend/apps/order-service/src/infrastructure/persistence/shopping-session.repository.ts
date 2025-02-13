import { NullableType } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { CartItem, ShoppingSession } from '../../domain';

export abstract class ShoppingSessionRepository {
  abstract findOne(
    filter: FindOptionsWhere<Pick<ShoppingSession, 'id' | 'storeId' | 'customerId'>>,
  ): Promise<NullableType<ShoppingSession>>;
  abstract findCartItemsBySessionId(sessionId: string): Promise<CartItem[]>;
  abstract deleteShoppingSessionById(sessionId: string): Promise<boolean>;
}
