import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, Auth } from '@gateway/decorators';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { PartnerItemDto } from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { OperatorQueryItemDto } from '@gateway/modules/menus/dtos/query-menu.dto';
import { OperatorMenusService } from '@gateway/modules/menus/operator-menus.service';
import { emptyPaginationResponse } from '@gateway/utils/common';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { isEmpty } from 'lodash';

@Controller('operator')
export class OperatorMenusController {
  constructor(private readonly service: OperatorMenusService) {}

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
}
