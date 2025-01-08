import { NullableType } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { Partner } from '../../domain/partner.domain';

import { PartnerEntity } from './relational/entities/partner.entity';

export abstract class PartnerRepository {
  abstract findOne(
    filter: FindOptionsWhere<Pick<PartnerEntity, 'id'>>,
  ): Promise<NullableType<Partner>>;
}
