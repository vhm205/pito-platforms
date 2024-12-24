import { NullableType } from '@app/common/types/common';

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
    };
  }
}
