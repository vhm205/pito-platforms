import {
  CreateCateringPackageOptionRequest,
  CreateCateringPackageOptionResponse,
  CreateCateringPackageRequest,
  CreateCateringPackageResponse,
  DeleteCateringPackageOptionResponse,
  DeleteCateringPackageResponse,
  FindAllCateringPackagesResponse,
  FindCateringPackagesAndOccasionEventsResponse,
  FilterItemsWithCateringPackageRequest,
  FindItemRequest,
  FindItemsByFiltersRequest,
  FindItemsByFiltersResponse,
  getDateTimeWithOffset,
  ItemFilter,
  PartnerItem,
  PartnerItemRequest,
  StoreFilter,
  transformFilterRule,
  UpdateCateringPackageOptionRequest,
  UpdateCateringPackageOptionResponse,
  UpdateCateringPackageRequest,
  UpdateCateringPackageResponse,
  UpdateItemRequest,
  FindItemsRequest,
  CountCateringPackagesItemsRequest,
  FindCateringPackagesRequest,
  FindItemsWithPaginationRequest,
  AssignOptionsToPackageRequest,
  FindAllCateringPackageOptionsRequest,
  FindCateringPackagesAndOccasionEventsRequest,
  BulkInsertItemsRequest,
  BulkInsertItemsRequest_Item,
} from '@app/common';
import { AppConfig, Environment } from '@app/common/configs';
import { GrpcStatus, SourceSystemType } from '@app/common/enums';
import { PackageOptionStatus } from '@app/common/enums/catering-package';
import { ItemStatus } from '@app/common/enums/item';
import { SortRule } from '@app/common/types/proto/common';
import {
  CreateOccasionEventRequest,
  CreateOccasionEventResponse,
  DeleteOccasionEventResponse,
  UpdateOccasionEventRequest,
  UpdateOccasionEventResponse,
} from '@app/common/types/proto/item/occasion-event';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { PartnerItemRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-item.repository';
import { CateringPackageEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/catering-package.entity';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { generateSlug } from 'apps/menu-service/src/utils/slug.util';
import dayjs from 'dayjs';
import { compact, keyBy, uniq } from 'lodash';
import { v4 as uuidV4 } from 'uuid';

import { GetItemInStoreFilterDto } from './dtos/get-items-in-store.dto';
import { SearchStoreFilterDto } from './dtos/search-store.dto';
import { CateringPackageRepository } from './infrastructure/persistence/catering-package.repository';
import { ItemRepository } from './infrastructure/persistence/item.repository';
import { OccasionEventRepository } from './infrastructure/persistence/occasion-event.repository';
import { PartnerStoreRepository } from './infrastructure/persistence/partner-store.repository';
import { StoreRepository } from './infrastructure/persistence/store.repository';
import { mergeFilterOptions } from './utils/get-filter-option.util';

@Injectable()
export class MenuService {
  constructor(
    private readonly configService: ConfigService,
    private readonly storeRepository: StoreRepository,
    private readonly itemRepository: ItemRepository,
    private readonly partnerItemRepository: PartnerItemRepository,
    private readonly partnerStoreRepository: PartnerStoreRepository,
    private readonly cateringPackageRepository: CateringPackageRepository,
    private readonly occasionEventRepository: OccasionEventRepository,
  ) {}

  async findStoresByFilter(
    paginationOptions: {
      page: number;
      pageSize: number;
    },
    sortBy?: string,
    filters?: StoreFilter,
  ) {
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

    return this.storeRepository.findStoresByFilter(filterPayload);
  }

  async getItemsInStore(
    filters: ItemFilter,
    paginationOptions: {
      page: number;
      pageSize: number;
    },
    sortBy?: string,
  ) {
    const { page, pageSize } = paginationOptions;
    const searchTerm = filters?.keyword && filters.keyword.trim().toLowerCase();

    const filterPayload: GetItemInStoreFilterDto = {
      storeId: filters?.storeId,
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

    const [data, count] = await this.partnerItemRepository.searchItemsInStore({ ...filterPayload });
    return { data, count };
  }

  async getFilterOptions(keyword: string) {
    const [{ data: filterOptionsOfStore }, { data: filterOptionsOfItem }] = await Promise.all([
      this.storeRepository.getFilterOptionIds(keyword),
      this.itemRepository.getFilterOptionIds(keyword),
    ]);

    const filterOptionIds = mergeFilterOptions({
      filterOptionsOfStore,
      filterOptionsOfItem,
    });

    return this.storeRepository.getFilterOptions(filterOptionIds);
  }

  async insertMenuItem(payload: PartnerItemRequest): Promise<PartnerItem> {
    const [menuCategory, isSlugExist, cuisineTypes, dietaries, occasionEvents] = await Promise.all([
      this.partnerItemRepository.getMenuCategoryById(payload.menuCategory),
      this.partnerItemRepository.findOne({
        slug: generateSlug(payload.name),
      }),
      payload?.cuisineTypes?.length
        ? this.itemRepository.findAllCuisineTypes(payload.cuisineTypes)
        : Promise.resolve([]),
      payload?.specialDietaries?.length
        ? this.itemRepository.findAllSpecialDietaries(payload.specialDietaries)
        : Promise.resolve([]),
      payload?.occasionEvents?.length
        ? this.itemRepository.findAllOccasionEvents(payload.occasionEvents)
        : Promise.resolve([]),
    ]);

    if (!menuCategory) {
      throw new RpcException({
        message: 'Menu category not found',
        status: GrpcStatus.NOT_FOUND,
      });
    }

    if (payload?.cuisineTypes?.length && cuisineTypes?.length !== payload?.cuisineTypes?.length) {
      throw new RpcException({
        message: 'Some provided cuisines are invalid or do not exist',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    if (
      payload?.specialDietaries?.length &&
      dietaries?.length !== payload?.specialDietaries?.length
    ) {
      throw new RpcException({
        message: 'Some provided special dietaries are invalid or do not exist',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    if (
      payload?.occasionEvents?.length &&
      occasionEvents.length !== payload?.occasionEvents?.length
    ) {
      throw new RpcException({
        message: 'Some provided occasion events are invalid or do not exist',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    const isInvalidStatus =
      payload.status &&
      ![ItemStatus.DRAFT, ItemStatus.PENDING_APPROVAL].includes(payload.status as ItemStatus);

    if (isInvalidStatus) {
      throw new RpcException({
        message: 'Invalid status',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    const savedItem = await this.partnerItemRepository.insertItem({
      ...payload,
      cuisineTypes: cuisineTypes?.map(cuisine => cuisine.id),
      specialDietaries: dietaries?.map(dietary => dietary.id),
      occasionEvents: occasionEvents?.map(event => event.id),
      slug: isSlugExist
        ? `${generateSlug(payload.name)}-${Date.now()}`
        : generateSlug(payload.name),
      cateringPackages: menuCategory.packageId ? [menuCategory.packageId] : [],
      status: payload.status ?? ItemStatus.DRAFT,
    });

    if (!savedItem) {
      throw new RpcException({
        message: 'Failed to insert menu item',
        status: GrpcStatus.INTERNAL,
      });
    }

    return {
      ...savedItem,
      cuisineTypes,
      specialDietaries: dietaries,
      occasionEvents,
    };
  }

  async updateMenuItem(payload: UpdateItemRequest): Promise<PartnerItem> {
    const { id, updateItemRequest } = payload;

    const findItemPromise = this.partnerItemRepository.findOne({ id });

    const cuisineTypesPromise = updateItemRequest?.cuisineTypes?.length
      ? this.itemRepository.findAllCuisineTypes(updateItemRequest.cuisineTypes)
      : Promise.resolve([]);

    const dietariesPromise = updateItemRequest?.specialDietaries?.length
      ? this.itemRepository.findAllSpecialDietaries(updateItemRequest.specialDietaries)
      : Promise.resolve([]);

    const occasionEventsPromise = updateItemRequest?.occasionEvents?.length
      ? this.itemRepository.findAllOccasionEvents(updateItemRequest.occasionEvents)
      : Promise.resolve([]);

    const [item, cuisineTypes, dietaries, occasionEvents] = await Promise.all([
      findItemPromise,
      cuisineTypesPromise,
      dietariesPromise,
      occasionEventsPromise,
    ]);

    if (!item) {
      throw new RpcException({
        message: 'Menu item not found',
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const isInvalidStatus =
      updateItemRequest?.status &&
      ![ItemStatus.DRAFT, ItemStatus.PENDING_APPROVAL].includes(
        updateItemRequest?.status as ItemStatus,
      );

    if (isInvalidStatus) {
      throw new RpcException({
        message: 'Invalid status',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    if (
      updateItemRequest?.cuisineTypes?.length &&
      cuisineTypes.length !== updateItemRequest.cuisineTypes.length
    ) {
      throw new RpcException({
        message: 'Some provided cuisines are invalid or do not exist',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    if (
      updateItemRequest?.specialDietaries?.length &&
      dietaries.length !== updateItemRequest.specialDietaries.length
    ) {
      throw new RpcException({
        message: 'Some provided special dietaries are invalid or do not exist',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    if (
      updateItemRequest?.occasionEvents?.length &&
      occasionEvents.length !== updateItemRequest.occasionEvents.length
    ) {
      throw new RpcException({
        message: 'Some provided occasion events are invalid or do not exist',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    const newStatus =
      item.status === ItemStatus.REJECTED ? ItemStatus.PENDING_APPROVAL : updateItemRequest?.status;

    // if (updateItemRequest?.name && updateItemRequest.name !== item.name) {
    //   const newSlug = generateSlug(updateItemRequest.name);
    //   const isSlugExist = await this.partnerItemRepository.findOne({ slug: newSlug });
    //   updateItemRequest.slug = isSlugExist ? `${newSlug}-${Date.now()}` : newSlug;
    // }

    const updatedItem = await this.partnerItemRepository.updateItem({
      id,
      updateItemRequest: {
        ...item,
        ...updateItemRequest,
        description: updateItemRequest?.description ?? item.description ?? '',
        metadata: updateItemRequest?.metadata
          ? (updateItemRequest?.metadata ?? undefined)
          : {
              hasNotes: item?.metadata?.hasNotes ?? false,
              hasUtensils: item?.metadata?.hasUtensils ?? false,
              rejectionReason: item?.metadata?.rejectionReason,
              diningTools: item?.metadata?.diningTools || [],
              hasFeedingService: item?.metadata?.hasFeedingService ?? false,
            },
        status: newStatus ?? item.status,
        optionsChoices: updateItemRequest?.optionsChoices
          ? updateItemRequest?.optionsChoices?.map(option => ({
              id: option?.id,
              name: option?.name,
              description: option?.description,
              allowMultipleSelection: option?.allowMultipleSelection ?? false,
              allowQuantitySelection: option?.allowQuantitySelection ?? false,
              isRequired: option?.isRequired ?? false,
              maxChoices: option?.maxChoices ?? 0,
              type: option?.type,
              maxQuantity: option?.maxQuantity,
              choices: option?.choices?.map(choice => ({
                id: choice?.id,
                name: choice?.name,
                price: choice?.price,
                quantity: choice?.quantity,
                quantityUnit: choice?.quantityUnit,
              })),
            }))
          : (item.optionsChoices?.map(option => ({
              id: option?.id,
              name: option?.name,
              description: option?.description,
              allowMultipleSelection: option?.allowMultipleSelection ?? false,
              allowQuantitySelection: option?.allowQuantitySelection ?? false,
              isRequired: option?.isRequired ?? false,
              maxChoices: option?.maxChoices ?? 0,
              type: option?.type,
              maxQuantity: option?.maxQuantity,
              choices: option?.choices?.map(choice => ({
                id: choice?.id,
                name: choice?.name,
                price: choice?.price,
                quantity: choice?.quantity,
                quantityUnit: choice?.quantityUnit,
              })),
            })) ?? []),
        orderDeadlineAt: updateItemRequest?.orderDeadlineAt,
      },
    });

    if (!updatedItem) {
      throw new RpcException({
        message: 'Failed to update menu item',
        status: GrpcStatus.INTERNAL,
      });
    }

    return {
      ...updatedItem,
      cuisineTypes,
      specialDietaries: dietaries,
      occasionEvents,
    };
  }

  async findItemsWithPagination({
    pagination,
    filters,
    sorts,
    menuType,
  }: FindItemsWithPaginationRequest): Promise<[PartnerItem[], number]> {
    if (!pagination) {
      throw new RpcException({
        message: 'Pagination is required',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    const [items, total] = await this.partnerItemRepository.findItemsWithPagination({
      pagination,
      filters: filters?.map(transformFilterRule),
      sorts,
      exceptionFilters: {
        menuType,
      },
    });

    const cuisineTypeIds = uniq(
      compact(items.flatMap(item => item.cuisineTypes ?? []).map(Number)),
    );
    const specialDietaryIds = uniq(
      compact(items.flatMap(item => item.specialDietaries ?? []).map(Number)),
    );
    const occasionEventIds = uniq(
      compact(items.flatMap(item => item.occasionEvents ?? []).map(Number)),
    );

    const [cuisineTypes, specialDietaries, occasionEvents] = await Promise.all([
      this.itemRepository.findAllCuisineTypes(cuisineTypeIds),
      this.itemRepository.findAllSpecialDietaries(specialDietaryIds),
      this.itemRepository.findAllOccasionEvents(occasionEventIds),
    ]);

    const cuisineTypeMap = keyBy(cuisineTypes, 'id');
    const specialDietaryMap = keyBy(specialDietaries, 'id');
    const occasionEventMap = keyBy(occasionEvents, 'id');

    const enrichedItems = items.map(item => ({
      ...item,
      cuisineTypes: (item.cuisineTypes ?? []).map(id => cuisineTypeMap[id]).filter(Boolean),
      specialDietaries: (item.specialDietaries ?? [])
        .map(id => specialDietaryMap[id])
        .filter(Boolean),
      occasionEvents: (item.occasionEvents ?? []).map(id => occasionEventMap[id]).filter(Boolean),
    }));

    return [enrichedItems, total];
  }

  async findItem(payload: FindItemRequest) {
    const item = await this.partnerItemRepository.findOne(payload);

    if (!item) {
      throw new RpcException({
        message: 'Menu item not found',
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const [store, cuisineTypes, specialDietaries, occasionEvents] = await Promise.all([
      this.partnerStoreRepository.findOne({ id: item.storeId }),
      item?.cuisineTypes?.length
        ? this.itemRepository.findAllCuisineTypes(item.cuisineTypes)
        : Promise.resolve([]),
      item?.specialDietaries?.length
        ? this.itemRepository.findAllSpecialDietaries(item.specialDietaries)
        : Promise.resolve([]),
      item?.occasionEvents?.length
        ? this.itemRepository.findAllOccasionEvents(item.occasionEvents)
        : Promise.resolve([]),
    ]);

    return {
      ...item,
      storeSlug: store?.slug,
      cuisineTypes,
      specialDietaries,
      occasionEvents,
    };
  }

  async findAllCateringPackages(): Promise<FindAllCateringPackagesResponse> {
    const cateringPackages = await this.partnerItemRepository.findAllCateringPackages({
      sorts: [],
    });

    return { cateringPackages };
  }

  async findCateringPackagesAndOccasionEvents(
    request: FindCateringPackagesAndOccasionEventsRequest,
  ): Promise<FindCateringPackagesAndOccasionEventsResponse> {
    const cateringPackageOptions: { sorts: SortRule[] } = { sorts: [] };
    const occasionEventOptions: { sorts: SortRule[] } = { sorts: [] };

    if (request.sorts) {
      request.sorts.forEach(sort => {
        if (sort.column === 'cateringPackages') {
          cateringPackageOptions.sorts.push({ column: 'id', direction: sort.direction });
        }

        if (sort.column === 'occasionEvents') {
          occasionEventOptions.sorts.push({ column: 'id', direction: sort.direction });
        }
      });
    }

    const [cateringPackages, occasionEvents] = await Promise.all([
      this.partnerItemRepository.findAllCateringPackages(cateringPackageOptions),
      this.partnerItemRepository.findAllOccasionEvents(occasionEventOptions),
    ]);

    return { cateringPackages, occasionEvents };
  }

  async findItemsByFilters({
    pagination,
    filters,
    sorts,
    latitude,
    longitude,
    menuType,
  }: FindItemsByFiltersRequest): Promise<FindItemsByFiltersResponse> {
    if (!pagination) {
      throw new RpcException({
        message: 'Pagination is required',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    const { items, total } = await this.partnerItemRepository.findItemsByFilters({
      pagination,
      sorts,
      filters: filters?.map(transformFilterRule),
      exceptionFilters: {
        latitude,
        longitude,
        menuType,
      },
    });

    const cuisineTypeIds = uniq(compact(items.flatMap(item => item.cuisineTypes ?? [])));
    const specialDietaryIds = uniq(compact(items.flatMap(item => item.specialDietaries ?? [])));
    const occasionEventIds = uniq(compact(items.flatMap(item => item.occasionEvents ?? [])));

    const [cuisineTypes, specialDietaries, occasionEvents] = await Promise.all([
      this.itemRepository.findAllCuisineTypes(cuisineTypeIds),
      this.itemRepository.findAllSpecialDietaries(specialDietaryIds),
      this.itemRepository.findAllOccasionEvents(occasionEventIds),
    ]);

    const cuisineTypeMap = keyBy(cuisineTypes, 'id');
    const specialDietaryMap = keyBy(specialDietaries, 'id');
    const occasionEventMap = keyBy(occasionEvents, 'id');

    const enrichedItems = items.map(item => ({
      ...item,
      cuisineTypes: (item.cuisineTypes ?? []).map(id => cuisineTypeMap[id]).filter(Boolean),
      specialDietaries: (item.specialDietaries ?? [])
        .map(id => specialDietaryMap[id])
        .filter(Boolean),
      occasionEvents: (item.occasionEvents ?? []).map(id => occasionEventMap[id]).filter(Boolean),
      serviceCategory: item.serviceCategory as string,
    }));

    return {
      totalCount: total,
      items: enrichedItems,
    };
  }

  async createCateringPackage(
    data: CreateCateringPackageRequest,
  ): Promise<CreateCateringPackageResponse> {
    const newCateringPackage = {
      ...data,
      isActive: true,
    };
    const insertedId =
      await this.cateringPackageRepository.createCateringPackage(newCateringPackage);

    return { id: insertedId };
  }

  async updateCateringPackage(
    payload: UpdateCateringPackageRequest,
  ): Promise<UpdateCateringPackageResponse> {
    const { id, ...data } = payload;
    const { affected } = await this.cateringPackageRepository.updateCateringPackage(id, data);
    return { affectedRows: affected };
  }

  async deleteCateringPackage(id: number): Promise<DeleteCateringPackageResponse> {
    const isSuccess = await this.cateringPackageRepository.deleteCateringPackage(id);
    return { success: isSuccess };
  }

  async createCateringPackageOption(
    data: CreateCateringPackageOptionRequest,
  ): Promise<CreateCateringPackageOptionResponse> {
    const dataInsert = {
      name: data.name,
      status: PackageOptionStatus.ACTIVE,
    };

    const insertedId = await this.cateringPackageRepository.createCateringPackageOption(dataInsert);

    return { id: insertedId };
  }

  async updateCateringPackageOption(
    payload: UpdateCateringPackageOptionRequest,
  ): Promise<UpdateCateringPackageOptionResponse> {
    const { id, ...data } = payload;
    const { affected } = await this.cateringPackageRepository.updateCateringPackageOption(id, data);
    return { affectedRows: affected };
  }

  async deleteCateringPackageOption(id: number): Promise<DeleteCateringPackageOptionResponse> {
    const isSuccess = await this.cateringPackageRepository.deleteCateringPackageOption(id);
    return { success: isSuccess };
  }

  async findCateringPackageOptionsByPackageId(id: number) {
    const options = await this.cateringPackageRepository.findCateringPackageOptionsByPackageId(id);
    return { options };
  }

  async filterItemsWithCateringPackage({
    filters,
    pagination,
  }: FilterItemsWithCateringPackageRequest) {
    return this.partnerItemRepository.filterItemsWithCateringPackage({
      filters: filters.map(transformFilterRule),
      pagination: pagination!,
    });
  }

  async findItems(request: FindItemsRequest) {
    const filters = request.filters.map(transformFilterRule);
    return this.partnerItemRepository.findItems({ filters });
  }

  async countCateringPackagesItems(request: CountCateringPackagesItemsRequest) {
    return this.partnerItemRepository.countCateringPackagesItems({
      itemStatus: request.itemStatus,
      cateringPackages: request.cateringPackageIds,
      serviceCategory: request.serviceCategory,
    });
  }

  async findAllCateringPackageOptions(request: FindAllCateringPackageOptionsRequest) {
    const packageOptions =
      await this.cateringPackageRepository.findAllCateringPackageOptions(request);
    return { options: packageOptions };
  }

  async findCateringPackages(request: FindCateringPackagesRequest) {
    return this.partnerItemRepository.findCateringPackages({
      filters: request.filters.map(transformFilterRule),
    });
  }

  async assignOptionsToPackage(request: AssignOptionsToPackageRequest) {
    const { packageId, optionIds } = request;

    const { options } = await this.cateringPackageRepository.assignOptionsToPackage(
      packageId,
      optionIds,
    );
    const isSuccess = options.length === optionIds.length;

    return { success: isSuccess };
  }

  async createOccasionEvent(
    data: CreateOccasionEventRequest,
  ): Promise<CreateOccasionEventResponse> {
    const newOccasionEvents = {
      ...data,
      isActive: true,
    };
    const insertedId = await this.occasionEventRepository.createOccasionEvent(newOccasionEvents);

    return { id: insertedId };
  }

  async updateOccasionEvent(
    payload: UpdateOccasionEventRequest,
  ): Promise<UpdateOccasionEventResponse> {
    const { id, ...data } = payload;
    const { affected } = await this.occasionEventRepository.updateOccasionEvent(id, data);
    return { affectedRows: affected };
  }

  async deleteOccasionEvent(id: number): Promise<DeleteOccasionEventResponse> {
    const isSuccess = await this.occasionEventRepository.deleteOccasionEvent(id);
    return { success: isSuccess };
  }

  async findOccasionEventById(id: number) {
    const occasionEvent = await this.occasionEventRepository.findOccasionEventById(id);

    if (!occasionEvent) {
      throw new RpcException({
        message: `Occasion event not found with id ${id}`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    return occasionEvent;
  }

  async findOccasionEvents() {
    return this.itemRepository.findAllOccasionEvents();
  }

  async findCuisineTypes() {
    return this.itemRepository.findAllCuisineTypes();
  }

  async findSpecialDietaries() {
    return this.itemRepository.findAllSpecialDietaries();
  }

  async findItemCountsByStoreIds(
    storeIds: string[],
    serviceCategory?: string,
    shouldFetchPendingItems?: boolean,
  ) {
    return this.partnerItemRepository.findItemCountsByStoreIds(
      storeIds,
      serviceCategory,
      shouldFetchPendingItems,
    );
  }

  async findStoreIdsForPendingItems(serviceCategory?: string) {
    return this.partnerItemRepository.findStoreIdsForPendingItems(serviceCategory);
  }

  async fetchDriveFolderImages({
    itemId,
    driveFolderUrl,
  }: {
    itemId: string;
    driveFolderUrl: string;
  }) {
    const uploadMenuImagesUrl = (
      this.configService.get<string>('UPLOAD_IMAGE_SERVICE_URL') ?? 'http://35.213.189.210:8000'
    ).concat('/upload-menu-images');

    const response = await fetch(uploadMenuImagesUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_id: itemId,
        drive_folder_url: driveFolderUrl,
        environment: (() => {
          const env = process.env.NODE_ENV! as Environment;
          if (env === Environment.PRODUCTION) return 'prod';
          if (env === Environment.DEVELOPMENT) return 'dev';
          return 'stg';
        })(),
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch drive folder images');
    }
    return response.json();
  }

  private async processItemsAndMenuCategories({
    items,
    menuId,
    storeId,
  }: {
    items: BulkInsertItemsRequest_Item[];
    menuId: string;
    storeId: string;
  }): Promise<
    Array<
      PartnerItemRequest & {
        slug: PartnerItemEntity['slug'];
        cateringPackages: PartnerItemEntity['cateringPackages'];
      }
    >
  > {
    const processedItems: Array<
      PartnerItemRequest & {
        slug: PartnerItemEntity['slug'];
        cateringPackages: PartnerItemEntity['cateringPackages'];
      }
    > = [];

    for (const item of items) {
      const newItem: any = {
        ...item,
      };

      const itemId = uuidV4();
      newItem.id = itemId;
      newItem.storeId = storeId;
      newItem.menuId = menuId;
      newItem.status = ItemStatus.PENDING_APPROVAL;

      if (item?.driveFolderUrl) {
        try {
          const driveImages = await this.fetchDriveFolderImages({
            itemId,
            driveFolderUrl: item.driveFolderUrl,
          });

          newItem.images = driveImages?.data ?? [];
        } catch {
          throw new RpcException({
            message: 'Failed to fetch drive folder images',
            status: GrpcStatus.INTERNAL,
          });
        }
      }

      if (item.packageId) {
        const cateringPackages =
          await this.partnerItemRepository.fuzzySearchByName<CateringPackageEntity>({
            table: 'catering_packages',
            name: item.packageId,
          });

        newItem.packageId = cateringPackages[0]?.id;
      }

      if (item.categoryId) {
        const categories = await this.partnerItemRepository.fuzzySearchByName({
          table: 'categories',
          name: item.categoryId,
        });

        newItem.categoryId = categories[0]?.id;
      }

      const menuCategoryId = await this.partnerItemRepository.findOrCreateMenuCategory({
        menuId,
        categoryId: newItem.categoryId ?? null,
        packageId: newItem.packageId ?? null,
      });

      newItem.menuCategory = menuCategoryId;

      delete newItem.packageId;
      delete newItem.categoryId;
      delete newItem.driveFolderUrl;

      const slug = generateSlug(newItem.name);

      const [menuCategoryResponse, isSlugExist] = await Promise.all([
        this.partnerItemRepository.getMenuCategoryById(menuCategoryId),
        this.findItem({ slug }).then(d => d?.slug),
      ]);

      if (!menuCategoryResponse) {
        throw new RpcException({
          message: 'Menu category not found',
          status: GrpcStatus.NOT_FOUND,
        });
      }

      if (isSlugExist) {
        newItem.slug = slug.concat(`-${Date.now()}`);
      }

      if (menuCategoryResponse.packageId) {
        newItem.cateringPackages = [menuCategoryResponse.packageId];
      }

      processedItems.push(newItem);
    }

    return processedItems;
  }

  async bulkInsertItems(request: BulkInsertItemsRequest) {
    const storeId = request.storeId;
    const items = request.items;

    const store = await this.partnerStoreRepository.findOne({ id: storeId });

    if (!store) {
      throw new RpcException({
        message: 'Store not found',
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const menu = await this.partnerItemRepository.findMenuByStoreAndSystemType({
      storeId,
      systemType: SourceSystemType.PX,
    });

    if (!menu) {
      throw new RpcException({
        message: 'Menu not found',
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const processedItems = await this.processItemsAndMenuCategories({
      items,
      menuId: menu.id,
      storeId,
    });

    const insertedItems = await this.partnerItemRepository.bulkInsertItems(processedItems);

    return {
      insertedCount: insertedItems?.length ?? 0,
    };
  }
}
