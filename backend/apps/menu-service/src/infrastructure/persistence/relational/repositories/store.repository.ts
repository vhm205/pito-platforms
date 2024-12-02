import { CUSTOMER_DB_SOURCE, transformToCamelCase } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetFilterOption,
  GetFilterOptionId,
} from 'apps/menu-service/src/dtos/get-filter-option.dto';
import {
  FindStoreByFilterResult,
  SearchStoreDto,
  SearchStoreFilterDto,
} from 'apps/menu-service/src/dtos/search-store.dto';
import { collectUniqueValues } from 'apps/menu-service/src/utils/get-filter-option.util';
import type { Repository } from 'typeorm';

import { StoreRepository } from '../../store.repository';
import { CategoryEntity } from '../entities/category.entity';
import { CuisineTypeEntity } from '../entities/cuisine-type.entity';
import { OccasionEventEntity } from '../entities/occasion-event.entity';
import { SpecialDietaryEntity } from '../entities/special-dietaries.entity';
import { StoreEntity } from '../entities/store.entity';
import { StoreMapper } from '../mappers/store.mapper';

@Injectable()
export class StoreRelationalRepository implements StoreRepository {
  constructor(
    @InjectRepository(StoreEntity, CUSTOMER_DB_SOURCE)
    private storeRepository: Repository<StoreEntity>,

    @InjectRepository(CuisineTypeEntity, CUSTOMER_DB_SOURCE)
    private cuisineTypeRepository: Repository<CuisineTypeEntity>,
    @InjectRepository(OccasionEventEntity, CUSTOMER_DB_SOURCE)
    private occasionEventRepository: Repository<OccasionEventEntity>,
    @InjectRepository(SpecialDietaryEntity, CUSTOMER_DB_SOURCE)
    private specialDietariesRepository: Repository<SpecialDietaryEntity>,
    @InjectRepository(CategoryEntity, CUSTOMER_DB_SOURCE)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findStoresByFilter(
    payload: SearchStoreFilterDto,
  ): Promise<{ data: FindStoreByFilterResult[]; count: number }> {
    const params = Object.values(payload);
    const entity: SearchStoreDto[] = await this.storeRepository.query(
      `SELECT * FROM search_stores($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      params,
    );

    const count = entity.length ? Number(entity[0].total_records) : 0;
    const data = entity.map(record => {
      return {
        store: StoreMapper.toDomain(transformToCamelCase(record)),
        distance: record.dist_meters! >= 0 ? record.dist_meters : undefined,
        totalCompletedOrders: Number(record.total_completed_orders),
        isOpen: record.is_open,
      };
    });
    return { data, count };
  }

  async getFilterOptionIds(keyword: string): Promise<{ data: GetFilterOptionId }> {
    const type = 'store';
    const queryBuilder = this.storeRepository
      .createQueryBuilder(type)
      .select([
        `${type}.cuisineTypes`,
        `${type}.specialDietaries`,
        `${type}.occasionEvents`,
        `${type}.serviceTypes`,
      ])
      .where(`${type}.isActive = :isActive`, { isActive: true });

    if (keyword) {
      queryBuilder.andWhere(
        `(to_tsvector('english', ${type}.store_name_vector) @@ plainto_tsquery('english', lower(:keyword))`,
        { keyword },
      );
    }

    const results = await queryBuilder.getMany();
    return { data: collectUniqueValues(results) };
  }

  async getFilterOptions(payload: GetFilterOptionId): Promise<{ data: GetFilterOption }> {
    const [cuisineTypes, specialDietaries, occasionEvents, serviceTypes] = await Promise.all([
      this.cuisineTypeRepository
        .createQueryBuilder('cuisine_type')
        .select(['id', 'name'])
        .where(`cuisine_type.is_active = :isActive`, { isActive: true })
        .andWhere(`cuisine_type.id IN (:...ids)`, { ids: payload.cuisineTypesIds })
        .getRawMany(),
      this.specialDietariesRepository
        .createQueryBuilder('special_dietary')
        .select(['id', 'name'])
        .where(`special_dietary.is_active = :isActive`, { isActive: true })
        .andWhere(`special_dietary.id IN (:...ids)`, { ids: payload.specialDietariesIds })
        .getRawMany(),
      this.occasionEventRepository
        .createQueryBuilder('occasion_event')
        .select(['id', 'name'])
        .where(`occasion_event.is_active = :isActive`, { isActive: true })
        .andWhere(`occasion_event.id IN (:...ids)`, { ids: payload.occasionEventsIds })
        .getRawMany(),
      this.categoryRepository
        .createQueryBuilder('category')
        .select(['id', 'name'])
        .where(`category.is_active = :isActive`, { isActive: true })
        .andWhere(`category.id IN (:...ids)`, { ids: payload.serviceTypesIds })
        .getRawMany(),
    ]);

    return {
      data: {
        cuisineTypes,
        specialDietaries,
        occasionEvents,
        serviceTypes,
      },
    };
  }
}
