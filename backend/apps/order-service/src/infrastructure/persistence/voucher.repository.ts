import { NullableType } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { UserVoucher, Voucher } from '../../domain/voucher';

export abstract class VoucherRepository {
  abstract createUserVoucher(userVoucher: Partial<UserVoucher>): Promise<UserVoucher>;
  abstract findOne(
    filter: FindOptionsWhere<Pick<Voucher, 'id' | 'voucherCode'>>,
  ): Promise<NullableType<Voucher>>;
  abstract findUserVoucherByUserIdAndVoucherId(
    userId: string,
    voucherId: string,
  ): Promise<NullableType<UserVoucher>>;
  abstract findVouchersByIds(voucherIds: string[]): Promise<Voucher[]>;
  abstract getTotalVoucherUsage(voucherId: string): Promise<number>;
  abstract updateUserVoucher(userVoucher: UserVoucher): Promise<UserVoucher>;
  abstract incrementUserVoucherUsage(
    filter: FindOptionsWhere<Pick<UserVoucher, 'id' | 'voucherId' | 'userId'>>,
  ): Promise<void>;
}
