import {
  GetFilterOptionRequest,
  GetFilterOptionResponse,
  GetItemInStoreRequest,
  GetItemInStoreResponse,
  GetItemInStoreResult,
  GetStoreByFilterRequest,
  GetStoreByFilterResponse,
  MenusServiceController,
  MenusServiceControllerMethods,
  SearchStoreResult,
} from '@app/common';
import { Controller } from '@nestjs/common';

import { MenuService } from './menu.service';

@Controller()
@MenusServiceControllerMethods()
export class MenuController implements MenusServiceController {
  constructor(private readonly menuService: MenuService) {}

  async findStoresByFilter(args: GetStoreByFilterRequest): Promise<GetStoreByFilterResponse> {
    const { page, pageSize, sortBy, filters } = args;

    const paginationOptions = { page, pageSize };

    const { data, metadata } = await this.menuService.findStoresByFilter(
      paginationOptions,
      sortBy,
      filters,
    );

    return { stores: data as SearchStoreResult[], total: metadata.total };
  }

  async findItemsInStore(args: GetItemInStoreRequest): Promise<GetItemInStoreResponse> {
    const { page, pageSize, sortBy, filters } = args;

    const paginationOptions = { page, pageSize };

    const { data, metadata } = await this.menuService.getItemsInStore(
      filters!,
      paginationOptions,
      sortBy,
    );

    return { items: data as GetItemInStoreResult[], total: metadata.total };
  }

  async getFilterOptions(args: GetFilterOptionRequest): Promise<GetFilterOptionResponse> {
    const result = await this.menuService.getFilterOptions(args.keyword);
    return result;
  }
}
