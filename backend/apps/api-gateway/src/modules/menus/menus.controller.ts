import { RoleType } from '@gateway/constants';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { InsertItemDto, PartnerItemDto } from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { UpdateItemDto } from '@gateway/modules/menus/dtos/update-menu-item.dto';
import { MenusService } from '@gateway/modules/menus/menus.service';
import { DraftBypassPipe } from '@gateway/modules/menus/pipes/draft-bypass.pipe';
import { InsertItemSchema, UpdateItemSchema } from '@gateway/modules/menus/schemas/item.schema';
// import { ZodValidationPipe } from '@gateway/pipes/zod-validation.pipe';
import { Body, Controller, Param, Post, Put } from '@nestjs/common';

import { Auth } from '../../decorators/http.decorator';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post(':menuId/items')
  @Auth([RoleType.PARTNER])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async insertMenuItem(
    @Body(new DraftBypassPipe(InsertItemSchema)) dto: InsertItemDto,
    @Param('menuId') menuId: string,
  ) {
    const newItem = await this.menusService.insertMenuItem({
      ...dto,
      menuId,
    });

    return newItem;
  }

  @Put('items/:itemId')
  @Auth([RoleType.PARTNER])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async updateMenuItem(
    @Body(new DraftBypassPipe(UpdateItemSchema)) dto: Partial<UpdateItemDto>,
    @Param('itemId') itemId: string,
  ) {
    const updatedItem = await this.menusService.updateMenuItem({
      ...dto,
      itemId,
    });

    return updatedItem;
  }
}
