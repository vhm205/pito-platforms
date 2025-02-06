import { MaybeType, NullableType } from '@app/common/types/common';

export class DeliveryAddress {
  name: string;
  label: string;
  type: string;
  default: boolean;
}

export class Customer {
  id: string;
  email: string;
  phone: NullableType<string>;
  firstName: string;
  lastName: string;
  avatar: NullableType<string>;
  thumbnail: NullableType<string>;
  contactAddress: NullableType<string>;
  deliveryAddresses: DeliveryAddress[];
  createdAt: MaybeType<Date>;
  updatedAt: MaybeType<Date>;
  status: number;
  companyId: MaybeType<string>;

  toMessage() {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone as string,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar as string,
      thumbnail: this.thumbnail as string,
      contactAddress: this.contactAddress as string,
      deliveryAddresses: this.deliveryAddresses,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      status: this.status,
      companyId: this.companyId,
    };
  }
}
