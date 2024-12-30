import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, Auth } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { PartnerItemDto } from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { OperatorQueryItemDto } from '@gateway/modules/menus/dtos/query-menu.dto';
import { UpdateItemDto } from '@gateway/modules/menus/dtos/update-menu-item.dto';
import { MenusService } from '@gateway/modules/menus/menus.service';
import { OperatorMenusService } from '@gateway/modules/menus/operator-menus.service';
import { DraftBypassPipe } from '@gateway/modules/menus/pipes/draft-bypass.pipe';
import { UpdateItemSchema } from '@gateway/modules/menus/schemas/item.schema';
import { emptyPaginationResponse, isValidUUID } from '@gateway/utils/common';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isEmpty } from 'lodash';

@Controller('operator')
export class OperatorMenusController {
  constructor(
    private readonly service: OperatorMenusService,
    private readonly menusService: MenusService,
  ) {}

  @Get('/stores/:storeId/items')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: PartnerItemDto })
  async getItems(@Query() query: OperatorQueryItemDto, @Param('storeId') storeId: string) {
    const store = await this.service.findStore(storeId);

    if (isEmpty(store)) {
      throw new NotFoundException('Store not found');
    }

    query.filters = [
      ...(query.filters || []),
      { column: 'storeId', operator: 'eq', value: storeId },
    ];

    const { items, totalCount } = await this.service.findItemsWithPagination(query);

    if (isEmpty(items)) {
      return emptyPaginationResponse({
        page: query.page,
        pageSize: query.pageSize,
        totalCount,
      });
    }

    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto(items, pageMeta);
  }

  @Put('items/:itemId')
  @Auth([RoleType.OPERATOR])
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

  @Get('items/:identifier')
  @Auth([RoleType.OPERATOR])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async getMenuItem(@Param('identifier') identifier: string) {
    const filterCriteria = isValidUUID(identifier) ? { id: identifier } : { slug: identifier };
    const item = await this.menusService.findItem(filterCriteria);
    const itemDto = plainToInstance(PartnerItemDto, item, { excludeExtraneousValues: true });

    return itemDto;
  }
}
