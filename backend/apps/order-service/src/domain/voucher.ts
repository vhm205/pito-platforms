import { VoucherType, VoucherUnit } from '@app/common/enums';

export class Voucher {
  id: string;
  type: VoucherType;
  value: number;
  valueUnit: VoucherUnit;
  validFrom: Date;
  validUntil: Date;
  maxUsage: number;
  voucherCode: string;
  voucherName: string;
  createdAt: Date | string;
}

export class UserVoucher {
  id: string;
  userId: string;
  voucherId: string;
  usageCount: number;
  createdAt: Date | string;
}
