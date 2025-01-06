import {
  CalculateDistanceRequest,
  CalculateDistanceResponse,
  FindItemRequest,
  FindAllCateringPackagesResponse,
  FindItemsByFiltersRequest,
  FindItemsByFiltersResponse,
  FindItemsRequest,
  FindStoreRequest,
  FindStoreResponse,
  FindStoresRequest,
  FindStoresResponse,
  GetFilterOptionRequest,
  GetFilterOptionResponse,
  GetItemInStoreRequest,
  GetItemInStoreResponse,
  GetItemInStoreResult,
  GetStoreByFilterRequest,
  GetStoreByFilterResponse,
  GetStoreDetailRequest,
  GetStoreDetailResponse,
  MenusServiceController,
  MenusServiceControllerMethods,
  PartnerItemRequest,
  SearchStoreResult,
  UpdateItemRequest,
  UpdateStoreStatusRequest,
  UpdatePartnerStatusRequest,
} from '@app/common';
import { StoreStatus } from '@app/common/enums';
import { PartnerStatus } from '@app/common/enums/partner';
import { CamelCaseResponseInterceptor } from '@app/common/interceptors/convert-to-camel-case.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';

import { MenuService } from './menu.service';
import { StoreService } from './store.service';

@Controller()
@MenusServiceControllerMethods()
export class MenuController implements MenusServiceController {
  constructor(
    private readonly menuService: MenuService,
    private readonly storeService: StoreService,
  ) {}

  async findStoresByFilter(args: GetStoreByFilterRequest): Promise<GetStoreByFilterResponse> {
    const { page, pageSize, sortBy, filters } = args;

    const paginationOptions = { page, pageSize };

    const { data, count } = await this.menuService.findStoresByFilter(
      paginationOptions,
      sortBy,
      filters,
    );

    return { stores: data as SearchStoreResult[], total: count };
  }

  async findItemsInStore(args: GetItemInStoreRequest): Promise<GetItemInStoreResponse> {
    const { page, pageSize, sortBy, filters } = args;

    const paginationOptions = { page, pageSize };

    const { data, count } = await this.menuService.getItemsInStore(
      filters!,
      paginationOptions,
      sortBy,
    );

    return { items: data as GetItemInStoreResult[], total: count };
  }

  async getFilterOptions(args: GetFilterOptionRequest): Promise<GetFilterOptionResponse> {
    const { data } = await this.menuService.getFilterOptions(args.keyword);
    return data;
  }

  @UseInterceptors(CamelCaseResponseInterceptor)
  async getStoreDetail(request: GetStoreDetailRequest): Promise<GetStoreDetailResponse> {
    return this.storeService.getStoreDetailByIdOrSlug(request);
  }

  async findStores(request: FindStoresRequest): Promise<FindStoresResponse> {
    request.filters ??= [];
    request.sorts ??= [];

    const { stores, totalCount } = await this.storeService.findStoresWithPagination(request);

    return {
      stores,
      totalCount,
    };
  }

  async findStore(request: FindStoreRequest): Promise<FindStoreResponse> {
    const store = await this.storeService.findStore(request);
    return { store };
  }

  async insertMenuItem(request: PartnerItemRequest) {
    return this.menuService.insertMenuItem(request);
  }

  async updateMenuItem(request: UpdateItemRequest) {
    return this.menuService.updateMenuItem(request);
  }

  async findItemsWithPagination(request: FindItemsRequest) {
    request.filters ??= [];
    request.sorts ??= [];

    const [items, totalCount] = await this.menuService.findItemsWithPagination({
      filters: request.filters,
      pagination: request.pagination,
      sorts: request.sorts,
    });

    return {
      items,
      totalCount,
    };
  }

  async calculateDistance(request: CalculateDistanceRequest): Promise<CalculateDistanceResponse> {
    const distance = await this.storeService.calculateDistance(request);
    return { distance };
  }

  async findItem(request: FindItemRequest) {
    return this.menuService.findItem(request);
  }

  async findAllCateringPackages(): Promise<FindAllCateringPackagesResponse> {
    const cateringPackages = await this.menuService.findAllCateringPackages();
    return { cateringPackages };
  }

  async findItemsByFilters(
    request: FindItemsByFiltersRequest,
  ): Promise<FindItemsByFiltersResponse> {
    request.filters ??= [];
    request.sorts ??= [];

    const [items, totalCount] = await this.menuService.findItemsByFilters(request);

    return {
      items,
      totalCount,
    };
  }

  updateStoreStatus(request: UpdateStoreStatusRequest) {
    return this.storeService.updateStoreStatus(request.ids, request.status as StoreStatus);
  }

  updatePartnerStatus(request: UpdatePartnerStatusRequest) {
    return this.storeService.updatePartnerStatus(request.ids, request.status as PartnerStatus);
  }
}
