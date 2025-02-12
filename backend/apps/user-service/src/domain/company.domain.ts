import { MaybeType } from '@app/common/types/common';

export class Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxCode: string;
  createdAt: MaybeType<Date>;
  updatedAt: MaybeType<Date>;
}
