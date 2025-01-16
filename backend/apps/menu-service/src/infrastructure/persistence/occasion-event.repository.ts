import { NullableType } from '@app/common/types/common';

import { OccasionEvent } from '../../domain/partner-item.domain';

export abstract class OccasionEventRepository {
  abstract createOccasionEvent(occasionEvent: Omit<OccasionEvent, 'id' | 'index'>): Promise<number>;

  abstract updateOccasionEvent(
    id: number,
    data: Partial<Omit<OccasionEvent, 'id' | 'index'>>,
  ): Promise<{ affected: number }>;

  abstract deleteOccasionEvent(occasionEventId: number): Promise<boolean>;

  abstract findOccasionEventById(id: number): Promise<NullableType<OccasionEvent>>;
}
