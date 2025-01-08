import { PARTNER_DB_SOURCE } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, type Repository } from 'typeorm';

import { UserPartnerRepository } from '../../user-partner.repository';
import { UserPartnerEntity } from '../entities/user-partner.entity';
import { UserRoleEntity } from '../entities/user-role.entity';
import { UserPartnerMapper } from '../mappers/partner.mapper';

@Injectable()
export class UserPartnerRelationalRepository implements UserPartnerRepository {
  constructor(
    @InjectRepository(UserPartnerEntity, PARTNER_DB_SOURCE)
    private userPartnerRepository: Repository<UserPartnerEntity>,
    @InjectRepository(UserRoleEntity, PARTNER_DB_SOURCE)
    private userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  async findOne(filter: FindOptionsWhere<Pick<UserPartnerEntity, 'id' | 'email'>>) {
    const entity = await this.userPartnerRepository.findOne({ where: filter });
    return entity ? UserPartnerMapper.toDomain(entity) : null;
  }

  async findRolesByUserId(userId: string): Promise<string[]> {
    const roles = await this.userRoleRepository.find({ where: { userId } });
    return roles.map(role => role.role);
  }
}
