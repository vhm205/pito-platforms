import {
  CalculateDistanceRequest,
  FindStoreRequest,
  FindStoresRequest,
  transformFilterRule,
} from '@app/common';
import { Injectable } from '@nestjs/common';

import { PartnerStoreRepository } from './infrastructure/persistence/partner-store.repository';
import { StoreRepository } from './infrastructure/persistence/store.repository';

@Injectable()
export class StoreService {
  constructor(
    private readonly repository: PartnerStoreRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  async findStoresAndCount({ filters }: FindStoresRequest) {
    return this.repository.findManyAndCount(filters.map(transformFilterRule));
  }

  async findStoresWithPagination({ pagination, filters, sorts }: FindStoresRequest) {
    return this.repository.findStoresWithPagination({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });
  }

  async findStore({ id, slug }: FindStoreRequest) {
    return this.repository.findOne({ id, slug });
  }

  async calculateDistance({ geolocation, latitude, longitude }: CalculateDistanceRequest) {
    return this.storeRepository.calculateDistance(geolocation, latitude, longitude);
  }
}
