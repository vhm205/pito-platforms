import { NullableType } from '@app/common/types/common';

import { StoreOrder } from '../../domain';

export abstract class StoreOrderRepository {
  abstract findByOrderId(orderId: string): Promise<NullableType<StoreOrder>>;
}
