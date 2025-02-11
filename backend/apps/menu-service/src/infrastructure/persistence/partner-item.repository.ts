import { PartnerItemRequest, UpdateItemRequest } from '@app/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import {
  PartnerItem,
  CateringPackage,
  OccasionEvent,
} from 'apps/menu-service/src/domain/partner-item.domain';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import type { FindOperator, FindOptionsWhere } from 'typeorm';

import { FindItemsByFiltersResult } from '../../dtos/get-items-by-filter.dto';
import { SearchItemsInStoreResult } from '../../dtos/search-items-in-store.dto';

export abstract class PartnerItemRepository {
  abstract insertItem(
    payload: PartnerItemRequest & {
      slug: PartnerItemEntity['slug'];
      cateringPackages: PartnerItemEntity['cateringPackages'];
    },
  ): Promise<PartnerItem>;

  abstract getMenuCategoryById(id: string): Promise<PartnerMenuCategoriesEntity | null>;

  abstract findOne(
    filter: FindOptionsWhere<Pick<PartnerItem, 'id' | 'slug'>>,
  ): Promise<PartnerItem | null>;

  abstract updateItem(payload: UpdateItemRequest): Promise<PartnerItem | null>;

  abstract findItemsWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
    exceptionFilters: Record<string, unknown>;
  }): Promise<[PartnerItem[], number]>;

  abstract findAllCateringPackages(options: { sorts: SortRule[] }): Promise<CateringPackage[]>;

  abstract findAllOccasionEvents(options: { sorts: SortRule[] }): Promise<OccasionEvent[]>;

  abstract findItemsByFilters(options: {
    pagination: PaginationRequest;
    sorts: SortRule[];
    filters: Record<string, FindOperator<unknown>>[];
    exceptionFilters: Record<string, unknown>;
  }): Promise<FindItemsByFiltersResult>;

  abstract filterItemsWithCateringPackage(args: {
    filters: Record<string, FindOperator<any>>[];
    pagination: PaginationRequest;
  }): Promise<[PartnerItem[], number]>;

  abstract findItems(args: {
    filters: Record<string, FindOperator<unknown>>[];
  }): Promise<[PartnerItem[], number]>;

  abstract countCateringPackagesItems(args: {
    serviceCategory: string;
    itemStatus: string[];
    cateringPackages: number[];
  }): Promise<Map<number, number>>;

  abstract findCateringPackages(args: {
    filters: Record<string, FindOperator<any>>[];
  }): Promise<CateringPackage[]>;

  abstract findItemCountsByStoreIds(
    storeIds: string[],
    serviceCategory?: string,
    shouldFetchPendingItems?: boolean,
  ): Promise<
    {
      storeId: string;
      itemCount: number;
      menuStatus: string;
    }[]
  >;

  abstract findStoreIdsForPendingItems(serviceCategory?: string): Promise<{ storeIds: string[] }>;

  abstract searchItemsInStore(params: {
    storeId: string;
    budgetMin?: number;
    budgetMax?: number;
    occasionEventIds?: number[];
    specialDietaryIds?: number[];
    serviceTypeIds?: number[];
    cuisineTypeIds?: number[];
    searchTerm?: string;
    sortBy?: string;
    page?: number;
    pageSize?: number;
  }): Promise<[SearchItemsInStoreResult[], number]>;
}
