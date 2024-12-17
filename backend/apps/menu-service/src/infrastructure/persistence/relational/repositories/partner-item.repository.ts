import { PARTNER_DB_SOURCE, PartnerItemRequest } from '@app/common';
import { ItemStatus, PackagingType, UnitType } from '@app/common/enums/item';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerItemRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-item.repository';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import { type Repository } from 'typeorm';

@Injectable()
export class PartnerItemRelationalRepository implements PartnerItemRepository {
  constructor(
    @InjectRepository(PartnerItemEntity, PARTNER_DB_SOURCE)
    private partnerItemRepository: Repository<PartnerItemEntity>,

    @InjectRepository(PartnerMenuCategoriesEntity, PARTNER_DB_SOURCE)
    private partnerMenuCategoriesRepository: Repository<PartnerMenuCategoriesEntity>,
  ) {}

  async insertItem(
    payload: PartnerItemRequest & {
      slug: PartnerItemEntity['slug'];
      cateringPackages: PartnerItemEntity['cateringPackages'];
    },
  ) {
    return this.partnerItemRepository.save({
      ...payload,
      packagingUnit: payload?.packagingUnit as UnitType,
      packagingType: payload?.packagingType as PackagingType,
      specialDietaries: payload?.specialDietaries ?? [],
      status: (payload?.status as ItemStatus) ?? ItemStatus.DRAFT,
      metadata: {
        has_notes: payload.metadata?.hasNotes,
        has_utensils: payload.metadata?.hasUtensils,
        rejection_reason: payload.metadata?.rejectionReason,
      },
      optionsChoices:
        payload?.optionsChoices?.map(option => ({
          id: option?.id,
          name: option?.name,
          description: option?.description,
          allow_multiple_selection: option?.allowMultipleSelection ?? false,
          allow_quantity_selection: option?.allowQuantitySelection ?? false,
          is_required: option?.isRequired ?? false,
          max_choices: option?.maxChoices ?? 0,
          choices: option?.choices?.map(choice => ({
            id: choice?.id,
            name: choice?.name,
            price: choice?.price,
          })),
        })) ?? [],
    });
  }

  async getMenuCategoryById(id: string) {
    return this.partnerMenuCategoriesRepository.findOne({
      where: { id },
    });
  }

  async getMenuItemBySlug(slug: string) {
    return this.partnerItemRepository.findOne({
      where: { slug },
    });
  }
}
