import { getImageUrl } from '@app/common';
import { PartnerItem } from 'apps/menu-service/src/domain/partner-item.domain';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';

export class PartnerItemMapper {
  static toDomain(raw: PartnerItemEntity): PartnerItem {
    const domain = new PartnerItem();

    domain.id = raw.id;
    domain.storeId = raw.storeId;
    domain.menuId = raw.menuId;
    domain.menuCategory = raw.menuCategory;
    domain.slug = raw.slug;
    domain.cateringPackages = raw.cateringPackages;

    // domain.cuisineTypes = raw.cuisineTypes?.map(id => ({ id, name: '' }));
    // domain.specialDietaries = raw.specialDietaries?.map(id => ({ id, name: '' }));
    // domain.occasionEvents = raw.occasionEvents?.map(id => ({ id, name: '' }));

    domain.basePrice = raw.basePrice;
    domain.name = raw.name;
    domain.description = raw.description;
    domain.images = raw.images?.map(image => getImageUrl(image));
    domain.minQuantity = raw.minQuantity;
    domain.participant = raw.participant;
    domain.preparationTime = raw.preparationTime;
    domain.status = raw.status;
    domain.packagingType = raw.packagingType;
    domain.packagingUnit = raw.packagingUnit;
    domain.optionsChoices = [];

    if (raw.optionsChoices) {
      domain.optionsChoices = raw.optionsChoices.map(option => {
        return {
          id: option.id,
          name: option.name,
          description: option.description,
          choices: option.choices.map(choice => ({
            id: choice.id,
            name: choice.name,
            price: choice.price,
          })),
          isRequired: option.is_required,
          maxChoices: option.max_choices,
          allowMultipleSelection: option.allow_multiple_selection,
          allowQuantitySelection: option.allow_quantity_selection,
        };
      });
    }

    if (raw.metadata) {
      domain.metadata.hasNotes = raw?.metadata?.has_notes;
      domain.metadata.hasUtensils = raw?.metadata?.has_utensils;
      domain.metadata.rejectionReason = raw?.metadata?.rejection_reason;
    }

    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;

    return domain;
  }
}
