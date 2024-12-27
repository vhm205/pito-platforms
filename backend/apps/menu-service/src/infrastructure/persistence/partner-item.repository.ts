import { PartnerItemRequest, UpdateItemRequest } from '@app/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { PartnerItem } from 'apps/menu-service/src/domain/partner-item.domain';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import type { FindOperator, FindOptionsWhere } from 'typeorm';

export abstract class PartnerItemRepository {
  abstract insertItem(
    payload: PartnerItemRequest & {
      slug: PartnerItemEntity['slug'];
      cateringPackages: PartnerItemEntity['cateringPackages'];
    },
  ): Promise<PartnerItem>;

  abstract getMenuCategoryById(id: string): Promise<PartnerMenuCategoriesEntity | null>;

  abstract findOne(
    filter: FindOptionsWhere<Pick<PartnerItemEntity, 'id' | 'slug'>>,
  ): Promise<PartnerItem | null>;

  abstract updateItem(payload: UpdateItemRequest): Promise<PartnerItem | null>;

  abstract findItemsWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[PartnerItem[], number]>;
}
