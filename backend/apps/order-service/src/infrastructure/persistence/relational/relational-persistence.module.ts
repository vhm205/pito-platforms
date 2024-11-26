import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderRepository } from '../order.repository';
import { StoreOrderRepository } from '../store-order.repository';
import { StoreRepository } from '../store.repository';

import { OrderEntity } from './entities/order.entity';
import { StoreOrderEntity } from './entities/store-order.entity';
import { StoreEntity } from './entities/store.entity';
import { OrderRelationalRepository } from './repositories/order.repository';
import { StoreOrderRelationalRepository } from './repositories/store-order.repository';
import { StoreRelationalRepository } from './repositories/store.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity], CUSTOMER_DB_SOURCE),
    TypeOrmModule.forFeature([StoreOrderEntity, StoreEntity], PARTNER_DB_SOURCE),
  ],
  providers: [
    {
      provide: OrderRepository,
      useClass: OrderRelationalRepository,
    },
    {
      provide: StoreOrderRepository,
      useClass: StoreOrderRelationalRepository,
    },
    {
      provide: StoreRepository,
      useClass: StoreRelationalRepository,
    },
  ],
  exports: [OrderRepository, StoreOrderRepository, StoreRepository],
})
export class RelationalOrderPersistenceModule {}
