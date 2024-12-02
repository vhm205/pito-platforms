import { NullableType } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { Partner } from '../../domain';

export abstract class PartnerRepository {
  abstract findOne(filters: FindOptionsWhere<Pick<Partner, 'id'>>): Promise<NullableType<Partner>>;
}
