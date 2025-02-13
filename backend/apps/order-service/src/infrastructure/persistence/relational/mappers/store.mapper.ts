import { Store } from 'apps/order-service/src/domain';

import { StoreEntity } from '../entities/store.entity';

export class StoreMapper {
  static toDomain(raw: StoreEntity): Store {
    const domain = new Store();

    domain.id = raw.id;
    domain.storeName = raw.storeName;
    domain.storeCode = raw.storeCode;
    domain.partnerId = raw.partnerId;
    domain.status = raw.status;
    domain.isVat = raw.isVat;
    domain.slug = raw.slug;

    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;

    return domain;
  }
}
