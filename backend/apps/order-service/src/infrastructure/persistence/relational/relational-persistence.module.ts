import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderRepository } from '../order.repository';
import { PartnerRepository } from '../partner.repository';
import { ShoppingSessionRepository } from '../shopping-session.repository';
import { StoreOrderRepository } from '../store-order.repository';
import { StoreRepository } from '../store.repository';
import { TransactionRepository } from '../transaction.repository';
import { VoucherRepository } from '../voucher.repository';

import { CartItemEntity } from './entities/cart-item.entity';
import { ItemEntity } from './entities/item.entity';
import { OrderEntity } from './entities/order.entity';
import { PartnerEntity } from './entities/partner.entity';
import { ShoppingSessionEntity } from './entities/shopping-session.entity';
import { StoreOrderEntity } from './entities/store-order.entity';
import { StoreEntity } from './entities/store.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { UserVoucherEntity } from './entities/user-voucher.entity';
import { VoucherEntity } from './entities/voucher.entity';
import { OrderRelationalRepository } from './repositories/order.repository';
import { PartnerRelationalRepository } from './repositories/partner.repository';
import { ShoppingSessionRelationalRepository } from './repositories/shopping-session.repository';
import { StoreOrderRelationalRepository } from './repositories/store-order.repository';
import { StoreRelationalRepository } from './repositories/store.repository';
import { TransactionRelationalRepository } from './repositories/transaction.repository';
import { VoucherRelationalRepository } from './repositories/voucher.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        OrderEntity,
        ShoppingSessionEntity,
        CartItemEntity,
        ItemEntity,
        VoucherEntity,
        UserVoucherEntity,
        TransactionEntity,
      ],
      CUSTOMER_DB_SOURCE,
    ),
    TypeOrmModule.forFeature([StoreOrderEntity, StoreEntity, PartnerEntity], PARTNER_DB_SOURCE),
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
      provide: ShoppingSessionRepository,
      useClass: ShoppingSessionRelationalRepository,
    },
    {
      provide: VoucherRepository,
      useClass: VoucherRelationalRepository,
    },
    {
      provide: TransactionRepository,
      useClass: TransactionRelationalRepository,
    },
    {
      provide: PartnerRepository,
      useClass: PartnerRelationalRepository,
    },
  ],
  exports: [
    OrderRepository,
    StoreOrderRepository,
    StoreRepository,
    ShoppingSessionRepository,
    VoucherRepository,
    TransactionRepository,
    PartnerRepository,
  ],
})
export class RelationalOrderPersistenceModule {}
