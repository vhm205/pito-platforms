import { Dish } from 'apps/menu-service/src/domain/dish.domain';

import { DishEntity } from '../entities/dish.entity';

export class DishMapper {
  static toDomain(raw: DishEntity): Dish {
    const domain = new Dish();

    domain.id = raw.id;
    domain.name = raw.name;
    domain.quantity = raw.quantity || 0;
    domain.quantityUnit = raw.quantityUnit;
    domain.images = raw.images;
    domain.storeId = raw.storeId;
    domain.partnerId = raw.partnerId;
    domain.packageOptionId = raw.packageOptionId;

    return domain;
  }

  static toPersistence(domainEntity: Dish): DishEntity {
    const entity = new DishEntity();
    entity.id = domainEntity.id;
    entity.name = domainEntity.name;
    entity.quantity = domainEntity.quantity || 0;
    entity.quantityUnit = domainEntity.quantityUnit;
    entity.images = domainEntity.images;
    entity.storeId = domainEntity.storeId;
    entity.partnerId = domainEntity.partnerId;
    entity.packageOptionId = domainEntity.packageOptionId;
    return entity;
  }
}
