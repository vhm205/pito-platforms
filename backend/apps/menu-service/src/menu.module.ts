import 'dotenv/config';

import { CUSTOMER_DB_SOURCE, LoggerModule, PARTNER_DB_SOURCE } from '@app/common';
import {
  AllConfigType,
  appConfig,
  databaseConfig,
  Environment,
  externalConfig,
} from '@app/common/configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CateringPackageEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/catering-package.entity';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';

import { CategoryEntity } from './infrastructure/persistence/relational/entities/category.entity';
import { CuisineTypeEntity } from './infrastructure/persistence/relational/entities/cuisine-type.entity';
import { ItemEntity } from './infrastructure/persistence/relational/entities/item.entity';
import { OccasionEventEntity } from './infrastructure/persistence/relational/entities/occasion-event.entity';
import { PartnerOccasionEventEntity } from './infrastructure/persistence/relational/entities/partner-occasion-event.entity';
import { PartnerStoreEntity } from './infrastructure/persistence/relational/entities/partner-store.entity';
import { PartnerEntity } from './infrastructure/persistence/relational/entities/partner.entity';
import { SpecialDietaryEntity } from './infrastructure/persistence/relational/entities/special-dietaries.entity';
import { StoreServiceEntity } from './infrastructure/persistence/relational/entities/store-service.entity';
import { StoreEntity } from './infrastructure/persistence/relational/entities/store.entity';
import { RelationalMenuPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { PartnerService } from './partner.service';
import { StoreService } from './store.service';

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
  PartnerItemEntity,
  PartnerMenuCategoriesEntity,
  PartnerStoreEntity,
  StoreServiceEntity,
  PartnerEntity,
  PartnerOccasionEventEntity,
];

@Module({
  imports: [
    LoggerModule.forRoot({ service: MenuService.name }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig, externalConfig],
    }),
    TypeOrmModule.forRootAsync({
      name: CUSTOMER_DB_SOURCE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        type: 'postgres',
        host: configService.get('database.host', { infer: true }),
        port: configService.get('database.port', { infer: true }),
        username: configService.get('database.username', { infer: true }),
        password: configService.get('database.password', { infer: true }),
        database: configService.get('database.name', { infer: true }),
        logging: configService.get('app.nodeEnv', { infer: true }) !== Environment.PRODUCTION,
        entities: customerEntities,
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: PARTNER_DB_SOURCE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('PARTNER_DB_HOST', { infer: true }),
        port: configService.getOrThrow<number>('PARTNER_DB_PORT', { infer: true }),
        username: configService.getOrThrow<string>('PARTNER_DB_USER', { infer: true }),
        password: configService.getOrThrow<string>('PARTNER_DB_PASSWORD', { infer: true }),
        database: configService.getOrThrow<string>('PARTNER_DB_NAME', { infer: true }),
        logging: configService.get('app.nodeEnv', { infer: true }) !== Environment.PRODUCTION,
        entities: partnerEntities,
        migrations: [__dirname + '/../../../database/migrations/partners/*{.ts,.js}'],
        migrationsRun: false,
        synchronize: false,
      }),
    }),
    RelationalMenuPersistenceModule,
  ],
  controllers: [MenuController],
  providers: [MenuService, StoreService, PartnerService],
})
export class MenuModule {}
