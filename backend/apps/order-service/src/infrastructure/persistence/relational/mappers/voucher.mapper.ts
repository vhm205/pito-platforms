import { Voucher, UserVoucher } from 'apps/order-service/src/domain/voucher';

import { UserVoucherEntity } from '../entities/user-voucher.entity';
import { VoucherEntity } from '../entities/voucher.entity';

export class VoucherMapper {
  static toDomain(raw: VoucherEntity): Voucher {
    const domain = new Voucher();
    domain.id = raw.id;
    domain.type = raw.type;
    domain.value = parseInt(raw.value);
    domain.valueUnit = raw.valueUnit;
    domain.validUntil = raw.validUntil;
    domain.validFrom = raw.validFrom;
    domain.maxUsage = parseInt(raw.maxUsage);
    domain.voucherCode = raw.voucherCode;
    domain.voucherName = raw.voucherName;
    return domain;
  }

  static toPersistence(domainEntity: Voucher): VoucherEntity {
    const entity = new VoucherEntity();
    entity.id = domainEntity.id;
    entity.type = domainEntity.type;
    entity.value = domainEntity.value.toString();
    entity.valueUnit = domainEntity.valueUnit;
    entity.validUntil = domainEntity.validUntil;
    entity.validFrom = domainEntity.validFrom;
    entity.maxUsage = domainEntity.maxUsage.toString();
    entity.voucherCode = domainEntity.voucherCode;
    entity.voucherName = domainEntity.voucherName;
    return entity;
  }
}

export class UserVoucherMapper {
  static toDomain(raw: UserVoucherEntity): UserVoucher {
    const domain = new UserVoucher();
    domain.userId = raw.userId;
    domain.usageCount = parseInt(raw.usageCount);
    domain.voucherId = raw.voucherId;
    domain.createdAt = raw.createdAt;
    return domain;
  }

  static toPersistence(domainEntity: UserVoucher): UserVoucherEntity {
    const entity = new UserVoucherEntity();
    entity.userId = domainEntity.userId;
    entity.usageCount = domainEntity.usageCount.toString();
    entity.voucherId = domainEntity.voucherId;
    entity.createdAt = domainEntity.createdAt;
    return entity;
  }
}
