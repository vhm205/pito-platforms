import {
  Metadata,
  PartnerItem as BasePartnerItem,
  PartnerOptionsChoices,
  ItemServiceSettings,
} from '@app/common';
import { SourceSystemType } from '@app/common/enums';

export class CateringPackage {
  id: number;
  name: string;
  isActive: boolean;
}

export class OccasionEvents {
  id: number;
  name: string;
  isActive: boolean;
}

export class PartnerItem
  implements Omit<BasePartnerItem, 'cuisineTypes' | 'occasionEvents' | 'specialDietaries'>
{
  id: string;
  name: string;
  basePrice: number;
  description: string;
  cuisineTypes: number[];
  occasionEvents: number[];
  specialDietaries: number[];
  cateringPackages: number[];
  menuCategory: string;
  images: string[];
  minQuantity: number;
  packagingType: string;
  packagingUnit: string;
  participant: number;
  preparationTime: number;
  storeId: string;
  menuId: string;
  optionsChoices: PartnerOptionsChoices[];
  metadata: Metadata | undefined;
  slug: string;
  status: string;
  orderDeadlineAt?: string | undefined;
  serviceType: number;
  serviceSettings: ItemServiceSettings | undefined;
  serviceCategory: SourceSystemType | undefined;
}
