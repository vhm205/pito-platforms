import { MENU_SERVICE, MENUS_SERVICE_NAME, MenusServiceClient } from '@app/common';
import { CreateDishRequest } from '@app/common/types/proto/dish/dish';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

import { UpdateDishDto } from './dtos/mutation-dish.dto';
import { FindDishesQueryDto } from './dtos/query-dish.dto';

@Injectable()
export class DishesService implements OnModuleInit {
  private menusService: MenusServiceClient;
  constructor(@Inject(MENU_SERVICE) private readonly menuClient: ClientGrpc) {}

  onModuleInit() {
    this.menusService = this.menuClient.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  async createDish(request: CreateDishRequest) {
    const source$ = this.menusService.createDish(request).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async updateDish(id: string, payload: UpdateDishDto) {
    const source$ = this.menusService
      .updateDish({ id, ...payload, images: payload.images ?? [] })
      .pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async deleteDish(id: string) {
    const source$ = this.menusService.deleteDish({ id }).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async findDishById(id: string) {
    const source$ = this.menusService.getDish({ id }).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async findDishesWithPagination(query: FindDishesQueryDto) {
    const { filters, page, pageSize, sorts } = query;

    const source$ = this.menusService
      .listDishes({
        filters,
        pagination: { currentPage: page, pageSize },
        sorts,
      })
      .pipe(timeout(3000));

    return firstValueFrom(source$);
  }
}
