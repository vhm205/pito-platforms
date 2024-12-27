import { MENU_SERVICE, MENUS_SERVICE_NAME, MenusServiceClient } from '@app/common';
import { InsertItemDto } from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

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
          })),
        })),
        orderDeadlineAt: payload?.orderDeadlineAt as string,
      },
    });
  }
}
