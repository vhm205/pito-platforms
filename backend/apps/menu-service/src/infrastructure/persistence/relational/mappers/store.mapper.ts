import { getImageUrl } from '@app/common';
import { PartnerStore } from 'apps/menu-service/src/domain/partner-store.domain';
import { StoreService } from 'apps/menu-service/src/domain/store-service.domain';
import { Store } from 'apps/menu-service/src/domain/store.domain';

import { PartnerStoreEntity } from '../entities/partner-store.entity';
import { StoreServiceEntity } from '../entities/store-service.entity';
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

export class PartnerStoreMapper {
  static toDomain(raw: PartnerStoreEntity): PartnerStore {
    const domain = new PartnerStore();

    domain.id = raw.id;
    domain.partnerId = raw.partnerId;
    domain.name = raw.storeName;
    domain.storeCode = raw.storeCode;
    domain.status = raw.status;
    domain.isVat = raw.isVat;
    domain.slug = raw.slug;
    domain.description = raw.description;
    domain.cuisineTypes = raw.cuisineTypes;

    if (raw.location) domain.location = raw.location;
    if (raw.images) domain.images = raw.images;
    if (raw.contacts) domain.contacts = raw.contacts;
    if (raw.bankAccount) domain.bankAccount = raw.bankAccount;
    if (raw.prepTimes) domain.prepTimes = raw.prepTimes;
    if (raw.metadata) domain.metadata = raw.metadata;

    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;

    domain.engagementLevel = raw.engagementLevel;
    domain.performanceLevel = raw.performanceLevel;

    return domain;
  }
}

export class StoreServiceMapper {
  static toDomain(raw: StoreServiceEntity): StoreService {
    const domain = new StoreService();

    domain.storeId = raw.storeId;
    domain.serviceType = raw.serviceType;
    domain.reopenTime = raw.reopenTime;

    return domain;
  }
}
