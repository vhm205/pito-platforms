import { PartnerItemRequest } from '@app/common';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';

export abstract class PartnerItemRepository {
  abstract insertItem(
    payload: PartnerItemRequest & {
      slug: PartnerItemEntity['slug'];
      cateringPackages: PartnerItemEntity['cateringPackages'];
    },
  ): Promise<PartnerItemEntity>;
  abstract getMenuCategoryById(id: string): Promise<PartnerMenuCategoriesEntity | null>;
  abstract getMenuItemBySlug(slug: string): Promise<PartnerItemEntity | null>;
}
