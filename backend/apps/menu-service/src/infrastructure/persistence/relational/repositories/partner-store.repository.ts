import { PARTNER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerStore } from 'apps/menu-service/src/domain/partner-store.domain';
import { StoreService } from 'apps/menu-service/src/domain/store-service.domain';
import { type FindOperator, type FindOptionsWhere, type Repository } from 'typeorm';

import { PartnerStoreRepository } from '../../partner-store.repository';
import { PartnerStoreEntity } from '../entities/partner-store.entity';
import { StoreServiceEntity } from '../entities/store-service.entity';
import { PartnerStoreMapper, StoreServiceMapper } from '../mappers/store.mapper';

@Injectable()
export class PartnerStoreRelationalRepository implements PartnerStoreRepository {
  constructor(
    @InjectRepository(PartnerStoreEntity, PARTNER_DB_SOURCE)
    private readonly repository: Repository<PartnerStoreEntity>,
    @InjectRepository(StoreServiceEntity, PARTNER_DB_SOURCE)
    private readonly storeServiceRepository: Repository<StoreServiceEntity>,
  ) {}

  async findOne(
    filters: FindOptionsWhere<Pick<PartnerStoreEntity, 'id' | 'status' | 'slug'>>,
  ): Promise<NullableType<PartnerStore>> {
    const entity = await this.repository.findOne({ where: filters });
    return entity ? PartnerStoreMapper.toDomain(entity) : null;
  }

  async findManyAndCount(
    filters: Record<string, FindOperator<unknown>>[],
  ): Promise<[PartnerStore[], number]> {
    const [entities, count] = await this.repository.findAndCount({ where: filters });
    return [entities.map(PartnerStoreMapper.toDomain), count];
  }

  async findStoresWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[PartnerStore[], number]> {
    const { pagination, sorts, filters } = options;
    const [entities, total] = await this.repository.findAndCount({
      skip: (pagination.currentPage - 1) * pagination.pageSize, // 1-based index
      take: pagination.pageSize,
      where: filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
      order: Object.fromEntries(sorts.map(sort => [sort.column, sort.direction])),
    });

    const domainEntities = entities.map(PartnerStoreMapper.toDomain);
    return [domainEntities, total];
  }

  async findStoreServiceByStoreId(id: string): Promise<NullableType<StoreService>> {
    const entity = await this.storeServiceRepository.findOne({
      where: { storeId: id, isActive: true },
    });
    return entity ? StoreServiceMapper.toDomain(entity) : null;
  }
}
