import { GetItemInStoreResult, ItemFilter, SearchStoreResult, StoreFilter } from '@app/common';
import { ApiPageWrapperResponse } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import {
  CalculateDistanceRequestDto,
  CalculateDistanceResponseDto,
} from './dtos/calculate-distance.dto';
import { GetItemInStoreRequestDto, GetItemInStoreResponseDto } from './dtos/get-items-in-store.dto';
import { SearchStoreRequestDto, SearchStoreResponseDto } from './dtos/search-store.dto';
import { StoresService } from './stores.service';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storeService: StoresService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: SearchStoreResponseDto })
  async searchStores(@Query() query: SearchStoreRequestDto) {
    const {
      page,
      pageSize,
      sortBy,
      keyword,
      shippingTime,
      budgetMax,
      budgetMin,
      address,
      latitude,
      longitude,
      occasionEvents,
      specialDietaries,
      serviceTypes,
      cuisineTypes,
      rating,
    } = query;

    const filters: StoreFilter = {
      keyword,
      shippingTime,
      budgetRange: { max: budgetMax, min: budgetMin },
      shippingAddress: { address, latitude, longitude },
      occasionEvents,
      specialDietaries,
      serviceTypes,
      cuisineTypes,
      rating,
    };

    const { stores, total } = await this.storeService.searchStores({
      page,
      pageSize,
      sortBy,
      filters,
    });

    const pageMeta = new PageMetaDto({
      pageOptions: { page, pageSize },
      totalCount: total,
    });
    const transformedDto = plainToInstance(SearchStoreResponseDto, stores);
    const response = new PageDto<SearchStoreResult>(transformedDto || [], pageMeta);

    return response;
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: GetItemInStoreResponseDto })
  async getProductsInStore(@Query() query: GetItemInStoreRequestDto) {
    const {
      page,
      pageSize,
      sortBy,
      keyword,
      storeId,
      budgetMax,
      budgetMin,
      occasionEvents,
      specialDietaries,
      serviceTypes,
      cuisineTypes,
    } = query;

    const filters: ItemFilter = {
      storeId,
      keyword,
      budgetRange: { max: budgetMax, min: budgetMin },
      occasionEvents,
      specialDietaries,
      serviceTypes,
      cuisineTypes,
    };

    const { items, total } = await this.storeService.getItemsInStore({
      page,
      pageSize,
      sortBy,
      filters,
    });

    const pageMeta = new PageMetaDto({
      pageOptions: { page, pageSize },
      totalCount: total,
    });
    const transformedDto = plainToInstance(GetItemInStoreResponseDto, items);
    const response = new PageDto<GetItemInStoreResult>(transformedDto || [], pageMeta);

    return response;
  }

  @Get('filter-options')
  @HttpCode(HttpStatus.OK)
  async getFilterOptions(@Query('keyword') keyword: string) {
    const result = await this.storeService.getFilterOptions(keyword);
    return result;
  }

  @Get('calculate-distance')
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: CalculateDistanceResponseDto })
  async calculateDistance(@Query() query: CalculateDistanceRequestDto) {
    const result = await this.storeService.calculateDistance(query);
    return result;
  }
}
