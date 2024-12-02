import { PartnerStatus } from '@app/common/enums/partner';
import { NullableType } from '@app/common/types/common';

export class Partner {
  id: string;
  partnerName: string;
  isActive: boolean;
  isVat: boolean;
  serviceFeeRate: NullableType<number>;
  status: PartnerStatus;
  createdAt: Date;
  updatedAt: NullableType<Date>;
}
