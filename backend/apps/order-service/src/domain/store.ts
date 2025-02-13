import { StoreStatus } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';

export class Store {
  id: string;
  storeCode: string;
  storeName: string;
  status: StoreStatus;
  isVat: boolean;
  slug: string;
  partnerId: string;

  createdAt: Date;
  updatedAt: NullableType<Date>;
}
