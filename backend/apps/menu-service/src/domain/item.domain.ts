import { UnitType, PackagingType, EatingUtensil } from '@app/common/enums/item';
import { NullableType } from '@app/common/types/common';

export interface ItemChoice {
  name: string;
  choiceId: string;
  isActive: boolean;
  basePrice: number;
}

export interface ItemOptionAndChoice {
  optionId: string;
  name: string;
  choices: ItemChoice[];
  isActive: boolean;
  description: string;
  isRequired: boolean;
  maxChoices: number;
  isMultipleChoice: boolean;
  isSelectionQuantityAllowed: boolean;
}

export class Item {
  id: string;
  basePrice: NullableType<number>;
  name: NullableType<string>;
  description: NullableType<string>;
  extraDescription: NullableType<string>;
  images: any;
  unitQuantity: NullableType<number>;
  preparationTime: NullableType<number>;
  createdAt: Date;
  updatedAt: NullableType<Date>;
  deletedAt: NullableType<Date>;
  cuisineTypes: number[];
  specialDietaries: number[];
  menuCategoryId: NullableType<string>;
  unitType: UnitType;
  minQuantity: NullableType<number>;
  maxQuantity: NullableType<number>;
  packagingType: NullableType<PackagingType>;
  eatingUtensil: NullableType<EatingUtensil>;
  specialNote: NullableType<string>;
  serverAvailable: NullableType<boolean>;
  addMoreFood: boolean;
  setupParty: boolean;
  occasionEvents: number[];
  ftsVector: NullableType<string>;
  serviceTypes: number[];
  storeId: string;
  isActive: boolean;
  optionsAndChoices: ItemOptionAndChoice[];
  index: number;
  slug: string;
}
