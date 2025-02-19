import { ShoppingSession } from 'apps/order-service/src/domain';
import { CartItem } from 'apps/order-service/src/domain';

import { CartItemEntity } from '../entities/cart-item.entity';
import { ShoppingSessionEntity } from '../entities/shopping-session.entity';

import { ItemMapper } from './item.mapper';

export class ShoppingSessionMapper {
  static toDomain(raw: ShoppingSessionEntity): ShoppingSession {
    const domain = new ShoppingSession();
    domain.id = raw.id;
    domain.customerId = raw.customerId;
    domain.storeId = raw.storeId;
    domain.shippingFee = parseInt(raw.shippingFee);
    return domain;
  }

  static toPersistence(domainEntity: ShoppingSession): ShoppingSessionEntity {
    const entity = new ShoppingSessionEntity();
    entity.id = domainEntity.id;
    entity.customerId = domainEntity.customerId;
    entity.storeId = domainEntity.storeId;
    entity.shippingFee = domainEntity.shippingFee.toString();
    return entity;
  }
}

export class CartItemMapper {
  static toDomain(raw: CartItemEntity): CartItem {
    const domain = new CartItem();
    domain.id = raw.id;
    domain.sessionId = raw.sessionId;
    domain.itemId = raw.itemId;
    domain.quantity = raw.quantity;
    domain.totalPrice = parseInt(raw.totalPrice);
    domain.rawOptionsChoices = raw.rawOptionsChoices;
    domain.notes = raw.notes;

    if (raw.item) {
      domain.item = ItemMapper.toDomain(raw.item);
    }

    return domain;
  }

  static toPersistence(domainEntity: CartItem): CartItemEntity {
    const entity = new CartItemEntity();

    entity.id = domainEntity.id;
    entity.sessionId = domainEntity.sessionId;
    entity.itemId = domainEntity.itemId;
    entity.quantity = domainEntity.quantity;
    entity.totalPrice = domainEntity.totalPrice.toString();
    entity.rawOptionsChoices = domainEntity.rawOptionsChoices;
    entity.notes = domainEntity.notes;

    return entity;
  }
}
