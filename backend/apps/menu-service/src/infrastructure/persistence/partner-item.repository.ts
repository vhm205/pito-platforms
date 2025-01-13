import { PartnerItemRequest, UpdateItemRequest } from '@app/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import {
  PartnerItem,
  CateringPackage,
  OccasionEvents,
} from 'apps/menu-service/src/domain/partner-item.domain';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import type { FindOperator, FindOptionsWhere } from 'typeorm';

import { FindItemsByFiltersResult } from '../../dtos/get-items-by-filter.dto';

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
    customFilters: Record<string, unknown>;
  }): Promise<[PartnerItem[], number]>;

  abstract findAllCateringPackages(): Promise<CateringPackage[]>;

  abstract findAllOccasionEvents(): Promise<OccasionEvents[]>;

  abstract findItemsByFilters(options: {
    pagination: PaginationRequest;
    sorts: SortRule[];
    filters: Record<string, FindOperator<unknown>>[];
    customFilters: Record<string, unknown>;
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
}
