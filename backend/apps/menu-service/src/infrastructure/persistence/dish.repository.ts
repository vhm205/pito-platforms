import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { FindOperator } from 'typeorm';

import { Dish } from '../../domain/dish.domain';

export abstract class DishRepository {
  abstract createDish(Dish: Omit<Dish, 'id'>): Promise<string>;

  abstract updateDish(id: string, data: Partial<Omit<Dish, 'id'>>): Promise<{ affected: number }>;

  abstract deleteDish(dishId: string): Promise<boolean>;

  abstract findDishById(id: string): Promise<NullableType<Dish>>;

  abstract findDishesWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Dish[], number]>;
}
