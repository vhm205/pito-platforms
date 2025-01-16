import { PARTNER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OccasionEvent } from 'apps/menu-service/src/domain/partner-item.domain';
import { Repository } from 'typeorm';

import { OccasionEventRepository } from '../../occasion-event.repository';
import { PartnerOccasionEventEntity } from '../entities/partner-occasion-event.entity';

@Injectable()
export class OccasionEventRelationalRepository implements OccasionEventRepository {
  constructor(
    @InjectRepository(PartnerOccasionEventEntity, PARTNER_DB_SOURCE)
    private repository: Repository<PartnerOccasionEventEntity>,
  ) {}

  async createOccasionEvent(data: Omit<OccasionEvent, 'id'>): Promise<number> {
    const newOccationEvent = this.repository.create(data);
    const result = await this.repository.insert(newOccationEvent);
    return result.identifiers[0]?.id;
  }

  async updateOccasionEvent(
    id: number,
    data: Partial<Omit<OccasionEvent, 'id'>>,
  ): Promise<{ affected: number }> {
    const updateResult = await this.repository.update(id, data);
    return { affected: updateResult.affected || 0 };
  }

  async deleteOccasionEvent(occasionEventId: number): Promise<boolean> {
    const deleteResult = await this.repository.delete(occasionEventId);
    return (deleteResult.affected || 0) > 0;
  }

  async findOccasionEventById(id: number): Promise<NullableType<OccasionEvent>> {
    const entity = await this.repository.findOneBy({ id });
    return entity;
  }
}
