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
        diningTools: [],
        hasFeedingService: false,
      },
      specialDietaries: [],
      occasionEvents: [],
      cuisineTypes: [],
      cateringPackages: [],
      orderDeadlineAt: undefined,
      serviceType: 1,
      serviceSettings: {
        setupTime: 0,
        servicePerson: 0,
        serviceTime: 0,
      },
      serviceCategory: undefined,
      version: 1,
    };

    domain.id = raw?.id;
    domain.storeId = raw?.storeId;
    domain.menuId = raw?.menuId;
    domain.menuCategory = raw?.menuCategory;
    domain.slug = raw?.slug;

    domain.basePrice = raw?.basePrice;
    domain.name = raw?.name;
    domain.description = raw?.description ?? '';
    domain.images = raw?.images?.map(i => getPublicImageURL('images/product', i)) || [];

    domain.minQuantity = raw?.minQuantity;
    domain.participant = raw?.participant;
    domain.preparationTime = raw?.preparationTime;
    domain.status = raw?.status;
    domain.packagingType = raw?.packagingType;
    domain.packagingUnit = raw?.packagingUnit;
    domain.optionsChoices = [];
    domain.serviceType = raw?.serviceType ?? 1;
    domain.version = raw?.version ?? 1;

    domain.cuisineTypes = raw?.cuisineTypes?.map(Number) ?? [];
    domain.occasionEvents = raw?.occasionEvents?.map(Number) ?? [];
    domain.specialDietaries = raw?.specialDietaries?.map(Number) ?? [];
    domain.cateringPackages = raw?.cateringPackages?.map(Number) ?? [];
    domain.serviceCategory = raw?.serviceCategory;

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
            quantity: choice?.quantity,
            quantityUnit: choice?.quantity_unit,
          })),
          isRequired: option?.is_required,
          maxChoices: option?.max_choices,
          allowMultipleSelection: option?.allow_multiple_selection,
          allowQuantitySelection: option?.allow_quantity_selection,
          type: option?.type,
          maxQuantity: option?.max_quantity,
        };
      });
    }

    if (raw?.metadata) {
      domain.metadata = {
        hasNotes: raw?.metadata?.has_notes ?? false,
        hasUtensils: raw?.metadata?.has_utensils ?? false,
        rejectionReason: raw?.metadata?.rejection_reason ?? '',
        diningTools: raw?.metadata?.dining_tools || [],
        hasFeedingService: raw?.metadata?.has_feeding_service ?? false,
      };
    }

    if (raw?.serviceSettings) {
      domain.serviceSettings = {
        setupTime: raw?.serviceSettings?.setup_time ?? 0,
        servicePerson: raw?.serviceSettings?.service_person ?? 0,
        serviceTime: raw?.serviceSettings?.service_time ?? 0,
      };
    }

    return domain;
  }
}
