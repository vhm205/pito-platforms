import { CUSTOMER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemRepository } from '../item.repository';
import { StoreRepository } from '../store.repository';

import { CategoryEntity } from './entities/category.entity';
import { CuisineTypeEntity } from './entities/cuisine-type.entity';
import { ItemEntity } from './entities/item.entity';
import { OccasionEventEntity } from './entities/occasion-event.entity';
import { SpecialDietaryEntity } from './entities/special-dietaries.entity';
import { StoreEntity } from './entities/store.entity';
import { ItemRelationalRepository } from './repositories/item.repository';
import { StoreRelationalRepository } from './repositories/store.repository';

const entities = [
  StoreEntity,
  ItemEntity,
  CuisineTypeEntity,
  OccasionEventEntity,
  SpecialDietaryEntity,
  CategoryEntity,
];

@Module({
  imports: [TypeOrmModule.forFeature(entities, CUSTOMER_DB_SOURCE)],
  providers: [
    {
      provide: StoreRepository,
      useClass: StoreRelationalRepository,
    },
    {
      provide: ItemRepository,
      useClass: ItemRelationalRepository,
    },
  ],
  exports: [StoreRepository, ItemRepository],
})
export class RelationalMenuPersistenceModule {}
