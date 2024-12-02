import { GetFilterOption, GetFilterOptionId } from '../../dtos/get-filter-option.dto';
import { FindStoreByFilterResult, SearchStoreFilterDto } from '../../dtos/search-store.dto';

export abstract class StoreRepository {
  abstract findStoresByFilter(
    payload: SearchStoreFilterDto,
  ): Promise<{ data: FindStoreByFilterResult[]; count: number }>;
  abstract getFilterOptionIds(keyword: string): Promise<{ data: GetFilterOptionId }>;
  abstract getFilterOptions(payload: GetFilterOptionId): Promise<{ data: GetFilterOption }>;
}
