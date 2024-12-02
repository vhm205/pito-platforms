import { NullableType } from '@app/common/types/common';
import { OpeningHours } from '@app/common/types/store';

export class Store {
  id: string;
  partnerId: string;
  storeName: string;
  introduction: string;
  avatar: string;
  thumbnail: string;
  email: string;
  phone: string;
  isActive: boolean;
  isVat: boolean;
  starRating: number;
  timelinessRate: number;
  cover: string;
  menuStatus: string;
  cuisineTypes: number[];
  specialDietaries: number[];
  occasionEvents: number[];
  serviceTypes: number[];
  minParticipants: NullableType<number>;
  minPreparationTime: NullableType<number>;
  minOrderValue: NullableType<number>;
  storeCode: string;
  slug: string;
  status: NullableType<string>;
  openingHours: NullableType<{ [key: string]: OpeningHours }>;
  updatedAt: Date | undefined;
}
