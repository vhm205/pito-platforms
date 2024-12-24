import { PARTNER_DB_SOURCE } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, type Repository } from 'typeorm';

import { PartnerRepository } from '../../partner.repository';
import { PartnerEntity } from '../entities/partner.entity';
import { PartnerMapper } from '../mappers/partner.mapper';

@Injectable()
export class PartnerRelationalRepository implements PartnerRepository {
  constructor(
    @InjectRepository(PartnerEntity, PARTNER_DB_SOURCE)
    private partnerRepository: Repository<PartnerEntity>,
  ) {}

  async findOne(filter: FindOptionsWhere<Pick<PartnerEntity, 'id'>>) {
    const entity = await this.partnerRepository.findOne({ where: filter });
    return entity ? PartnerMapper.toDomain(entity) : null;
  }
}
