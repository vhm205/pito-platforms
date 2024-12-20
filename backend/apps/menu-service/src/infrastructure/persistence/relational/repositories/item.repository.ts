import { CUSTOMER_DB_SOURCE, transformToCamelCase } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetFilterOptionId } from 'apps/menu-service/src/dtos/get-filter-option.dto';
import {
  GetItemInStoreDto,
  GetItemInStoreFilterDto,
  GetItemInStoreResult,
} from 'apps/menu-service/src/dtos/get-items-in-store.dto';
import { CuisineTypeEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/cuisine-type.entity';
import { OccasionEventEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/occasion-event.entity';
import { SpecialDietaryEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/special-dietaries.entity';
import { collectUniqueValues } from 'apps/menu-service/src/utils/get-filter-option.util';
import { In, type Repository } from 'typeorm';

import { ItemRepository } from '../../item.repository';
import { ItemEntity } from '../entities/item.entity';
import { ItemMapper } from '../mappers/item.mapper';

@Injectable()
export class ItemRelationalRepository implements ItemRepository {
  constructor(
    @InjectRepository(ItemEntity, CUSTOMER_DB_SOURCE)
    private itemRepository: Repository<ItemEntity>,

    @InjectRepository(CuisineTypeEntity, CUSTOMER_DB_SOURCE)
    private cuisineTypeRepository: Repository<CuisineTypeEntity>,

    @InjectRepository(SpecialDietaryEntity, CUSTOMER_DB_SOURCE)
    private specialDietaryRepository: Repository<SpecialDietaryEntity>,

    @InjectRepository(OccasionEventEntity, CUSTOMER_DB_SOURCE)
    private occasionEventRepository: Repository<OccasionEventEntity>,
  ) {}

  async getItemsInStore(
    payload: GetItemInStoreFilterDto,
  ): Promise<{ data: GetItemInStoreResult[]; count: number }> {
    const params = Object.values(payload);
    const entity: GetItemInStoreDto[] = await this.itemRepository.query(
      `SELECT * FROM search_items_in_store($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      params,
    );

    const count = entity.length ? Number(entity[0].total_records) : 0;
    const data = entity.map(record => {
      return {
        item: ItemMapper.toDomain(transformToCamelCase(record)),
        specialDietaries: record.special_dietaries,
        cuisineTypes: record.cuisine_types,
        occasionEvents: record.occasion_events,
      };
    });
    return { data, count };
  }

  async getFilterOptionIds(keyword: string): Promise<{ data: GetFilterOptionId }> {
    const type = 'item';
    const queryBuilder = this.itemRepository
      .createQueryBuilder(type)
      .select([
        `${type}.cuisineTypes`,
        `${type}.specialDietaries`,
        `${type}.occasionEvents`,
        `${type}.serviceTypes`,
      ])
      .where(`${type}.isActive = :isActive`, { isActive: true });

    if (keyword) {
      queryBuilder.andWhere(`(${type}.fts_vector @@ plainto_tsquery('english', lower(:keyword))`, {
        keyword,
      });
    }

    const results = await queryBuilder.getMany();
    return { data: collectUniqueValues(results) };
  }

  async findAllCuisineTypes(ids?: number[]) {
    const validIds = ids?.filter(id => Number.isInteger(id) && id > 0);
    const cuisineTypes = await this.cuisineTypeRepository.find(
      validIds ? { where: { id: In(validIds) } } : {},
    );
    return cuisineTypes.map(cuisineType => ({ id: cuisineType.id, name: cuisineType.name }));
  }

  async findAllSpecialDietaries(ids?: number[]) {
    const validIds = ids?.filter(id => Number.isInteger(id) && id > 0);
    const specialDietaries = await this.specialDietaryRepository.find(
      validIds ? { where: { id: In(validIds) } } : {},
    );
    return specialDietaries.map(specialDietary => ({
      id: specialDietary.id,
      name: specialDietary.name,
    }));
  }

  async findAllOccasionEvents(ids?: number[]) {
    const validIds = ids?.filter(id => Number.isInteger(id) && id > 0);
    const occasionEvents = await this.occasionEventRepository.find(
      validIds ? { where: { id: In(validIds) } } : {},
    );
    return occasionEvents.map(occasionEvent => ({
      id: occasionEvent.id,
      name: occasionEvent.name,
    }));
  }
}
