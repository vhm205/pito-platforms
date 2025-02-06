import {
  CateringPackage,
  FindItemRequest,
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
} from '@app/common';
import { InsertItemDto } from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { isEmpty } from 'lodash';
import { firstValueFrom, timeout } from 'rxjs';

import { FindItemsQueryDto } from './dtos/query-items.dto';

@Injectable()
export class MenusService {
  private menusService: MenusServiceClient;

  constructor(@Inject(MENU_SERVICE) private client: ClientGrpc) {
    this.menusService = this.client.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  async insertMenuItem(payload: InsertItemDto & { menuId: string }) {
    return this.menusService.insertMenuItem({
      ...payload,
      images: payload?.images ?? [],
      specialDietaries: payload?.specialDietaries ?? [],
      cuisineTypes: payload?.cuisineTypes ?? [],
      occasionEvents: payload?.occasionEvents ?? [],
      optionsChoices: payload.optionsChoices.map(option => ({
        ...option,
        choices: option.choices.map(choice => ({
          ...choice,
          price: choice?.price as number,
          quantity: choice?.quantity as number,
          quantityUnit: choice?.quantityUnit as string,
        })),
      })),
      orderDeadlineAt: payload?.orderDeadlineAt as string,
    });
  }

  async updateMenuItem(payload: Partial<InsertItemDto> & { itemId: string }) {
    return this.menusService.updateMenuItem({
      id: payload.itemId,
      updateItemRequest: {
        ...payload,
        specialDietaries: payload?.specialDietaries as number[],
        cuisineTypes: payload?.cuisineTypes as number[],
        occasionEvents: payload?.occasionEvents as number[],
        images: payload?.images as string[],
        optionsChoices: (payload.optionsChoices ?? []).map(option => ({
          ...option,
          choices: option.choices.map(choice => ({
            ...choice,
            price: choice?.price as number,
            quantity: choice?.quantity as number,
            quantityUnit: choice?.quantityUnit as string,
          })),
        })),
        orderDeadlineAt: payload?.orderDeadlineAt as string,
      },
    });
  }

  async findItem(request: FindItemRequest) {
    return firstValueFrom(this.menusService.findItem(request));
  }

  async findItemsWithFilters(query: FindItemsQueryDto) {
    const { filters, page, pageSize, sorts, latitude, longitude, menuType } = query;

    const source$ = this.menusService
      .findItemsByFilters({
        filters,
        pagination: { currentPage: page, pageSize },
        sorts,
        latitude,
        longitude,
        menuType,
      })
      .pipe(timeout(5000));

    return firstValueFrom(source$);
  }

  async findAllCateringPackages() {
    const source$ = this.menusService.findAllCateringPackages({}).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async findActiveCateringPackages() {
    return firstValueFrom(
      this.menusService.findCateringPackages({
        filters: [{ column: 'isActive', operator: 'eq', value: 'true' }],
      }),
    ).then(r => r.data ?? []);
  }

  async findCateringPackagesWithIds(ids: number[]) {
    if (isEmpty(ids)) return Promise.resolve<CateringPackage[]>([]);
    return firstValueFrom(
      this.menusService.findCateringPackages({
        filters: [{ column: 'id', operator: 'in', value: ids.join(',') }],
      }),
    ).then(r => r.data ?? []);
  }

  async findOccasionEvents() {
    return firstValueFrom(this.menusService.findOccasionEvents({}));
  }

  async findCuisineTypes() {
    return firstValueFrom(this.menusService.findCuisineTypes({}));
  }

  async findSpecialDietaries() {
    return firstValueFrom(this.menusService.findSpecialDietaries({}));
  }
}
