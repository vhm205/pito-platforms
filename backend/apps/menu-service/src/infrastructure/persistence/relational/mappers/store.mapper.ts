import { getImageUrl } from '@app/common';
import { Store } from 'apps/menu-service/src/domain/store.domain';

import { StoreEntity } from '../entities/store.entity';

export class StoreMapper {
  static toDomain(raw: StoreEntity): Store {
    const domain = new Store();

    domain.id = raw.id;
    domain.minOrderValue = raw.minOrderValue;
    domain.minParticipants = raw.minParticipants;
    domain.minPreparationTime = raw.minPreparationTime;
    domain.occasionEvents = raw.occasionEvents;
    domain.cuisineTypes = raw.cuisineTypes;
    domain.serviceTypes = raw.serviceTypes;
    domain.specialDietaries = raw.specialDietaries;
    domain.slug = raw.slug;
    domain.status = raw.status;
    domain.isVat = raw.isVat;
    domain.avatar = raw.avatar ? getImageUrl(raw.avatar) : '';
    domain.thumbnail = raw.thumbnail ? getImageUrl(raw.thumbnail) : '';
    domain.cover = raw.cover ? getImageUrl(raw.cover) : '';
    domain.openingHours = raw.openingHours;
    domain.storeName = raw.storeName;

    return domain;
  }

  static toPersistence(domainEntity: Store): StoreEntity {
    const entity = new StoreEntity();
    entity.id = domainEntity.id;
    return entity;
  }
}
