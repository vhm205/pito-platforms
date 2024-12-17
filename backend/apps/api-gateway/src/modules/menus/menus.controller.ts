import { RoleType } from '@gateway/constants';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import {
  InsertItemDto,
  InsertItemSchema,
  PartnerItemDto,
} from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { MenusService } from '@gateway/modules/menus/menus.service';
import { ZodValidationPipe } from '@gateway/pipes/zod-validation.pipe';
import { Body, Controller, Param, Post } from '@nestjs/common';

import { Auth } from '../../decorators/http.decorator';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post(':menuId/items')
  @Auth([RoleType.PARTNER])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async insertMenuItem(
    @Body(new ZodValidationPipe(InsertItemSchema)) dto: InsertItemDto,
    @Param('menuId') menuId: string,
  ) {
    const newItem = await this.menusService.insertMenuItem({
      ...dto,
      menuId,
    });

    return newItem;
  }
}
