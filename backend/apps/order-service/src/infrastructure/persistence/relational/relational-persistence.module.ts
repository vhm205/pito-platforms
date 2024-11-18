import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderRepository } from '../order.repository';
import { StoreOrderRepository } from '../store-order.repository';

import { OrderEntity } from './entities/order.entity';
import { StoreOrderEntity } from './entities/store-order.entity';
import { OrderRelationalRepository } from './repositories/order.repository';
import { StoreOrderRelationalRepository } from './repositories/store-order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity], CUSTOMER_DB_SOURCE),
    TypeOrmModule.forFeature([StoreOrderEntity], PARTNER_DB_SOURCE),
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
  ],
  exports: [OrderRepository, StoreOrderRepository],
})
export class RelationalOrderPersistenceModule {}
