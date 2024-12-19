import { PartnerItemRequest, UpdateItemRequest } from '@app/common';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import type { FindOptionsWhere } from 'typeorm';

export abstract class PartnerItemRepository {
  abstract insertItem(
    payload: PartnerItemRequest & {
      slug: PartnerItemEntity['slug'];
      cateringPackages: PartnerItemEntity['cateringPackages'];
    },
  ): Promise<PartnerItemEntity>;
  abstract getMenuCategoryById(id: string): Promise<PartnerMenuCategoriesEntity | null>;
  abstract findOne(
    filter: FindOptionsWhere<Pick<PartnerItemEntity, 'id' | 'slug'>>,
  ): Promise<PartnerItemEntity | null>;
  abstract updateItem(payload: UpdateItemRequest): Promise<PartnerItemEntity | null>;
}
