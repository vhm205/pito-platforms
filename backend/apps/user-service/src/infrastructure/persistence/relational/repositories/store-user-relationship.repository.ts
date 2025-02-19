import { PARTNER_DB_SOURCE } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreUser } from 'apps/user-service/src/domain/store-user.domain';
import { filter, map } from 'lodash';
import { In, Repository } from 'typeorm';

import { StoreUserRelationshipRepository } from '../../store-user-relationship.repository';
import { StoreUserRelationship } from '../entities/store-user-relationship.entity';
import { UserPartnerEntity } from '../entities/user-partner.entity';
import { UserRoleEntity } from '../entities/user-role.entity';

@Injectable()
export class StoreUserRelationshipRelationRepository implements StoreUserRelationshipRepository {
  constructor(
    @InjectRepository(StoreUserRelationship, PARTNER_DB_SOURCE)
    private readonly repository: Repository<StoreUserRelationship>,
    @InjectRepository(UserPartnerEntity, PARTNER_DB_SOURCE)
    private userPartnerRepository: Repository<UserPartnerEntity>,
    @InjectRepository(UserRoleEntity, PARTNER_DB_SOURCE)
    private userRoleRepository: Repository<UserRoleEntity>,
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

  async getStoreUsers(storeId: string): Promise<[StoreUser[], number]> {
    const [entities, totalCount] = await this.repository.findAndCount({
      where: { storeId },
    });

    const userIds = entities.map(entity => entity.userId);
    const [userEntities, userRoleEntities] = await Promise.all([
      this.userPartnerRepository.findBy({ id: In(userIds) }),
      this.userRoleRepository.findBy({ userId: In(userIds) }),
    ]);

    const storeUserEntitiesMap = new Map(map(entities, entity => [entity.userId, entity]));

    const storeUsersTransformed = map(userEntities, user => {
      const storeUser = storeUserEntitiesMap.get(user.id)!;

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName ?? '',
        isBanned: storeUser?.isBanned,
        avatarUrl: user.avatarUrl ?? '',
        phone: user.phone ?? '',
        storeUid: storeUser?.id,
        userRoles: filter(userRoleEntities, role => role.userId === user.id).map(role => role.role),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt ?? undefined,
      };
    });

    return [storeUsersTransformed, totalCount];
  }
}
