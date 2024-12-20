import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerItemRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-item.repository';
import { CateringPackageEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/catering-package.entity';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import { PartnerItemRelationalRepository } from 'apps/menu-service/src/infrastructure/persistence/relational/repositories/partner-item.repository';

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

const customerEntities = [
  StoreEntity,
  ItemEntity,
  CuisineTypeEntity,
  OccasionEventEntity,
  SpecialDietaryEntity,
  CategoryEntity,
];

const partnerEntities = [
  CateringPackageEntity,
  PartnerItemEntity,
  PartnerMenuCategoriesEntity,
  PartnerStoreEntity,
];

@Module({
  imports: [
    TypeOrmModule.forFeature(customerEntities, CUSTOMER_DB_SOURCE),
    TypeOrmModule.forFeature(partnerEntities, PARTNER_DB_SOURCE),
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
      provide: PartnerItemRepository,
      useClass: PartnerItemRelationalRepository,
    },
    { provide: PartnerStoreRepository, useClass: PartnerStoreRelationalRepository },
  ],
  exports: [StoreRepository, ItemRepository, PartnerItemRepository, PartnerStoreRepository],
})
export class RelationalMenuPersistenceModule {}
