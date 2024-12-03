import { StoreStatus } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';

export class PartnerStore {
  id: string;
  storeName: string;
  status: StoreStatus;
  isVat: boolean;
  slug: string;

  createdAt: Date;
  updatedAt: NullableType<Date>;

  toMessage() {
    return {
      id: this.id,
      name: this.storeName,
      slug: this.slug,
    };
  }
}
