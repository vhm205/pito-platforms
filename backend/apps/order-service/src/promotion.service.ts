import { getDateTime } from '@app/common';
import { GrpcStatus, VoucherType, VoucherUnit } from '@app/common/enums';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { FindOptionsWhere } from 'typeorm';

import { UserVoucher, Voucher } from './domain';
import { VoucherRepository } from './infrastructure/persistence/voucher.repository';

@Injectable()
export class PromotionService {
  constructor(private readonly voucherRepository: VoucherRepository) {}

  async createUserVoucher(userVoucher: Partial<UserVoucher>) {
    return this.voucherRepository.createUserVoucher(userVoucher);
  }

  async incrementVoucherUsage(
    filter: FindOptionsWhere<Pick<UserVoucher, 'id' | 'voucherId' | 'userId'>>,
  ) {
    return this.voucherRepository.incrementUserVoucherUsage(filter);
  }

  async findVouchersByIds(voucherIds: string[]) {
    return this.voucherRepository.findVouchersByIds(voucherIds);
  }

  async calculateVoucherDiscount(
    userId: string,
    voucherIds: string[],
    shippingFee: number,
    subTotalPrice: number,
  ) {
    let discountAmount = 0,
      discountShippingFee = 0;

    if (!voucherIds || !voucherIds.length) {
      return { discountAmount, discountShippingFee };
    }

    const vouchersDiscount: number[] = [];

    const calculateVouchersAsync = voucherIds.map(async (voucherId: string) => {
      const voucher = await this.checkVoucherValid(userId, voucherId);

      if (voucher.code && voucher.code !== 'FREE_SHIP') {
        vouchersDiscount.push(voucher.value);
      }

      if (vouchersDiscount.length >= 2) {
        throw new RpcException({
          message: 'Only one voucher can be used at a time',
          status: GrpcStatus.INVALID_ARGUMENT,
        });
      }

      if (voucher.unit === VoucherUnit.PERCENT) {
        if (voucher.code === 'FREE_SHIP') {
          if (!isNaN(shippingFee)) {
            discountShippingFee += Math.round((shippingFee * voucher.value) / 100);
          }
        } else {
          discountAmount += Math.round((subTotalPrice * voucher.value) / 100);
        }
      } else {
        discountAmount += voucher.value;
      }
    });
    await Promise.all(calculateVouchersAsync);

    return { discountAmount, discountShippingFee };
  }

  private async checkVoucherValid(userId: string, voucherId: string) {
    const voucher = await this.voucherRepository.findOne({ id: voucherId });
    if (!voucher) {
      throw new RpcException({
        message: `Voucher with ID ${voucherId} not found`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const result = await ((userId, voucher) => {
      switch (voucher.type) {
        case VoucherType.ALL:
          return this.checkVoucherTypeAll(userId, voucher);
        case VoucherType.INDIVIDUAL:
          return this.checkVoucherTypeIndividual(userId, voucher);
        default:
          return { unit: VoucherUnit.CURRENCY, value: 0, code: '' };
      }
    })(userId, voucher);

    return result;
  }

  private async checkVoucherTypeAll(userId: string, voucher: Voucher) {
    const userVoucher = await this.voucherRepository.findUserVoucherByUserIdAndVoucherId(
      userId,
      voucher.id,
    );
    if (!userVoucher) {
      return { unit: VoucherUnit.CURRENCY, value: 0, code: '' };
    }

    const { value, valueUnit, voucherCode, maxUsage, validUntil } = voucher;
    const { createdAt, usageCount = 0 } = userVoucher;
    const currentDate = getDateTime();

    if (usageCount > maxUsage) {
      throw new RpcException({
        message: 'Voucher has been used up',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    const voucherInThirtyDays = ['PITO20%'];

    if (voucherInThirtyDays.includes(voucherCode)) {
      const voucherDate = getDateTime(createdAt).add(30, 'days');
      const diff = currentDate.diff(voucherDate, 'days');

      if (diff > 0) {
        throw new RpcException({
          message: 'Voucher has expired',
          status: GrpcStatus.INVALID_ARGUMENT,
        });
      }
    } else {
      const voucherExpired = getDateTime(validUntil).isBefore(currentDate);
      if (voucherExpired) {
        throw new RpcException({
          message: 'Voucher has expired',
          status: GrpcStatus.INVALID_ARGUMENT,
        });
      }
    }

    return { unit: valueUnit, value, code: voucherCode };
  }

  private async checkVoucherTypeIndividual(userId: string, voucher: Voucher) {
    const { value, valueUnit, voucherCode, validUntil, validFrom, maxUsage } = voucher;
    const currentDate = getDateTime();

    const isAfterExpireDay = currentDate.isAfter(getDateTime(validUntil));
    const isBeforeValidDay = currentDate.isBefore(getDateTime(validFrom));

    if (isAfterExpireDay || isBeforeValidDay) {
      throw new RpcException({
        message: 'Voucher has expired',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    const [userVoucher, usageCount] = await Promise.all([
      this.voucherRepository.findUserVoucherByUserIdAndVoucherId(userId, voucher.id),
      this.voucherRepository.getTotalVoucherUsage(voucher.id),
    ]);

    if (usageCount >= maxUsage) {
      throw new RpcException({
        message: 'Voucher has been used up',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    if (userVoucher) {
      throw new RpcException({
        message: 'Voucher has been used',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    return { unit: valueUnit, value, code: voucherCode };
  }
}
