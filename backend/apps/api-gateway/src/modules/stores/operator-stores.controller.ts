import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, Auth } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { emptyPaginationResponse } from '@gateway/utils/common';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isEmpty, map } from 'lodash';

import { GetStoreDetailResponseDto } from './dtos/get-store-detail.dto';
import { QueryStoreListDto, StoreListDto } from './dtos/store-list.dto';
import { UpdateStoreRequestDto, UpdateStoreResponseDto } from './dtos/update-store.dto';
import { OperatorStoresService } from './operator-stores.service';
import { StoresService } from './stores.service';

@Controller('operator')
export class OperatorStoresController {
  constructor(
    private readonly service: OperatorStoresService,
    private readonly storeService: StoresService,
  ) {}

  @Get('stores')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: StoreListDto })
  async getListStores(@Query() query: QueryStoreListDto) {
    let shouldFetchItemCount = false;
    let shouldFetchStoreIdsForPendingItems = false;
    let serviceCategory = '';

    query.filters = query.filters.filter(filter => {
      if (filter.column === 'name') filter.column = 'storeName';

      switch (filter.column) {
        case 'shouldFetchItemCount':
          if (filter.operator === 'eq' && filter.value === 'true') {
            shouldFetchItemCount = true;
            return false;
          }
          break;
        case 'serviceCategory':
          if (filter.operator === 'eq' && filter.value) {
            serviceCategory = filter.value;
            return false;
          }
          break;
        case 'shouldFetchStoreIdsForPendingItems':
          if (filter.operator === 'eq' && filter.value === 'true') {
            shouldFetchStoreIdsForPendingItems = true;
            return false;
          }
          break;
      }
      return true;
    });

    if (shouldFetchStoreIdsForPendingItems) {
      const { storeIds } = await this.service.findStoreIdsForPendingItems(serviceCategory);
      query.filters.push({ column: 'id', operator: 'in', value: storeIds.join(',') });
    }

    const { stores, totalCount } = await this.service.getListStores(query);

    if (isEmpty(stores)) {
      return emptyPaginationResponse({ page: query.page, pageSize: query.pageSize, totalCount });
    }

    let itemCountsMap = new Map();

    if (shouldFetchItemCount) {
      const itemCounts = await this.service.findItemCountsByStoreIds(
        stores.map(store => store.id),
        serviceCategory,
        shouldFetchStoreIdsForPendingItems,
      );
      itemCountsMap = new Map(
        itemCounts?.data?.map(item => [
          item.storeId,
          { itemCount: item.itemCount, menuStatus: item.menuStatus },
        ]),
      );
    }

    const transformedStores = plainToInstance(
      StoreListDto,
      map(stores, store => ({
        ...store,
        itemCount: shouldFetchItemCount ? itemCountsMap.get(store.id)?.itemCount || 0 : undefined,
        menuStatus: shouldFetchItemCount
          ? itemCountsMap.get(store.id)?.menuStatus || 'active'
          : undefined,
      })),
      { excludeExtraneousValues: true },
    );

    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto<StoreListDto>(transformedStores, pageMeta);
  }

  @Get('stores/:identifier')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: GetStoreDetailResponseDto })
  async getStoreDetail(@Param('identifier') identifier: string) {
    const result = await this.storeService.getStoreDetail({ identifier });
    return plainToInstance(GetStoreDetailResponseDto, result);
  }

  @Patch('stores/:identifier')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: UpdateStoreResponseDto })
  async updateStoreById(
    @Param('identifier') identifier: string,
    @Body() body: UpdateStoreRequestDto,
  ) {
    const result = await this.service.updateStoreById({ id: identifier, ...body });
    return result;
  }
}
