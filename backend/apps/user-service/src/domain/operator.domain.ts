import { NullableType, ObjectType } from '@app/common/types/common';

export class Operator {
  id: string;
  name: string;
  email: string;
  phone: NullableType<string>;
  avatarUrl: NullableType<string>;
  firstName: NullableType<string>;
  lastName: NullableType<string>;
  metadata: NullableType<ObjectType>;
  createdAt: Date;
  updatedAt: NullableType<Date>;

  toMessage() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone as string,
      avatarUrl: this.avatarUrl as string,
      firstName: this.firstName as string,
      lastName: this.lastName as string,
      metadata: this.metadata as ObjectType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt as Date,
    };
  }
}
