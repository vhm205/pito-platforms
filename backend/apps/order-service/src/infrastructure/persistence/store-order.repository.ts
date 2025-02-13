import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import type { FindOperator, FindOptionsWhere } from 'typeorm';

import { StoreOrder } from '../../domain';
import { GetRevenueAndCountDto } from '../../dto/get-revenue-and-count.dto';

export abstract class StoreOrderRepository {
  abstract findOne(
    filters: FindOptionsWhere<Pick<StoreOrder, 'id' | 'orderId' | 'orderCode' | 'status'>>,
  ): Promise<NullableType<StoreOrder>>;

  abstract findWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[StoreOrder[], number]>;

  abstract update(storeOrder: StoreOrder): Promise<StoreOrder>;

  abstract getTotalRevenueAndCountOrders(storeIds: string[]): Promise<GetRevenueAndCountDto[]>;

  abstract getTotalOrderCountByStoreId(storeId: string): Promise<number>;

  abstract saveOrder(order: Partial<StoreOrder>): Promise<StoreOrder>;
}
