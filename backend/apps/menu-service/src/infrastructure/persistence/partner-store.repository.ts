import { PartnerStatus } from '@app/common/enums/partner';
import { StoreStatus } from '@app/common/enums/store';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import type { FindOperator, FindOptionsWhere } from 'typeorm';

import { PartnerStore } from '../../domain/partner-store.domain';
import { StoreService } from '../../domain/store-service.domain';

export abstract class PartnerStoreRepository {
  abstract findOne(
    filters: FindOptionsWhere<Pick<PartnerStore, 'id' | 'status' | 'slug'>>,
  ): Promise<NullableType<PartnerStore>>;

  abstract findMany(
    filters: FindOptionsWhere<Pick<PartnerStore, 'id' | 'status' | 'slug'>>,
  ): Promise<PartnerStore[]>;

  abstract findManyAndCount(
    filters: Record<string, FindOperator<unknown>>[],
  ): Promise<[PartnerStore[], number]>;

  abstract findStoresWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[PartnerStore[], number]>;

  abstract findStoreServiceByStoreId(id: string): Promise<NullableType<StoreService>>;

  abstract updateStoreStatusByIds(
    ids: string[],
    status: StoreStatus,
  ): Promise<{ affected: number }>;
  abstract updatePartnerStatusByIds(
    ids: string[],
    status: PartnerStatus,
  ): Promise<{ affected: number }>;
}
