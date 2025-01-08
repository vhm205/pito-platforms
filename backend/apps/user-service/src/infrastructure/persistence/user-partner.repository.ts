import { NullableType } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { UserPartner } from '../../domain/user-partner.domain';

import { UserPartnerEntity } from './relational/entities/user-partner.entity';

export abstract class UserPartnerRepository {
  abstract findOne(
    filter: FindOptionsWhere<Pick<UserPartnerEntity, 'id' | 'email'>>,
  ): Promise<NullableType<UserPartner>>;

  abstract findRolesByUserId(userId: string): Promise<string[]>;
}
