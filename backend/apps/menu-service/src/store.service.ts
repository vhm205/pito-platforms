import {
  transformFilterRule,
  CalculateDistanceRequest,
  FindStoreRequest,
  FindStoresRequest,
  GetStoreDetailRequest,
} from '@app/common';
import { GrpcStatus, StoreStatus } from '@app/common/enums';
import { PartnerStatus } from '@app/common/enums/partner';
import { isValidUUID } from '@gateway/utils/common';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { StoreBankAccount, StoreContactInfo, StoreLocation } from './domain/partner-store.domain';
import { ItemRepository } from './infrastructure/persistence/item.repository';
import { PartnerStoreRepository } from './infrastructure/persistence/partner-store.repository';
import { StoreRepository } from './infrastructure/persistence/store.repository';

@Injectable()
export class StoreService {
  constructor(
    private readonly repository: PartnerStoreRepository,
    private readonly storeRepository: StoreRepository,
    private readonly itemRepository: ItemRepository,
    private readonly partnerStoreRepository: PartnerStoreRepository,
  ) {}

  async findStoresAndCount({ filters }: FindStoresRequest) {
    return this.repository.findManyAndCount(filters.map(transformFilterRule));
  }

  async findStoresWithPagination({ pagination, filters, sorts }: FindStoresRequest) {
    const [stores, totalCount] = await this.repository.findStoresWithPagination({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });

    const transformedStores = stores.map(store => ({
      id: store.id,
      storeCode: store.storeCode,
      name: store.name,
      slug: store.slug,
      isVat: store.isVat,
      description: store.description as string,
      contacts: store.contacts as StoreContactInfo[],
      location: store.location as StoreLocation,
      bankAccount: store.bankAccount as StoreBankAccount,
    }));

    return { stores: transformedStores, totalCount };
  }

  async findStore({ id, slug }: FindStoreRequest) {
    const store = await this.repository.findOne({ id, slug });

    if (!store) {
      throw new RpcException({
        message: `Store not found with identifier ${id}`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    return {
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description as string,
      storeCode: store.storeCode,
      contacts: store.contacts as StoreContactInfo[],
      location: store.location as StoreLocation,
    };
  }

  async getStoreDetailByIdOrSlug({ identifier }: GetStoreDetailRequest) {
    const query = isValidUUID(identifier) ? { id: identifier } : { slug: identifier };
    const store = await this.repository.findOne(query);

    if (!store) {
      throw new RpcException({
        message: `Store not found with identifier ${identifier}`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const cuisineTypesAsync = (() => {
      if (!store.cuisineTypes) return [];
      return this.itemRepository.findAllCuisineTypes(store.cuisineTypes);
    })();

    const [storeService, cuisineTypes] = await Promise.all([
      this.repository.findStoreServiceByStoreId(store.id),
      cuisineTypesAsync,
    ]);

    return {
      ...store.toMessage(),
      cuisineTypes,
      reopenTime: storeService?.reopenTime as Date,
    };
  }

  async calculateDistance({ geolocation, latitude, longitude }: CalculateDistanceRequest) {
    return this.storeRepository.calculateDistance(geolocation, latitude, longitude);
  }

  async updateStoreStatus(ids: string[], status: StoreStatus) {
    const { affected } = await this.partnerStoreRepository.updateStoreStatusByIds(ids, status);
    return { success: affected === ids.length };
  }

  async updatePartnerStatus(ids: string[], status: PartnerStatus) {
    const { affected } = await this.partnerStoreRepository.updatePartnerStatusByIds(ids, status);
    return { success: affected === ids.length };
  }
}
