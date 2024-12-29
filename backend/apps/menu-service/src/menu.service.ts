import {
  FindItemRequest,
  getDateTimeWithOffset,
  ItemFilter,
  PartnerItem,
  PartnerItemRequest,
  StoreFilter,
  transformFilterRule,
  UpdateItemRequest,
} from '@app/common';
import { AppConfig } from '@app/common/configs';
import { GrpcStatus } from '@app/common/enums';
import { ItemStatus } from '@app/common/enums/item';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { PartnerItemRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-item.repository';
import { PartnerStoreRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-store.repository';
import { generateSlug } from 'apps/menu-service/src/utils/slug.util';
import dayjs from 'dayjs';
import { compact, keyBy, uniq } from 'lodash';

import { GetItemInStoreFilterDto } from './dtos/get-items-in-store.dto';
import { SearchStoreFilterDto } from './dtos/search-store.dto';
import { ItemRepository } from './infrastructure/persistence/item.repository';
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

    return this.itemRepository.getItemsInStore(filterPayload);
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

    if (updateItemRequest?.name && updateItemRequest.name !== item.name) {
      const newSlug = generateSlug(updateItemRequest.name);
      const isSlugExist = await this.partnerItemRepository.findOne({ slug: newSlug });

      updateItemRequest.slug = isSlugExist ? `${newSlug}-${Date.now()}` : newSlug;
    }

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
              choices: option?.choices?.map(choice => ({
                id: choice?.id,
                name: choice?.name,
                price: choice?.price,
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
              choices: option?.choices?.map(choice => ({
                id: choice?.id,
                name: choice?.name,
                price: choice?.price,
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

  async findItemsWithPagination({ pagination, filters, sorts }): Promise<[PartnerItem[], number]> {
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

    const [cuisineTypes, specialDietaries, occasionEvents] = await Promise.all([
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
      cuisineTypes,
      specialDietaries,
      occasionEvents,
    };
  }
}
