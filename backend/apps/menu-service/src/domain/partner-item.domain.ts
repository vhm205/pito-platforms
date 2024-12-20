import { FilterOption } from '@app/common';
import { PackagingType, ItemStatus, UnitType } from '@app/common/enums/item';
import { NullableType } from '@app/common/types/common';

export interface Choice {
  id: string;
  name: string;
  price?: number | null;
}

export interface OptionChoices {
  id: string;
  name: string;
  description?: string;
  choices: Choice[];
  isRequired: boolean;
  maxChoices: number;
  allowMultipleSelection: boolean;
  allowQuantitySelection: boolean;
}

export interface Metadata {
  hasNotes: boolean;
  hasUtensils: boolean;
  rejectionReason?: string;
}

export class PartnerItem {
  id: string;
  storeId: string;
  menuId: string;
  menuCategory: string;
  slug: string;
  cateringPackages: number[];
  cuisineTypes?: FilterOption[];
  specialDietaries?: FilterOption[];
  occasionEvents?: FilterOption[];
  basePrice: NullableType<number>;
  name: string;
  description: NullableType<string>;
  images?: string[];
  minQuantity: number;
  participant: number;
  preparationTime: number;
  status: ItemStatus;
  packagingType: PackagingType;
  packagingUnit: UnitType;
  optionsChoices: OptionChoices[];
  metadata: Metadata;
  createdAt: Date;
  updatedAt: NullableType<Date>;
}
