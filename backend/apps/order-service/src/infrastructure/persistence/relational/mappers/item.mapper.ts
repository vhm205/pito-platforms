import { getImageUrl } from '@app/common';
import { Item } from 'apps/order-service/src/domain/item';

import { ItemEntity } from '../entities/item.entity';

export class ItemMapper {
  static toDomain(raw: ItemEntity): Item {
    const domain = new Item();

    domain.id = raw.id;
    domain.basePrice = parseInt(raw.basePrice || '0');
    domain.name = raw.name;
    domain.description = raw.description;
    domain.extraDescription = raw.extraDescription;
    domain.images = Array.isArray(raw.images) ? raw.images.map(getImageUrl) : [];
    domain.unitQuantity = raw.unitQuantity;
    domain.preparationTime = raw.preparationTime;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    domain.deletedAt = raw.deletedAt;
    domain.cuisineTypes = raw.cuisineTypes;
    domain.specialDietaries = raw.specialDietaries;
    domain.menuCategoryId = raw.menuCategoryId;
    domain.unitType = raw.unitType;
    domain.minQuantity = raw.minQuantity;
    domain.maxQuantity = raw.maxQuantity;
    domain.packagingType = raw.packagingType;
    domain.eatingUtensil = raw.eatingUtensil;
    domain.specialNote = raw.specialNote;
    domain.optionsAndChoices = [];

    if (Array.isArray(raw.optionsAndChoices)) {
      domain.optionsAndChoices = raw.optionsAndChoices.map(option => {
        return {
          optionId: option.option_id,
          name: option.name,
          description: option.description,
          isActive: option.is_active,
          isRequired: option.is_required,
          maxChoices: option.max_choices,
          isMultipleChoice: option.is_multiple_choice,
          isSelectionQuantityAllowed: option.is_selection_quantity_allowed,
          choices: option.choices.map((choice: any) => ({
            choiceId: choice.choice_id,
            isActive: choice.is_active,
            name: choice.name,
            basePrice: choice.base_price ?? 0,
            quantity: choice.quantity ?? 0,
          })),
        };
      });
    }

    return domain;
  }
}
