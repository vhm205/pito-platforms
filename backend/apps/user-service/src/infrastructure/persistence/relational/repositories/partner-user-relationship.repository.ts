import { PARTNER_DB_SOURCE } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartnerUserRelationshipRepository } from '../../partner-user-relationship.repository';
import { PartnerUserRelationship } from '../entities/partner-user-relationship.entity';

@Injectable()
export class PartnerUserRelationshipRelationRepository
  implements PartnerUserRelationshipRepository
{
  constructor(
    @InjectRepository(PartnerUserRelationship, PARTNER_DB_SOURCE)
    private readonly repository: Repository<PartnerUserRelationship>,
  ) {}

  async validateUserInPartner(userId: string, partnerId: string): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder('partner_users')
      .where('partner_users.partner_id = :partnerId', { partnerId })
      .andWhere('partner_users.user_id = :userId', { userId })
      .getCount();

    return count > 0;
  }
}
