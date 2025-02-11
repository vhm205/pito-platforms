import { PARTNER_DB_SOURCE } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StoreUserRelationshipRepository } from '../../store-user-relationship.repository';
import { StoreUserRelationship } from '../entities/store-user-relationship.entity';

@Injectable()
export class StoreUserRelationshipRelationRepository implements StoreUserRelationshipRepository {
  constructor(
    @InjectRepository(StoreUserRelationship, PARTNER_DB_SOURCE)
    private readonly repository: Repository<StoreUserRelationship>,
  ) {}

  async validateUserInStore(userId: string, storeId: string): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder('store_users')
      .where('store_users.store_id = :storeId', { storeId })
      .andWhere('store_users.user_id = :userId', { userId })
      .andWhere('store_users.is_banned = false')
      .getCount();

    return count > 0;
  }
}
