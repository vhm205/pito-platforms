import { Metadata, PartnerItem as BasePartnerItem, PartnerOptionsChoices } from '@app/common';

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
  menuCategory: string;
  images: string[];
  minQuantity: number;
  packagingType: string;
  packagingUnit: string;
  participant: number;
  preparationTime: number;
  storeId: string;
  optionsChoices: PartnerOptionsChoices[];
  metadata: Metadata | undefined;
  slug: string;
  status: string;
  orderDeadlineAt?: string | undefined;
}
