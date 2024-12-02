import {
  GetFilterOptionResponse,
  ItemFilter,
  StoreFilter,
  getDateTimeWithOffset,
  pagePagination,
} from '@app/common';
import { AppConfig } from '@app/common/configs';
import { PagePaginationResponseDto } from '@app/common/dto';
import { PaginationOptions } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

import { GetItemInStoreFilterDto, GetItemInStoreResult } from './dtos/get-items-in-store.dto';
import { FindStoreByFilterResult, SearchStoreFilterDto } from './dtos/search-store.dto';
import { ItemRepository } from './infrastructure/persistence/item.repository';
import { StoreRepository } from './infrastructure/persistence/store.repository';
import { mergeFilterOptions } from './utils/get-filter-option.util';

@Injectable()
export class MenuService {
  constructor(
    private readonly configService: ConfigService,
    private readonly storeRepository: StoreRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async findStoresByFilter(
    paginationOptions: PaginationOptions,
    sortBy?: string,
    filters?: StoreFilter,
  ): Promise<PagePaginationResponseDto<FindStoreByFilterResult>> {
    const { page, pageSize } = paginationOptions;
    const shippingTimeWithTimezone =
      filters?.shippingTime && getDateTimeWithOffset(filters.shippingTime);
    const shippingTimeFormated = dayjs(shippingTimeWithTimezone).format('YYYY-MM-DD HH:mm:ss');
    const searchTerm = filters?.keyword && filters.keyword.trim().toLowerCase();
    const limitDistanceInMeters =
      this.configService.get<AppConfig>('app.defaultDistanceInMeters', { infer: true }) ?? 30000;

    const filterPayload: SearchStoreFilterDto = {
      longitude: filters?.shippingAddress?.longitude,
      latitude: filters?.shippingAddress?.latitude,
      budgetMin: filters?.budgetRange?.min,
      budgetMax: filters?.budgetRange?.max,
      rating: filters?.rating,
      limitDistance: limitDistanceInMeters,
      occasionEvents: filters?.occasionEvents,
      specialDietaries: filters?.specialDietaries,
      serviceTypes: filters?.serviceTypes,
      cuisineTypes: filters?.cuisineTypes,
      keyword: searchTerm,
      shippingTime: shippingTimeFormated,
      sortBy,
      page,
      pageSize,
    };

    const { data: stores, count: total } =
      await this.storeRepository.findStoresByFilter(filterPayload);

    return pagePagination(stores, {
      total,
      page,
      pageSize,
    });
  }

  async getItemsInStore(
    filters: ItemFilter,
    paginationOptions: PaginationOptions,
    sortBy?: string,
  ): Promise<PagePaginationResponseDto<GetItemInStoreResult>> {
    const { page, pageSize } = paginationOptions;
    const searchTerm = filters?.keyword && filters.keyword.trim().toLowerCase();

    const filterPayload: GetItemInStoreFilterDto = {
      sid: filters?.storeId,
      budgetMin: filters?.budgetRange?.min,
      budgetMax: filters?.budgetRange?.max,
      occasionEvents: filters?.occasionEvents,
      specialDietaries: filters?.specialDietaries,
      serviceTypes: filters?.serviceTypes,
      cuisineTypes: filters?.cuisineTypes,
      keyword: searchTerm,
      sortBy,
      page,
      pageSize,
    };
    const { data: items, count: total } = await this.itemRepository.getItemsInStore(filterPayload);

    return pagePagination(items, {
      total,
      page,
      pageSize,
    });
  }

  async getFilterOptions(keyword: string): Promise<GetFilterOptionResponse> {
    const [{ data: filterOptionsOfStore }, { data: filterOptionsOfItem }] = await Promise.all([
      this.storeRepository.getFilterOptionIds(keyword),
      this.itemRepository.getFilterOptionIds(keyword),
    ]);

    const filterOptionIds = mergeFilterOptions({
      filterOptionsOfStore,
      filterOptionsOfItem,
    });

    const { data: filterOptions } = await this.storeRepository.getFilterOptions(filterOptionIds);
    return filterOptions;
  }
}
