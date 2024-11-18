import { StoreOrder } from 'apps/order-service/src/domain';

import { StoreOrderEntity } from '../entities/store-order.entity';

export class StoreOrderMapper {
  static toDomain(raw: StoreOrderEntity): StoreOrder {
    const domain = new StoreOrder();

    domain.id = raw.id;
    domain.storeId = raw.storeId;
    domain.orderId = raw.orderId;

    return domain;
  }

  static toPersistence(domainEntity: StoreOrder): StoreOrderEntity {
    const entity = new StoreOrderEntity();

    entity.storeId = domainEntity.storeId;
    entity.orderId = domainEntity.orderId;

    return entity;
  }
}
