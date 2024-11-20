import { PARTNER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'apps/order-service/src/domain';
import type { FindOptionsWhere, Repository } from 'typeorm';

import { StoreRepository } from '../../store.repository';
import { StoreEntity } from '../entities/store.entity';
import { StoreMapper } from '../mappers/store.mapper';

@Injectable()
export class StoreRelationalRepository implements StoreRepository {
  constructor(
    @InjectRepository(StoreEntity, PARTNER_DB_SOURCE)
    private readonly storeRepo: Repository<StoreEntity>,
  ) {}

  async findOne(
    filters: FindOptionsWhere<Pick<Store, 'id' | 'status' | 'slug'>>,
  ): Promise<NullableType<Store>> {
    const entity = await this.storeRepo.findOne({ where: filters });
    return entity ? StoreMapper.toDomain(entity) : null;
  }
}
