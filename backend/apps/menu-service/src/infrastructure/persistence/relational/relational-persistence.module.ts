import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerItemRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-item.repository';
import { CateringPackageEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/catering-package.entity';
import { MenuEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/menu.entity';
import { PartnerCategoryEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-category.entity';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import { PartnerOnboardingEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-onboarding.entity';
import { PartnerItemRelationalRepository } from 'apps/menu-service/src/infrastructure/persistence/relational/repositories/partner-item.repository';

import { CateringPackageRepository } from '../catering-package.repository';
import { DishRepository } from '../dish.repository';
import { ItemRepository } from '../item.repository';
import { OccasionEventRepository } from '../occasion-event.repository';
import { PartnerStoreRepository } from '../partner-store.repository';
import { PartnerRepository } from '../partner.repository';
import { StoreRepository } from '../store.repository';

import { CategoryEntity } from './entities/category.entity';
import { CateringPackageOptionEntity } from './entities/catering-package-option.entity';
import { CuisineTypeEntity } from './entities/cuisine-type.entity';
import { DishEntity } from './entities/dish.entity';
import { ItemEntity } from './entities/item.entity';
import { OccasionEventEntity } from './entities/occasion-event.entity';
import { PartnerOccasionEventEntity } from './entities/partner-occasion-event.entity';
import { PartnerStoreEntity } from './entities/partner-store.entity';
import { PartnerEntity } from './entities/partner.entity';
import { SpecialDietaryEntity } from './entities/special-dietaries.entity';
import { StoreFavoriteEntity } from './entities/store-favorite.entity';
import { StoreServiceEntity } from './entities/store-service.entity';
import { StoreEntity } from './entities/store.entity';
import { CateringPackageRelationalRepository } from './repositories/catering-package.repository';
import { DishRelationalRepository } from './repositories/dish.repository';
import { ItemRelationalRepository } from './repositories/item.repository';
import { OccasionEventRelationalRepository } from './repositories/occasion-event.repository';
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
  StoreFavoriteEntity,
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
  DishEntity,
  PartnerOnboardingEntity,
  MenuEntity,
  PartnerCategoryEntity,
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
    {
      provide: DishRepository,
      useClass: DishRelationalRepository,
    },
    {
      provide: OccasionEventRepository,
      useClass: OccasionEventRelationalRepository,
    },
  ],
  exports: [
    StoreRepository,
    ItemRepository,
    PartnerItemRepository,
    PartnerStoreRepository,
    PartnerRepository,
    CateringPackageRepository,
    DishRepository,
    OccasionEventRepository,
  ],
})
export class RelationalMenuPersistenceModule {}
