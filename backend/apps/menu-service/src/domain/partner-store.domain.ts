import { StoreStatus } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';

export class PartnerStore {
  id: string;
  storeName: string;
  status: StoreStatus;
  isVat: boolean;
  slug: string;
  storeCode: string;
  description: string;
  contacts: {
    email: string;
    phone: string;
    fullName: string;
  }[];
  location: {
    ward: string;
    region: string;
    address: string;
    district: string;
    latitude: number;
    longitude: number;
  };

  createdAt: Date;
  updatedAt: NullableType<Date>;

  toMessage() {
    return {
      id: this.id,
      name: this.storeName,
      slug: this.slug,
      description: this.description,
      storeCode: this.storeCode,
      contacts: this.contacts,
      location: this.location,
    };
  }
}
