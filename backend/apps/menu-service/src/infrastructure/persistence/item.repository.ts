import { CuisineTypeEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/cuisine-type.entity';
import { OccasionEventEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/occasion-event.entity';
import { SpecialDietaryEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/special-dietaries.entity';

import { GetFilterOptionId } from '../../dtos/get-filter-option.dto';
import { GetItemInStoreFilterDto, GetItemInStoreResult } from '../../dtos/get-items-in-store.dto';

export abstract class ItemRepository {
  abstract getItemsInStore(
    payload: GetItemInStoreFilterDto,
  ): Promise<{ data: GetItemInStoreResult[]; count: number }>;
  abstract getFilterOptionIds(keyword: string): Promise<{ data: GetFilterOptionId }>;

  abstract findAllCuisineTypes(
    ids?: number[],
  ): Promise<{ id: CuisineTypeEntity['id']; name: CuisineTypeEntity['name'] }[]>;
  abstract findAllSpecialDietaries(
    ids?: number[],
  ): Promise<{ id: SpecialDietaryEntity['id']; name: SpecialDietaryEntity['name'] }[]>;
  abstract findAllOccasionEvents(
    ids?: number[],
  ): Promise<{ id: OccasionEventEntity['id']; name: OccasionEventEntity['name'] }[]>;
}
