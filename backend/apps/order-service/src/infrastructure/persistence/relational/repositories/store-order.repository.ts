import { PARTNER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StoreOrder } from '../../../../domain';
import { StoreOrderRepository } from '../../store-order.repository';
import { StoreOrderEntity } from '../entities/store-order.entity';
import { StoreOrderMapper } from '../mappers/store-order.mapper';

@Injectable()
export class StoreOrderRelationalRepository implements StoreOrderRepository {
  constructor(
    // private readonly logger: LoggerService,
    @InjectRepository(StoreOrderEntity, PARTNER_DB_SOURCE)
    private readonly repository: Repository<StoreOrderEntity>,
  ) {}

  async findByOrderId(orderId: string): Promise<NullableType<StoreOrder>> {
    const entity = await this.repository.findOne({
      where: {
        orderId,
      },
    });
    return entity ? StoreOrderMapper.toDomain(entity) : null;
  }
}
