import { PARTNER_DB_SOURCE } from '@app/common';
import { StoreStatus } from '@app/common/enums';
import { PartnerStatus } from '@app/common/enums/partner';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerStore } from 'apps/menu-service/src/domain/partner-store.domain';
import { StoreService } from 'apps/menu-service/src/domain/store-service.domain';
import { In, type FindOperator, type FindOptionsWhere, type Repository } from 'typeorm';

import { PartnerStoreRepository } from '../../partner-store.repository';
import { PartnerStoreEntity } from '../entities/partner-store.entity';
import { PartnerEntity } from '../entities/partner.entity';
import { StoreServiceEntity } from '../entities/store-service.entity';
import { PartnerStoreMapper, StoreServiceMapper } from '../mappers/store.mapper';

@Injectable()
export class PartnerStoreRelationalRepository implements PartnerStoreRepository {
  constructor(
    @InjectRepository(PartnerStoreEntity, PARTNER_DB_SOURCE)
    private readonly repository: Repository<PartnerStoreEntity>,
    @InjectRepository(StoreServiceEntity, PARTNER_DB_SOURCE)
    private readonly storeServiceRepository: Repository<StoreServiceEntity>,
    @InjectRepository(PartnerEntity, PARTNER_DB_SOURCE)
    private readonly partnerRepository: Repository<PartnerEntity>,
  ) {}

  async findOne(
    filters: FindOptionsWhere<Pick<PartnerStoreEntity, 'id' | 'status' | 'slug'>>,
  ): Promise<NullableType<PartnerStore>> {
    const entity = await this.repository.findOne({ where: filters });
    return entity ? PartnerStoreMapper.toDomain(entity) : null;
  }

  async findMany(
    filters: FindOptionsWhere<Pick<PartnerStore, 'id' | 'status' | 'slug'>>,
  ): Promise<PartnerStore[]> {
    const entities = await this.repository.findBy(filters);
    return entities.map(PartnerStoreMapper.toDomain);
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

  async updateStoreStatusByIds(ids: string[], status: StoreStatus): Promise<void> {
    await this.repository.update({ id: In(ids) }, { status, updatedAt: new Date() });
  }

  async updatePartnerStatusByIds(ids: string[], status: PartnerStatus): Promise<void> {
    await this.partnerRepository.update({ id: In(ids) }, { status, updatedAt: new Date() });
  }
}
