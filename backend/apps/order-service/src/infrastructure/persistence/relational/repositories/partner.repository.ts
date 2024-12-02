import { PARTNER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from 'apps/order-service/src/domain';
import type { FindOptionsWhere, Repository } from 'typeorm';

import { PartnerRepository } from '../../partner.repository';
import { PartnerEntity } from '../entities/partner.entity';
import { PartnerMapper } from '../mappers/partner.mapper';

@Injectable()
export class PartnerRelationalRepository implements PartnerRepository {
  constructor(
    @InjectRepository(PartnerEntity, PARTNER_DB_SOURCE)
    private readonly partnerRepository: Repository<PartnerEntity>,
  ) {}

  async findOne(filters: FindOptionsWhere<Pick<Partner, 'id'>>): Promise<NullableType<Partner>> {
    const entity = await this.partnerRepository.findOne({ where: filters });
    return entity ? PartnerMapper.toDomain(entity) : null;
  }
}
