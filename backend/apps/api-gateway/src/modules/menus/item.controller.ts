import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PartnerItemDto } from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { MenusService } from '@gateway/modules/menus/menus.service';
import { isValidUUID } from '@gateway/utils/common';
import { Controller, Get, Param } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Controller('items')
export class ItemsController {
  constructor(private readonly menusService: MenusService) {}

  @Get(':identifier')
  @ApiWrapperResponse({ type: PartnerItemDto })
  async getItemDetail(@Param('identifier') identifier: string) {
    const filterCriteria = isValidUUID(identifier) ? { id: identifier } : { slug: identifier };
    const item = await this.menusService.findItem(filterCriteria);
    const transformedItem = plainToInstance(PartnerItemDto, item, {
      excludeExtraneousValues: true,
    });

    return transformedItem;
  }
}
