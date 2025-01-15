import { PARTNER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'apps/menu-service/src/domain/dish.domain';
import { FindOperator, type Repository } from 'typeorm';

import { DishRepository } from '../../dish.repository';
import { DishEntity } from '../entities/dish.entity';
import { DishMapper } from '../mappers/dish.mapper';

@Injectable()
export class DishRelationalRepository implements DishRepository {
  constructor(
    @InjectRepository(DishEntity, PARTNER_DB_SOURCE)
    private dishRepository: Repository<DishEntity>,
  ) {}

  async createDish(data: Omit<Dish, 'id'>) {
    const newPackage = this.dishRepository.create(data);
    const result = await this.dishRepository.insert(newPackage);
    return result.identifiers[0]?.id;
  }

  async updateDish(id: string, data: Partial<Omit<Dish, 'id'>>) {
    const result = await this.dishRepository.update({ id }, data);
    return { affected: result.affected || 0 };
  }

  async deleteDish(id: string) {
    const deleteResult = await this.dishRepository.delete(id);
    return (deleteResult.affected || 0) > 0;
  }

  async findDishById(id: string): Promise<NullableType<Dish>> {
    const entity = await this.dishRepository.findOneBy({ id });
    return entity ? DishMapper.toDomain(entity) : null;
  }

  async findDishesWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }) {
    const { pagination, sorts, filters } = options;
    const skip = (pagination.currentPage - 1) * pagination.pageSize;
    const take = pagination.pageSize;

    const queryBuilder = this.dishRepository.createQueryBuilder('dish');

    /* WHERE clause */
    if (filters.length) {
      filters.forEach(filter => {
        queryBuilder.andWhere(filter);
      });
    }

    if (sorts.length) {
      sorts.forEach(sort => {
        const column = `dish.${sort.column}`;
        const direction = sort.direction === 'asc' ? 'ASC' : 'DESC';
        queryBuilder.addOrderBy(column, direction);
      });
    }

    /* LIMIT clause */
    queryBuilder.skip(skip);
    queryBuilder.take(take);

    const [entities, total] = await queryBuilder.getManyAndCount();
    const dishes = entities?.map(entity => DishMapper.toDomain(entity));

    return [dishes, total] as [Dish[], number];
  }
}
