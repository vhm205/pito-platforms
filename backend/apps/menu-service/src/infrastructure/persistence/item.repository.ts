import { GetFilterOptionId } from '../../dtos/get-filter-option.dto';
import { GetItemInStoreFilterDto, GetItemInStoreResult } from '../../dtos/get-items-in-store.dto';

export abstract class ItemRepository {
  abstract getItemsInStore(
    payload: GetItemInStoreFilterDto,
  ): Promise<{ data: GetItemInStoreResult[]; count: number }>;
  abstract getFilterOptionIds(keyword: string): Promise<{ data: GetFilterOptionId }>;
}
