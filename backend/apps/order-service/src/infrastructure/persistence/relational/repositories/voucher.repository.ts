import { CUSTOMER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVoucher, Voucher } from 'apps/order-service/src/domain/voucher';
import { type FindOptionsWhere, In, Repository } from 'typeorm';

import { VoucherRepository } from '../../voucher.repository';
import { UserVoucherEntity } from '../entities/user-voucher.entity';
import { VoucherEntity } from '../entities/voucher.entity';
import { VoucherMapper, UserVoucherMapper } from '../mappers/voucher.mapper';

@Injectable()
export class VoucherRelationalRepository implements VoucherRepository {
  constructor(
    @InjectRepository(VoucherEntity, CUSTOMER_DB_SOURCE)
    private voucherRepository: Repository<VoucherEntity>,
    @InjectRepository(UserVoucherEntity, CUSTOMER_DB_SOURCE)
    private userVoucherRepository: Repository<UserVoucherEntity>,
  ) {}

  async createUserVoucher(userVoucher: UserVoucher): Promise<UserVoucher> {
    const entity = UserVoucherMapper.toPersistence(userVoucher);
    await this.userVoucherRepository.save(entity);
    return userVoucher;
  }

  async incrementUserVoucherUsage(
    filter: FindOptionsWhere<Pick<UserVoucher, 'id' | 'voucherId' | 'userId'>>,
  ): Promise<void> {
    await this.userVoucherRepository.increment(filter, 'usageCount', 1);
  }

  async findOne(
    filter: FindOptionsWhere<Pick<VoucherEntity, 'id' | 'voucherCode'>>,
  ): Promise<NullableType<Voucher>> {
    const entity = await this.voucherRepository.findOne({ where: filter });
    return entity ? VoucherMapper.toDomain(entity) : null;
  }

  async findUserVoucherByUserIdAndVoucherId(
    userId: string,
    voucherId: string,
  ): Promise<NullableType<UserVoucher>> {
    const entity = await this.userVoucherRepository.findOne({
      where: { userId, voucherId },
    });
    return entity ? UserVoucherMapper.toDomain(entity) : null;
  }

  async findVouchersByIds(voucherIds: string[]): Promise<Voucher[]> {
    const entities = await this.voucherRepository.findBy({ id: In(voucherIds) });
    return entities ? entities.map(entity => VoucherMapper.toDomain(entity)) : [];
  }

  async getTotalVoucherUsage(voucherId: string): Promise<number> {
    return this.userVoucherRepository.count({ where: { voucherId } });
  }

  async updateUserVoucher(userVoucher: UserVoucher): Promise<UserVoucher> {
    const entity = UserVoucherMapper.toPersistence(userVoucher);
    await this.userVoucherRepository.save(entity);
    return userVoucher;
  }
}
