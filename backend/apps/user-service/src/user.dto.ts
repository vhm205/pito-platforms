import { User as UserProto } from '@app/common';

export class UserDto implements UserProto {
  id: string;
  email: string;
  encryptedPassword: string;
  phone: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
