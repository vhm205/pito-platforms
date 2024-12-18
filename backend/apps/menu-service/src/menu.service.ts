import {
  ItemFilter,
  PartnerItemRequest,
  PartnerItem,
  StoreFilter,
  getDateTimeWithOffset,
  UpdateItemRequest,
  FilterOption,
} from '@app/common';
import { AppConfig } from '@app/common/configs';
import { GrpcStatus } from '@app/common/enums';
import { ItemStatus } from '@app/common/enums/item';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { PartnerItemRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-item.repository';
import { generateSlug } from 'apps/menu-service/src/utils/slug.util';
import dayjs from 'dayjs';

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
      this.itemRepository.findAllCuisineTypes(payload.cuisineTypes),
      this.itemRepository.findAllSpecialDietaries(payload.specialDietaries),
      this.itemRepository.findAllOccasionEvents(payload.occasionEvents),
    ]);

    if (!menuCategory) {
      throw new RpcException({
        message: 'Menu category not found',
        status: GrpcStatus.NOT_FOUND,
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

    if (cuisineTypes.length === 0 || dietaries.length === 0 || occasionEvents.length === 0) {
      throw new RpcException({
        message: 'Invalid related data',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    const savedItem = await this.partnerItemRepository.insertItem({
      ...payload,
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
      description: savedItem?.description ?? '',
      cuisineTypes,
      specialDietaries: dietaries,
      occasionEvents,
      optionsChoices:
        savedItem?.optionsChoices?.map(option => ({
          id: option?.id,
          name: option?.name,
          description: option?.description,
          choices: option?.choices?.map(choice => ({
            id: choice?.id,
            name: choice?.name,
            price: choice?.price,
          })),
          isRequired: option?.is_required ?? false,
          maxChoices: option?.max_choices ?? 0,
          allowMultipleSelection: option?.allow_multiple_selection ?? false,
          allowQuantitySelection: option?.allow_quantity_selection ?? false,
        })) ?? [],
      metadata: {
        hasNotes: savedItem?.metadata?.has_notes ?? false,
        hasUtensils: savedItem?.metadata?.has_utensils ?? false,
        rejectionReason: savedItem?.metadata?.rejection_reason,
      },
    };
  }

  async updateMenuItem(payload: UpdateItemRequest): Promise<PartnerItem> {
    const { id, updateItemRequest } = payload;

    const item = await this.partnerItemRepository.findOne({
      id,
    });

    if (!item) {
      throw new RpcException({
        message: 'Menu item not found',
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const isInvalidStatus =
      item.status &&
      ![ItemStatus.DRAFT, ItemStatus.PENDING_APPROVAL].includes(item.status as ItemStatus);

    if (isInvalidStatus) {
      throw new RpcException({
        message: 'Invalid status',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    const newStatus =
      item.status === ItemStatus.REJECTED ? ItemStatus.PENDING_APPROVAL : updateItemRequest?.status;

    let cuisineTypes: FilterOption[] = [];
    let dietaries: FilterOption[] = [];
    let occasionEvents: FilterOption[] = [];

    if (updateItemRequest?.cuisineTypes?.length) {
      cuisineTypes = await this.itemRepository.findAllCuisineTypes(updateItemRequest.cuisineTypes);

      if (cuisineTypes.length !== updateItemRequest.cuisineTypes.length) {
        throw new RpcException({
          message: 'Invalid related data',
          status: GrpcStatus.INVALID_ARGUMENT,
        });
      }
    }

    if (updateItemRequest?.specialDietaries?.length) {
      dietaries = await this.itemRepository.findAllSpecialDietaries(
        updateItemRequest.specialDietaries,
      );
      if (dietaries.length !== updateItemRequest.specialDietaries.length) {
        throw new RpcException({
          message: 'Invalid related data',
          status: GrpcStatus.INVALID_ARGUMENT,
        });
      }
    }

    if (updateItemRequest?.occasionEvents?.length) {
      occasionEvents = await this.itemRepository.findAllOccasionEvents(
        updateItemRequest.occasionEvents,
      );
      if (occasionEvents.length !== updateItemRequest.occasionEvents.length) {
        throw new RpcException({
          message: 'Invalid related data',
          status: GrpcStatus.INVALID_ARGUMENT,
        });
      }
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
              hasNotes: item?.metadata?.has_notes ?? false,
              hasUtensils: item?.metadata?.has_utensils ?? false,
              rejectionReason: item?.metadata?.rejection_reason,
            },
        status: newStatus ?? ItemStatus.DRAFT,
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
              allowMultipleSelection: option?.allow_multiple_selection ?? false,
              allowQuantitySelection: option?.allow_quantity_selection ?? false,
              isRequired: option?.is_required ?? false,
              maxChoices: option?.max_choices ?? 0,
              choices: option?.choices?.map(choice => ({
                id: choice?.id,
                name: choice?.name,
                price: choice?.price,
              })),
            })) ?? []),
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
      description: updatedItem?.description ?? '',
      cuisineTypes: cuisineTypes.length ? cuisineTypes : [],
      specialDietaries: dietaries.length ? dietaries : [],
      occasionEvents: occasionEvents.length ? occasionEvents : [],
      optionsChoices:
        updatedItem?.optionsChoices?.map(option => ({
          id: option?.id,
          name: option?.name,
          description: option?.description,
          choices: option?.choices?.map(choice => ({
            id: choice?.id,
            name: choice?.name,
            price: choice?.price,
          })),
          isRequired: option?.is_required ?? false,
          maxChoices: option?.max_choices ?? 0,
          allowMultipleSelection: option?.allow_multiple_selection ?? false,
          allowQuantitySelection: option?.allow_quantity_selection ?? false,
        })) ?? [],
      metadata: {
        hasNotes: updatedItem?.metadata?.has_notes ?? false,
        hasUtensils: updatedItem?.metadata?.has_utensils ?? false,
        rejectionReason: updatedItem?.metadata?.rejection_reason,
      },
    };
  }
}
