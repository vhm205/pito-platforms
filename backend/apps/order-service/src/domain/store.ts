import { StoreStatus } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';

export class Store {
  id: string;
  storeName: string;
  status: StoreStatus;
  isVat: boolean;
  slug: string;

  createdAt: Date;
  updatedAt: NullableType<Date>;
}
