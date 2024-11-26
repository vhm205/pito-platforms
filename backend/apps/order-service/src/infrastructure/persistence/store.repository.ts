import { NullableType } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { Store } from '../../domain';

export abstract class StoreRepository {
  abstract findOne(
    filters: FindOptionsWhere<Pick<Store, 'id' | 'status' | 'slug'>>,
  ): Promise<NullableType<Store>>;
}
