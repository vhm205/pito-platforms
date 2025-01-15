import { transformFilterRule } from '@app/common';
import { GrpcStatus } from '@app/common/enums';
import { DishQuantityUnit } from '@app/common/enums/dish';
import {
  CreateDishRequest,
  CreateDishResponse,
  DeleteDishResponse,
  ListDishesRequest,
  UpdateDishRequest,
  UpdateDishResponse,
} from '@app/common/types/proto/dish/dish';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Dish } from './domain/dish.domain';
import { DishRepository } from './infrastructure/persistence/dish.repository';

@Injectable()
export class DishService {
  constructor(private readonly repository: DishRepository) {}

  async createDish(data: CreateDishRequest): Promise<CreateDishResponse> {
    const newDish = {
      ...data,
      quantity: data.quantity ?? 0,
      quantityUnit: data.quantityUnit as DishQuantityUnit,
      packageOptionId: data.packageOptionId ?? null,
    };

    const insertedId = await this.repository.createDish(newDish);

    return { id: insertedId };
  }

  async updateDish(payload: UpdateDishRequest): Promise<UpdateDishResponse> {
    const { id, quantityUnit, ...data } = payload;
    const { affected } = await this.repository.updateDish(id, {
      ...data,
      quantityUnit: quantityUnit as DishQuantityUnit,
    });
    return { affectedRows: affected };
  }

  async deleteDish(id: string): Promise<DeleteDishResponse> {
    const isSuccess = await this.repository.deleteDish(id);
    return { success: isSuccess };
  }

  async getDishById(id: string) {
    const dish = await this.repository.findDishById(id);

    if (!dish) {
      throw new RpcException({
        message: `Dish not found with id ${id}`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    return dish;
  }

  async getDishesWithPagination({
    pagination,
    filters,
    sorts,
  }: ListDishesRequest): Promise<[Dish[], number]> {
    if (!pagination) {
      throw new RpcException({
        message: 'Pagination is required',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    const [dishes, total] = await this.repository.findDishesWithPagination({
      pagination,
      filters: filters?.map(transformFilterRule),
      sorts,
    });

    return [dishes, total];
  }
}
