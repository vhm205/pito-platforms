import { CUSTOMER_DB_SOURCE, transformToCamelCase } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetFilterOptionId } from 'apps/menu-service/src/dtos/get-filter-option.dto';
import {
  GetItemInStoreDto,
  GetItemInStoreFilterDto,
  GetItemInStoreResult,
} from 'apps/menu-service/src/dtos/get-items-in-store.dto';
import { collectUniqueValues } from 'apps/menu-service/src/utils/get-filter-option.util';
import type { Repository } from 'typeorm';

import { ItemRepository } from '../../item.repository';
import { ItemEntity } from '../entities/item.entity';
import { ItemMapper } from '../mappers/item.mapper';

@Injectable()
export class ItemRelationalRepository implements ItemRepository {
  constructor(
    @InjectRepository(ItemEntity, CUSTOMER_DB_SOURCE)
    private itemRepository: Repository<ItemEntity>,
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
}
