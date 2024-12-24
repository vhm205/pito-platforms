import { NullableType } from '@app/common/types/common';

export class UserPartner {
  id: string;
  fullName: NullableType<string>;
  email: string;
  phone: NullableType<string>;
  fcmToken: NullableType<string>;
  avatarUrl: NullableType<string>;
  createdAt: Date;
  updatedAt: NullableType<Date>;
  roles?: string[];

  toMessage() {
    return {
      id: this.id,
      fullName: this.fullName as string,
      email: this.email,
      phone: this.phone as string,
      avatarUrl: this.avatarUrl as string,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt as Date,
      roles: this.roles,
    };
  }
}
