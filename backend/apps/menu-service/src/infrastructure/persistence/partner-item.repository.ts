import {
  BulkUpdateItemsStatusRequest,
  FindMenuCategoryRequest,
  PartnerItemRequest,
  UpdateItemRequest,
} from '@app/common';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import {
  PartnerItem,
  CateringPackage,
  OccasionEvent,
} from 'apps/menu-service/src/domain/partner-item.domain';
import { MenuEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/menu.entity';
import { PartnerCategoryEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-category.entity';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import type { FindOperator, FindOptionsWhere, ObjectLiteral } from 'typeorm';

import { SettingFee } from '../../domain/setting-fee.domain';
import { FindItemsByFiltersResult } from '../../dtos/get-items-by-filter.dto';
import { SearchItemsInStoreResult } from '../../dtos/search-items-in-store.dto';

export abstract class PartnerItemRepository {
  abstract insertItem(
    payload: PartnerItemRequest & {
      slug: PartnerItemEntity['slug'];
      cateringPackages: PartnerItemEntity['cateringPackages'];
    },
  ): Promise<PartnerItem>;

  abstract bulkInsertItems(
    payload: Array<
      PartnerItemRequest & {
        slug: PartnerItemEntity['slug'];
        cateringPackages: PartnerItemEntity['cateringPackages'];
      }
    >,
  ): Promise<PartnerItem[]>;

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

  abstract findMenuByStoreAndSystemType({
    storeId,
    systemType,
  }: {
    storeId: string;
    systemType: string;
  }): Promise<NullableType<MenuEntity>>;

  abstract findOrCreateMenuCategory({
    menuId,
    categoryId,
    packageId,
  }: {
    menuId: string;
    categoryId: NullableType<string>;
    packageId: NullableType<string>;
  }): Promise<string>;

  abstract fuzzySearchByName<T extends ObjectLiteral>({
    table,
    name,
  }: {
    table: string;
    name: string;
  }): Promise<T[]>;

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

  abstract bulkUpdateItemsStatus(request: BulkUpdateItemsStatusRequest): Promise<{
    affectedRows: number;
  }>;

  abstract deleteItem(filter: FindOptionsWhere<Pick<PartnerItem, 'id' | 'slug'>>): Promise<{
    affectedRows: number;
  }>;

  abstract findMenuCategoryWithItemCounts(request: FindMenuCategoryRequest): Promise<{
    category: PartnerMenuCategoriesEntity;
    itemCount: number;
  }>;

  abstract findCategories(args: {
    filters: Record<string, FindOperator<any>>[];
  }): Promise<PartnerCategoryEntity[]>;

  abstract findSettingsFee(): Promise<SettingFee[]>;
}
