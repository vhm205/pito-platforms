import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderRepository } from '../order.repository';
import { StoreOrderRepository } from '../store-order.repository';
import { StoreRepository } from '../store.repository';
import { TransactionRepository } from '../transaction.repository';

import { OrderEntity } from './entities/order.entity';
import { StoreOrderEntity } from './entities/store-order.entity';
import { StoreEntity } from './entities/store.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { OrderRelationalRepository } from './repositories/order.repository';
import { StoreOrderRelationalRepository } from './repositories/store-order.repository';
import { StoreRelationalRepository } from './repositories/store.repository';
import { TransactionRelationalRepository } from './repositories/transaction.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, TransactionEntity], CUSTOMER_DB_SOURCE),
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
    {
      provide: TransactionRepository,
      useClass: TransactionRelationalRepository,
    },
  ],
  exports: [OrderRepository, StoreOrderRepository, StoreRepository, TransactionRepository],
})
export class RelationalOrderPersistenceModule {}
