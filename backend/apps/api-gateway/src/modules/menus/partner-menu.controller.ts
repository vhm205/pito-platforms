import { RoleType } from '@gateway/constants';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { StoreAuth } from '@gateway/decorators/http.decorator';
import { Store } from '@gateway/decorators/store.decorator';
import { AuthenticatedStore } from '@gateway/modules/auth/auth-user.interface';
import { InsertItemDto, PartnerItemDto } from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { UpdateItemDto } from '@gateway/modules/menus/dtos/update-menu-item.dto';
import { MenusService } from '@gateway/modules/menus/menus.service';
import { DraftBypassPipe } from '@gateway/modules/menus/pipes/draft-bypass.pipe';
import { InsertItemSchema, UpdateItemSchema } from '@gateway/modules/menus/schemas/item.schema';
import { isValidUUID } from '@gateway/utils/common';
import { Body, Controller, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';

@Controller('partner-menus')
export class PartnerMenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post(':menuId/items')
  @StoreAuth([RoleType.PARTNER])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async insertMenuItem(
    @Body(new DraftBypassPipe(InsertItemSchema)) dto: InsertItemDto,
    @Param('menuId') menuId: string,
  ) {
    // TODO: Get store_id and partner_id from the Store decorator
    const newItem = await this.menusService.insertMenuItem({
      ...dto,
      menuId,
    });

    return newItem;
  }

  @Put('items/:itemId')
  @StoreAuth([RoleType.PARTNER])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async updateMenuItem(
    @Body(new DraftBypassPipe(UpdateItemSchema)) dto: Partial<UpdateItemDto>,
    @Param('itemId') itemId: string,
    @Store() store: AuthenticatedStore,
  ) {
    const item = await this.menusService.findItem({
      id: itemId,
    });

    if (!item || item.storeId !== store.id) {
      throw new NotFoundException(`Item not found for ID: ${itemId}`);
    }

    const updatedItem = await this.menusService.updateMenuItem({
      ...dto,
      itemId,
    });

    return updatedItem;
  }

  @Get('items/:identifier')
  @StoreAuth([RoleType.PARTNER])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async getMenuItem(@Param('identifier') identifier: string, @Store() store: AuthenticatedStore) {
    const filterCriteria = isValidUUID(identifier) ? { id: identifier } : { slug: identifier };
    const item = await this.menusService.findItem(filterCriteria);

    if (!item || item.storeId !== store.id) {
      throw new NotFoundException(`Item not found for ID: ${identifier}`);
    }

    const itemDto = plainToInstance(PartnerItemDto, item, { excludeExtraneousValues: true });
    const sanitizedItem = omit(itemDto, ['menuCategory', 'storeId', 'menuId']);

    return sanitizedItem;
  }
}
