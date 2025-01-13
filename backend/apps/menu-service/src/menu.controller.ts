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
  GetListPartnersRequest,
  GetListPartnersResponse,
  GetListPartnersResponse_Partner,
  GetPartnerDetailsRequest,
  GetPartnerDetailsResponse,
  LoggerService,
  CreateCateringPackageRequest,
  CreateCateringPackageResponse,
  UpdateCateringPackageRequest,
  UpdateCateringPackageResponse,
  DeleteCateringPackageRequest,
  DeleteCateringPackageResponse,
  CreateCateringPackageOptionRequest,
  CreateCateringPackageOptionResponse,
  UpdateCateringPackageOptionRequest,
  UpdateCateringPackageOptionResponse,
  DeleteCateringPackageOptionRequest,
  DeleteCateringPackageOptionResponse,
  GetCateringPackageOptionsRequest,
  GetCateringPackageOptionsResponse,
  FindCateringPackagesAndOccasionEventsResponse,
  FilterItemsWithCateringPackageRequest,
  FilterItemsWithCateringPackageResponse,
  FindItemsWithPaginationRequest,
  FindItemsResponse,
  CountCateringPackagesItemsRequest,
  CountCateringPackagesItemsResponse,
} from '@app/common';
import { StoreStatus } from '@app/common/enums';
import { PartnerStatus } from '@app/common/enums/partner';
import { CamelCaseResponseInterceptor } from '@app/common/interceptors/convert-to-camel-case.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { find, includes, isEmpty } from 'lodash';

import { MenuService } from './menu.service';
import { PartnerService } from './partner.service';
import { StoreService } from './store.service';

@Controller()
@MenusServiceControllerMethods()
export class MenuController implements MenusServiceController {
  constructor(
    private readonly logger: LoggerService,
    private readonly menuService: MenuService,
    private readonly storeService: StoreService,
    private readonly partnerService: PartnerService,
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

    if (find(request.filters, filter => includes(['serviceType', 'location'], filter.column))) {
      return this.storeService.filterStoresWithPagination(request);
    }
    return this.storeService.findStoresWithPagination(request);
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

  async findItemsWithPagination(request: FindItemsWithPaginationRequest) {
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

  async findItems(request: FindItemsRequest): Promise<FindItemsResponse> {
    const [items] = await this.menuService.findItems(request);
    return { data: items };
  }

  async calculateDistance(request: CalculateDistanceRequest): Promise<CalculateDistanceResponse> {
    const distance = await this.storeService.calculateDistance(request);
    return { distance };
  }

  async findItem(request: FindItemRequest) {
    return this.menuService.findItem(request);
  }

  async findAllCateringPackages(): Promise<FindAllCateringPackagesResponse> {
    return this.menuService.findAllCateringPackages();
  }

  async findCateringPackagesAndOccasionEvents(): Promise<FindCateringPackagesAndOccasionEventsResponse> {
    return this.menuService.findCateringPackagesAndOccasionEvents();
  }

  async findItemsByFilters(
    request: FindItemsByFiltersRequest,
  ): Promise<FindItemsByFiltersResponse> {
    request.filters ??= [];
    request.sorts ??= [];

    const { items, totalCount } = await this.menuService.findItemsByFilters(request);

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

  async getListPartners(request: GetListPartnersRequest): Promise<GetListPartnersResponse> {
    try {
      const [partners, totalCount] = await this.partnerService.getPartnersWithPagination(request);
      const transformedPartners: Array<GetListPartnersResponse_Partner> = partners.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        representativeContact: {
          name: p.businessOwner.full_name,
          email: p.businessOwner.email,
          phone: p.businessOwner.phone,
        },
        businessType: p.businessType,
        certification: p.certification,
        businessAddress: p.businessInfo.registered_address,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      return { data: transformedPartners, totalCount };
    } catch (e) {
      const errMessage = (e as Error).message;
      this.logger.error(errMessage);
      return { error: errMessage, data: [], totalCount: 0 };
    }
  }

  async getPartnerDetails(request: GetPartnerDetailsRequest): Promise<GetPartnerDetailsResponse> {
    try {
      const partner = await this.partnerService.getPartnerDetails(request.id);
      if (isEmpty(partner)) {
        const errMessage = `We could not find the partner with the given id: ${request.id}`;
        this.logger.error(errMessage);
        return { error: errMessage };
      }

      return { data: partner };
    } catch (e) {
      const errMessage = (e as Error).message;
      this.logger.error(errMessage);
      return { error: errMessage };
    }
  }

  async createCateringPackage(
    request: CreateCateringPackageRequest,
  ): Promise<CreateCateringPackageResponse> {
    return this.menuService.createCateringPackage(request);
  }

  async updateCateringPackage(
    request: UpdateCateringPackageRequest,
  ): Promise<UpdateCateringPackageResponse> {
    return this.menuService.updateCateringPackage(request);
  }

  async deleteCateringPackage(
    request: DeleteCateringPackageRequest,
  ): Promise<DeleteCateringPackageResponse> {
    return this.menuService.deleteCateringPackage(request.id);
  }

  async createCateringPackageOption(
    request: CreateCateringPackageOptionRequest,
  ): Promise<CreateCateringPackageOptionResponse> {
    return this.menuService.createCateringPackageOption(request);
  }

  async updateCateringPackageOption(
    request: UpdateCateringPackageOptionRequest,
  ): Promise<UpdateCateringPackageOptionResponse> {
    return this.menuService.updateCateringPackageOption(request);
  }

  async deleteCateringPackageOption(
    request: DeleteCateringPackageOptionRequest,
  ): Promise<DeleteCateringPackageOptionResponse> {
    return this.menuService.deleteCateringPackageOption(request.id);
  }

  async getCateringPackageOptions(
    request: GetCateringPackageOptionsRequest,
  ): Promise<GetCateringPackageOptionsResponse> {
    return this.menuService.findCateringPackageOptionsByPackageId(request.packageId);
  }

  async filterItemsWithCateringPackage(
    request: FilterItemsWithCateringPackageRequest,
  ): Promise<FilterItemsWithCateringPackageResponse> {
    try {
      const [items, totalCount] = await this.menuService.filterItemsWithCateringPackage(request);
      return { data: items, totalCount };
    } catch (e) {
      const errMessage = (e as Error).message;
      this.logger.error(errMessage);
      return { error: errMessage, data: [], totalCount: 0 };
    }
  }

  async countCateringPackagesItems(
    request: CountCateringPackagesItemsRequest,
  ): Promise<CountCateringPackagesItemsResponse> {
    const countMap = await this.menuService.countCateringPackagesItems(request);
    return { data: Object.fromEntries(countMap) };
  }
}
