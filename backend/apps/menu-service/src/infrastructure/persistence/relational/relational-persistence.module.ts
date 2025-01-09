import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerItemRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-item.repository';
import { CateringPackageEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/catering-package.entity';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import { PartnerItemRelationalRepository } from 'apps/menu-service/src/infrastructure/persistence/relational/repositories/partner-item.repository';

import { CateringPackageRepository } from '../catering-package.repository';
import { ItemRepository } from '../item.repository';
import { PartnerStoreRepository } from '../partner-store.repository';
import { PartnerRepository } from '../partner.repository';
import { StoreRepository } from '../store.repository';

import { CategoryEntity } from './entities/category.entity';
import { CateringPackageOptionEntity } from './entities/catering-package-option.entity';
import { CuisineTypeEntity } from './entities/cuisine-type.entity';
import { ItemEntity } from './entities/item.entity';
import { OccasionEventEntity } from './entities/occasion-event.entity';
import { PartnerOccasionEventEntity } from './entities/partner-occasion-event.entity';
import { PartnerStoreEntity } from './entities/partner-store.entity';
import { PartnerEntity } from './entities/partner.entity';
import { SpecialDietaryEntity } from './entities/special-dietaries.entity';
import { StoreServiceEntity } from './entities/store-service.entity';
import { StoreEntity } from './entities/store.entity';
import { CateringPackageRelationalRepository } from './repositories/catering-package.repository';
import { ItemRelationalRepository } from './repositories/item.repository';
import { PartnerStoreRelationalRepository } from './repositories/partner-store.repository';
import { PartnerRelationalRepository } from './repositories/partner.repotitory';
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
  PartnerEntity,
  CateringPackageEntity,
  CateringPackageOptionEntity,
  PartnerItemEntity,
  PartnerMenuCategoriesEntity,
  PartnerStoreEntity,
  StoreServiceEntity,
  PartnerEntity,
  PartnerOccasionEventEntity,
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
    {
      provide: PartnerRepository,
      useClass: PartnerRelationalRepository,
    },
    {
      provide: CateringPackageRepository,
      useClass: CateringPackageRelationalRepository,
    },
  ],
  exports: [
    StoreRepository,
    ItemRepository,
    PartnerItemRepository,
    PartnerStoreRepository,
    PartnerRepository,
    CateringPackageRepository,
  ],
})
export class RelationalMenuPersistenceModule {}
