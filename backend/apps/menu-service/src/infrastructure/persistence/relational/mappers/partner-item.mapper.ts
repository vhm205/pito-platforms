import { getPublicImageURL } from '@app/common';
import { PartnerItem } from 'apps/menu-service/src/domain/partner-item.domain';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';

export class PartnerItemMapper {
  static toDomain(raw: PartnerItemEntity): PartnerItem {
    const domain: PartnerItem = {
      id: '',
      storeId: '',
      menuId: '',
      menuCategory: '',
      slug: '',
      basePrice: 0,
      name: '',
      description: '',
      images: [],
      minQuantity: 0,
      participant: 0,
      preparationTime: 0,
      status: '',
      packagingType: '',
      packagingUnit: '',
      optionsChoices: [],
      metadata: {
        hasNotes: false,
        hasUtensils: false,
        rejectionReason: '',
      },
      specialDietaries: [],
      occasionEvents: [],
      cuisineTypes: [],
      cateringPackages: [],
      orderDeadlineAt: undefined,
    };

    domain.id = raw?.id;
    domain.storeId = raw?.storeId;
    domain.menuId = raw?.menuId;
    domain.menuCategory = raw?.menuCategory;
    domain.slug = raw?.slug;

    domain.basePrice = raw?.basePrice;
    domain.name = raw?.name;
    domain.description = raw?.description ?? '';
    domain.images = raw?.images?.map(i => getPublicImageURL('images/product/', i)) || [];

    domain.minQuantity = raw?.minQuantity;
    domain.participant = raw?.participant;
    domain.preparationTime = raw?.preparationTime;
    domain.status = raw?.status;
    domain.packagingType = raw?.packagingType;
    domain.packagingUnit = raw?.packagingUnit;
    domain.optionsChoices = [];

    domain.cuisineTypes = raw?.cuisineTypes?.map(Number) ?? [];
    domain.occasionEvents = raw?.occasionEvents?.map(Number) ?? [];
    domain.specialDietaries = raw?.specialDietaries?.map(Number) ?? [];
    domain.cateringPackages = raw?.cateringPackages?.map(Number) ?? [];

    if (raw?.orderDeadlineAt) {
      domain.orderDeadlineAt = raw.orderDeadlineAt as unknown as string;
    }

    if (raw?.optionsChoices) {
      domain.optionsChoices = raw?.optionsChoices?.map(option => {
        return {
          id: option?.id,
          name: option?.name,
          description: option?.description,
          choices: option?.choices?.map(choice => ({
            id: choice?.id,
            name: choice?.name,
            price: choice?.price,
          })),
          isRequired: option?.is_required,
          maxChoices: option?.max_choices,
          allowMultipleSelection: option?.allow_multiple_selection,
          allowQuantitySelection: option?.allow_quantity_selection,
        };
      });
    }

    if (raw?.metadata) {
      domain.metadata = {
        hasNotes: raw?.metadata?.has_notes ?? false,
        hasUtensils: raw?.metadata?.has_utensils ?? false,
        rejectionReason: raw?.metadata?.rejection_reason ?? '',
      };
    }

    return domain;
  }
}
