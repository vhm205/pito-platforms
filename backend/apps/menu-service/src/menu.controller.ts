import {
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
  MenusServiceController,
  MenusServiceControllerMethods,
  PartnerItemRequest,
  SearchStoreResult,
  UpdateItemRequest,
} from '@app/common';
import { Controller } from '@nestjs/common';

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

  async findStores(request: FindStoresRequest): Promise<FindStoresResponse> {
    request.filters ??= [];
    request.sorts ??= [];

    const [stores, totalCount] = await this.storeService.findStoresWithPagination(request);

    return {
      stores: stores.map(store => store.toMessage()),
      totalCount,
    };
  }

  async findStore(request: FindStoreRequest): Promise<FindStoreResponse> {
    const store = await this.storeService.findStore(request).then(store => store?.toMessage());
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
}
