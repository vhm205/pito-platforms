import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, Auth } from '@gateway/decorators';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { emptyPaginationResponse } from '@gateway/utils/common';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isEmpty } from 'lodash';

import { QueryStoreListDto, StoreListDto } from './dtos/store-list.dto';
import { OperatorStoresService } from './operator-stores.service';

@Controller('operator')
export class OperatorStoresController {
  constructor(private readonly service: OperatorStoresService) {}

  @Get('stores')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: StoreListDto })
  async getListStores(@Query() query: QueryStoreListDto) {
    const { stores, totalCount } = await this.service.getListStores(query);
    if (isEmpty(stores)) {
      return emptyPaginationResponse({
        page: query.page,
        pageSize: query.pageSize,
        totalCount,
      });
    }

    const transformedStores = plainToInstance(StoreListDto, stores, {
      excludeExtraneousValues: true,
    });
    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto<StoreListDto>(transformedStores, pageMeta);
  }
}
