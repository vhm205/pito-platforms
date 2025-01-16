import { StoreStatus } from '@app/common/enums';
import { NullableType, ObjectType } from '@app/common/types/common';
import { StoreEngagementLevel, StorePerformanceLevel } from '@app/common/types/proto/common';

export interface StoreContactInfo {
  email: string;
  phone: string;
  fullName: string;
}

export interface StoreLocation {
  ward: string;
  region: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
}

export interface StoreBankAccount {
  bankName: string;
  bankBranch: string;
  accountHolder: string;
  accountNumber: string;
}

export interface StoreImage {
  cover: string;
  avatar: string;
  thumbnail: string;
}

export interface CuisineType {
  id: number;
  name: string;
}

export class PartnerStore {
  id: string;
  partnerId: string;
  name: string;
  storeCode: string;
  isVat: boolean;
  slug: string;
  description: NullableType<string>;
  status: StoreStatus;
  images: NullableType<StoreImage>;
  cuisineTypes: NullableType<number[]>;
  contacts: NullableType<StoreContactInfo[]>;
  location: NullableType<StoreLocation>;
  bankAccount: NullableType<StoreBankAccount>;
  prepTimes: NullableType<ObjectType>;
  metadata: NullableType<ObjectType>;

  createdAt: Date;
  updatedAt: NullableType<Date>;
  engagementLevel: StoreEngagementLevel;
  performanceLevel: StorePerformanceLevel;

  toMessage() {
    return {
      id: this.id,
      partnerId: this.partnerId,
      storeCode: this.storeCode,
      name: this.name,
      isVat: this.isVat,
      slug: this.slug,
      description: this.description as string,
      status: this.status,
      cuisineTypes: this.cuisineTypes as number[],
      images: this.images as StoreImage,
      contacts: this.contacts as StoreContactInfo[],
      location: this.location as StoreLocation,
      bankAccount: this.bankAccount as StoreBankAccount,
      prepTimes: this.prepTimes as ObjectType,
      metadata: this.metadata as ObjectType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt as Date,
      engagementLevel: this.engagementLevel,
      performanceLevel: this.performanceLevel,
    };
  }
}
