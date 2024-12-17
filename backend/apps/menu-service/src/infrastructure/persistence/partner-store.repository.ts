import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import type { FindOperator, FindOptionsWhere } from 'typeorm';

import { PartnerStore } from '../../domain/partner-store.domain';

export abstract class PartnerStoreRepository {
  abstract findOne(
    filters: FindOptionsWhere<Pick<PartnerStore, 'id' | 'status' | 'slug'>>,
  ): Promise<NullableType<PartnerStore>>;
  abstract findManyAndCount(
    filters: Record<string, FindOperator<unknown>>[],
  ): Promise<[PartnerStore[], number]>;

  abstract findStoresWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[PartnerStore[], number]>;
}
