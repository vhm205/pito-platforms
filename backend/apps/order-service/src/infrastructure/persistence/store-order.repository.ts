import { NullableType } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { StoreOrder } from '../../domain';

export abstract class StoreOrderRepository {
  abstract findOne(
    filters: FindOptionsWhere<Pick<StoreOrder, 'id' | 'orderId' | 'orderCode' | 'status'>>,
  ): Promise<NullableType<StoreOrder>>;
  abstract update(storeOrder: StoreOrder): Promise<StoreOrder>;
}
