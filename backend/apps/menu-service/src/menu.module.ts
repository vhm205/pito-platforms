import 'dotenv/config';

import { CUSTOMER_DB_SOURCE, LoggerModule } from '@app/common';
import { AllConfigType, appConfig, databaseConfig } from '@app/common/configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity } from './infrastructure/persistence/relational/entities/category.entity';
import { CuisineTypeEntity } from './infrastructure/persistence/relational/entities/cuisine-type.entity';
import { ItemEntity } from './infrastructure/persistence/relational/entities/item.entity';
import { OccasionEventEntity } from './infrastructure/persistence/relational/entities/occasion-event.entity';
import { SpecialDietaryEntity } from './infrastructure/persistence/relational/entities/special-dietaries.entity';
import { StoreEntity } from './infrastructure/persistence/relational/entities/store.entity';
import { RelationalMenuPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

const entities = [
  StoreEntity,
  ItemEntity,
  CuisineTypeEntity,
  OccasionEventEntity,
  SpecialDietaryEntity,
  CategoryEntity,
];

@Module({
  imports: [
    LoggerModule.forRoot({ service: MenuService.name }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig],
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
        entities,
      }),
    }),
    RelationalMenuPersistenceModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
