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
import slugify from 'slugify';

import { PartnerStore, StoreContactInfo, StoreLocation } from './domain/partner-store.domain';
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

    const transformedStores = stores.map(store => store.toMessage());

    return { stores: transformedStores, totalCount };
  }

  async filterStoresWithPagination({ pagination, filters, sorts }: FindStoresRequest) {
    const [stores, totalCount] = await this.repository.filterStores({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });

    const transformedStores = stores.map(store => store.toMessage());

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
      name: store.storeName,
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
      dailyOrderLimit: storeService?.dailyOrderLimit as number,
      dailyRevenueLimit: storeService?.dailyRevenueLimit as number,
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

    switch (status) {
      case PartnerStatus.APPROVED:
        await this.partnerStoreRepository.updateStoreStatusByPartnerIds(ids, StoreStatus.ACTIVE);
        break;
      case PartnerStatus.SUSPEND:
      case PartnerStatus.STOP_COOPERATION:
        await this.partnerStoreRepository.updateStoreStatusByPartnerIds(
          ids,
          StoreStatus.TEMPORARILY_CLOSED,
        );
        break;
    }

    return { success: affected === ids.length };
  }

  async updateStore(
    id: string,
    data: Partial<Omit<PartnerStore, 'id' | 'storeCode' | 'partnerId'>>,
  ) {
    if (data.storeName) {
      data.slug = slugify(data.storeName, { lower: true });
    }

    const { affected } = await this.partnerStoreRepository.updateStore(id, data);
    return { affectedRows: affected };
  }
}
