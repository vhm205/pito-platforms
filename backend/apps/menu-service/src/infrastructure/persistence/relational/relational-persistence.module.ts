import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemRepository } from '../item.repository';
import { PartnerStoreRepository } from '../partner-store.repository';
import { StoreRepository } from '../store.repository';

import { CategoryEntity } from './entities/category.entity';
import { CuisineTypeEntity } from './entities/cuisine-type.entity';
import { ItemEntity } from './entities/item.entity';
import { OccasionEventEntity } from './entities/occasion-event.entity';
import { PartnerStoreEntity } from './entities/partner-store.entity';
import { SpecialDietaryEntity } from './entities/special-dietaries.entity';
import { StoreEntity } from './entities/store.entity';
import { ItemRelationalRepository } from './repositories/item.repository';
import { PartnerStoreRelationalRepository } from './repositories/partner-store.repository';
import { StoreRelationalRepository } from './repositories/store.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        StoreEntity,
        ItemEntity,
        CuisineTypeEntity,
        OccasionEventEntity,
        SpecialDietaryEntity,
        CategoryEntity,
      ],
      CUSTOMER_DB_SOURCE,
    ),
    TypeOrmModule.forFeature([PartnerStoreEntity], PARTNER_DB_SOURCE),
  ],
  providers: [
    {
      provide: StoreRepository,
      useClass: StoreRelationalRepository,
    },
    {
      provide: ItemRepository,
      useClass: ItemRelationalRepository,
    },
    {
      provide: PartnerStoreRepository,
      useClass: PartnerStoreRelationalRepository,
    },
  ],
  exports: [StoreRepository, ItemRepository, PartnerStoreRepository],
})
export class RelationalMenuPersistenceModule {}
